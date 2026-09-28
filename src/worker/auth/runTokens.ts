export interface RunTokenPayload {
  nonce: string;
  category: string;
  challengeId?: string | null;
  seed: string;
  issuedAt: number;
  expiresAt: number;
  accountId?: string | null;
}

function toBase64Url(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]!);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(str: string): Uint8Array {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function getHmacKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    'raw',
    enc.encode(secret || 'default-comtam-daily-key'),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

export async function createSignedRunToken(payload: RunTokenPayload, secret: string): Promise<string> {
  const key = await getHmacKey(secret);
  const enc = new TextEncoder();
  const payloadJson = JSON.stringify(payload);
  const payloadB64 = toBase64Url(enc.encode(payloadJson));

  const signature = await crypto.subtle.sign('HMAC', key, enc.encode(payloadB64));
  const sigB64 = toBase64Url(signature);

  return `${payloadB64}.${sigB64}`;
}

export async function verifySignedRunToken(
  tokenString: string,
  secret: string
): Promise<RunTokenPayload | null> {
  try {
    const parts = tokenString.split('.');
    if (parts.length !== 2) return null;
    const [payloadB64, sigB64] = parts as [string, string];

    const key = await getHmacKey(secret);
    const enc = new TextEncoder();
    const sigBytes = fromBase64Url(sigB64);

    const valid = await crypto.subtle.verify('HMAC', key, sigBytes as unknown as BufferSource, enc.encode(payloadB64) as unknown as BufferSource);
    if (!valid) return null;

    const payloadJson = new TextDecoder().decode(fromBase64Url(payloadB64));
    const payload = JSON.parse(payloadJson) as RunTokenPayload;

    return payload;
  } catch {
    return null;
  }
}
