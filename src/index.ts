/// <reference path='declarations.d.ts'/>

/*##############################################################################

# set up Express application object

##############################################################################*/

import { logRequest } from './utils/loggers';
import express, { Request, Response } from 'express';
import mustacheExpress from 'mustache-express';
import cookieParser from 'cookie-parser';
import * as authN from './authN';
import { getSessionCookie } from './authN/cookie';
import session from 'express-session';
import { createClient } from 'redis';
import SessionStore from 'connect-redis';
// import connectRedis from 'connect-redis';

Error.stackTraceLimit = 1;

/**
 * log server environment info
 */
console.log(`
ENVIRONMENT:
    HOST: ${process.env.HOST}
    PORT: ${process.env.PORT}
    OAUTH_CLIENT_ID: ${process.env.OAUTH_CLIENT_ID}
    OAUTH_CLIENT_SECRET: ${process.env.OAUTH_CLIENT_SECRET ? true : false}
`);

const app = express();

app.use(logRequest);

app.use(cookieParser());

/**
 * init Redis client
 */
const redisClient = createClient({
  legacyMode: true,
  socket: {
    host: '127.0.0.1',
    port: 6379,
  }
});
(async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    console.trace('Redis client failed to connect to server. error: %o', err);
  }
})();

/**
 * init session store
 */
// const RedisStore = connectRedis(session);
const redisStore = new SessionStore({
  // host: '127.0.0.1',
  // port: 6379,
  client: redisClient,
  // ttl: 86400,
});

/**
 * init session middleware
 */
app.use(session({
  secret: process.env['SESSION_SIGNATURE'] ?? 'default', // what to encrypt session data with?
  name: 'id', // name of session cookie?
  resave: false, // force save unmodified session object BACK TO store?
  saveUninitialized: false, // force save new, unmodified session object to store?
  unset: 'keep', // what to do with session in store when unsetting req.session?
  cookie: {
    expires: new Date(Date.now() + (604800000 * 4)),
    httpOnly: true,
    path: '/',
    sameSite: false, // investigate security vulnerabilities (in order for Sign in with Google to work, this must be set to false.)
    secure: false,
  },
  store: redisStore,
}));

/**
 * set up mustache-express as templating engine
 */
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');

app.use(authN.initAuthN);
app.use(authN.session);
app.use(authN.routes());

/**
 * INDEX ROUTE
 * send rendered HTML containing link to initiate OIDC flow
 */
app.get('/', (req: Request, res: Response) => {
  res.render('index');
});

/**
 * PRIVATE ROUTE
 * send rendered HTML containing private information
 */
app.get('/private', authN.requireAuthn, (req: Request, res: Response) => {
  /**
   * @todo read userinfo from session and pass it to renderer function
   */
  console.trace('req.sessino.user: %o', req.session?.user);
  const user = req.session?.user ?? { name: 'hardCodedUser' };

  res.render('private', {
    user
  });
});

/**
 * Start a TCP server listening for connections on the given port and host
 */
app.listen(process.env.PORT, () => {
  console.log(`Express started on port ${process.env.PORT}\n`);
});

