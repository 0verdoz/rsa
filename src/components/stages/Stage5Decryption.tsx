import React, { useState } from 'react';
import { RSAKeys, EncryptedBlock } from '../../types';
import { modPow, messageNumbersToString } from '../../lib/rsaMath';
import { ModularClockVisualizer } from '../ModularClockVisualizer';
import { Lock, CheckCircle2, Sparkles, ArrowRight, BookOpen, Key, Compass } from 'lucide-react';
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
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 border border-emerald-800/60 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-800/80">
              Stage 5: Nii's Vault Decryption
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-2">
              Nii Unlocks Plaintext Message M using Secret Key d
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Using private exponent <strong className="text-emerald-300 font-mono">d={keys.d}</strong>, Nii computes:
              <span className="font-mono bg-slate-950 text-emerald-300 border border-emerald-900 px-2 py-0.5 rounded ml-2 text-xs">
                M = C^d mod n
              </span>
            </p>
          </div>
          <div className="bg-slate-950 border border-emerald-800 rounded-xl p-3 text-center shrink-0">
            <span className="text-[10px] text-slate-400 block font-semibold">Recovered Secret Message</span>
            <span className="text-2xl font-bold font-mono text-emerald-300">{recoveredMessage}</span>
          </div>
        </div>
      </div>

      {/* Decryption Block Breakdown */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h3 className="font-bold text-white text-sm flex items-center space-x-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>Character-by-Character Decryption Transformation</span>
          </h3>
          <span className="text-xs font-mono text-emerald-300">
            Private Key d = {keys.d}, Modulus n = {keys.n}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {decryptedBlocks.map((blk, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedCharIndex(idx)}
              className={`p-3 rounded-xl border font-mono text-xs text-left transition-all ${
                selectedCharIndex === idx
                  ? 'bg-emerald-950/80 border-emerald-500 text-white ring-2 ring-emerald-400/50 shadow-lg scale-[1.02]'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
              }`}
            >
              <div className="flex justify-between items-center text-slate-400 mb-1">
                <span>Cipher C={blk.cipher}</span>
                <span className="text-[10px] text-emerald-400">d = {keys.d}</span>
              </div>
              <div className="text-slate-300 text-[11px]">
                {blk.cipher}^{keys.d} mod {keys.n} =
              </div>
              <div className="text-emerald-300 font-bold text-base mt-1 flex items-center justify-between">
                <span>M = {blk.decryptedAscii}</span>
                <span className="text-xs bg-emerald-950 text-emerald-200 border border-emerald-800 px-1.5 py-0.5 rounded">
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
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
        <h3 className="font-bold text-white text-sm border-b border-slate-800 pb-2 flex items-center space-x-2">
          <BookOpen className="w-4 h-4 text-indigo-400" />
          <span>Why Does It Work? The Mathematical Magic Behind RSA</span>
        </h3>

        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 space-y-2">
          <div className="text-slate-400">
            1. Encryption: <strong className="text-pink-300">C ≡ M^e (mod n)</strong>
          </div>
          <div className="text-slate-400">
            2. Decryption: <strong className="text-emerald-300">C^d ≡ (M^e)^d ≡ M^(e·d) (mod n)</strong>
          </div>
          <div className="text-indigo-300">
            3. Since e·d ≡ 1 (mod φ(n)), we have e·d = 1 + k·φ(n)
          </div>
          <div className="text-cyan-300">
            4. By Euler's Totient Theorem: <strong className="text-cyan-200">M^(1 + k·φ(n)) ≡ M · (M^φ(n))^k ≡ M · 1^k ≡ M (mod n)!</strong>
          </div>
        </div>

        <p className="text-xs text-slate-400 italic">
          The modular exponentiation reverses itself perfectly because e and d are modular inverses under φ(n)!
        </p>
      </div>

      {/* Action Button */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center space-x-2 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-3 py-1.5 rounded-xl font-medium">
          <CheckCircle2 className="w-4 h-4" />
          <span>Bello & Nii successfully communicated with 100% secrecy!</span>
        </div>
        <button
          onClick={handleFinishStory}
          className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 via-indigo-600 to-purple-600 hover:from-emerald-500 hover:to-purple-500 text-white font-semibold text-sm px-6 py-2.5 rounded-xl shadow-lg transition-all transform hover:scale-[1.02]"
        >
          <span>Explore RSA Freeform Playground</span>
          <Compass className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
