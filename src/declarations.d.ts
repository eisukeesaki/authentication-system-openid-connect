/*##############################################################################

# declarations

##############################################################################*/

import { ISession } from './authn';
import { Issuer, Client } from 'openid-client';

declare global {
  namespace Express {
    export interface Application {
      authnIssuer?: Issuer;
      authnClient: Client;
    }
    export interface Request {
      session?: ISession;
    }
  }
}
