import React, { useState, useEffect } from 'react';
import { RSAKeys } from '../../types';
import { 
  gcd, 
  modInverse, 
  findValidExponents, 
  getExtendedGcdSteps 
} from '../../lib/rsaMath';
import { Key, Lock, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
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
      <div className="bg-white border border-slate-300 rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Stage 2: Key Pair Construction
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2">
              Nii Forges Public & Private Keys
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl font-medium">
              Public Key <strong className="text-blue-700 font-bold">PU = {"{e, n}"}</strong> is published so Bello can encrypt. Private Key <strong className="text-rose-700 font-bold">PR = {"{d, n}"}</strong> is derived via Extended Euclidean Algorithm and kept strictly secret!
            </p>
          </div>
        </div>
      </div>

      {/* Step 1: Selecting Exponent e */}
      <div className="bg-white border border-slate-300 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <h3 className="font-extrabold text-slate-900 text-sm flex items-center space-x-2">
            <Key className="w-4 h-4 text-blue-600" />
            <span>Select Public Exponent (e)</span>
          </h3>
          <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
            e = {selectedE}
          </span>
        </div>

        <p className="text-xs text-slate-700 font-medium">
          Must be coprime to Euler's Totient <strong className="text-purple-700 font-mono font-bold">φ(n) = {keys.phi}</strong> (i.e. gcd(e, φ(n)) = 1):
        </p>

        {/* Valid exponents grid */}
        <div className="flex flex-wrap gap-2">
          {validEList.slice(0, 12).map((eCandidate) => (
            <button
              key={eCandidate}
              onClick={() => setSelectedE(eCandidate)}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                selectedE === eCandidate
                  ? 'bg-blue-600 text-white ring-2 ring-blue-400 shadow-md scale-105'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-300'
              }`}
            >
              e = {eCandidate}
            </button>
          ))}
        </div>

        {/* Coprime validation indicator */}
        <div className={`p-3 rounded-xl text-xs border flex items-center justify-between font-medium ${
          isCoprime 
            ? 'bg-emerald-50 border-emerald-300 text-emerald-900' 
            : 'bg-rose-50 border-rose-300 text-rose-900'
        }`}>
          <div className="flex items-center space-x-2">
            {isCoprime ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
            <span>
              gcd({selectedE}, {keys.phi}) = <strong className="font-mono font-bold">{gcd(selectedE, keys.phi)}</strong> {isCoprime ? '(Coprime - Valid Exponent!)' : '(Not Coprime - Select another)'}
            </span>
          </div>
        </div>
      </div>

      {/* Step 2: Extended Euclidean Algorithm Visualizer for Private Key d */}
      <div className="bg-white border border-slate-300 rounded-2xl p-5 shadow-sm space-y-4">
        <h3 className="font-extrabold text-slate-900 text-sm border-b border-slate-200 pb-3 flex items-center space-x-2">
          <Lock className="w-4 h-4 text-rose-600" />
          <span>Calculating Private Exponent d = e⁻¹ mod φ(n)</span>
        </h3>

        <div className="bg-slate-50 border border-slate-300 rounded-xl p-4 font-mono text-xs text-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-600 border-b border-slate-200 pb-2">
            <span className="font-sans font-bold">Modular Inverse Formula:</span>
            <span className="text-rose-700 font-bold">(e × d) mod φ(n) = 1</span>
          </div>
          <div className="text-slate-900 font-semibold">
            ({selectedE} × <span className="text-rose-700 font-extrabold">{computedD}</span>) mod {keys.phi} = ({selectedE * computedD}) mod {keys.phi} = <strong className="text-blue-700 font-extrabold">1</strong>
          </div>
        </div>

        {/* Euclidean Algorithm steps trace table */}
        <div className="border border-slate-300 rounded-xl overflow-hidden shadow-2xs">
          <div className="bg-slate-900 text-white px-4 py-2 text-xs font-bold font-mono">
            Extended Euclidean Trace for e = {selectedE}, φ(n) = {keys.phi}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-mono text-xs">
              <thead className="bg-slate-100 border-b border-slate-300 text-slate-700">
                <tr>
                  <th className="py-2 px-3 font-bold">Step</th>
                  <th className="py-2 px-3 font-bold">Equation (a = q × b + r)</th>
                  <th className="py-2 px-3 font-bold text-right">Remainder (r)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white text-slate-800">
                {gcdSteps.map((st) => (
                  <tr key={st.step} className="hover:bg-slate-50">
                    <td className="py-2 px-3 font-bold text-slate-500">Step {st.step}</td>
                    <td className="py-2 px-3">
                      {st.a} = {st.q} × {st.b} + <strong className="text-blue-700">{st.r}</strong>
                    </td>
                    <td className="py-2 px-3 text-right font-bold text-blue-700">{st.r}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Public vs Private Key Cards - Matching rsacryptography.vercel.app style keybox */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Public Key (n, e) Box */}
        <div className="bg-blue-50/70 border-3 border-blue-600 rounded-2xl p-5 shadow-sm relative">
          <div className="flex items-center justify-between border-b border-blue-200 pb-3 mb-3">
            <div className="flex items-center space-x-2">
              <Key className="w-5 h-5 text-blue-600" />
              <h4 className="font-extrabold text-blue-900 text-base">🔓 Public Key PU</h4>
            </div>
            <span className="text-[10px] bg-blue-600 text-white px-2.5 py-0.5 rounded-full uppercase font-extrabold tracking-wider">
              Shared Publicly
            </span>
          </div>

          <div className="bg-white border border-blue-300 rounded-xl p-4 font-mono text-base text-blue-900 font-extrabold space-y-2">
            <div>
              {`PU = { e: ${keys.e}, n: ${keys.n} }`}
            </div>
          </div>
          <p className="text-xs text-slate-700 mt-3 font-medium">
            Published freely. Bello uses <strong className="text-blue-900 font-bold">{`PU = {${keys.e}, ${keys.n}}`}</strong> to encrypt her message: <span className="font-mono font-bold">C = M^e mod n</span>.
          </p>
        </div>

        {/* Private Key d Box */}
        <div className="bg-rose-50/70 border-3 border-rose-600 rounded-2xl p-5 shadow-sm relative">
          <div className="flex items-center justify-between border-b border-rose-200 pb-3 mb-3">
            <div className="flex items-center space-x-2">
              <Lock className="w-5 h-5 text-rose-600" />
              <h4 className="font-extrabold text-rose-900 text-base">🔒 Private Key PR</h4>
            </div>
            <span className="text-[10px] bg-rose-600 text-white px-2.5 py-0.5 rounded-full uppercase font-extrabold tracking-wider">
              Kept Secret
            </span>
          </div>

          <div className="bg-white border border-rose-300 rounded-xl p-4 font-mono text-base text-rose-900 font-extrabold space-y-2">
            <div>
              {`PR = { d: ${keys.d}, n: ${keys.n} }`}
            </div>
          </div>
          <p className="text-xs text-slate-700 mt-3 font-medium">
            Kept strictly secret by Nii. <strong className="text-rose-900 font-bold">d = {keys.d}</strong> is used to decrypt ciphertext: <span className="font-mono font-bold">M = C^d mod n</span>.
          </p>
        </div>
      </div>

      {/* Next Button */}
      <div className="flex items-center justify-end pt-2">
        <button
          onClick={handleNextStage}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm px-6 py-3 rounded-xl shadow-md transition-all cursor-pointer"
        >
          <span>Proceed to Bello Encrypting</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
