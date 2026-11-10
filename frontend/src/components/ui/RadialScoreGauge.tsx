import React from 'react';
import { motion } from 'framer-motion';

interface RadialScoreGaugeProps {
  score: number; // 0 - 100
  size?: number;
  strokeWidth?: number;
}

export const RadialScoreGauge: React.FC<RadialScoreGaugeProps> = ({
  score,
  size = 180,
  strokeWidth = 11,
}) => {
  const radius = (size - strokeWidth * 2.2) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let colorGradient = 'url(#holoBlueCyan)';
  let glowColor = 'rgba(99, 139, 255, 0.45)';
  let orbBg = 'radial-gradient(circle, rgba(99, 139, 255, 0.15) 0%, rgba(8, 11, 20, 0) 70%)';
  let tier = 'OPTIMAL';
  let tierColor = 'text-[#638BFF]';
  let tierBadgeBg = 'bg-[#638BFF]/15 border-[#638BFF]/30';

  if (score >= 85) {
    colorGradient = 'url(#holoPurpleViolet)';
    glowColor = 'rgba(147, 107, 255, 0.55)';
    orbBg = 'radial-gradient(circle, rgba(147, 107, 255, 0.18) 0%, rgba(8, 11, 20, 0) 70%)';
    tier = 'HARDENED';
    tierColor = 'text-[#C084FC]';
    tierBadgeBg = 'bg-[#936BFF]/20 border-[#936BFF]/40';
  } else if (score >= 70) {
    colorGradient = 'url(#holoGreenCyan)';
    glowColor = 'rgba(67, 214, 160, 0.55)';
    orbBg = 'radial-gradient(circle, rgba(67, 214, 160, 0.18) 0%, rgba(8, 11, 20, 0) 70%)';
    tier = 'OPTIMAL';
    tierColor = 'text-[#43D6A0]';
    tierBadgeBg = 'bg-[#43D6A0]/20 border-[#43D6A0]/40';
  } else if (score >= 45) {
    colorGradient = 'url(#holoAmber)';
    glowColor = 'rgba(245, 185, 66, 0.55)';
    orbBg = 'radial-gradient(circle, rgba(245, 185, 66, 0.18) 0%, rgba(8, 11, 20, 0) 70%)';
    tier = 'MODERATE';
    tierColor = 'text-[#F5B942]';
    tierBadgeBg = 'bg-[#F5B942]/20 border-[#F5B942]/40';
  } else {
    colorGradient = 'url(#holoRed)';
    glowColor = 'rgba(240, 100, 117, 0.55)';
    orbBg = 'radial-gradient(circle, rgba(240, 100, 117, 0.18) 0%, rgba(8, 11, 20, 0) 70%)';
    tier = 'CRITICAL';
    tierColor = 'text-[#F06475]';
    tierBadgeBg = 'bg-[#F06475]/20 border-[#F06475]/40';
  }

  return (
    <div
      className="relative flex flex-col items-center justify-center select-none"
      style={{ width: size, height: size }}
    >
      {/* Ambient Holographic Orb Light */}
      <div
        className="absolute inset-2 rounded-full pointer-events-none transition-all duration-700 blur-xl"
        style={{ background: orbBg }}
      />

      <svg width={size} height={size} className="transform -rotate-90 relative z-10">
        <defs>
          <linearGradient id="holoBlueCyan" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00F0FF" />
            <stop offset="50%" stopColor="#638BFF" />
            <stop offset="100%" stopColor="#936BFF" />
          </linearGradient>
          <linearGradient id="holoPurpleViolet" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#936BFF" />
            <stop offset="50%" stopColor="#C084FC" />
            <stop offset="100%" stopColor="#F472B6" />
          </linearGradient>
          <linearGradient id="holoGreenCyan" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#43D6A0" />
            <stop offset="60%" stopColor="#2DD4BF" />
            <stop offset="100%" stopColor="#638BFF" />
          </linearGradient>
          <linearGradient id="holoAmber" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F5B942" />
            <stop offset="100%" stopColor="#FB923C" />
          </linearGradient>
          <linearGradient id="holoRed" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F43F5E" />
            <stop offset="100%" stopColor="#E11D48" />
          </linearGradient>

          {/* SVG Glow Filter */}
          <filter id="holoGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer Orbit Tick Ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius + strokeWidth * 0.9}
          stroke="rgba(255, 255, 255, 0.12)"
          strokeWidth={1}
          fill="none"
          strokeDasharray="2 6"
        />

        {/* Inner Depth Disc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius - strokeWidth * 0.8}
          fill="rgba(13, 19, 32, 0.65)"
          stroke="rgba(255, 255, 255, 0.05)"
          strokeWidth={1}
        />

        {/* Track circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#1e293b"
          strokeWidth={strokeWidth}
          fill="none"
          strokeOpacity={0.4}
        />

        {/* Holographic Glowing Progress Arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colorGradient}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          style={{
            filter: `drop-shadow(0 0 10px ${glowColor})`,
          }}
        />
      </svg>

      {/* Center 3D Floating Readout */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-20 pointer-events-none">
        <span
          className={`font-mono tracking-widest text-slate-400 uppercase font-semibold ${
            size < 150 ? 'text-[9px]' : 'text-[10px]'
          }`}
        >
          INDEX
        </span>
        <motion.span
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1, type: 'spring', damping: 15 }}
          className={`font-extrabold font-heading text-white tracking-tight my-0.5 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] ${
            size < 150 ? 'text-3xl' : 'text-4xl'
          }`}
        >
          {score}
        </motion.span>
        <span
          className={`font-mono font-bold tracking-widest uppercase rounded-full border shadow-sm ${tierColor} ${tierBadgeBg} ${
            size < 150 ? 'text-[8px] px-1.5 py-0.5' : 'text-[9px] px-2 py-0.5'
          }`}
        >
          {tier}
        </span>
      </div>
    </div>
  );
};
