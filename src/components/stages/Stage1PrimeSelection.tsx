import React, { useState } from 'react';
import { isPrime, getFriendlyPrimes } from '../../lib/rsaMath';
import { RSAKeys } from '../../types';
import { Key, CheckCircle, ArrowRight, Grid, Sparkles, HelpCircle, Shield } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Stage1PrimeSelectionProps {
  keys: RSAKeys | null;
  onSetPrimes: (p: number, q: number) => void;
  onNext: () => void;
}

export const Stage1PrimeSelection: React.FC<Stage1PrimeSelectionProps> = ({
  keys,
  onSetPrimes,
  onNext,
}) => {
  const [selectedP, setSelectedP] = useState<number>(keys?.p || 61);
  const [selectedQ, setSelectedQ] = useState<number>(keys?.q || 53);

  // Sieve mini-game grid numbers 2..30 for hands-on learning
  const [sieveCrossed, setSieveCrossed] = useState<number[]>([]);

  const handleCrossSieve = (num: number) => {
    if (isPrime(num)) return; // Don't cross primes!
    if (!sieveCrossed.includes(num)) {
      setSieveCrossed([...sieveCrossed, num]);
    }
  };

  const handleApplyPrimes = () => {
    if (selectedP === selectedQ) return;
    onSetPrimes(selectedP, selectedQ);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
  };

  const currentN = selectedP * selectedQ;
  const currentPhi = (selectedP - 1) * (selectedQ - 1);
  const isPrimesValid = isPrime(selectedP) && isPrime(selectedQ) && selectedP !== selectedQ;

  const primeList = getFriendlyPrimes().slice(0, 16);

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-gradient-to-r from-indigo-900/60 via-slate-900 to-purple-900/60 border border-indigo-800/60 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950 px-2.5 py-1 rounded-full border border-indigo-800/80">
              Stage 1: Building Blocks
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-2">
              Nii's Secret Prime Multiplication
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              RSA security relies on a simple mathematical asymmetry: <strong className="text-cyan-300">multiplying two prime numbers is instant</strong>, but <strong className="text-amber-300">factoring their product back into primes is extraordinarily difficult</strong> without knowing them!
            </p>
          </div>
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-center shrink-0">
            <span className="text-[10px] text-slate-400 block font-semibold">Modulus (n = p × q)</span>
            <span className="text-2xl font-bold font-mono text-cyan-300">{currentN}</span>
          </div>
        </div>
      </div>

      {/* Prime Selectors & Interactive Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Select Prime p */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="font-bold text-white text-sm flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-mono text-xs">
                p
              </span>
              <span>Select First Prime (p)</span>
            </h3>
            <span className="text-xs font-mono text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
              p = {selectedP}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {primeList.map((pr) => (
              <button
                key={pr}
                onClick={() => setSelectedP(pr)}
                className={`py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                  selectedP === pr
                    ? 'bg-cyan-500 text-slate-950 ring-2 ring-cyan-300 shadow-md scale-[1.03]'
                    : selectedQ === pr
                    ? 'bg-slate-800/40 text-slate-600 cursor-not-allowed border border-slate-800'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/80'
                }`}
                disabled={selectedQ === pr}
              >
                {pr}
              </button>
            ))}
          </div>

          <div className="text-[11px] text-slate-400 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
            💡 Prime numbers have no divisors other than 1 and themselves.
          </div>
        </div>

        {/* Select Prime q */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="font-bold text-white text-sm flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center font-mono text-xs">
                q
              </span>
              <span>Select Second Prime (q)</span>
            </h3>
            <span className="text-xs font-mono text-purple-300 bg-purple-950 px-2 py-0.5 rounded border border-purple-800">
              q = {selectedQ}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {primeList.map((pr) => (
              <button
                key={pr}
                onClick={() => setSelectedQ(pr)}
                className={`py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                  selectedQ === pr
                    ? 'bg-purple-500 text-white ring-2 ring-purple-300 shadow-md scale-[1.03]'
                    : selectedP === pr
                    ? 'bg-slate-800/40 text-slate-600 cursor-not-allowed border border-slate-800'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/80'
                }`}
                disabled={selectedP === pr}
              >
                {pr}
              </button>
            ))}
          </div>

          <div className="text-[11px] text-slate-400 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
            💡 <strong className="text-slate-200">Constraint:</strong> p and q must be distinct primes!
          </div>
        </div>
      </div>

      {/* Visual Multiplication & Totient Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <h3 className="font-bold text-white text-sm border-b border-slate-800 pb-2 flex items-center space-x-2">
          <Grid className="w-4 h-4 text-indigo-400" />
          <span>Calculated RSA Parameters for Nii</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Modulus n Card */}
          <div className="bg-slate-950 border border-cyan-900/50 rounded-xl p-4 relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs text-slate-400 font-medium block">Public Modulus (n)</span>
                <span className="text-2xl font-bold font-mono text-cyan-300">{currentN}</span>
              </div>
              <span className="text-[11px] font-mono bg-cyan-950 text-cyan-400 px-2 py-1 rounded border border-cyan-800">
                n = p × q
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-2 font-mono">
              {selectedP} × {selectedQ} = {currentN}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              This number <strong className="text-slate-300">n</strong> will be shared publicly with Bello and Paulson.
            </p>
          </div>

          {/* Euler's Totient phi(n) Card */}
          <div className="bg-slate-950 border border-purple-900/50 rounded-xl p-4 relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs text-slate-400 font-medium block">Euler's Totient φ(n)</span>
                <span className="text-2xl font-bold font-mono text-purple-300">{currentPhi}</span>
              </div>
              <span className="text-[11px] font-mono bg-purple-950 text-purple-400 px-2 py-1 rounded border border-purple-800">
                φ(n) = (p-1)(q-1)
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-2 font-mono">
              ({selectedP} - 1) × ({selectedQ} - 1) = {selectedP - 1} × {selectedQ - 1} = {currentPhi}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              <strong className="text-amber-400">CRITICAL SECRET:</strong> φ(n) measures numbers coprime to n and MUST be kept secret!
            </p>
          </div>
        </div>

        {/* Real World 2048-bit comparison info */}
        <div className="bg-indigo-950/40 border border-indigo-900/60 rounded-xl p-4 text-xs text-indigo-200 flex items-start space-x-3">
          <Shield className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-white block mb-0.5">Real-World RSA Scale (2048-bit):</span>
            In actual HTTPS / TLS web traffic, p and q are over 300 digits long each, making n a 600-digit number. Factorizing a 600-digit number would require more energy than exists in our solar system!
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-end pt-2">
          <button
            onClick={() => {
              handleApplyPrimes();
              onNext();
            }}
            disabled={!isPrimesValid}
            className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-40 text-white font-semibold text-sm px-6 py-2.5 rounded-xl shadow-lg transition-all transform hover:scale-[1.02]"
          >
            <span>Lock In Primes & Forge Keys</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
