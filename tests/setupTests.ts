import '@testing-library/jest-dom';

// jsdom <-> crypto shim for randomUUID in tests
if (!globalThis.crypto) {
  // @ts-ignore
  globalThis.crypto = {} as Crypto;
}
if (!('randomUUID' in globalThis.crypto)) {
  // @ts-ignore
  globalThis.crypto.randomUUID = () => 'test-uuid';
}
