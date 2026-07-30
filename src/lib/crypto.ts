// Signal End-to-End Encryption Helper & Safety Number Generator

export async function generateSafetyNumber(userId1: string, userId2: string): Promise<string> {
  const combined = [userId1, userId2].sort().join('-signal-e2ee-key');
  const encoder = new TextEncoder();
  const data = encoder.encode(combined);
  
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    // Convert to 12 groups of 5-digit numbers like Signal Safety Numbers
    let digits = hashArray.map(b => b.toString(10).padStart(3, '0')).join('');
    digits = digits.slice(0, 60);
    const chunks = [];
    for (let i = 0; i < digits.length; i += 5) {
      chunks.push(digits.slice(i, i + 5));
    }
    return chunks.slice(0, 12).join(' ');
  }
  
  // Fallback fallback string generator
  return "48201 93012 88412 04918 39201 44812 00192 48192 30192 49201 10492 85930";
}

// Simulates AES-GCM Encryption for Signal privacy demo
export function encryptMessageText(plainText: string): { ciphertext: string; nonce: string } {
  // Simple Base64 + key salt simulation for UI display of encrypted state
  const encoded = btoa(unescape(encodeURIComponent(plainText)));
  const nonce = Array.from({ length: 12 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  return {
    ciphertext: `enc_v1:${nonce}:${encoded}`,
    nonce,
  };
}

export function decryptMessageText(ciphertext: string): string {
  if (!ciphertext.startsWith('enc_v1:')) return ciphertext;
  try {
    const parts = ciphertext.split(':');
    if (parts.length < 3) return ciphertext;
    const encoded = parts[2];
    return decodeURIComponent(escape(atob(encoded)));
  } catch {
    return ciphertext;
  }
}
