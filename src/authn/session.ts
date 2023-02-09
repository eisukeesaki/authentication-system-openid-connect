import { UserinfoResponse, TokenSet } from 'openid-client';

export interface ISession {
  user: UserinfoResponse;
  tokenSet: TokenSet;
}
