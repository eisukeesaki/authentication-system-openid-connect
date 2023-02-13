/*##############################################################################

# define authn routes

##############################################################################*/

import { Router } from 'express';
import {
  serializeAuthnState,
  setAuthnStateCookie,
  // getAuthnStateCookie
} from './state';

/**
 * middleware that hosts all authn routes
 */
export default function authnRoutesMiddleware(): Router {
  const router = Router();

  /*
   * initiator of authorization code flow 
   */
  router.get('/auth/login', function(req, res, next) {
    /**
     * create authn state
     */
    const backToPath = '/private';
    const state = serializeAuthnState({ backToPath });
    console.trace('state %o:', state);

    /**
     * construct authz URL
     */
    const authzUrl = req.app.authnClient.authorizationUrl({
      scope: 'openid email profile',
      state: state
    });
    console.trace('authzUrl %o:', authzUrl);

    /**
     * set HTTP Set-Cookie header
     */
    setAuthnStateCookie(res, state);

    /**
     * redirect user agent to authorization URL
     */
    res.redirect(authzUrl);
  });

  /*
   * @todo
   */
  router.get('/auth/callback', function(req, res, next) {
    // const state = getAuthnStateCookie(req);
    // console.trace('state', state);
    res.status(501).end();
  });

  /*
   * @todo
   */
  router.get('/auth/logout');

  return router;
}
