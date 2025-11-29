// Web-only MetaMask connector using EIP-1193 provider.
// This does not create a Clerk session; it only retrieves the user's address.
// You can extend this to a SIWE flow with a backend if desired.
export async function connectMetamaskWeb(): Promise<string | null> {
  if (typeof window === 'undefined') return null;
  const anyWindow: any = window as any;
  const provider = anyWindow.ethereum;
  if (!provider) {
    console.warn('MetaMask provider not found. Make sure MetaMask is installed.');
    return null;
  }
  try {
    const accounts: string[] = await provider.request({ method: 'eth_requestAccounts' });
    const address = accounts?.[0] || null;
    return address;
  } catch (e) {
    console.error('MetaMask connect error', e);
    return null;
  }
}
