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
import { Compass, Key, Lock, Unlock, Zap, RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react';

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
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 border border-purple-800/60 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400 bg-purple-950 px-2.5 py-1 rounded-full border border-purple-800/80">
              Stage 7: Freeform RSA Sandbox & Laboratory
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-2">
              RSA Interactive Mathematical Sandbox
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Experiment with custom prime values, test corrupted ciphertext attacks, adjust parameters, and observe modular arithmetic behavior in real time!
            </p>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center space-x-2 bg-slate-950/80 border border-slate-800 p-2 rounded-xl shrink-0">
            <span className="text-[10px] text-slate-400 font-semibold block">Presets:</span>
            <button
              onClick={() => loadPreset(7, 11)}
              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-mono text-cyan-300 rounded border border-slate-700"
            >
              (7, 11)
            </button>
            <button
              onClick={() => loadPreset(61, 53)}
              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-mono text-cyan-300 rounded border border-slate-700"
            >
              (61, 53)
            </button>
            <button
              onClick={() => loadPreset(101, 103)}
              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-mono text-cyan-300 rounded border border-slate-700"
            >
              (101, 103)
            </button>
          </div>
        </div>
      </div>

      {/* Sandbox Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Prime & Modulus Config */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <h3 className="font-bold text-white text-sm border-b border-slate-800 pb-2 flex items-center space-x-2">
            <Key className="w-4 h-4 text-cyan-400" />
            <span>Prime Configuration</span>
          </h3>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Prime p:</span>
              <input
                type="number"
                value={p}
                onChange={(e) => setP(Math.max(2, parseInt(e.target.value, 10) || 2))}
                className="w-20 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-cyan-300 font-bold text-right"
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Prime q:</span>
              <input
                type="number"
                value={q}
                onChange={(e) => setQ(Math.max(2, parseInt(e.target.value, 10) || 2))}
                className="w-20 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-purple-300 font-bold text-right"
              />
            </div>
            <div className="pt-2 border-t border-slate-800 flex justify-between text-slate-300">
              <span>n = p × q:</span>
              <strong className="text-cyan-300 text-sm">{n}</strong>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>φ(n) = (p-1)(q-1):</span>
              <strong className="text-purple-300 text-sm">{phi}</strong>
            </div>
          </div>
        </div>

        {/* Exponents Config */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <h3 className="font-bold text-white text-sm border-b border-slate-800 pb-2 flex items-center space-x-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>Exponent Forge</span>
          </h3>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Public Exponent e:</span>
              <select
                value={eVal}
                onChange={(e) => setEVal(parseInt(e.target.value, 10))}
                className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-cyan-300 font-bold"
              >
                {validEList.map((candidate) => (
                  <option key={candidate} value={candidate}>
                    e = {candidate}
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
              <span className="text-slate-400">Private Exponent d:</span>
              <strong className="text-emerald-300 text-base">{dVal}</strong>
            </div>

            <div className="text-[11px] text-slate-400 bg-slate-950 p-2 rounded border border-slate-800">
              (e × d) mod φ(n) = ({eVal} × {dVal}) mod {phi} = <strong className="text-cyan-300">{(eVal * dVal) % phi}</strong>
            </div>
          </div>
        </div>

        {/* Custom Message & Attack Simulator */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <h3 className="font-bold text-white text-sm border-b border-slate-800 pb-2 flex items-center space-x-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Cipher Tamper Testing</span>
          </h3>

          <div className="space-y-2 text-xs">
            <label className="text-slate-400 font-semibold block">Message Text:</label>
            <input
              type="text"
              value={customText}
              onChange={(e) => setCustomText(e.target.value.toUpperCase().slice(0, 10))}
              placeholder="CUSTOM TEXT..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 font-mono text-pink-300 font-bold uppercase focus:outline-none"
            />

            <div className="pt-2">
              <button
                onClick={() => setCorruptBit(!corruptBit)}
                className={`w-full py-2 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition-all ${
                  corruptBit
                    ? 'bg-rose-600 text-white ring-2 ring-rose-400'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
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
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <h3 className="font-bold text-white text-sm border-b border-slate-800 pb-2 flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-indigo-400" />
          <span>Real-time RSA Pipeline Output</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
          {/* Plaintext */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
            <span className="text-slate-400 block mb-1">1. Plaintext Input:</span>
            <span className="text-lg font-bold text-pink-300">{customText}</span>
            <div className="text-[11px] text-slate-500 mt-1">
              Numeric: [{nums.join(', ')}]
            </div>
          </div>

          {/* Ciphertext */}
          <div className={`bg-slate-950 border rounded-xl p-4 ${corruptBit ? 'border-rose-700/80' : 'border-slate-800'}`}>
            <span className="text-slate-400 block mb-1">
              2. Transmitted Ciphertext C: {corruptBit && <span className="text-rose-400 font-bold">(TAMPERED)</span>}
            </span>
            <span className="text-lg font-bold text-cyan-300">[{actualCiphers.join(', ')}]</span>
            <div className="text-[11px] text-slate-500 mt-1">
              Formula: C = M^{eVal} mod {n}
            </div>
          </div>

          {/* Decrypted */}
          <div className={`bg-slate-950 border rounded-xl p-4 ${corruptBit ? 'border-rose-900/60' : 'border-emerald-900/60'}`}>
            <span className="text-slate-400 block mb-1">3. Decrypted Output:</span>
            <span className={`text-lg font-bold ${corruptBit ? 'text-rose-400' : 'text-emerald-300'}`}>
              {decryptedText}
            </span>
            <div className="text-[11px] text-slate-500 mt-1">
              Formula: M = C^{dVal} mod {n}
            </div>
          </div>
        </div>

        {corruptBit && (
          <div className="bg-rose-950/80 border border-rose-800/80 rounded-xl p-3 text-xs text-rose-200 flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <strong>Wire Tampering Effect:</strong> Changing even 1 value in the ciphertext destroys modular equivalence when raised to private exponent <span className="font-mono">d = {dVal}</span>, resulting in total character corruption. This proves RSA provides integrity verification!
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
