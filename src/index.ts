/// <reference path="declarations.d.ts"/>

/*##############################################################################

# set up Express application object

##############################################################################*/

import { logRequest } from './utils/loggers';
import express, { Request, Response } from 'express';
import mustacheExpress from 'mustache-express';
import cookieParser from 'cookie-parser';
import * as authN from './authN';
import { getSessionCookie } from './authN/cookie';

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
  console.trace('req.session: %o', req.session);
  const user = req.session?.user;
  console.trace('passing `user` to template renderer: %o', user);

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

