import React, { useState } from 'react';
import { RSAKeys, EncryptedBlock } from '../../types';
import { modPow, stringToMessageNumbers } from '../../lib/rsaMath';
import { ModularClockVisualizer } from '../ModularClockVisualizer';
import { Unlock, Send, Binary } from 'lucide-react';
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
      <div className="bg-white border border-slate-300 rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
              Stage 3: Bello's Secret Transmission
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2">
              Bello Encrypts Plaintext Message M into Ciphertext C
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl font-medium">
              Bello uses Nii's public key <strong className="text-blue-700 font-bold">PU = {"{"}e={keys.e}, n={keys.n}{"}"}</strong> to calculate:
              <span className="font-mono bg-blue-50 text-blue-900 border border-blue-200 px-2 py-0.5 rounded ml-2 text-xs font-bold">
                C = M^e mod n
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Input Message Card */}
      <div className="bg-white border border-slate-300 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
          <label className="font-extrabold text-slate-900 text-sm flex items-center space-x-2">
            <Unlock className="w-4 h-4 text-rose-600" />
            <span>Bello's Plaintext Message M Input:</span>
          </label>
          <span className="text-xs text-slate-600 font-medium">
            Active Public Key: <span className="font-mono text-blue-700 font-bold">n={keys.n}, e={keys.e}</span>
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
            className="flex-1 bg-slate-50 border-2 border-slate-300 focus:border-rose-600 rounded-xl px-4 py-2.5 font-mono text-xl text-rose-700 font-extrabold tracking-wider uppercase focus:outline-none focus:ring-2 focus:ring-rose-200"
          />
          <span className="text-xs text-slate-500 font-mono font-bold">Max 8 chars</span>
        </div>

        {/* Individual Blocks mapping */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <span className="text-xs text-slate-700 font-extrabold uppercase tracking-wider block mb-3">
            Character-by-Character Modular Encryption Breakdown:
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {blocks.map((blk, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedCharIndex(idx)}
                className={`p-3.5 rounded-xl border font-mono text-xs text-left transition-all cursor-pointer ${
                  selectedCharIndex === idx
                    ? 'bg-rose-50 border-2 border-rose-600 text-slate-900 ring-2 ring-rose-300 shadow-md scale-[1.02]'
                    : 'bg-white border-slate-300 hover:border-slate-400 text-slate-800'
                }`}
              >
                <div className="flex justify-between items-center text-slate-600 mb-1 font-sans">
                  <span className="font-bold">Char '{blk.char}'</span>
                  <span className="text-[10px] text-rose-700 font-bold">M={blk.ascii}</span>
                </div>
                <div className="text-slate-600 text-[11px] font-semibold">
                  {blk.ascii}^{keys.e} mod {keys.n} =
                </div>
                <div className="text-blue-700 font-extrabold text-lg mt-1">
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
        <div className="text-xs text-slate-600 font-medium flex items-center space-x-2">
          <Binary className="w-4 h-4 text-rose-600" />
          <span>Ciphertext blocks ready for transmission across public channel!</span>
        </div>
        <button
          onClick={handleEncryptAndSend}
          className="flex items-center space-x-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-sm px-6 py-3 rounded-xl shadow-md transition-all cursor-pointer"
        >
          <span>Transmit Packet to Paulson & Nii</span>
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
