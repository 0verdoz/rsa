import React, { useState } from 'react';
import { StageId, RSAKeys, EncryptedBlock } from './types';
import { modInverse, modPow, stringToMessageNumbers } from './lib/rsaMath';
import { Navbar } from './components/Navbar';
import { StoryHeader } from './components/StoryHeader';
import { Stage0Intro } from './components/stages/Stage0Intro';
import { Stage1PrimeSelection } from './components/stages/Stage1PrimeSelection';
import { Stage2KeyForge } from './components/stages/Stage2KeyForge';
import { Stage3Encryption } from './components/stages/Stage3Encryption';
import { Stage4EveInterception } from './components/stages/Stage4EveInterception';
import { Stage5Decryption } from './components/stages/Stage5Decryption';
import { Stage6SandboxPlayground } from './components/stages/Stage6SandboxPlayground';
import { AITutorModal } from './components/AITutorModal';

const DEFAULT_P = 61;
const DEFAULT_Q = 53;
const DEFAULT_N = DEFAULT_P * DEFAULT_Q;
const DEFAULT_PHI = (DEFAULT_P - 1) * (DEFAULT_Q - 1);
const DEFAULT_E = 17;
const DEFAULT_D = modInverse(DEFAULT_E, DEFAULT_PHI) || 2753;

export default function App() {
  const [currentStage, setCurrentStage] = useState<StageId>('INTRO');
  const [isTutorOpen, setIsTutorOpen] = useState<boolean>(false);

  // RSA Keys state
  const [keys, setKeys] = useState<RSAKeys>({
    p: DEFAULT_P,
    q: DEFAULT_Q,
    n: DEFAULT_N,
    phi: DEFAULT_PHI,
    e: DEFAULT_E,
    d: DEFAULT_D,
  });

  // Default initial message blocks
  const initialNums = stringToMessageNumbers('HI', keys.n);
  const initialBlocks: EncryptedBlock[] = ['H', 'I'].map((char, i) => ({
    char,
    ascii: initialNums[i],
    cipher: modPow(initialNums[i], keys.e, keys.n),
  }));

  const [encryptedBlocks, setEncryptedBlocks] = useState<EncryptedBlock[]>(initialBlocks);

  // Stage progression unlock tracker
  const [stageProgress, setStageProgress] = useState<Record<StageId, boolean>>({
    INTRO: true,
    PRIME_SELECTION: true,
    KEY_FORGE: true,
    ENCRYPTION: true,
    EVE_INTERCEPTION: true,
    DECRYPTION: true,
    SANDBOX: true,
  });

  const handleSetPrimes = (newP: number, newQ: number) => {
    const newN = newP * newQ;
    const newPhi = (newP - 1) * (newQ - 1);
    const newE = 17;
    const newD = modInverse(newE, newPhi) || 1;

    const newKeys: RSAKeys = {
      p: newP,
      q: newQ,
      n: newN,
      phi: newPhi,
      e: newE,
      d: newD,
    };

    setKeys(newKeys);

    // Re-encrypt default message
    const nums = stringToMessageNumbers('HI', newN);
    const reEncrypted = ['H', 'I'].map((char, i) => ({
      char,
      ascii: nums[i],
      cipher: modPow(nums[i], newE, newN),
    }));
    setEncryptedBlocks(reEncrypted);
  };

  const handleReset = () => {
    handleSetPrimes(DEFAULT_P, DEFAULT_Q);
    setCurrentStage('INTRO');
  };

  const unlockedCount = Object.values(stageProgress).filter(Boolean).length;

  return (
    <div id="rsa-visualizer-app" className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col antialiased selection:bg-blue-600 selection:text-white">
      {/* Navigation Header */}
      <Navbar
        currentStage={currentStage}
        onSelectStage={(stage) => setCurrentStage(stage)}
        keys={keys}
        onOpenTutor={() => setIsTutorOpen(true)}
        onReset={handleReset}
        achievementsUnlockedCount={unlockedCount}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6">
        {/* Story Character Dialogue Banner */}
        <StoryHeader stage={currentStage} />

        {/* Stage View Routing */}
        <div className="mt-4">
          {currentStage === 'INTRO' && (
            <Stage0Intro onStart={() => setCurrentStage('PRIME_SELECTION')} />
          )}

          {currentStage === 'PRIME_SELECTION' && (
            <Stage1PrimeSelection
              keys={keys}
              onSetPrimes={handleSetPrimes}
              onNext={() => setCurrentStage('KEY_FORGE')}
            />
          )}

          {currentStage === 'KEY_FORGE' && (
            <Stage2KeyForge
              keys={keys}
              onUpdateKeys={(k) => setKeys(k)}
              onNext={() => setCurrentStage('ENCRYPTION')}
            />
          )}

          {currentStage === 'ENCRYPTION' && (
            <Stage3Encryption
              keys={keys}
              onEncrypted={(blks) => setEncryptedBlocks(blks)}
              onNext={() => setCurrentStage('EVE_INTERCEPTION')}
            />
          )}

          {currentStage === 'EVE_INTERCEPTION' && (
            <Stage4EveInterception
              keys={keys}
              encryptedBlocks={encryptedBlocks}
              onNext={() => setCurrentStage('DECRYPTION')}
            />
          )}

          {currentStage === 'DECRYPTION' && (
            <Stage5Decryption
              keys={keys}
              encryptedBlocks={encryptedBlocks}
              onNext={() => setCurrentStage('SANDBOX')}
            />
          )}

          {currentStage === 'SANDBOX' && (
            <Stage6SandboxPlayground initialKeys={keys} />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t-4 border-blue-600 py-6 text-center text-xs text-slate-300 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-white text-sm">RSA Cryptography Gamified Visualizer</span>
            <span className="text-slate-400">— Group 34 Presentation System</span>
          </div>
          <span className="font-mono bg-slate-800 text-blue-300 px-3 py-1 rounded-md border border-slate-700 font-semibold text-xs">
            C ≡ M^e (mod n) &nbsp;↔&nbsp; M ≡ C^d (mod n)
          </span>
        </div>
      </footer>

      {/* Professor Cyber AI Tutor Modal */}
      <AITutorModal
        isOpen={isTutorOpen}
        onClose={() => setIsTutorOpen(false)}
        currentStage={currentStage}
        keys={keys}
      />
    </div>
  );
}
