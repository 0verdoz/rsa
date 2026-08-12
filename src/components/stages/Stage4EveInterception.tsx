import React, { useState } from 'react';
import { RSAKeys, EncryptedBlock } from '../../types';
import { isPrime, modPow } from '../../lib/rsaMath';
import { ShieldAlert, Terminal, Cpu, Zap, ArrowRight, Play, CheckCircle2, XCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Stage4EveInterceptionProps {
  keys: RSAKeys;
  encryptedBlocks: EncryptedBlock[];
  onNext: () => void;
}

export const Stage4EveInterception: React.FC<Stage4EveInterceptionProps> = ({
  keys,
  encryptedBlocks,
  onNext,
}) => {
  // Eve's manual factoring attempts
  const [guessP, setGuessP] = useState<string>('');
  const [guessQ, setGuessQ] = useState<string>('');
  const [factorResult, setFactorResult] = useState<{ success: boolean; msg: string } | null>(null);

  // Bit length slider for security scaling demonstration
  const [bitLength, setBitLength] = useState<number>(keys.n < 256 ? 8 : 16);

  const handleTestFactor = () => {
    const pVal = parseInt(guessP, 10);
    const qVal = parseInt(guessQ, 10);

    if (isNaN(pVal) || isNaN(qVal)) {
      setFactorResult({ success: false, msg: 'Enter valid integer guesses for p and q.' });
      return;
    }

    if (pVal * qVal === keys.n) {
      setFactorResult({
        success: true,
        msg: `PAULSON CRACKED IT! ${pVal} × ${qVal} = ${keys.n}! Because n was small (${keys.n}), Paulson derived φ(n) = ${(pVal - 1) * (qVal - 1)} and private key d = ${keys.d}!`,
      });
      confetti({ particleCount: 50, spread: 60 });
    } else {
      setFactorResult({
        success: false,
        msg: `${pVal} × ${qVal} = ${pVal * qVal} ≠ ${keys.n}. Factorization failed!`,
      });
    }
  };

  // Get estimated cracking time string based on bit length
  const getCrackingEstimate = (bits: number) => {
    if (bits <= 8) return { time: '0.0001 milliseconds', status: 'trivial', color: 'text-rose-400' };
    if (bits <= 16) return { time: '0.02 milliseconds', status: 'trivial', color: 'text-rose-400' };
    if (bits <= 32) return { time: '0.8 seconds', status: 'vulnerable', color: 'text-amber-400' };
    if (bits <= 64) return { time: '4.5 days', status: 'weak', color: 'text-yellow-400' };
    if (bits <= 512) return { time: '12,000 years', status: 'legacy', color: 'text-emerald-400' };
    if (bits <= 1024) return { time: '1.4 billion years', status: 'secure', color: 'text-cyan-400' };
    return { time: '3 × 10²⁵ years (Trillions × Age of Universe!)', status: 'unbreakable', color: 'text-indigo-300' };
  };

  const timeEst = getCrackingEstimate(bitLength);

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-rose-950 border border-amber-800/60 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-950 px-2.5 py-1 rounded-full border border-amber-800/80">
              Stage 4: Cryptanalysis & Eavesdropping
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-2">
              Paulson's Hacker Terminal: Intercepted Data
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Paulson intercepted <strong className="text-cyan-300">Public Key (n={keys.n}, e={keys.e})</strong> and <strong className="text-pink-300">Ciphertext [{encryptedBlocks.map(b => b.cipher).join(', ')}]</strong>.
              Can she break the encryption?
            </p>
          </div>
        </div>
      </div>

      {/* Intercepted Data Wire Dashboard */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <h3 className="font-bold text-white text-sm border-b border-slate-800 pb-2 flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-amber-400" />
          <span>Intercepted Network Packets</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          <div className="bg-slate-950 border border-amber-900/40 rounded-xl p-4 space-y-2">
            <span className="text-amber-400 font-bold block">Public Key Wire Capture:</span>
            <div className="flex justify-between text-slate-300">
              <span>Modulus (n):</span>
              <span className="text-cyan-300 font-bold">{keys.n}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Exponent (e):</span>
              <span className="text-cyan-300 font-bold">{keys.e}</span>
            </div>
          </div>

          <div className="bg-slate-950 border border-amber-900/40 rounded-xl p-4 space-y-2">
            <span className="text-amber-400 font-bold block">Ciphertext Cipher Payload:</span>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {encryptedBlocks.map((b, i) => (
                <span key={i} className="bg-amber-950/80 text-amber-300 border border-amber-800 px-2 py-1 rounded">
                  C{i+1}={b.cipher}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Eve's Interactive Attack Station 1: Factorization Attempt */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h3 className="font-bold text-white text-sm flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-rose-400" />
            <span>Paulson's Attack Method 1: Prime Factorization of n</span>
          </h3>
          <span className="text-xs text-slate-400">Target n = {keys.n}</span>
        </div>

        <p className="text-xs text-slate-300">
          If Paulson can guess prime factors <strong className="text-cyan-300">p</strong> and <strong className="text-purple-300">q</strong> such that <span className="font-mono text-cyan-300 font-bold">p × q = {keys.n}</span>, she can derive <span className="font-mono text-purple-300">φ(n)</span> and calculate private key <strong className="text-emerald-300">d</strong>!
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="number"
            value={guessP}
            onChange={(e) => setGuessP(e.target.value)}
            placeholder="Guess p..."
            className="w-full sm:w-32 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-cyan-300 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <span className="text-slate-500 font-bold">×</span>
          <input
            type="number"
            value={guessQ}
            onChange={(e) => setGuessQ(e.target.value)}
            placeholder="Guess q..."
            className="w-full sm:w-32 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-purple-300 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <button
            onClick={handleTestFactor}
            className="w-full sm:w-auto bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-colors flex items-center justify-center space-x-1"
          >
            <Zap className="w-4 h-4" />
            <span>Test Factorization</span>
          </button>
        </div>

        {factorResult && (
          <div className={`p-3 rounded-xl text-xs font-mono border flex items-start space-x-2 ${
            factorResult.success ? 'bg-emerald-950/80 border-emerald-800 text-emerald-200' : 'bg-rose-950/80 border-rose-800 text-rose-200'
          }`}>
            {factorResult.success ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> : <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />}
            <span>{factorResult.msg}</span>
          </div>
        )}
      </div>

      {/* Bit-Length Security Scaling Visualizer */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <h3 className="font-bold text-white text-sm border-b border-slate-800 pb-2 flex items-center space-x-2">
          <Zap className="w-4 h-4 text-yellow-400" />
          <span>Interactive Security Scaler: Bit Length vs Cracking Time</span>
        </h3>

        <div className="space-y-3">
          <div className="flex justify-between text-xs text-slate-300 font-mono">
            <span>Key Size: <strong className="text-cyan-300">{bitLength} bits</strong></span>
            <span>Est. Modulus Magnitude: ~10^{(bitLength * 0.30103).toFixed(0)}</span>
          </div>

          <input
            type="range"
            min={8}
            max={2048}
            step={8}
            value={bitLength}
            onChange={(e) => setBitLength(parseInt(e.target.value, 10))}
            className="w-full accent-indigo-500 cursor-pointer h-2 bg-slate-950 rounded-lg"
          />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-mono">
            <button onClick={() => setBitLength(8)} className={`p-2 rounded-lg border ${bitLength === 8 ? 'bg-indigo-600 text-white' : 'bg-slate-950 text-slate-400'}`}>
              8-bit (Demo)
            </button>
            <button onClick={() => setBitLength(64)} className={`p-2 rounded-lg border ${bitLength === 64 ? 'bg-indigo-600 text-white' : 'bg-slate-950 text-slate-400'}`}>
              64-bit
            </button>
            <button onClick={() => setBitLength(1024)} className={`p-2 rounded-lg border ${bitLength === 1024 ? 'bg-indigo-600 text-white' : 'bg-slate-950 text-slate-400'}`}>
              1024-bit
            </button>
            <button onClick={() => setBitLength(2048)} className={`p-2 rounded-lg border ${bitLength === 2048 ? 'bg-indigo-600 text-white' : 'bg-slate-950 text-slate-400'}`}>
              2048-bit (Standard)
            </button>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <span className="text-xs text-slate-400 block">Paulson's Supercomputer Time to Factor n:</span>
              <span className={`text-lg sm:text-xl font-bold font-mono ${timeEst.color}`}>
                {timeEst.time}
              </span>
            </div>
            <span className="text-xs font-mono uppercase bg-slate-900 border border-slate-700 px-3 py-1 rounded-full text-slate-300">
              Security Level: {timeEst.status}
            </span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex items-center justify-end pt-2">
        <button
          onClick={onNext}
          className="flex items-center space-x-2 bg-gradient-to-r from-amber-600 via-indigo-600 to-cyan-600 hover:from-amber-500 hover:to-cyan-500 text-white font-semibold text-sm px-6 py-2.5 rounded-xl shadow-lg transition-all transform hover:scale-[1.02]"
        >
          <span>Proceed to Nii's Decryption</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
