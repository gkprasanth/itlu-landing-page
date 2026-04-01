import React from "react";
import "../TraditionalDesigns.css";

export const MandalaSVG: React.FC<{
  className?: string;
  style?: React.CSSProperties;
}> = ({ className, style }) => (
  <svg
    viewBox="0 0 200 200"
    xmlns="http://www.w3.org/2000/svg"
    className={`mandala-container ${className}`}
    style={{ opacity: 0.8, ...style }}
    aria-hidden="true"
  >
    <path
      fill="none"
      stroke="var(--theme-color)"
      strokeWidth="0.5"
      d="M100 0 A100 100 0 0 1 100 200 A100 100 0 0 1 100 0 Z"
    />
    <g fill="none" stroke="var(--theme-color)" strokeWidth="0.8">
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
        <g key={i} transform={`rotate(${angle} 100 100)`}>
          <path d="M100 100 C110 80 130 80 140 100 C130 120 110 120 100 100" />
          <path
            d="M100 100 C120 70 160 70 180 100 C160 130 120 130 100 100"
            strokeWidth="0.4"
          />
          <circle
            cx="150"
            cy="100"
            r="5"
            fill="var(--theme-color2)"
            fillOpacity="0.6"
            stroke="none"
          />
        </g>
      ))}
      <circle cx="100" cy="100" r="20" />
      <circle cx="100" cy="100" r="10" fill="var(--theme-color)" />
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(
        (angle, i) => (
          <line
            key={i}
            x1="100"
            y1="100"
            x2="100"
            y2="30"
            transform={`rotate(${angle} 100 100)`}
            strokeWidth="0.3"
          />
        ),
      )}
    </g>
  </svg>
);

export const KolamBorder: React.FC<{
  className?: string;
  style?: React.CSSProperties;
}> = ({ className, style }) => (
  <div
    className={`kolam-border-container ${className}`}
    style={{ opacity: 0.8, ...style }}
  >
    <svg
      viewBox="0 0 1000 60"
      xmlns="http://www.w3.org/2000/svg"
      className="traditional-border animate-kolam"
      preserveAspectRatio="none"
    >
      <defs>
        <pattern
          id="kolam-pattern"
          x="0"
          y="0"
          width="100"
          height="60"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M20 30 C20 10 40 10 50 30 C60 50 80 50 80 30 C80 10 60 10 50 30 C40 50 20 50 20 30"
            fill="none"
            stroke="var(--theme-color)"
            strokeWidth="1.5"
          />
          <circle cx="20" cy="30" r="1.5" fill="var(--theme-color2)" />
          <circle cx="50" cy="30" r="1.5" fill="var(--theme-color2)" />
          <circle cx="80" cy="30" r="1.5" fill="var(--theme-color2)" />
        </pattern>
      </defs>
      <rect width="1000" height="60" fill="url(#kolam-pattern)" />
    </svg>
  </div>
);

export const SectionDivider: React.FC = () => (
  <div className="flex flex-col justify-center items-center py-10 opacity-70">
    <div className="flex gap-2 mb-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="w-1.5 h-1.5 bg-theme rounded-full"></div>
      ))}
    </div>
    <div className="flex items-center w-full max-w-[600px]">
      <div className="h-[1px] bg-theme flex-grow"></div>
      <div className="mx-4 text-theme transform rotate-45 border-2 border-theme p-1">
        <div className="w-2 h-2 bg-theme"></div>
      </div>
      <div className="h-[1px] bg-theme flex-grow"></div>
    </div>
  </div>
);