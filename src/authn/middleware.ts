/*##############################################################################

# define middlewares

##############################################################################*/

import { Request, Response, NextFunction } from 'express';
import { Issuer } from 'openid-client';
import { getSessionCookie } from './cookie';
import { deserialize } from './session';

export function getDomain(): string {
  return `http://${process.env.HOST}:${process.env.PORT}`;
}

export async function initAuthN(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.app.authNIssuer) {
    return next();
  }

  const issuerGoogle = await Issuer.discover('https://accounts.google.com');
  console.trace('loaded OIDC authorization server metadata documents. : %o', issuerGoogle);

  const client = new issuerGoogle.Client({
    client_id: process.env.OAUTH_CLIENT_ID!,
    client_secret: process.env.OAUTH_CLIENT_SECRET,
    redirect_uris: [`${getDomain()}/auth/callback`],
    response_types: ['code']
  });
  console.trace('instantiated client: %o', client);

  req.app.authNIssuer = issuerGoogle;
  req.app.authNClient = client;

  next();
}

/**
* @todo ?refresh access token if necessary
* @todo ?validate received ID Token's integrity
*/
export function session(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const sessionCookie = getSessionCookie(req);
  if (!sessionCookie)
    return next();

  const session = deserialize(sessionCookie);

  req.session = session;

  next();
}

/**
 * block unauthenticated requests
 */
export async function requireAuthn(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const session = req.session;
  console.trace('session: %o', session);

  if (!session)
    return res.status(401).send('user agent not authenticated');

  next();
}
