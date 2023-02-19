import { Request, Response, NextFunction } from 'express';

export function logRequest(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.trace('incoming request.\n' +
    'req.protocol: %o\n' +
    'req.method: %o\n' +
    'req.hostname: %o\n' +
    'req.path: %o\n' +
    'req.originalUrl: %o\n' +
    'req.baseUrl: %o\n' +
    'req.url: %o\n' +
    'req.params: %o\n' +
    'req.query: %o\n' +
    'req.ip: %o\n' +
    'req.ips: %o\n' +
    'req.subdomains: %o\n' +
    'req.route: %o\n' +
    // 'req.app: %o\n' +
    'req.fresh: %o\n' +
    'req.secure: %o\n' +
    'req.stale: %o\n' +
    'req.xhr: %o\n' +
    'req.cookies %o\n' +
    'req.signedCookies %o\n' +
    'req.headers: %o\n' +
    'req.body: %o',
    req.protocol,
    req.method,
    req.hostname,
    req.path,
    req.originalUrl,
    req.baseUrl,
    req.url,
    req.params,
    req.query,
    req.ip,
    req.ips,
    req.subdomains,
    req.route,
    // req.app,
    req.fresh,
    req.secure,
    req.stale,
    req.xhr,
    req.cookies,
    req.signedCookies,
    req.headers,
    req.body
  );

  next();
}


