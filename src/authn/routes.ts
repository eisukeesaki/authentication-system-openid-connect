/*##############################################################################

# define authN routes

##############################################################################*/

import { Router } from 'express';
import {
  serializeAuthnState,
  setAuthNStateCookie,
  getAuthNStateCookie,
  deserializeAuthnState
} from './state';
import { getDomain } from './middleware';
import { serialize } from './session';
import { setSessionCookie } from './cookie';
// import { generators } from 'openid-client';

/**
 * middleware that hosts all authn routes
 */
export default function authNRoutes(): Router {
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

    /*
     * create additional OA2 params to implement PKCE
     */
    // const code_verifier = generators.codeVerifier();
    // const code_challenge = generators.codeChallenge(code_verifier);

    /**
     * construct authZ URL
     * URL components: client_id, scope, response_type, redirect_uri, state
     */
    const authZUrl = req.app.authNClient.authorizationUrl({
      scope: 'openid email profile',
      state: state,
      // code_challenge,
      // code_challenge_method: 'S256',
    });
    console.trace('constructed authZUrl %o:', authZUrl);

    /**
     * set HTTP Set-Cookie response header `state`
     */
    setAuthNStateCookie(res, state);

    /**
     * redirect user agent to authorization URL
     */
    console.trace('redirecting user agent to authorization URL: %o', authZUrl);
    res.redirect(authZUrl);
  });

  router.get('/auth/callback', async function(req, res, next) {
    // console.trace('req: %o', req);
    /**
     * extract state out of cookies
     */
    const state = getAuthNStateCookie(req);
    const { backToPath } = deserializeAuthnState(state);

    /**
     * extract code & state out of query string
     */
    const client = req.app.authNClient;
    const params = client.callbackParams(req);

    /**
     * make Access Token & ID Token request to authZ server
     * POST ...oauth2.googleapis.com/token
     */
    console.trace('making access token request to authorization server...');
    const tokenSet = await client.callback(
      `${getDomain()}/auth/callback`,
      params,
      { state },
      // { code_verifier },
    );
    console.trace('received access token from authorization server: %o', tokenSet);
    console.trace('calling tokenSet.claims(): %o', tokenSet.claims());

    /**
     * make protected-resource request to resource server
     */
    console.trace('making protected resource request to resource server...');
    const user = await client.userinfo(tokenSet);
    console.trace('received userinfo: %o', user);

    /**
     * create and save session?
     **/

    /**
     * set Set-Cookie response header `state`, `authN`
     * @todo this is a temporary solution
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
