/*##############################################################################

# authn session

##############################################################################*/

import { UserinfoResponse, TokenSet } from 'openid-client';
import { toBase64, fromBase64 } from './encoding';

export interface IDSession {
  user: UserinfoResponse;
  tokenSet: TokenSet;
}

export function serialize(session: IDSession): string {
  return toBase64(session);
}

export function deserialize(value: string): IDSession {
  const raw = fromBase64<any>(value);
  return {
    ...raw
  }
}
