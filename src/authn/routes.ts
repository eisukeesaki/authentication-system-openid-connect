/*##############################################################################

# define authn routes

##############################################################################*/

import { Router } from 'express';
import {
  serializeAuthnState,
  setAuthnStateCookie,
  getAuthnStateCookie,
  deserializeAuthnState
} from './state';
import { getDomain } from './middleware';
import { serialize } from './session';
import { setSessionCookie } from './cookie';

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
     * create `state` which uniquely identifies request
     * state is CSRF token
     */
    const backToPath = '/private';
    const state = serializeAuthnState({ backToPath });
    console.trace('created state %o:', state);

    /**
     * construct authz URL
     * URL components: client_id, scope, response_type, redirect_uri, state
     */
    const authzUrl = req.app.authnClient.authorizationUrl({
      scope: 'openid email profile',
      state: state
    });
    console.trace('constructed authzUrl %o:', authzUrl);

    /**
     * set HTTP Set-Cookie response header `state`
     */
    setAuthnStateCookie(res, state);

    /**
     * redirect user agent to authorization URL
     */
    console.trace('redirecting user agent to authorization URL: %o', authzUrl);
    res.redirect(authzUrl);
  });

  /*
   * @todo
   */
  router.get('/auth/callback', async function(req, res, next) {
    /**
     * extract state out of req.cookies
     */
    const state = getAuthnStateCookie(req);
    const { backToPath } = deserializeAuthnState(state);

    /**
     * extract code, state out of req.url
     */
    const client = req.app.authnClient;
    const params = client.callbackParams(req);

    /**
     * make Access Token & ID Token request to authz server
     */
    console.trace('making access token request to authorization server...');
    const tokenSet = await client.callback(
      `${getDomain()}/auth/callback`,
      params,
      { state }
    );
    console.trace('received access token from authorization server: %o', tokenSet);

    /**
     * make protected-resource request to resource server
     */
    console.trace('making protected resource request to resource server...');
    const user = await client.userinfo(tokenSet);
    console.trace('received user: %o', user);

    /**
     * set Set-Cookie response header `state`, `authN`
     */
    const sessionCookie = serialize({ user, tokenSet });
    setSessionCookie(res, sessionCookie);

    /**
     * redirect user agent to originally requested protected resource
     */
    res.redirect(backToPath);
  });

  /*
   * @todo
   */
  router.get('/auth/logout');

  return router;
}
