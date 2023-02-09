/*##############################################################################

# define middlewares

##############################################################################*/
import { Request, Response, NextFunction } from 'express';

/**
 * block unauthenticated requests
 */
export async function requireAuthn(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const session = req.session;

  if (!session)
    return res.status(401).send('user agent not authenticated');

  next();
}
