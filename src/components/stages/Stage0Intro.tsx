import React, { useState } from 'react';
import { BookOpen, Lock, Unlock, Key, ArrowRight, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Stage0IntroProps {
  onStart: () => void;
}

export const Stage0Intro: React.FC<Stage0IntroProps> = ({ onStart }) => {
  const [padlockLocked, setPadlockLocked] = useState<boolean>(false);

  const handleToggleLock = () => {
    setPadlockLocked(!padlockLocked);
    if (!padlockLocked) {
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.7 } });
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner - Presentation style with vibrant high-contrast header */}
      <div className="bg-slate-900 text-white border-b-4 border-blue-600 rounded-2xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="max-w-3xl relative z-10 space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400 bg-slate-800 border border-slate-700 px-3 py-1 rounded-full inline-block">
            Interactive Cryptography Story & Presentation
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            How Bello & Nii Talk In Secret Across a Public Network
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            Every time you buy a coffee online, log into your bank, or send an encrypted text message, your device uses <strong className="text-cyan-300 font-bold">RSA Public Key Cryptography</strong>.
            Explore the mathematics through the journey of <strong className="text-rose-300 font-bold">Bello</strong>, <strong className="text-cyan-300 font-bold">Nii</strong>, and <strong className="text-amber-300 font-bold">Paulson</strong>!
          </p>
        </div>
      </div>

      {/* The Core Concept: The Open Padlock Analogy */}
      <div className="bg-white border border-slate-300 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="border-b border-slate-200 pb-3">
          <h3 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2">
            <Key className="w-5 h-5 text-blue-600" />
            <span>The Open Padlock Analogy (Public vs Private Key)</span>
          </h3>
          <p className="text-xs text-slate-600 mt-1 font-medium">
            How do you receive a secret message from someone across the world without ever meeting them first?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Narrative step list */}
          <div className="space-y-4 text-xs text-slate-700 font-medium">
            <div className="flex items-start space-x-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-extrabold shrink-0 mt-0.5 text-xs shadow-xs">
                1
              </span>
              <div>
                <strong className="text-blue-900 block text-sm font-extrabold">Nii Creates the Key Pair</strong>
                Nii generates two mathematically linked keys: a <strong className="text-blue-700 font-bold">Public Key (n, e)</strong> (an open padlock) and a <strong className="text-rose-700 font-bold">Private Key (d)</strong> (the unique key that opens it).
              </div>
            </div>

            <div className="flex items-start space-x-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="w-7 h-7 rounded-full bg-rose-600 text-white flex items-center justify-center font-extrabold shrink-0 mt-0.5 text-xs shadow-xs">
                2
              </span>
              <div>
                <strong className="text-rose-900 block text-sm font-extrabold">Bello Locks His Message</strong>
                Bello puts his message in a box, snaps Nii's open padlock shut, and sends it back across the internet. Anyone can snap an open padlock shut, but only Nii has the secret key!
              </div>
            </div>

            <div className="flex items-start space-x-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="w-7 h-7 rounded-full bg-amber-600 text-white flex items-center justify-center font-extrabold shrink-0 mt-0.5 text-xs shadow-xs">
                3
              </span>
              <div>
                <strong className="text-amber-900 block text-sm font-extrabold">Paulson Cannot Open the Box</strong>
                Paulson intercepts the locked box on the wire. Without Nii's private key d, opening the lock requires factoring large prime numbers—taking billions of years!
              </div>
            </div>
          </div>

          {/* Interactive Padlock Demo */}
          <div className="bg-slate-50 border border-slate-300 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-4 shadow-inner">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-600">
              Try Nii's Digital Padlock:
            </span>

            <button
              onClick={handleToggleLock}
              className={`w-28 h-28 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-105 cursor-pointer shadow-lg ${
                padlockLocked
                  ? 'bg-rose-600 text-white border-4 border-rose-700 ring-4 ring-rose-200'
                  : 'bg-blue-600 text-white border-4 border-blue-700 ring-4 ring-blue-200'
              }`}
            >
              {padlockLocked ? (
                <Lock className="w-14 h-14 text-white" />
              ) : (
                <Unlock className="w-14 h-14 text-white" />
              )}
            </button>

            <div>
              <span className="font-extrabold text-base block text-slate-900">
                Status: {padlockLocked ? 'Message Locked by Bello (Ciphertext C)' : 'Padlock Unlocked & Open (Public Key)'}
              </span>
              <p className="text-xs text-slate-600 mt-1.5 max-w-xs font-medium">
                {padlockLocked
                  ? 'Anyone can snap it shut using Public Key (n, e). Only Nii can unlock it with Private Key d!'
                  : 'Click the padlock above to simulate Bello snapping it shut!'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Start Button */}
      <div className="flex justify-end pt-2">
        <button
          onClick={onStart}
          className="flex items-center space-x-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm sm:text-base px-8 py-3.5 rounded-xl shadow-md transition-all transform hover:scale-[1.02] cursor-pointer"
        >
          <span>Begin Chapter 2: Prime Hunt</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
