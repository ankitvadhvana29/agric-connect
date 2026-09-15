/**
 * UIDAI Aadhaar Verhoeff Checksum & Identity Verification Service
 * Used for verifying Farmer and Consumer ID authenticity
 */

// Verhoeff algorithm multiplication table (d)
const d = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
  [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
  [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
  [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
  [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
  [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
  [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
  [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
  [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
];

// Verhoeff algorithm permutation table (p)
const p = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
  [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
  [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
  [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
  [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
  [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
  [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
];

/**
 * Validate Aadhaar number using official Verhoeff checksum algorithm
 * @param {string} aadhaarStr 12-digit numeric string
 * @returns {boolean} true if mathematically valid
 */
export const validateVerhoeffAadhaar = (aadhaarStr) => {
  if (!aadhaarStr) return false;
  const clean = aadhaarStr.toString().replace(/[\s-]/g, '');

  if (!/^\d{12}$/.test(clean)) return false;
  // Aadhaar numbers do not begin with 0 or 1
  if (clean.charAt(0) === '0' || clean.charAt(0) === '1') return false;

  let c = 0;
  const invertedArray = clean.split('').map(Number).reverse();

  for (let i = 0; i < invertedArray.length; i++) {
    c = d[c][p[i % 8][invertedArray[i]]];
  }

  return c === 0;
};

/**
 * Safely mask an Aadhaar number to conform to privacy guidelines (XXXX-XXXX-1234)
 */
export const maskAadhaarNumber = (aadhaarStr) => {
  if (!aadhaarStr) return 'XXXX-XXXX-0000';
  const clean = aadhaarStr.toString().replace(/[\s-]/g, '');
  if (clean.length < 4) return 'XXXX-XXXX-0000';
  const lastFour = clean.slice(-4);
  return `XXXX-XXXX-${lastFour}`;
};

/**
 * Compute user trust score based on KYC and activity
 */
export const computeTrustScore = (isKycVerified, orderCount = 0, reviewRating = 5.0) => {
  let score = 50; // Base score
  if (isKycVerified) score += 35; // +35 for Aadhaar verification
  score += Math.min(orderCount * 2, 10); // Up to +10 for transaction history
  if (reviewRating >= 4.5) score += 5; // +5 for high satisfaction
  return Math.min(score, 100);
};
