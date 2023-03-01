import express, { Request, Response } from 'express';
import { generators } from 'openid-client';
import { toBase64, fromBase64 } from './encoding';

const STATE_COOKIE = 'state';

interface AnState {
  backToPath: string;
  bytes: string;
}

export function serializeAuthnState(state: Partial<AnState>): string {
  /*
   * @notes .state() is an alias of generators.random([bytes])
   */
  const toSerialize = {
    ...state,
    bytes: generators.state()
  };

  return toBase64(toSerialize);
}

export function deserializeAuthnState(value: string): AnState {
  return fromBase64(value);
}

export function setAuthNStateCookie(res: Response, state: string): void {
  console.trace('Set-Cookie: state=%o', state);
  res.cookie(STATE_COOKIE, state/* , @todo options */);
}

export function getAuthNStateCookie(req: Request): string {
  return req.cookies[STATE_COOKIE];
}
