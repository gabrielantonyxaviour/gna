import React from "react";

const OneInchSpinner = ({ size = 80, strokeWidth = 4, color = "#3b82f6" }) => {
  const radius = size / 2 - strokeWidth;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference * 0.75; // This creates the gap

  return (
    <div className="flex justify-center items-center">
      <svg
        className="animate-spin"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        <circle
          className="stroke-current"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          style={{
            stroke: color,
            strokeDasharray: `${strokeDasharray} ${circumference}`,
            transform: "rotate(-90deg)",
            transformOrigin: "center",
          }}
        />
      </svg>
    </div>
  );
};

export default OneInchSpinner;
