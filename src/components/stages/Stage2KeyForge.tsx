import React, { useState, useEffect } from 'react';
import { RSAKeys } from '../../types';
import { 
  gcd, 
  modInverse, 
  findValidExponents, 
  getExtendedGcdSteps 
} from '../../lib/rsaMath';
import { Key, Lock, ShieldCheck, ArrowRight, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Stage2KeyForgeProps {
  keys: RSAKeys;
  onUpdateKeys: (newKeys: RSAKeys) => void;
  onNext: () => void;
}

export const Stage2KeyForge: React.FC<Stage2KeyForgeProps> = ({
  keys,
  onUpdateKeys,
  onNext,
}) => {
  const validEList = findValidExponents(keys.phi);
  const [selectedE, setSelectedE] = useState<number>(keys.e || validEList[0] || 17);

  // Compute d whenever e changes
  const computedD = modInverse(selectedE, keys.phi) || 1;
  const isCoprime = gcd(selectedE, keys.phi) === 1;

  useEffect(() => {
    if (isCoprime && computedD) {
      onUpdateKeys({
        ...keys,
        e: selectedE,
        d: computedD,
      });
    }
  }, [selectedE]);

  const gcdSteps = getExtendedGcdSteps(selectedE, keys.phi);

  const handleNextStage = () => {
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
    onNext();
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-indigo-950 border border-cyan-800/60 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950 px-2.5 py-1 rounded-full border border-cyan-800/80">
              Stage 2: Key Pair Construction
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-2">
              Nii Forges Public & Private Keys
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Public Key <strong className="text-cyan-300">(n, e)</strong> is broadcasted so Bello can lock messages. Private Key <strong className="text-emerald-300">d</strong> is calculated using the Extended Euclidean Algorithm and kept strictly secret!
            </p>
          </div>
        </div>
      </div>

      {/* Step 1: Selecting Exponent e */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h3 className="font-bold text-white text-sm flex items-center space-x-2">
            <Key className="w-4 h-4 text-cyan-400" />
            <span>Select Public Exponent (e)</span>
          </h3>
          <span className="text-xs font-mono text-cyan-300 bg-cyan-950 px-2.5 py-0.5 rounded border border-cyan-800">
            e = {selectedE}
          </span>
        </div>

        <p className="text-xs text-slate-300">
          Must be coprime to Euler's Totient <strong className="text-purple-300 font-mono">φ(n) = {keys.phi}</strong> (i.e. gcd(e, φ(n)) = 1):
        </p>

        {/* Valid exponents grid */}
        <div className="flex flex-wrap gap-2">
          {validEList.slice(0, 12).map((eCandidate) => (
            <button
              key={eCandidate}
              onClick={() => setSelectedE(eCandidate)}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                selectedE === eCandidate
                  ? 'bg-cyan-500 text-slate-950 ring-2 ring-cyan-300 shadow-md scale-105'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
              }`}
            >
              e = {eCandidate}
            </button>
          ))}
        </div>

        {/* Coprime validation indicator */}
        <div className={`p-3 rounded-xl text-xs border flex items-center justify-between ${
          isCoprime 
            ? 'bg-emerald-950/60 border-emerald-800/80 text-emerald-200' 
            : 'bg-rose-950/60 border-rose-800/80 text-rose-200'
        }`}>
          <div className="flex items-center space-x-2">
            {isCoprime ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-rose-400" />}
            <span>
              gcd({selectedE}, {keys.phi}) = <strong>{gcd(selectedE, keys.phi)}</strong> {isCoprime ? '(Coprime - Valid!)' : '(Not Coprime - Select another)'}
            </span>
          </div>
        </div>
      </div>

      {/* Step 2: Extended Euclidean Algorithm Visualizer for Private Key d */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <h3 className="font-bold text-white text-sm border-b border-slate-800 pb-2 flex items-center space-x-2">
          <Lock className="w-4 h-4 text-emerald-400" />
          <span>Calculating Private Exponent d using Modular Inverse</span>
        </h3>

        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 space-y-2">
          <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
            <span>Modular Inverse Formula:</span>
            <span className="text-emerald-300 font-bold">(e × d) mod φ(n) = 1</span>
          </div>
          <div className="text-slate-300">
            ({selectedE} × <span className="text-emerald-400 font-bold">{computedD}</span>) mod {keys.phi} = ({selectedE * computedD}) mod {keys.phi} = <strong className="text-cyan-300">1</strong>
          </div>
        </div>

        {/* Euclidean Algorithm steps accordion / list */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
          <span className="text-xs text-slate-400 font-semibold block mb-1">
            Euclidean Algorithm GCD Trace:
          </span>
          <div className="space-y-1 font-mono text-xs">
            {gcdSteps.map((st) => (
              <div key={st.step} className="flex justify-between bg-slate-900 px-3 py-1.5 rounded border border-slate-800">
                <span className="text-slate-400">Step {st.step}:</span>
                <span className="text-indigo-300">
                  {st.a} = {st.q} × {st.b} + <strong className="text-cyan-300">{st.r}</strong>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Public vs Private Key Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Public Key (n, e) */}
        <div className="bg-gradient-to-br from-slate-900 to-cyan-950 border border-cyan-800/80 rounded-2xl p-5 shadow-xl relative">
          <div className="flex items-center justify-between border-b border-cyan-800/60 pb-3 mb-3">
            <div className="flex items-center space-x-2">
              <Key className="w-5 h-5 text-cyan-400" />
              <h4 className="font-bold text-white text-base">Nii's Public Key</h4>
            </div>
            <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-700 px-2 py-0.5 rounded-full uppercase font-bold">
              Shared Publicly
            </span>
          </div>

          <div className="bg-slate-950 border border-cyan-900/50 rounded-xl p-4 font-mono text-sm text-cyan-300 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Modulus (n):</span>
              <span className="font-bold text-cyan-200">{keys.n}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Public Exponent (e):</span>
              <span className="font-bold text-cyan-200">{keys.e}</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-3">
            Bello will use <strong className="text-cyan-300">(n={keys.n}, e={keys.e})</strong> to encrypt her message. Anyone on the internet can see this key!
          </p>
        </div>

        {/* Private Key d */}
        <div className="bg-gradient-to-br from-slate-900 to-emerald-950 border border-emerald-800/80 rounded-2xl p-5 shadow-xl relative">
          <div className="flex items-center justify-between border-b border-emerald-800/60 pb-3 mb-3">
            <div className="flex items-center space-x-2">
              <Lock className="w-5 h-5 text-emerald-400" />
              <h4 className="font-bold text-white text-base">Nii's Secret Private Key</h4>
            </div>
            <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-700 px-2 py-0.5 rounded-full uppercase font-bold">
              Keep Secret
            </span>
          </div>

          <div className="bg-slate-950 border border-emerald-900/50 rounded-xl p-4 font-mono text-sm text-emerald-300 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Modulus (n):</span>
              <span className="font-bold text-slate-200">{keys.n}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Private Exponent (d):</span>
              <span className="font-bold text-emerald-300 text-base">{keys.d}</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-3">
            Stored in Nii's secure lockbox. <strong className="text-emerald-300">d={keys.d}</strong> is the only exponent that can undo the transformation $M^e \bmod n$.
          </p>
        </div>
      </div>

      {/* Next Button */}
      <div className="flex items-center justify-end pt-2">
        <button
          onClick={handleNextStage}
          className="flex items-center space-x-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-semibold text-sm px-6 py-2.5 rounded-xl shadow-lg transition-all transform hover:scale-[1.02]"
        >
          <span>Proceed to Bello Encrypting</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
