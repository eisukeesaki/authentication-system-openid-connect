/*##############################################################################

# declarations

##############################################################################*/

import { ISession } from './authn';

declare global {
  namespace Express {
    export interface Request {
      session?: ISession;
    }
  }
}
