import React from "react";

interface LevelIndicatorProps {
  levels: number[];
  labels?: string[];
}

const LevelIndicator = ({ levels, labels }: LevelIndicatorProps) => {
  const maxOffset = 50;
  const centerX = 60;
  const centerY = 60;
  const numPoints = levels.length;

  if (numPoints === 0) {
    return null;
  }

  const generatePointsAndLines = (
    levels: number[],
    color: string,
    labels: string[]
  ) => {
    let points: any = [];
    let lines: any = [];

    levels.forEach((level, i) => {
      let x, y;

      if (level === 0) {
        x = centerX;
        y = centerY;
      } else {
        const normalizedLevel = Math.max(0, Math.min(level, 10)) / 10;
        const offset = maxOffset * normalizedLevel;
        const angle = (2 * Math.PI * i) / numPoints;
        x = centerX + offset * Math.cos(angle);
        y = centerY + offset * Math.sin(angle);
      }

      points.push(
        <React.Fragment key={`group-${color}-${i}`}>
          <circle
            key={`point-${color}-${i}`}
            cx={x}
            cy={y}
            r={3}
            fill={color}
          />
          {labels && labels.length === numPoints && (
            <text
              key={`label-${color}-${i}`}
              x={x}
              y={y - 5}
              fontSize="10"
              textAnchor="middle"
              fill={color}
            >
              {labels[i]}
            </text>
          )}
        </React.Fragment>
      );

      if (i > 0) {
        const prevLevel = levels[i - 1];
        let prevX, prevY;
        if (prevLevel === 0) {
          prevX = centerX;
          prevY = centerY;
        } else {
          const prevNormalizedLevel = Math.max(0, Math.min(prevLevel, 10)) / 10;
          const prevOffset = maxOffset * prevNormalizedLevel;
          const prevAngle = (2 * Math.PI * (i - 1)) / numPoints;
          prevX = centerX + prevOffset * Math.cos(prevAngle);
          prevY = centerY + prevOffset * Math.sin(prevAngle);
        }
        lines.push(
          <line
            key={`line-${color}-${i}`}
            x1={prevX}
            y1={prevY}
            x2={x}
            y2={y}
            stroke={color}
            strokeWidth="1"
          />
        );
      }
      if (i === numPoints - 1 && numPoints > 1) {
        let firstX, firstY;
        if (levels[0] === 0) {
          firstX = centerX;
          firstY = centerY;
        } else {
          const firstNormalizedLevel =
            Math.max(0, Math.min(levels[0], 10)) / 10;
          const firstOffset = maxOffset * firstNormalizedLevel;
          const firstAngle = 0;
          firstX = centerX + firstOffset * Math.cos(firstAngle);
          firstY = centerY + firstOffset * Math.sin(firstAngle);
        }
        lines.push(
          <line
            key={`line-final-${color}`}
            x1={x}
            y1={y}
            x2={firstX}
            y2={firstY}
            stroke={color}
            strokeWidth="1"
          />
        );
      }
    });

    return { points, lines };
  };

  const backgroundLevels10 = Array(numPoints).fill(10);

  const background10 = generatePointsAndLines(
    backgroundLevels10,
    "darkgray",
    labels || []
  );
  const background5 = generatePointsAndLines(
    Array(numPoints).fill(5),
    "lightgray",
    []
  );
  const foreground = generatePointsAndLines(levels, "blue", []);

  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      {/* Punto grigio al centro */}
      <circle cx={centerX} cy={centerY} r={3} fill="gray" key="center-point" />
      {background10.lines}
      {background10.points}
      {background5.lines}
      {background5.points}
      {foreground.lines}
      {foreground.points}
    </svg>
  );
};

export default LevelIndicator;
