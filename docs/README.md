# authentication-system-openid-connect

## features

* allow users to log in to the app using their Google account

## endpoints

`GET /auth/login`

* initiates the OAuth 2.0 authorization code flow
* builds and redirects user to authorization URL

`GET /auth/callback`

* makes Access Token & ID Token request to authorization server
* makes protected-resource request to resource server
* redirects user agent to originally requested protected resource

## [authentication flow](./oidc-authn-sequence.svg)

## [TODOs](./todos)
