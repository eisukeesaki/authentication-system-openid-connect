import express, { Request, Response } from 'express';
import { generators } from 'openid-client';
import { toBase64 } from './encoding';

const STATE_COOKIE = 'state';

interface AnState {
  backToPath: string;
  bytes: string;
}

export function serializeAuthnState(state: Partial<AnState>): string {
  /*
   * take backToPath
   * generate random bytes and encode them into url safe base64
   * encode the combined data into url safe base64
   * @notes .state() is an alias of generators.random([bytes])
   */
  return toBase64({
    ...state,
    bytes: generators.state()
  });
}

// export function deserializeAuthnState(value: string): AnState {
//   /*
//    * take backToPath
//    * generate random bytes and encode them into url safe base64
//    * encode the combined data into url safe base64
//    * @notes .state() is an alias of generators.random([bytes])
//    */
//   return toBase64({
//     ...state,
//     bytes: generators.state()
//   });
// }

export function setAuthnStateCookie(res: Response, state: string): void {
  res.cookie(STATE_COOKIE, state/* , @todo options */);
}

// export function getAuthnStateCookie(req: Request): string {
//   return req.cookies[STATE_COOKIE];
// }
