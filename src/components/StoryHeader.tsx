import React from 'react';
import { StageId } from '../types';
import { User, ShieldAlert, Cpu, MessageSquare } from 'lucide-react';

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
    <div id="story-header-container" className="bg-white border border-slate-300 rounded-2xl p-4 sm:p-6 mb-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
        <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center space-x-2">
          <MessageSquare className="w-5 h-5 text-blue-600" />
          <span>{narrative.title}</span>
        </h2>
        <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full font-bold">
          Interactive Story Dialogue
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Bello (Alice) - Pink / Rose theme */}
        <div id="character-bello" className="bg-rose-50/50 border border-rose-200 rounded-xl p-4 flex flex-col justify-between hover:shadow-md transition-all">
          <div className="flex items-center space-x-3 mb-2.5">
            <div className="w-9 h-9 rounded-full bg-rose-600 text-white flex items-center justify-center font-extrabold text-sm shadow-sm">
              B
            </div>
            <div>
              <span className="font-extrabold text-rose-900 text-sm">Bello</span>
              <span className="text-xs text-rose-600 font-semibold block">Sender</span>
            </div>
          </div>
          <div className="bg-white border border-rose-200 rounded-lg p-3 text-xs text-slate-800 shadow-2xs relative">
            <p className="italic font-medium text-slate-700">"{narrative.aliceSpeak}"</p>
          </div>
        </div>

        {/* Nii (Bob) - Blue / Cyan theme */}
        <div id="character-nii" className="bg-blue-50/50 border border-blue-200 rounded-xl p-4 flex flex-col justify-between hover:shadow-md transition-all">
          <div className="flex items-center space-x-3 mb-2.5">
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-extrabold text-sm shadow-sm">
              N
            </div>
            <div>
              <span className="font-extrabold text-blue-900 text-sm">Nii</span>
              <span className="text-xs text-blue-600 font-semibold block">Receiver & Key Maker</span>
            </div>
          </div>
          <div className="bg-white border border-blue-200 rounded-lg p-3 text-xs text-slate-800 shadow-2xs relative">
            <p className="italic font-medium text-slate-700">"{narrative.bobSpeak}"</p>
          </div>
        </div>

        {/* Paulson (Eve) - Amber / Red theme */}
        <div id="character-paulson" className="bg-amber-50/50 border border-amber-200 rounded-xl p-4 flex flex-col justify-between hover:shadow-md transition-all">
          <div className="flex items-center space-x-3 mb-2.5">
            <div className="w-9 h-9 rounded-full bg-amber-600 text-white flex items-center justify-center font-extrabold text-sm shadow-sm">
              P
            </div>
            <div>
              <span className="font-extrabold text-amber-900 text-sm">Paulson</span>
              <span className="text-xs text-amber-700 font-semibold block">The Eavesdropper</span>
            </div>
          </div>
          <div className="bg-white border border-amber-200 rounded-lg p-3 text-xs text-slate-800 shadow-2xs relative">
            <p className="italic font-medium text-slate-700">"{narrative.eveSpeak}"</p>
          </div>
        </div>
      </div>
    </div>
  );
};
