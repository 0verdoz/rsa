import React, { useState } from 'react';
import { RSAKeys, EncryptedBlock } from '../../types';
import { modPow, stringToMessageNumbers } from '../../lib/rsaMath';
import { ModularClockVisualizer } from '../ModularClockVisualizer';
import { Unlock, Send, ArrowRight, Sparkles, Binary, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Stage3EncryptionProps {
  keys: RSAKeys;
  onEncrypted: (blocks: EncryptedBlock[]) => void;
  onNext: () => void;
}

export const Stage3Encryption: React.FC<Stage3EncryptionProps> = ({
  keys,
  onEncrypted,
  onNext,
}) => {
  const [inputText, setInputText] = useState<string>('HI');
  const [selectedCharIndex, setSelectedCharIndex] = useState<number>(0);

  // Compute encrypted blocks
  const numbers = stringToMessageNumbers(inputText, keys.n);
  const blocks: EncryptedBlock[] = inputText.split('').map((char, i) => {
    const ascii = numbers[i];
    const cipher = modPow(ascii, keys.e, keys.n);
    return {
      char,
      ascii,
      cipher,
    };
  });

  const activeBlock = blocks[selectedCharIndex] || blocks[0] || { char: 'H', ascii: 72, cipher: 0 };

  const handleEncryptAndSend = () => {
    onEncrypted(blocks);
    confetti({ particleCount: 70, spread: 80, origin: { y: 0.7 } });
    onNext();
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-gradient-to-r from-pink-950 via-slate-900 to-indigo-950 border border-pink-800/60 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-pink-400 bg-pink-950 px-2.5 py-1 rounded-full border border-pink-800/80">
              Stage 3: Bello's Secret Transmission
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-2">
              Bello Encrypts plaintext message into Ciphertext C
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Bello uses Nii's public key <strong className="text-cyan-300">(n={keys.n}, e={keys.e})</strong> to calculate:
              <span className="font-mono bg-slate-950 text-pink-300 border border-pink-900 px-2 py-0.5 rounded ml-2 text-xs">
                C = M^e mod n
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Input Message Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <label className="font-bold text-white text-sm flex items-center space-x-2">
            <Unlock className="w-4 h-4 text-pink-400" />
            <span>Bello's Plaintext Input:</span>
          </label>
          <span className="text-xs text-slate-400">
            Current Public Key: <span className="font-mono text-cyan-300">n={keys.n}, e={keys.e}</span>
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => {
              const val = e.target.value.toUpperCase().slice(0, 8);
              setInputText(val || 'A');
              setSelectedCharIndex(0);
            }}
            placeholder="Type secret message..."
            maxLength={8}
            className="flex-1 bg-slate-950 border border-slate-700 focus:border-pink-500 rounded-xl px-4 py-2.5 font-mono text-lg text-pink-300 tracking-wider uppercase focus:outline-none focus:ring-2 focus:ring-pink-500/50"
          />
          <span className="text-xs text-slate-500 font-mono">Max 8 chars</span>
        </div>

        {/* Individual Blocks mapping */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 font-semibold block mb-3">
            Character-by-Character Modular Encryption Breakdown:
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {blocks.map((blk, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedCharIndex(idx)}
                className={`p-3 rounded-xl border font-mono text-xs text-left transition-all ${
                  selectedCharIndex === idx
                    ? 'bg-pink-950/80 border-pink-500 text-white ring-2 ring-pink-400/50 shadow-lg scale-[1.02]'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex justify-between items-center text-slate-400 mb-1">
                  <span>Char '{blk.char}'</span>
                  <span className="text-[10px] text-pink-400">ASCII M={blk.ascii}</span>
                </div>
                <div className="text-slate-300 text-[11px] font-mono">
                  {blk.ascii}^{keys.e} mod {keys.n} =
                </div>
                <div className="text-cyan-300 font-bold text-base mt-1">
                  C = {blk.cipher}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Clock Visualizer for currently selected character */}
      <ModularClockVisualizer
        modulus={keys.n}
        base={activeBlock.ascii}
        exponent={keys.e}
        highlightValue={activeBlock.cipher}
        title={`Modular Clock Animation for Char '${activeBlock.char}' (M = ${activeBlock.ascii})`}
      />

      {/* Action Button */}
      <div className="flex items-center justify-between pt-2">
        <div className="text-xs text-slate-400 flex items-center space-x-2">
          <Binary className="w-4 h-4 text-pink-400" />
          <span>Ciphertext blocks ready for transmission across public channel!</span>
        </div>
        <button
          onClick={handleEncryptAndSend}
          className="flex items-center space-x-2 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white font-semibold text-sm px-6 py-2.5 rounded-xl shadow-lg transition-all transform hover:scale-[1.02]"
        >
          <span>Transmit Packet to Paulson & Nii</span>
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
