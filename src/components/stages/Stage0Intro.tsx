import React, { useState } from 'react';
import { BookOpen, Lock, Unlock, Key, ShieldAlert, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
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
      {/* Hero Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border border-indigo-800/80 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl relative z-10 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-300 bg-indigo-950/90 border border-indigo-800 px-3 py-1 rounded-full">
            Interactive Cryptography Story
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            How Bello & Nii Talk In Secret Across a Public World
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Every time you buy a coffee online, log into your bank, or send an encrypted text message, your phone uses <strong className="text-cyan-300">RSA Public Key Cryptography</strong>.
            Learn the mathematics through the gamified journey of <strong className="text-pink-300">Bello</strong>, <strong className="text-cyan-300">Nii</strong>, and <strong className="text-amber-300">Paulson</strong>!
          </p>
        </div>
      </div>

      {/* The Core Concept: The Open Padlock Analogy */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="border-b border-slate-800 pb-3">
          <h3 className="text-lg font-bold text-white flex items-center space-x-2">
            <Key className="w-5 h-5 text-indigo-400" />
            <span>The Open Padlock Analogy</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            How do you receive a secret message from someone across the world without ever meeting them first?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Narrative step list */}
          <div className="space-y-4 text-xs text-slate-300">
            <div className="flex items-start space-x-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold shrink-0 mt-0.5">
                1
              </span>
              <div>
                <strong className="text-cyan-300 block text-sm">Nii Creates the Key Pair</strong>
                Nii generates two mathematically linked keys: a <strong className="text-cyan-300">Public Key</strong> (an open padlock) and a <strong className="text-emerald-300">Private Key</strong> (the unique key that opens it).
              </div>
            </div>

            <div className="flex items-start space-x-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <span className="w-6 h-6 rounded-full bg-pink-500/20 text-pink-300 flex items-center justify-center font-bold shrink-0 mt-0.5">
                2
              </span>
              <div>
                <strong className="text-pink-300 block text-sm">Bello Locks Her Message</strong>
                Bello puts her message in a box, snaps Nii's open padlock shut, and sends it back across the internet. Anyone can snap an open padlock shut, but only Nii has the secret key!
              </div>
            </div>

            <div className="flex items-start space-x-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold shrink-0 mt-0.5">
                3
              </span>
              <div>
                <strong className="text-amber-300 block text-sm">Paulson Cannot Open the Box</strong>
                Paulson intercepts the locked box on the wire. Without Nii's private key, opening the lock requires factoring large prime numbers—taking billions of years!
              </div>
            </div>
          </div>

          {/* Interactive Padlock Demo */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-4">
            <span className="text-xs font-semibold text-slate-400">Try Nii's Digital Padlock:</span>

            <button
              onClick={handleToggleLock}
              className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-105 shadow-2xl ${
                padlockLocked
                  ? 'bg-emerald-600/30 border-2 border-emerald-500 text-emerald-300 ring-4 ring-emerald-500/20'
                  : 'bg-indigo-600/30 border-2 border-indigo-500 text-indigo-300 ring-4 ring-indigo-500/20'
              }`}
            >
              {padlockLocked ? (
                <Lock className="w-12 h-12 text-emerald-400" />
              ) : (
                <Unlock className="w-12 h-12 text-indigo-400" />
              )}
            </button>

            <div>
              <span className="font-bold text-sm block text-white">
                Status: {padlockLocked ? 'Message Locked by Bello (Ciphertext C)' : 'Padlock Unlocked & Open (Public Key)'}
              </span>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
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
          className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-base px-8 py-3 rounded-xl shadow-xl transition-all transform hover:scale-[1.02]"
        >
          <span>Begin Chapter 2: Prime Hunt</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
