import { Request, Response, NextFunction } from 'express';

export async function requireAuthn(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const session = req.session;

  if (!session)
    return next(new Error('user agent not authned'));

  next();
}
