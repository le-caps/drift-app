import React from "react";

interface RiskBadgeProps {
  score?: number;
  level?: "low" | "medium" | "high";
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ score, level }) => {
  if (score === undefined || level === undefined) return null;

  const colors = {
    low: "text-emerald-600 bg-emerald-100/60 border-emerald-300",
    medium: "text-amber-600 bg-amber-100/60 border-amber-300",
    high: "text-rose-600 bg-rose-100/60 border-rose-300",
  };

  return (
    <span
      className={`
        inline-flex items-center px-2 py-0.5 rounded border text-[10px]
        font-semibold uppercase tracking-wide
        ${colors[level]}
      `}
    >
      {level} • {score}
    </span>
  );
};