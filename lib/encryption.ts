const { subtle } = require('crypto').webcrypto;

export const generateKeys = async (password: string) => {
  const ec = new TextEncoder();

  const keyMaterial = await subtle.importKey(
    'raw',
    ec.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return await subtle.deriveKey(
    {
      name: 'PBKDF2',
      hash: 'SHA-512',
      salt: ec.encode('H5a86KT6alcuuSQVS73WSwdmK0kWwg9B'),
      iterations: 1000,
    },
    keyMaterial,
    {
      name: 'AES-GCM',
      length: 256,
    },
    true,
    ['encrypt', 'decrypt']
  );
};

export const exportKeys = async (key: CryptoKey) => {
  key = await subtle.exportKey('raw', key);

  return key;
};
