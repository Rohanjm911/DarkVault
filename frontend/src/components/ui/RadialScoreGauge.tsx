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
  strokeWidth = 12,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // Use a 270-degree arc for high-tech gauge look
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let colorGradient = 'url(#bluePurpleGradient)';
  let glowColor = 'rgba(99, 139, 255, 0.4)';
  let tier = 'OPTIMAL';
  let tierColor = 'text-[#638BFF]';

  if (score >= 85) {
    colorGradient = 'url(#purpleGradient)';
    glowColor = 'rgba(147, 107, 255, 0.45)';
    tier = 'HARDENED';
    tierColor = 'text-[#936BFF]';
  } else if (score >= 70) {
    colorGradient = 'url(#greenGradient)';
    glowColor = 'rgba(67, 214, 160, 0.45)';
    tier = 'OPTIMAL';
    tierColor = 'text-[#43D6A0]';
  } else if (score >= 45) {
    colorGradient = 'url(#amberGradient)';
    glowColor = 'rgba(245, 185, 66, 0.45)';
    tier = 'MODERATE';
    tierColor = 'text-[#F5B942]';
  } else {
    colorGradient = 'url(#redGradient)';
    glowColor = 'rgba(240, 100, 117, 0.45)';
    tier = 'CRITICAL';
    tierColor = 'text-[#F06475]';
  }

  return (
    <div className="relative flex flex-col items-center justify-center select-none" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <defs>
          <linearGradient id="bluePurpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#638BFF" />
            <stop offset="100%" stopColor="#936BFF" />
          </linearGradient>
          <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#936BFF" />
            <stop offset="100%" stopColor="#C084FC" />
          </linearGradient>
          <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#43D6A0" />
            <stop offset="100%" stopColor="#638BFF" />
          </linearGradient>
          <linearGradient id="amberGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F5B942" />
            <stop offset="100%" stopColor="#FB923C" />
          </linearGradient>
          <linearGradient id="redGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F06475" />
            <stop offset="100%" stopColor="#E11D48" />
          </linearGradient>
        </defs>

        {/* Track circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#1e293b"
          strokeWidth={strokeWidth}
          fill="none"
          strokeOpacity={0.6}
        />

        {/* Animated fill circle */}
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
          transition={{ duration: 1.2, ease: 'easeOut' }}
          style={{ filter: `drop-shadow(0 0 8px ${glowColor})` }}
        />
      </svg>

      {/* Center readout */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">
          INDEX
        </span>
        <motion.span
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-extrabold font-heading text-white tracking-tight my-0.5"
        >
          {score}
        </motion.span>
        <span className={`text-[10px] font-mono font-bold tracking-wider ${tierColor}`}>
          {tier}
        </span>
      </div>
    </div>
  );
};

