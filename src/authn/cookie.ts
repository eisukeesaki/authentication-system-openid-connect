import { Request, Response } from 'express';

const SESSION_COOKIE = 'authN';

export function getSessionCookie(req: Request): string | undefined {
  return req.cookies[SESSION_COOKIE];
}

export function setSessionCookie(res: Response, session: string): void {
  // @todo determine & set appropriate cookie options
  res.cookie(SESSION_COOKIE, session);
}
