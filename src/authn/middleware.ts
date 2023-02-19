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

export async function initAuthn(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.app.authnIssuer) {
    return next();
  }

  const issuerGoogle = await Issuer.discover('https://accounts.google.com');
  // console.log('issuerGoogle:', issuerGoogle);

  const client = new issuerGoogle.Client({
    client_id: process.env.OAUTH_CLIENT_ID!,
    client_secret: process.env.OAUTH_CLIENT_SECRET,
    redirect_uris: [`${getDomain()}/auth/callback`],
    response_types: ['code']
  });
  // console.log('client:', client);

  req.app.authnIssuer = issuerGoogle;
  req.app.authnClient = client;

  next();
}

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
