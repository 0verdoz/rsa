/**
 * Utility mathematical functions for RSA operations and educational visualizers.
 */

export function isPrime(n: number): boolean {
  if (n <= 1) return false;
  if (n <= 3) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;
  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
  }
  return true;
}

export function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x;
}

/**
 * Returns Extended Euclidean Algorithm steps and result:
 * e * x + phi * y = gcd(e, phi)
 */
export interface ExtendedGcdStep {
  step: number;
  a: number;
  b: number;
  q: number;
  r: number;
}

export function getExtendedGcdSteps(a: number, b: number): ExtendedGcdStep[] {
  const steps: ExtendedGcdStep[] = [];
  let currentA = a;
  let currentB = b;
  let stepNum = 1;

  while (currentB > 0) {
    const q = Math.floor(currentA / currentB);
    const r = currentA % currentB;
    steps.push({
      step: stepNum++,
      a: currentA,
      b: currentB,
      q,
      r,
    });
    currentA = currentB;
    currentB = r;
  }

  return steps;
}

export function modInverse(e: number, phi: number): number | null {
  let m0 = phi;
  let y = 0;
  let x = 1;

  if (phi === 1) return 0;

  let tempE = e;
  let tempPhi = phi;

  while (tempE > 1) {
    if (tempPhi === 0) return null; // Not coprime
    const q = Math.floor(tempE / tempPhi);
    let t = tempPhi;

    tempPhi = tempE % tempPhi;
    tempE = t;
    t = y;

    y = x - q * y;
    x = t;
  }

  if (x < 0) x += m0;

  return x;
}

/**
 * Modular Exponentiation: (base^exp) % mod using BigInt to prevent overflow
 */
export function modPow(base: number, exp: number, mod: number): number {
  if (mod === 1) return 0;
  let b = BigInt(base);
  let e = BigInt(exp);
  const m = BigInt(mod);
  let result = 1n;

  b = b % m;
  while (e > 0n) {
    if (e % 2n === 1n) {
      result = (result * b) % m;
    }
    e = e / 2n;
    b = (b * b) % m;
  }

  return Number(result);
}

/**
 * Get step-by-step modular exponentiation trace for animation
 */
export interface ModPowStep {
  stepIndex: number;
  expBit: number;
  currentBase: number;
  currentResult: number;
  actionDescription: string;
}

export function getModPowSteps(base: number, exp: number, mod: number): ModPowStep[] {
  const steps: ModPowStep[] = [];
  let b = BigInt(base);
  let e = BigInt(exp);
  const m = BigInt(mod);
  let res = 1n;
  let stepIdx = 1;

  const binaryExp = exp.toString(2);

  for (let i = binaryExp.length - 1; i >= 0; i--) {
    const bit = parseInt(binaryExp[i], 10);
    const prevRes = res;
    const prevB = b;

    if (bit === 1) {
      res = (res * b) % m;
      steps.push({
        stepIndex: stepIdx++,
        expBit: bit,
        currentBase: Number(prevB),
        currentResult: Number(res),
        actionDescription: `Bit is 1: Multiply result by base (${prevRes} × ${prevB}) mod ${mod} = ${res}`,
      });
    } else {
      steps.push({
        stepIndex: stepIdx++,
        expBit: bit,
        currentBase: Number(prevB),
        currentResult: Number(res),
        actionDescription: `Bit is 0: Result stays ${res}`,
      });
    }

    b = (b * b) % m;
  }

  return steps;
}

export function getFriendlyPrimes(): number[] {
  return [3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];
}

export function findValidExponents(phi: number): number[] {
  const candidates = [3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 65537];
  return candidates.filter((c) => c < phi && gcd(c, phi) === 1);
}

/**
 * Format string to array of ASCII codes, mapping to range smaller than n if possible
 */
export function stringToMessageNumbers(text: string, maxN: number): number[] {
  const result: number[] = [];
  for (let i = 0; i < text.length; i++) {
    let charCode = text.charCodeAt(i);
    // If character code >= n, fit within modulus range safely for educational display
    if (charCode >= maxN) {
      charCode = (charCode % (maxN - 2)) + 2;
    }
    result.push(charCode);
  }
  return result;
}

export function messageNumbersToString(nums: number[]): string {
  return nums.map((n) => String.fromCharCode(n)).join('');
}
