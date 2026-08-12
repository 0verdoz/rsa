import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, ChevronRight, HelpCircle } from 'lucide-react';

interface ModularClockVisualizerProps {
  modulus: number;
  base: number;
  exponent: number;
  highlightValue?: number;
  title?: string;
}

export const ModularClockVisualizer: React.FC<ModularClockVisualizerProps> = ({
  modulus,
  base,
  exponent,
  highlightValue,
  title = "Modular Clock Arithmetic",
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Calculate step sequence: base^k % modulus for k = 0..exponent
  const steps: { k: number; val: number; rawPower: BigInt }[] = [];
  let curVal = 1n;
  const b = BigInt(base);
  const m = BigInt(modulus || 1);

  for (let k = 0; k <= Math.min(exponent, 20); k++) {
    steps.push({
      k,
      val: Number(curVal),
      rawPower: BigInt(base) ** BigInt(k),
    });
    curVal = (curVal * b) % m;
  }

  useEffect(() => {
    setCurrentStep(0);
    setIsPlaying(false);
  }, [base, exponent, modulus]);

  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1200);
    }
    return () => clearInterval(interval);
  }, [isPlaying, steps.length]);

  const activeStepObj = steps[currentStep] || steps[0] || { k: 0, val: 0, rawPower: 0n };
  const currentValue = activeStepObj.val;

  // Render clock ticks around SVG
  // Max visible ticks on rim = 40 for rendering clarity, or modulus if smaller
  const numTicks = Math.min(modulus, 36);
  const clockRadius = 110;
  const clockCenterX = 150;
  const clockCenterY = 150;

  // Hand angle calculation
  const handAngleDegrees = (currentValue / (modulus || 1)) * 360 - 90;
  const handAngleRad = (handAngleDegrees * Math.PI) / 180;
  const handLength = 80;
  const handX2 = clockCenterX + handLength * Math.cos(handAngleRad);
  const handY2 = clockCenterY + handLength * Math.sin(handAngleRad);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl text-white">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div>
          <h3 className="font-bold text-base text-indigo-300 flex items-center space-x-2">
            <span>{title}</span>
            <span className="text-xs bg-indigo-950 text-indigo-400 border border-indigo-800/60 px-2 py-0.5 rounded-full font-mono">
              Modulus n = {modulus}
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Calculating <span className="font-mono text-cyan-300">{base}^{exponent} mod {modulus}</span> step-by-step
          </p>
        </div>

        {/* Step controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center space-x-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'Pause' : 'Auto Play'}</span>
          </button>
          <button
            onClick={() => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))}
            disabled={currentStep >= steps.length - 1}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded-lg border border-slate-700 text-slate-300 transition-colors"
            title="Next Step"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setCurrentStep(0);
              setIsPlaying(false);
            }}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 text-slate-400 transition-colors"
            title="Reset Clock"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Left: SVG Clock Face */}
        <div className="flex flex-col items-center justify-center bg-slate-950 rounded-xl p-4 border border-slate-800/80">
          <svg width="300" height="300" className="overflow-visible">
            {/* Outer Rim Circle */}
            <circle
              cx={clockCenterX}
              cy={clockCenterY}
              r={clockRadius}
              className="fill-slate-900 stroke-indigo-500/40"
              strokeWidth="4"
            />
            <circle
              cx={clockCenterX}
              cy={clockCenterY}
              r={clockRadius + 8}
              className="fill-none stroke-slate-800"
              strokeWidth="1"
              strokeDasharray="4 4"
            />

            {/* Ticks & Numbers around rim */}
            {Array.from({ length: numTicks }).map((_, i) => {
              const tickVal = Math.round((i * modulus) / numTicks);
              const angle = (i / numTicks) * 2 * Math.PI - Math.PI / 2;
              const innerR = clockRadius - 10;
              const outerR = clockRadius;
              const labelR = clockRadius - 22;

              const x1 = clockCenterX + innerR * Math.cos(angle);
              const y1 = clockCenterY + innerR * Math.sin(angle);
              const x2 = clockCenterX + outerR * Math.cos(angle);
              const y2 = clockCenterY + outerR * Math.sin(angle);
              const lx = clockCenterX + labelR * Math.cos(angle);
              const ly = clockCenterY + labelR * Math.sin(angle);

              const isCurrent = tickVal === currentValue;
              const isHighlight = highlightValue !== undefined && tickVal === highlightValue;

              return (
                <g key={i}>
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    className={isCurrent ? 'stroke-cyan-400' : 'stroke-slate-600'}
                    strokeWidth={isCurrent ? '3' : '1.5'}
                  />
                  {numTicks <= 20 && (
                    <text
                      x={lx}
                      y={ly}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className={`text-[10px] font-mono ${
                        isCurrent
                          ? 'fill-cyan-300 font-bold text-xs'
                          : isHighlight
                          ? 'fill-emerald-400 font-bold'
                          : 'fill-slate-400'
                      }`}
                    >
                      {tickVal}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Target highlight indicator if applicable */}
            {highlightValue !== undefined && (
              <g>
                {(() => {
                  const targetAngle = (highlightValue / (modulus || 1)) * 2 * Math.PI - Math.PI / 2;
                  const tx = clockCenterX + (clockRadius - 5) * Math.cos(targetAngle);
                  const ty = clockCenterY + (clockRadius - 5) * Math.sin(targetAngle);
                  return (
                    <circle
                      cx={tx}
                      cy={ty}
                      r="6"
                      className="fill-emerald-400/80 stroke-emerald-200"
                      strokeWidth="2"
                    />
                  );
                })()}
              </g>
            )}

            {/* Hand Line */}
            <line
              x1={clockCenterX}
              y1={clockCenterY}
              x2={handX2}
              y2={handY2}
              className="stroke-cyan-400 transition-all duration-500 ease-out"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Hand Tip Glowing Dot */}
            <circle
              cx={handX2}
              cy={handY2}
              r="6"
              className="fill-cyan-300 animate-pulse stroke-cyan-100"
              strokeWidth="2"
            />

            {/* Center Cap */}
            <circle cx={clockCenterX} cy={clockCenterY} r="8" className="fill-indigo-500 stroke-indigo-300" strokeWidth="2" />

            {/* Center Text */}
            <text
              x={clockCenterX}
              y={clockCenterY + 35}
              textAnchor="middle"
              className="fill-cyan-300 text-sm font-bold font-mono"
            >
              val = {currentValue}
            </text>
            <text
              x={clockCenterX}
              y={clockCenterY + 52}
              textAnchor="middle"
              className="fill-slate-400 text-[10px] font-mono"
            >
              (mod {modulus})
            </text>
          </svg>

          <span className="text-[11px] text-slate-400 mt-2 italic text-center">
            Clock hands wrap around {modulus} tick positions, representing modular equivalence!
          </span>
        </div>

        {/* Right: Step breakdown card */}
        <div className="space-y-3">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="text-xs text-slate-400 flex items-center justify-between">
              <span>Power Step: <strong className="text-indigo-300 font-mono">k = {activeStepObj.k}</strong> of {exponent}</span>
              <span className="text-cyan-400 font-mono text-[11px]">Step {currentStep + 1} / {steps.length}</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 space-y-1.5 font-mono text-xs">
              <div className="text-slate-400 flex justify-between">
                <span>Unmodded Power ({base}^{activeStepObj.k}):</span>
                <span className="text-amber-300 font-bold overflow-hidden text-ellipsis max-w-[150px]">
                  {activeStepObj.rawPower.toString()}
                </span>
              </div>
              <div className="text-slate-400 flex justify-between">
                <span>Modulo Operation:</span>
                <span className="text-slate-300">{activeStepObj.rawPower.toString()} mod {modulus}</span>
              </div>
              <div className="border-t border-slate-800 pt-1.5 flex justify-between items-center text-sm">
                <span className="text-slate-300 font-sans font-semibold">Clock Hand Position:</span>
                <span className="text-cyan-300 font-bold text-base bg-cyan-950/80 border border-cyan-800 px-2.5 py-0.5 rounded">
                  {currentValue}
                </span>
              </div>
            </div>
          </div>

          {/* Stepper Timeline */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
            <span className="text-[11px] text-slate-400 block mb-2 font-medium">Trajectory Steps:</span>
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-thin">
              {steps.map((st, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCurrentStep(idx);
                    setIsPlaying(false);
                  }}
                  className={`px-2 py-1 rounded text-xs font-mono transition-all whitespace-nowrap ${
                    idx === currentStep
                      ? 'bg-cyan-500 text-slate-950 font-bold ring-2 ring-cyan-300'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {base}^{st.k}→{st.val}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
