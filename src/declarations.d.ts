/*##############################################################################

# declarations

##############################################################################*/

import { IDSession } from './authN';
import { Issuer, Client } from 'openid-client';

declare global {
  namespace Express {
    export interface Application {
      authNIssuer?: Issuer;
      authNClient: Client;
    }
    export interface Request {
      session?: IDSession;
    }
  }
}
