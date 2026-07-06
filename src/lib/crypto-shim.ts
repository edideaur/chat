// Browser shim for the Node `crypto` bits the E2B SDKs import (randomBytes).
// Aliased in vite.config.ts. Web Crypto is available in all target browsers.
export function randomBytes(size: number): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(size))
}

export default { randomBytes }
