/*##############################################################################

# define encoding & decoding helpers

##############################################################################*/

import { createNoSubstitutionTemplateLiteral } from "typescript";

export function toBase64<T>(data: T): string {
  return Buffer.from(JSON.stringify(data)).toString("base64");
}

export function fromBase64<T>(value: string): T {
  return JSON.parse(Buffer.from(value, 'base64').toString('utf8'));
}

