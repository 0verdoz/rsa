import React, { useState } from 'react';
import { RSAKeys, EncryptedBlock } from '../../types';
import { modPow, messageNumbersToString } from '../../lib/rsaMath';
import { ModularClockVisualizer } from '../ModularClockVisualizer';
import { Lock, CheckCircle2, BookOpen, Compass } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Stage5DecryptionProps {
  keys: RSAKeys;
  encryptedBlocks: EncryptedBlock[];
  onNext: () => void;
}

export const Stage5Decryption: React.FC<Stage5DecryptionProps> = ({
  keys,
  encryptedBlocks,
  onNext,
}) => {
  const [selectedCharIndex, setSelectedCharIndex] = useState<number>(0);

  // Decrypt each block using private key d
  const decryptedBlocks = encryptedBlocks.map((blk) => {
    const decryptedAscii = modPow(blk.cipher, keys.d, keys.n);
    const decryptedChar = String.fromCharCode(decryptedAscii);
    return {
      ...blk,
      decryptedAscii,
      decryptedChar,
    };
  });

  const activeDecBlock = decryptedBlocks[selectedCharIndex] || decryptedBlocks[0] || {
    char: 'H',
    ascii: 72,
    cipher: 0,
    decryptedAscii: 72,
    decryptedChar: 'H',
  };

  const recoveredMessage = messageNumbersToString(decryptedBlocks.map((b) => b.decryptedAscii));

  const handleFinishStory = () => {
    confetti({ particleCount: 100, spread: 100, origin: { y: 0.6 } });
    onNext();
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-white border border-slate-300 rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
              Stage 5: Nii's Vault Decryption
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2">
              Nii Unlocks Plaintext Message M using Secret Key PR
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl font-medium">
              Using secret private exponent <strong className="text-rose-700 font-mono font-bold">d={keys.d}</strong>, Nii computes:
              <span className="font-mono bg-rose-50 text-rose-900 border border-rose-200 px-2 py-0.5 rounded ml-2 text-xs font-bold">
                M = C^d mod n
              </span>
            </p>
          </div>
          <div className="bg-emerald-50 border-2 border-emerald-500 rounded-xl p-4 text-center shrink-0 min-w-[170px]">
            <span className="text-xs text-emerald-900 font-extrabold block tracking-wider uppercase">Recovered Secret Message</span>
            <span className="text-3xl font-extrabold font-mono text-emerald-700 mt-1 block">{recoveredMessage}</span>
          </div>
        </div>
      </div>

      {/* Decryption Block Breakdown */}
      <div className="bg-white border border-slate-300 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <h3 className="font-extrabold text-slate-900 text-sm flex items-center space-x-2">
            <Lock className="w-4 h-4 text-rose-600" />
            <span>Character-by-Character Decryption Transformation</span>
          </h3>
          <span className="text-xs font-mono font-bold text-slate-700">
            Private Key d = {keys.d}, Modulus n = {keys.n}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {decryptedBlocks.map((blk, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedCharIndex(idx)}
              className={`p-3.5 rounded-xl border font-mono text-xs text-left transition-all cursor-pointer ${
                selectedCharIndex === idx
                  ? 'bg-rose-50 border-2 border-rose-600 text-slate-900 ring-2 ring-rose-300 shadow-md scale-[1.02]'
                  : 'bg-slate-50 border-slate-300 hover:border-slate-400 text-slate-800'
              }`}
            >
              <div className="flex justify-between items-center text-slate-600 mb-1 font-sans font-bold">
                <span>Cipher C={blk.cipher}</span>
                <span className="text-[10px] text-rose-700">d = {keys.d}</span>
              </div>
              <div className="text-slate-600 text-[11px] font-semibold">
                {blk.cipher}^{keys.d} mod {keys.n} =
              </div>
              <div className="text-emerald-700 font-extrabold text-lg mt-1 flex items-center justify-between">
                <span>M = {blk.decryptedAscii}</span>
                <span className="text-xs bg-emerald-600 text-white font-mono px-2 py-0.5 rounded font-extrabold">
                  '{blk.decryptedChar}'
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Clock Visualizer for currently selected decryption character */}
      <ModularClockVisualizer
        modulus={keys.n}
        base={activeDecBlock.cipher}
        exponent={keys.d}
        highlightValue={activeDecBlock.decryptedAscii}
        title={`Decryption Clock Animation for Cipher ${activeDecBlock.cipher} → Char '${activeDecBlock.decryptedChar}'`}
      />

      {/* Mathematical Proof Card (Euler's Totient Theorem) */}
      <div className="bg-white border border-slate-300 rounded-2xl p-5 shadow-sm space-y-3">
        <h3 className="font-extrabold text-slate-900 text-sm border-b border-slate-200 pb-3 flex items-center space-x-2">
          <BookOpen className="w-4 h-4 text-blue-600" />
          <span>Why Does It Work? The Mathematical Proof Behind RSA</span>
        </h3>

        <div className="bg-slate-50 border border-slate-300 rounded-xl p-4 font-mono text-xs text-slate-800 space-y-2 font-semibold">
          <div className="text-slate-700">
            1. Encryption step: <strong className="text-rose-700">C ≡ M^e (mod n)</strong>
          </div>
          <div className="text-slate-700">
            2. Decryption step: <strong className="text-emerald-700">C^d ≡ (M^e)^d ≡ M^(e·d) (mod n)</strong>
          </div>
          <div className="text-blue-800">
            3. Since e·d ≡ 1 (mod φ(n)), we have e·d = 1 + k·φ(n)
          </div>
          <div className="text-blue-900 bg-white p-2.5 rounded border border-blue-200 text-sm font-extrabold">
            4. By Euler's Totient Theorem: M^(1 + k·φ(n)) ≡ M · (M^φ(n))^k ≡ M · 1^k ≡ M (mod n)!
          </div>
        </div>

        <p className="text-xs text-slate-600 italic font-medium">
          The modular exponentiation reverses itself perfectly because e and d are modular inverses under φ(n)!
        </p>
      </div>

      {/* Action Button */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center space-x-2 text-xs text-emerald-800 bg-emerald-50 border border-emerald-300 px-3 py-2 rounded-xl font-bold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Bello & Nii successfully communicated with 100% mathematical secrecy!</span>
        </div>
        <button
          onClick={handleFinishStory}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm px-6 py-3 rounded-xl shadow-md transition-all cursor-pointer"
        >
          <span>Explore RSA Freeform Playground</span>
          <Compass className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
