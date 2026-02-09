/**
 * URL validation utilities shared between client and server.
 */

/**
 * Client-safe URL validation that blocks internal/private addresses.
 * Checks protocol and hostname against a blocklist.
 */
export function isValidExternalUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return false;
    const hostname = parsed.hostname.toLowerCase();
    if (
      hostname === 'localhost' ||
      hostname === '0.0.0.0' ||
      hostname === '127.0.0.1' ||
      hostname.startsWith('10.') ||
      hostname.startsWith('192.168.') ||
      /^172\.(1[6-9]|2\d|3[01])\./.test(hostname) ||
      hostname === '169.254.169.254' ||
      hostname.endsWith('.internal') ||
      hostname.endsWith('.local')
    ) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Server-only: resolve DNS and check that the resolved IP is not in a private range.
 * Catches DNS rebinding attacks where a public hostname resolves to a private IP.
 */
export async function isResolvedIpSafe(hostname: string): Promise<boolean> {
  try {
    const dns = await import('dns');
    const { promisify } = await import('util');
    const resolve4 = promisify(dns.resolve4);

    const addresses = await resolve4(hostname);
    for (const ip of addresses) {
      if (isPrivateIp(ip)) return false;
    }
    return true;
  } catch {
    // DNS resolution failed — let the fetch call handle it
    return true;
  }
}

function isPrivateIp(ip: string): boolean {
  const parts = ip.split('.').map(Number);
  if (parts.length !== 4) return true;

  // 10.x.x.x
  if (parts[0] === 10) return true;
  // 172.16-31.x.x
  if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
  // 192.168.x.x
  if (parts[0] === 192 && parts[1] === 168) return true;
  // 127.x.x.x loopback
  if (parts[0] === 127) return true;
  // 169.254.x.x link-local
  if (parts[0] === 169 && parts[1] === 254) return true;
  // 0.0.0.0
  if (parts[0] === 0) return true;

  return false;
}
