import React, { useState } from 'react';
import { RSAKeys, EncryptedBlock } from '../../types';
import { Terminal, Cpu, Zap, ArrowRight, CheckCircle2, XCircle, ShieldAlert } from 'lucide-react';
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
    if (bits <= 8) return { time: '0.0001 milliseconds', status: 'trivial', color: 'text-rose-600', isSecure: false };
    if (bits <= 16) return { time: '0.02 milliseconds', status: 'trivial', color: 'text-rose-600', isSecure: false };
    if (bits <= 32) return { time: '0.8 seconds', status: 'vulnerable', color: 'text-amber-600', isSecure: false };
    if (bits <= 64) return { time: '4.5 days', status: 'weak', color: 'text-amber-700', isSecure: false };
    if (bits <= 512) return { time: '12,000 years', status: 'legacy', color: 'text-blue-700', isSecure: true };
    if (bits <= 1024) return { time: '1.4 billion years', status: 'secure', color: 'text-emerald-700', isSecure: true };
    return { time: '3 × 10²⁵ years (Trillions × Age of Universe!)', status: 'unbreakable', color: 'text-emerald-800', isSecure: true };
  };

  const timeEst = getCrackingEstimate(bitLength);

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-white border border-slate-300 rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              Stage 4: Cryptanalysis & Eavesdropping
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2">
              Paulson's Cryptanalysis Lab: Intercepted Data
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl font-medium">
              Paulson intercepted <strong className="text-blue-700 font-bold">Public Key (n={keys.n}, e={keys.e})</strong> and <strong className="text-rose-700 font-bold">Ciphertext [{encryptedBlocks.map(b => b.cipher).join(', ')}]</strong>.
              Can she break the encryption?
            </p>
          </div>
        </div>
      </div>

      {/* Intercepted Data Wire Dashboard */}
      <div className="bg-white border border-slate-300 rounded-2xl p-5 shadow-sm space-y-4">
        <h3 className="font-extrabold text-slate-900 text-sm border-b border-slate-200 pb-3 flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-amber-600" />
          <span>Intercepted Network Wire Capture</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-2">
            <span className="text-blue-900 font-extrabold block uppercase tracking-wider">Public Key Wire Capture:</span>
            <div className="flex justify-between text-slate-800 font-semibold">
              <span>Modulus (n):</span>
              <span className="text-blue-700 font-extrabold">{keys.n}</span>
            </div>
            <div className="flex justify-between text-slate-800 font-semibold">
              <span>Exponent (e):</span>
              <span className="text-blue-700 font-extrabold">{keys.e}</span>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-2">
            <span className="text-amber-900 font-extrabold block uppercase tracking-wider">Ciphertext Payload Wire Capture:</span>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {encryptedBlocks.map((b, i) => (
                <span key={i} className="bg-white text-amber-900 border border-amber-300 px-2.5 py-1 rounded font-extrabold shadow-2xs">
                  C{i+1}={b.cipher}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Eve's Interactive Attack Station 1: Factorization Attempt */}
      <div className="bg-white border border-slate-300 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <h3 className="font-extrabold text-slate-900 text-sm flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-rose-600" />
            <span>Paulson's Attack Method 1: Prime Factorization of n</span>
          </h3>
          <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded border border-slate-300">Target n = {keys.n}</span>
        </div>

        <p className="text-xs text-slate-700 font-medium">
          If Paulson can factor <strong className="text-blue-700 font-bold">p</strong> and <strong className="text-purple-700 font-bold">q</strong> such that <span className="font-mono text-blue-700 font-bold">p × q = {keys.n}</span>, she can derive <span className="font-mono text-purple-700 font-bold">φ(n)</span> and compute private key <strong className="text-rose-700 font-bold">d</strong>!
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="number"
            value={guessP}
            onChange={(e) => setGuessP(e.target.value)}
            placeholder="Guess p..."
            className="w-full sm:w-36 bg-slate-50 border-2 border-slate-300 rounded-xl px-3.5 py-2 text-xs font-mono font-bold text-blue-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <span className="text-slate-500 font-extrabold text-sm">×</span>
          <input
            type="number"
            value={guessQ}
            onChange={(e) => setGuessQ(e.target.value)}
            placeholder="Guess q..."
            className="w-full sm:w-36 bg-slate-50 border-2 border-slate-300 rounded-xl px-3.5 py-2 text-xs font-mono font-bold text-purple-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <button
            onClick={handleTestFactor}
            className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition-colors flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm"
          >
            <Zap className="w-4 h-4" />
            <span>Test Factorization</span>
          </button>
        </div>

        {factorResult && (
          <div className={`p-3.5 rounded-xl text-xs font-mono border flex items-start space-x-2 font-semibold ${
            factorResult.success ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-rose-50 border-rose-300 text-rose-900'
          }`}>
            {factorResult.success ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" /> : <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />}
            <span>{factorResult.msg}</span>
          </div>
        )}
      </div>

      {/* Bit-Length Security Scaling Visualizer - Chart comparison style */}
      <div className="bg-white border border-slate-300 rounded-2xl p-5 shadow-sm space-y-4">
        <h3 className="font-extrabold text-slate-900 text-sm border-b border-slate-200 pb-3 flex items-center space-x-2">
          <Zap className="w-4 h-4 text-amber-600" />
          <span>Security Scaler: Modulus Bit Size vs Supercomputer Cracking Time</span>
        </h3>

        <div className="space-y-4">
          <div className="flex justify-between text-xs text-slate-700 font-mono font-bold">
            <span>Key Modulus Size: <strong className="text-blue-700 text-sm">{bitLength} bits</strong></span>
            <span>Magnitude: ~10^{(bitLength * 0.30103).toFixed(0)}</span>
          </div>

          <input
            type="range"
            min={8}
            max={2048}
            step={8}
            value={bitLength}
            onChange={(e) => setBitLength(parseInt(e.target.value, 10))}
            className="w-full accent-blue-600 cursor-pointer h-2.5 bg-slate-200 rounded-lg"
          />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-mono font-bold">
            <button onClick={() => setBitLength(8)} className={`p-2.5 rounded-xl border transition-all cursor-pointer ${bitLength === 8 ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'}`}>
              8-bit (Demo)
            </button>
            <button onClick={() => setBitLength(64)} className={`p-2.5 rounded-xl border transition-all cursor-pointer ${bitLength === 64 ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'}`}>
              64-bit
            </button>
            <button onClick={() => setBitLength(1024)} className={`p-2.5 rounded-xl border transition-all cursor-pointer ${bitLength === 1024 ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'}`}>
              1024-bit
            </button>
            <button onClick={() => setBitLength(2048)} className={`p-2.5 rounded-xl border transition-all cursor-pointer ${bitLength === 2048 ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'}`}>
              2048-bit (Standard)
            </button>
          </div>

          <div className={`p-5 rounded-xl border-2 flex flex-col sm:flex-row items-center justify-between gap-3 ${
            timeEst.isSecure ? 'bg-emerald-50 border-emerald-500' : 'bg-rose-50 border-rose-500'
          }`}>
            <div>
              <span className="text-xs text-slate-700 font-extrabold uppercase tracking-wider block">Estimated Factorization Work (Number Field Sieve):</span>
              <span className={`text-xl sm:text-2xl font-extrabold font-mono mt-1 block ${timeEst.color}`}>
                {timeEst.time}
              </span>
            </div>
            <span className={`text-xs font-mono uppercase px-3 py-1.5 rounded-full font-extrabold border ${
              timeEst.isSecure ? 'bg-emerald-600 text-white border-emerald-700' : 'bg-rose-600 text-white border-rose-700'
            }`}>
              Security Level: {timeEst.status}
            </span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex items-center justify-end pt-2">
        <button
          onClick={onNext}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm px-6 py-3 rounded-xl shadow-md transition-all cursor-pointer"
        >
          <span>Proceed to Nii's Decryption</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
