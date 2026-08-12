import React, { useState } from 'react';
import { RSAKeys } from '../../types';
import { 
  isPrime, 
  gcd, 
  modInverse, 
  modPow, 
  findValidExponents, 
  stringToMessageNumbers, 
  messageNumbersToString 
} from '../../lib/rsaMath';
import { ModularClockVisualizer } from '../ModularClockVisualizer';
import { Key, Lock, Zap, AlertTriangle, ShieldCheck } from 'lucide-react';

interface Stage6SandboxPlaygroundProps {
  initialKeys: RSAKeys;
}

export const Stage6SandboxPlayground: React.FC<Stage6SandboxPlaygroundProps> = ({ initialKeys }) => {
  const [p, setP] = useState<number>(initialKeys.p || 61);
  const [q, setQ] = useState<number>(initialKeys.q || 53);

  const n = p * q;
  const phi = (p - 1) * (q - 1);

  const validEList = findValidExponents(phi);
  const [eVal, setEVal] = useState<number>(initialKeys.e || validEList[0] || 17);

  const dVal = modInverse(eVal, phi) || 1;

  // Custom sandbox message
  const [customText, setCustomText] = useState<string>('HELLO');
  const [corruptBit, setCorruptBit] = useState<boolean>(false);

  // Compute cipher & decryption
  const nums = stringToMessageNumbers(customText, n);
  const ciphers = nums.map((m) => modPow(m, eVal, n));

  // If corrupted, modify first cipher block
  const actualCiphers = corruptBit && ciphers.length > 0
    ? [(ciphers[0] + 1) % n, ...ciphers.slice(1)]
    : ciphers;

  const decryptedNums = actualCiphers.map((c) => modPow(c, dVal, n));
  const decryptedText = messageNumbersToString(decryptedNums);

  const loadPreset = (pVal: number, qVal: number) => {
    setP(pVal);
    setQ(qVal);
    const newPhi = (pVal - 1) * (qVal - 1);
    const newEList = findValidExponents(newPhi);
    if (newEList.length > 0) {
      setEVal(newEList[0]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white border border-slate-300 rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
              Stage 7: Freeform RSA Sandbox & Laboratory
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2">
              RSA Interactive Mathematical Sandbox
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl font-medium">
              Experiment with custom prime values, test corrupted ciphertext attacks, adjust parameters, and observe modular arithmetic behavior in real time!
            </p>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center space-x-2 bg-slate-50 border border-slate-300 p-2.5 rounded-xl shrink-0">
            <span className="text-[11px] text-slate-600 font-extrabold uppercase block tracking-wider">Presets:</span>
            <button
              onClick={() => loadPreset(7, 11)}
              className="px-2.5 py-1 bg-white hover:bg-slate-100 text-xs font-mono font-bold text-blue-700 rounded border border-slate-300 transition-colors cursor-pointer"
            >
              (7, 11)
            </button>
            <button
              onClick={() => loadPreset(61, 53)}
              className="px-2.5 py-1 bg-white hover:bg-slate-100 text-xs font-mono font-bold text-blue-700 rounded border border-slate-300 transition-colors cursor-pointer"
            >
              (61, 53)
            </button>
            <button
              onClick={() => loadPreset(101, 103)}
              className="px-2.5 py-1 bg-white hover:bg-slate-100 text-xs font-mono font-bold text-blue-700 rounded border border-slate-300 transition-colors cursor-pointer"
            >
              (101, 103)
            </button>
          </div>
        </div>
      </div>

      {/* Sandbox Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Prime & Modulus Config */}
        <div className="bg-white border border-slate-300 rounded-2xl p-5 shadow-sm space-y-3">
          <h3 className="font-extrabold text-slate-900 text-sm border-b border-slate-200 pb-3 flex items-center space-x-2">
            <Key className="w-4 h-4 text-blue-600" />
            <span>Prime Configuration</span>
          </h3>

          <div className="space-y-2.5 text-xs font-mono">
            <div className="flex justify-between items-center">
              <span className="text-slate-600 font-sans font-bold">Prime p:</span>
              <input
                type="number"
                value={p}
                onChange={(e) => setP(Math.max(2, parseInt(e.target.value, 10) || 2))}
                className="w-24 bg-slate-50 border-2 border-slate-300 rounded px-2 py-1 text-blue-700 font-bold text-right text-sm"
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600 font-sans font-bold">Prime q:</span>
              <input
                type="number"
                value={q}
                onChange={(e) => setQ(Math.max(2, parseInt(e.target.value, 10) || 2))}
                className="w-24 bg-slate-50 border-2 border-slate-300 rounded px-2 py-1 text-purple-700 font-bold text-right text-sm"
              />
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between text-slate-900 font-bold">
              <span>n = p × q:</span>
              <strong className="text-blue-700 text-base">{n}</strong>
            </div>
            <div className="flex justify-between text-slate-900 font-bold">
              <span>φ(n) = (p-1)(q-1):</span>
              <strong className="text-purple-700 text-base">{phi}</strong>
            </div>
          </div>
        </div>

        {/* Exponents Config */}
        <div className="bg-white border border-slate-300 rounded-2xl p-5 shadow-sm space-y-3">
          <h3 className="font-extrabold text-slate-900 text-sm border-b border-slate-200 pb-3 flex items-center space-x-2">
            <Lock className="w-4 h-4 text-rose-600" />
            <span>Exponent Forge</span>
          </h3>

          <div className="space-y-2.5 text-xs font-mono">
            <div className="flex justify-between items-center">
              <span className="text-slate-600 font-sans font-bold">Public Exponent e:</span>
              <select
                value={eVal}
                onChange={(e) => setEVal(parseInt(e.target.value, 10))}
                className="bg-slate-50 border-2 border-slate-300 rounded px-2 py-1 text-blue-700 font-bold text-sm"
              >
                {validEList.map((candidate) => (
                  <option key={candidate} value={candidate}>
                    e = {candidate}
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-slate-900 font-bold">
              <span>Private Exponent d:</span>
              <strong className="text-rose-700 text-lg font-extrabold">{dVal}</strong>
            </div>

            <div className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200 font-semibold">
              (e × d) mod φ(n) = ({eVal} × {dVal}) mod {phi} = <strong className="text-blue-700 font-extrabold">{(eVal * dVal) % phi}</strong>
            </div>
          </div>
        </div>

        {/* Custom Message & Attack Simulator */}
        <div className="bg-white border border-slate-300 rounded-2xl p-5 shadow-sm space-y-3">
          <h3 className="font-extrabold text-slate-900 text-sm border-b border-slate-200 pb-3 flex items-center space-x-2">
            <Zap className="w-4 h-4 text-amber-600" />
            <span>Cipher Tamper Simulator</span>
          </h3>

          <div className="space-y-2.5 text-xs">
            <label className="text-slate-700 font-bold block uppercase tracking-wider">Message Text:</label>
            <input
              type="text"
              value={customText}
              onChange={(e) => setCustomText(e.target.value.toUpperCase().slice(0, 10))}
              placeholder="CUSTOM TEXT..."
              className="w-full bg-slate-50 border-2 border-slate-300 rounded-xl px-3.5 py-2 font-mono text-rose-700 font-extrabold uppercase focus:outline-none focus:border-rose-600 text-sm"
            />

            <div className="pt-2">
              <button
                onClick={() => setCorruptBit(!corruptBit)}
                className={`w-full py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-xs ${
                  corruptBit
                    ? 'bg-rose-600 text-white ring-2 ring-rose-300'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300'
                }`}
              >
                <AlertTriangle className="w-4 h-4" />
                <span>{corruptBit ? 'Ciphertext Corrupted! (1 Bit Flipped)' : 'Simulate Wire Corruption'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Output Results Inspector */}
      <div className="bg-white border border-slate-300 rounded-2xl p-5 shadow-sm space-y-4">
        <h3 className="font-extrabold text-slate-900 text-sm border-b border-slate-200 pb-3 flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span>Real-time RSA Pipeline Output</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
          {/* Plaintext */}
          <div className="bg-slate-50 border border-slate-300 rounded-xl p-4">
            <span className="text-slate-600 font-sans font-bold block mb-1">1. Plaintext Input:</span>
            <span className="text-xl font-extrabold text-rose-700">{customText}</span>
            <div className="text-[11px] text-slate-500 mt-1.5 font-semibold">
              Numeric: [{nums.join(', ')}]
            </div>
          </div>

          {/* Ciphertext */}
          <div className={`bg-slate-50 border-2 rounded-xl p-4 ${corruptBit ? 'border-rose-500 bg-rose-50/50' : 'border-blue-300'}`}>
            <span className="text-slate-600 font-sans font-bold block mb-1">
              2. Ciphertext C: {corruptBit && <span className="text-rose-700 font-extrabold">(TAMPERED)</span>}
            </span>
            <span className="text-xl font-extrabold text-blue-700">[{actualCiphers.join(', ')}]</span>
            <div className="text-[11px] text-slate-500 mt-1.5 font-semibold">
              Formula: C = M^{eVal} mod {n}
            </div>
          </div>

          {/* Decrypted */}
          <div className={`bg-slate-50 border-2 rounded-xl p-4 ${corruptBit ? 'border-rose-500 bg-rose-50/50' : 'border-emerald-500 bg-emerald-50/50'}`}>
            <span className="text-slate-600 font-sans font-bold block mb-1">3. Decrypted Output:</span>
            <span className={`text-xl font-extrabold ${corruptBit ? 'text-rose-700' : 'text-emerald-700'}`}>
              {decryptedText}
            </span>
            <div className="text-[11px] text-slate-500 mt-1.5 font-semibold">
              Formula: M = C^{dVal} mod {n}
            </div>
          </div>
        </div>

        {corruptBit && (
          <div className="bg-rose-50 border border-rose-300 rounded-xl p-3.5 text-xs text-rose-900 flex items-start space-x-2 font-medium">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-extrabold">Wire Tampering Effect:</strong> Changing even 1 value in the ciphertext destroys modular equivalence when raised to private exponent <span className="font-mono font-bold">d = {dVal}</span>, resulting in total character corruption. This proves RSA provides message integrity verification!
            </div>
          </div>
        )}
      </div>

      {/* Clock visualizer for sandbox */}
      {nums.length > 0 && (
        <ModularClockVisualizer
          modulus={n}
          base={nums[0]}
          exponent={eVal}
          highlightValue={actualCiphers[0]}
          title={`Sandbox Clock Visualizer for '${customText[0]}' (M=${nums[0]}, e=${eVal}, n=${n})`}
        />
      )}
    </div>
  );
};
