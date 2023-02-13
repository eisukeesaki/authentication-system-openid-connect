/// <reference path="declarations.d.ts"/>

/*##############################################################################

# set up Express application object

##############################################################################*/

import express, { Request, Response } from 'express';
import mustacheExpress from 'mustache-express';
import cookieParser from 'cookie-parser';
import * as authn from './authn';

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

app.use(cookieParser());

/**
 * set up mustache-express as templating engine
 */
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');

app.use(authn.initAuthn);
app.use(authn.routes());

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
app.get('/private', authn.requireAuthn, (req: Request, res: Response) => {
  // TODO: const userinfo = extract userinfo out of received session token
  const userinfo = {
    name: "Asuka"
  };

  res.render('private', {
    // some private data to be used to render a view template template
    userinfo
  });
});

/**
 * Start a TCP server listening for connections on the given port and host
 */
app.listen(process.env.PORT, () => {
  console.log(`Express started on port ${process.env.PORT}\n`);
});

