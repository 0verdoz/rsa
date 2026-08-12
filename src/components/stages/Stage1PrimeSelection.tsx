import React, { useState } from 'react';
import { isPrime, getFriendlyPrimes } from '../../lib/rsaMath';
import { RSAKeys } from '../../types';
import { Key, ArrowRight, Grid, Shield, CheckCircle2 } from 'lucide-react';
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
      <div className="bg-white border border-slate-300 rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Stage 1: Building Blocks
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2">
              Nii's Secret Prime Multiplication
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl font-medium">
              RSA security relies on a fundamental mathematical asymmetry: <strong className="text-blue-700 font-bold">multiplying two prime numbers is instant</strong>, but <strong className="text-rose-700 font-bold">factoring their product back into primes is extraordinarily hard</strong> without knowing them!
            </p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center shrink-0 min-w-[160px]">
            <span className="text-xs text-blue-700 font-extrabold uppercase block tracking-wider">Modulus (n = p × q)</span>
            <span className="text-3xl font-extrabold font-mono text-blue-900 mt-0.5 block">{currentN}</span>
          </div>
        </div>
      </div>

      {/* Prime Selectors & Interactive Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Select Prime p */}
        <div className="bg-white border border-slate-300 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center space-x-2">
              <span className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-mono font-bold text-xs">
                p
              </span>
              <span>Select First Prime (p)</span>
            </h3>
            <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
              p = {selectedP}
            </span>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-4 gap-2">
            {primeList.map((pr) => (
              <button
                key={pr}
                onClick={() => setSelectedP(pr)}
                className={`py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  selectedP === pr
                    ? 'bg-blue-600 text-white ring-2 ring-blue-400 shadow-md scale-[1.03]'
                    : selectedQ === pr
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-300'
                }`}
                disabled={selectedQ === pr}
              >
                {pr}
              </button>
            ))}
          </div>

          <div className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200 font-medium">
            💡 Prime numbers have no integer divisors other than 1 and themselves.
          </div>
        </div>

        {/* Select Prime q */}
        <div className="bg-white border border-slate-300 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center space-x-2">
              <span className="w-7 h-7 rounded-full bg-purple-600 text-white flex items-center justify-center font-mono font-bold text-xs">
                q
              </span>
              <span>Select Second Prime (q)</span>
            </h3>
            <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded border border-purple-200">
              q = {selectedQ}
            </span>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-4 gap-2">
            {primeList.map((pr) => (
              <button
                key={pr}
                onClick={() => setSelectedQ(pr)}
                className={`py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  selectedQ === pr
                    ? 'bg-purple-600 text-white ring-2 ring-purple-400 shadow-md scale-[1.03]'
                    : selectedP === pr
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-300'
                }`}
                disabled={selectedP === pr}
              >
                {pr}
              </button>
            ))}
          </div>

          <div className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200 font-medium">
            💡 <strong className="text-slate-900">Constraint:</strong> p and q must be distinct primes!
          </div>
        </div>
      </div>

      {/* Visual Multiplication & Totient Box - Oversized Stat Tiles like textbook visualizer */}
      <div className="bg-white border border-slate-300 rounded-2xl p-5 shadow-sm space-y-4">
        <h3 className="font-extrabold text-slate-900 text-sm border-b border-slate-200 pb-3 flex items-center space-x-2">
          <Grid className="w-4 h-4 text-blue-600" />
          <span>Calculated RSA Parameters for Nii</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Modulus n Card - Blue (Public) */}
          <div className="bg-blue-50/60 border-2 border-blue-600 rounded-xl p-5 relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs text-blue-900 font-extrabold uppercase tracking-wider block">Public Modulus (n)</span>
                <span className="text-3xl sm:text-4xl font-extrabold font-mono text-blue-700 mt-1 block">{currentN}</span>
              </div>
              <span className="text-xs font-mono bg-blue-600 text-white px-2.5 py-1 rounded font-bold">
                n = p × q
              </span>
            </div>
            <p className="text-xs text-slate-700 mt-3 font-mono font-semibold">
              {selectedP} × {selectedQ} = {currentN}
            </p>
            <p className="text-xs text-slate-600 mt-1 font-medium">
              This number <strong className="text-blue-900 font-bold">n</strong> will be shared publicly with Bello and Paulson.
            </p>
          </div>

          {/* Euler's Totient phi(n) Card - Terracotta/Rose (Private Secret) */}
          <div className="bg-rose-50/60 border-2 border-rose-600 rounded-xl p-5 relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs text-rose-900 font-extrabold uppercase tracking-wider block">Euler's Totient φ(n)</span>
                <span className="text-3xl sm:text-4xl font-extrabold font-mono text-rose-700 mt-1 block">{currentPhi}</span>
              </div>
              <span className="text-xs font-mono bg-rose-600 text-white px-2.5 py-1 rounded font-bold">
                φ(n) = (p-1)(q-1)
              </span>
            </div>
            <p className="text-xs text-slate-700 mt-3 font-mono font-semibold">
              ({selectedP} - 1) × ({selectedQ} - 1) = {selectedP - 1} × {selectedQ - 1} = {currentPhi}
            </p>
            <p className="text-xs text-rose-800 mt-1 font-bold">
              CRITICAL SECRET: φ(n) measures numbers coprime to n and MUST be kept strictly secret!
            </p>
          </div>
        </div>

        {/* Real World 2048-bit comparison info */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-slate-700 flex items-start space-x-3 font-medium">
          <Shield className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-extrabold text-blue-900 block mb-0.5">Real-World RSA Scale (2048-bit):</span>
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
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-extrabold text-sm px-6 py-3 rounded-xl shadow-md transition-all cursor-pointer"
          >
            <span>Lock In Primes & Forge Keys</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
