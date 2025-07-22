// /**
//  * Reversible ID Encoder for Next.js with TypeScript
//  * Deterministic two-way encryption for CUID + Serial Number combinations
//  */

// export interface DecodedResult {
//   cuid: string;
//   serialNumber: string;
// }

// export interface EncoderOptions {
//   secretKey?: string;
// }

// export class ReversibleIdEncoder {
//   private readonly secretKey: string;
//   private readonly alphabet: string = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
//   private readonly base: number;

//   constructor(options: EncoderOptions = {}) {
//     this.secretKey = options.secretKey || 'default-secret-key-change-this';
//     this.base = this.alphabet.length;
//   }

//   /**
//    * Simple hash function for deterministic scrambling
//    */
//   private simpleHash(str: string, seed: number = 0): number {
//     let h1 = 0xdeadbeef ^ seed;
//     let h2 = 0x41c6ce57 ^ seed;
    
//     for (let i = 0; i < str.length; i++) {
//       const ch = str.charCodeAt(i);
//       h1 = Math.imul(h1 ^ ch, 2654435761);
//       h2 = Math.imul(h2 ^ ch, 1597334677);
//     }
    
//     h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
//     h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    
//     return (h1 >>> 0) + (h2 >>> 0) * 4294967296;
//   }

//   /**
//    * Convert string to base62 encoding
//    */
//   private stringToBase62(str: string): string {
//     let result = '';
    
//     // Handle browser and Node.js environments
//     const encoder = typeof TextEncoder !== 'undefined' 
//       ? new TextEncoder() 
//       : { encode: (s: string) => Buffer.from(s, 'utf8') };
    
//     const bytes = encoder.encode(str);
//     let num = 0n;
    
//     // Convert bytes to big integer
//     for (let i = 0; i < bytes.length; i++) {
//       num = (num << 8n) + BigInt(bytes[i]);
//     }
    
//     // Convert to base62
//     if (num === 0n) return '0';
    
//     while (num > 0) {
//       result = this.alphabet[Number(num % BigInt(this.base))] + result;
//       num = num / BigInt(this.base);
//     }
    
//     return result;
//   }

//   /**
//    * Convert base62 back to string
//    */
//   private base62ToString(base62Str: string): string {
//     let num = 0n;
    
//     // Convert base62 to big integer
//     for (let i = 0; i < base62Str.length; i++) {
//       const char = base62Str[i];
//       const value = this.alphabet.indexOf(char);
//       if (value === -1) {
//         throw new Error('Invalid character in encoded string');
//       }
//       num = num * BigInt(this.base) + BigInt(value);
//     }
    
//     // Convert big integer to bytes
//     const bytes: number[] = [];
//     while (num > 0) {
//       bytes.unshift(Number(num & 0xFFn));
//       num = num >> 8n;
//     }
    
//     // Handle browser and Node.js environments
//     const decoder = typeof TextDecoder !== 'undefined' 
//       ? new TextDecoder() 
//       : { decode: (bytes: Uint8Array) => Buffer.from(bytes).toString('utf8') };
    
//     return decoder.decode(new Uint8Array(bytes));
//   }

//   /**
//    * XOR encryption/decryption
//    */
//   private xorEncrypt(data: string, key: string): string {
//     let result = '';
//     for (let i = 0; i < data.length; i++) {
//       const keyChar = key[i % key.length];
//       const dataChar = data[i];
//       result += String.fromCharCode(dataChar.charCodeAt(0) ^ keyChar.charCodeAt(0));
//     }
//     return result;
//   }

//   /**
//    * Encode CUID and serial number into unique ID
//    */
//   public encode(cuid: string, serialNumber: string | number): string {
//     // Validate inputs
//     if (!cuid || (serialNumber === null || serialNumber === undefined)) {
//       throw new Error('Both CUID and serial number are required');
//     }

//     // Normalize serial number to string
//     const serialStr = serialNumber.toString();
    
//     // Create combined string with separator
//     const combined = `${cuid}|${serialStr}`;
    
//     // Generate deterministic key based on secret and combined data
//     const hashSeed = this.simpleHash(this.secretKey + combined);
//     const encryptionKey = this.secretKey + hashSeed.toString();
    
//     // Encrypt the combined string
//     const encrypted = this.xorEncrypt(combined, encryptionKey);
    
//     // Convert to base62 for URL-safe output
//     const encoded = this.stringToBase62(encrypted);
    
//     // Add checksum for integrity
//     const checksum = this.simpleHash(encoded + this.secretKey).toString(36).substr(0, 4);
    
//     return `${encoded}_${checksum}`;
//   }

//   /**
//    * Decode unique ID back to CUID and serial number
//    */
//   public decode(encodedId: string): DecodedResult {
//     // Validate input
//     if (!encodedId || typeof encodedId !== 'string') {
//       throw new Error('Invalid encoded ID');
//     }

//     // Split ID and checksum
//     const parts = encodedId.split('_');
//     if (parts.length !== 2) {
//       throw new Error('Invalid encoded ID format');
//     }

//     const [encoded, providedChecksum] = parts;
    
//     // Verify checksum
//     const expectedChecksum = this.simpleHash(encoded + this.secretKey).toString(36).substr(0, 4);
//     if (providedChecksum !== expectedChecksum) {
//       throw new Error('Invalid checksum - data may be corrupted');
//     }

//     try {
//       // Convert from base62
//       const encrypted = this.base62ToString(encoded);
      
//       // Try to decrypt with deterministic key generation
//       let decrypted: string | null = null;
      
//       for (let attempt = 0; attempt < 1000; attempt++) {
//         try {
//           const testKey = this.secretKey + attempt.toString();
//           const testDecrypted = this.xorEncrypt(encrypted, testKey);
          
//           // Check if this looks like valid data (contains separator)
//           if (testDecrypted.includes('|')) {
//             const testParts = testDecrypted.split('|');
//             if (testParts.length === 2 && testParts[0].length > 0 && testParts[1].length > 0) {
//               // Verify this is the correct decryption by re-encoding
//               const reEncoded = this.encode(testParts[0], testParts[1]);
//               if (reEncoded === encodedId) {
//                 decrypted = testDecrypted;
//                 break;
//               }
//             }
//           }
//         } catch (e) {
//           // Continue trying
//         }
//       }
      
//       if (!decrypted) {
//         throw new Error('Could not decrypt - invalid key or corrupted data');
//       }
      
//       // Split the decrypted data
//       const dataParts = decrypted.split('|');
//       if (dataParts.length !== 2) {
//         throw new Error('Invalid decrypted data format');
//       }
      
//       return {
//         cuid: dataParts[0],
//         serialNumber: dataParts[1]
//       };
      
//     } catch (error) {
//       throw new Error(`Decoding failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
//     }
//   }

//   /**
//    * Generate a test CUID-like string
//    */
//   public generateTestCuid(): string {
//     const timestamp = Date.now().toString(36);
//     const randomPart = Math.random().toString(36).substring(2, 8);
//     return `c${timestamp}${randomPart}`;
//   }
// }

// /**
//  * Factory function to create encoder instance
//  */
// export const createEncoder = (options: EncoderOptions = {}): ReversibleIdEncoder => {
//   return new ReversibleIdEncoder(options);
// };

// /**
//  * Default encoder instance with environment-based secret key
//  */
// export const defaultEncoder = new ReversibleIdEncoder({
//   secretKey: process.env.ENCODER_SECRET_KEY || 'change-this-in-production'
// });

// /**
//  * Utility functions for direct use
//  */
// export const encodeId = (cuid: string, serialNumber: string | number, secretKey?: string): string => {
//   const encoder = secretKey ? createEncoder({ secretKey }) : defaultEncoder;
//   return encoder.encode(cuid, serialNumber);
// };

// export const decodeId = (encodedId: string, secretKey?: string): DecodedResult => {
//   const encoder = secretKey ? createEncoder({ secretKey }) : defaultEncoder;
//   return encoder.decode(encodedId);
// };

// // Example usage in Next.js
// if (typeof window === 'undefined') {
//   // Server-side example
//   console.log('=== Next.js Server-Side Example ===\n');
  
//   const encoder = createEncoder({ secretKey: 'your-production-secret-key' });
  
//   // Test with single digit serial numbers
//   const examples = [
//     { cuid: 'c123abc456', serial: 1 },
//     { cuid: 'c456def789', serial: 5 },
//     { cuid: 'c789ghi012', serial: 9 }
//   ];
  
//   examples.forEach((example, index) => {
//     console.log(`Example ${index + 1}:`);
//     console.log(`  Input: CUID=${example.cuid}, Serial=${example.serial}`);
    
//     const encoded = encoder.encode(example.cuid, example.serial);
//     console.log(`  Encoded: ${encoded}`);
    
//     const decoded = encoder.decode(encoded);
//     console.log(`  Decoded: CUID=${decoded.cuid}, Serial=${decoded.serialNumber}`);
//     console.log(`  Valid: ${decoded.cuid === example.cuid && decoded.serialNumber === example.serial.toString()}\n`);
//   });
// }