export type StageId =
  | 'INTRO'
  | 'PRIME_SELECTION'
  | 'KEY_FORGE'
  | 'ENCRYPTION'
  | 'EVE_INTERCEPTION'
  | 'DECRYPTION'
  | 'SANDBOX';

export interface RSAKeys {
  p: number;
  q: number;
  n: number;
  phi: number;
  e: number;
  d: number;
}

export interface EncryptedBlock {
  char: string;
  ascii: number;
  cipher: number;
  decryptedAscii?: number;
  decryptedChar?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  iconName: string;
}

export interface ChatMessage {
  sender: 'user' | 'tutor';
  text: string;
  timestamp: string;
}
