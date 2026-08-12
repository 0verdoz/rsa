import React from 'react';
import { StageId } from '../types';
import { User, ShieldAlert, Cpu, HelpCircle } from 'lucide-react';

interface StoryHeaderProps {
  stage: StageId;
}

export const StoryHeader: React.FC<StoryHeaderProps> = ({ stage }) => {
  const getStageNarrative = () => {
    switch (stage) {
      case 'INTRO':
        return {
          title: 'Chapter 1: The Public Channel Dilemma',
          aliceSpeak: "Hi Nii! I need to send you a secret passcode, but Paulson monitors every message on our network!",
          bobSpeak: "Don't worry Bello! With Public Key Cryptography, I will send you an unlocked padlock that anyone can see, but ONLY my secret key can unlock!",
          eveSpeak: "I intercept all packets on this network! Try sending anything in plaintext and I will read it instantly!",
        };
      case 'PRIME_SELECTION':
        return {
          title: 'Chapter 2: Nii Hunts For Primes',
          aliceSpeak: "I am waiting for your Public Padlock, Nii!",
          bobSpeak: "First, I'll pick two secret prime numbers (p and q). Multiplying them gives our modulus (n). Multiplying is easy, but factoring n back is super hard!",
          eveSpeak: "Go ahead and multiply your primes... If n is too small, I can factor it using my supercomputer in milliseconds!",
        };
      case 'KEY_FORGE':
        return {
          title: 'Chapter 3: Forging the Public & Private Keys',
          aliceSpeak: "I see your public modulus n and public exponent e! I will use them to lock my message.",
          bobSpeak: "I've chosen e coprime to φ(n), and calculated my secret private exponent d using modular inverse (e × d ≡ 1 mod φ(n))!",
          eveSpeak: "I can see (n, e) in the public directory! But without knowing p and q, I can't calculate φ(n) or d!",
        };
      case 'ENCRYPTION':
        return {
          title: 'Chapter 4: Bello Encrypts the Message',
          aliceSpeak: "I converted my message into number M. Now I calculate Ciphertext C = M^e mod n using Nii's Public Key!",
          bobSpeak: "Send it over the network! The modular math scrambles M into Ciphertext C.",
          eveSpeak: "I see Ciphertext C floating on the cable! But without Nii's secret key d, calculating M from C^e mod n is nearly impossible!",
        };
      case 'EVE_INTERCEPTION':
        return {
          title: 'Chapter 5: Paulson\'s Cryptanalysis Lab',
          aliceSpeak: "Will Paulson be able to decipher my transmission?",
          bobSpeak: "Even if Paulson intercepts C and (n,e), she would need to factor n into p and q to break the encryption!",
          eveSpeak: "Let me fire up my factorization algorithms and brute-force tools! Watch how hard it gets as prime sizes grow!",
        };
      case 'DECRYPTION':
        return {
          title: 'Chapter 6: Nii Unlocks the Vault',
          aliceSpeak: "Nii, did you get my secret message?",
          bobSpeak: "Yes! Using my private exponent d, I computed C^d mod n = M! The original plaintext is restored!",
          eveSpeak: "Curse Euler's Totient Theorem! (C^d) mod n = (M^(e·d)) mod n = M! The math prevented my eavesdropping!",
        };
      case 'SANDBOX':
        return {
          title: 'Chapter 7: Freeform RSA Playground',
          aliceSpeak: "Try custom messages or custom prime numbers here!",
          bobSpeak: "Test modular exponentiation, check coprimes, or observe how mathematical parameters affect security.",
          eveSpeak: "Test my brute-force attack speeds against 8-bit up to 2048-bit keys in the security calculator!",
        };
    }
  };

  const narrative = getStageNarrative();

  return (
    <div id="story-header-container" className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 mb-6 shadow-xl backdrop-blur">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-white flex items-center space-x-2">
          <Cpu className="w-5 h-5 text-indigo-400" />
          <span>{narrative.title}</span>
        </h2>
        <span className="text-xs bg-slate-800 text-indigo-300 border border-indigo-900/60 px-2.5 py-1 rounded-full font-mono">
          Interactive Narrative
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Bello (Alice) */}
        <div id="character-bello" className="bg-slate-950/80 border border-pink-900/40 rounded-xl p-3.5 flex flex-col justify-between hover:border-pink-500/50 transition-all">
          <div className="flex items-center space-x-2.5 mb-2">
            <div className="w-8 h-8 rounded-full bg-pink-500/20 border border-pink-500/50 flex items-center justify-center text-pink-300 font-bold text-sm">
              B
            </div>
            <div>
              <span className="font-bold text-pink-300 text-sm">Bello</span>
              <span className="text-[10px] text-pink-400/70 block">Sender</span>
            </div>
          </div>
          <div className="bg-slate-900/90 border border-pink-900/30 rounded-lg p-2.5 text-xs text-slate-300 relative">
            <div className="absolute -top-1.5 left-3 w-2.5 h-2.5 bg-slate-900 border-t border-l border-pink-900/30 rotate-45"></div>
            <p className="italic">"{narrative.aliceSpeak}"</p>
          </div>
        </div>

        {/* Nii (Bob) */}
        <div id="character-nii" className="bg-slate-950/80 border border-cyan-900/40 rounded-xl p-3.5 flex flex-col justify-between hover:border-cyan-500/50 transition-all">
          <div className="flex items-center space-x-2.5 mb-2">
            <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center text-cyan-300 font-bold text-sm">
              N
            </div>
            <div>
              <span className="font-bold text-cyan-300 text-sm">Nii</span>
              <span className="text-[10px] text-cyan-400/70 block">Receiver & Key Maker</span>
            </div>
          </div>
          <div className="bg-slate-900/90 border border-cyan-900/30 rounded-lg p-2.5 text-xs text-slate-300 relative">
            <div className="absolute -top-1.5 left-3 w-2.5 h-2.5 bg-slate-900 border-t border-l border-cyan-900/30 rotate-45"></div>
            <p className="italic">"{narrative.bobSpeak}"</p>
          </div>
        </div>

        {/* Paulson (Eve) */}
        <div id="character-paulson" className="bg-slate-950/80 border border-amber-900/40 rounded-xl p-3.5 flex flex-col justify-between hover:border-amber-500/50 transition-all">
          <div className="flex items-center space-x-2.5 mb-2">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-300 font-bold text-sm">
              P
            </div>
            <div>
              <span className="font-bold text-amber-300 text-sm">Paulson</span>
              <span className="text-[10px] text-amber-400/70 block">The Eavesdropper</span>
            </div>
          </div>
          <div className="bg-slate-900/90 border border-amber-900/30 rounded-lg p-2.5 text-xs text-slate-300 relative">
            <div className="absolute -top-1.5 left-3 w-2.5 h-2.5 bg-slate-900 border-t border-l border-amber-900/30 rotate-45"></div>
            <p className="italic">"{narrative.eveSpeak}"</p>
          </div>
        </div>
      </div>
    </div>
  );
};
