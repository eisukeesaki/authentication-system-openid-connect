/*##############################################################################

# define encoding & decoding helpers

##############################################################################*/

export function toBase64<T>(data: T): string {
  console.trace('data: %o', data);
  return Buffer.from(JSON.stringify(data)).toString("base64");
}

