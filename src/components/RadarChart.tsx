import React, { useState } from 'react';
import { PillarResult } from '../types';
import { PILLARS } from '../data/pillars';
import { DIMENSIONS } from '../data/dimensions';

interface RadarChartProps {
  pillarResults: Record<string, PillarResult>;
}

export const RadarChart: React.FC<RadarChartProps> = ({ pillarResults }) => {
  const [hoveredPillarId, setHoveredPillarId] = useState<string | null>(null);

  // Center and radius for SVG canvas
  const size = 560;
  const cx = size / 2;
  const cy = size / 2;
  const radius = 175;

  // Grid levels (20%, 40%, 60%, 80%, 100%)
  const levels = [0.2, 0.4, 0.6, 0.8, 1.0];
  const numPillars = PILLARS.length; // 9

  // Calculate coordinates for a given pillar index and percentage (0 to 100)
  const getCoordinates = (index: number, percentage: number, customRadius = radius) => {
    // Start at top (-PI/2) and rotate clockwise
    const angle = -Math.PI / 2 + (index * 2 * Math.PI) / numPillars;
    const r = (percentage / 100) * customRadius;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    return { x, y, angle };
  };

  // Generate polygon points for the assessment result data
  const dataPoints = PILLARS.map((p, i) => {
    const res = pillarResults[p.id];
    const percentage = res ? res.percentage : 20;
    return getCoordinates(i, percentage);
  });

  const polygonPath = dataPoints.map((pt) => `${pt.x},${pt.y}`).join(' ');

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-[540px] relative aspect-square">
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="w-full h-full overflow-visible"
          role="img"
          aria-label="Nine-pillar radar diagnostic chart showing scores across all dimensions"
        >
          {/* Concentric grid polygons */}
          {levels.map((level, lvlIdx) => {
            const levelPoints = PILLARS.map((_, i) =>
              getCoordinates(i, level * 100)
            )
              .map((pt) => `${pt.x},${pt.y}`)
              .join(' ');

            return (
              <g key={`grid-lvl-${lvlIdx}`}>
                <polygon
                  points={levelPoints}
                  fill={lvlIdx === levels.length - 1 ? '#FAF8F4' : 'none'}
                  stroke="#E4DFD7"
                  strokeWidth="1"
                  strokeDasharray={lvlIdx === levels.length - 1 ? 'none' : '3 3'}
                />
                {/* Level % label along the top axis */}
                <text
                  x={cx + 6}
                  y={cy - radius * level + 4}
                  fontSize="9"
                  fill="#8C8882"
                  className="font-mono select-none"
                >
                  {Math.round(level * 100)}%
                </text>
              </g>
            );
          })}

          {/* Radiating Axis Lines */}
          {PILLARS.map((pillar, i) => {
            const axisEnd = getCoordinates(i, 100);

            return (
              <line
                key={`axis-${pillar.id}`}
                x1={cx}
                y1={cy}
                x2={axisEnd.x}
                y2={axisEnd.y}
                stroke="#D6D0C7"
                strokeWidth="1"
              />
            );
          })}

          {/* Data Polygon Fill & Stroke */}
          <polygon
            points={polygonPath}
            fill="#024F28"
            fillOpacity="0.14"
            stroke="#024F28"
            strokeWidth="2.5"
            strokeLinejoin="round"
            className="transition-all duration-300"
          />

          {/* Interactive Data Vertices & Points */}
          {PILLARS.map((pillar, i) => {
            const pt = dataPoints[i];
            const dim = DIMENSIONS[pillar.dimension];
            const isHovered = hoveredPillarId === pillar.id;

            return (
              <g
                key={`point-${pillar.id}`}
                className="cursor-pointer transition-transform"
                onMouseEnter={() => setHoveredPillarId(pillar.id)}
                onMouseLeave={() => setHoveredPillarId(null)}
              >
                {/* Outer halo */}
                {isHovered && (
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="12"
                    fill={dim.hex}
                    fillOpacity="0.2"
                    className="animate-pulse"
                  />
                )}
                {/* Main Node */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 6.5 : 5}
                  fill={dim.hex}
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  className="transition-all"
                />
              </g>
            );
          })}

          {/* Axis Labels outside the chart */}
          {PILLARS.map((pillar, i) => {
            const labelCoord = getCoordinates(i, 100, radius + 32);
            const res = pillarResults[pillar.id];
            const dim = DIMENSIONS[pillar.dimension];
            const isHovered = hoveredPillarId === pillar.id;

            // Alignment based on position relative to center
            let textAnchor: 'middle' | 'start' | 'end' = 'middle';
            if (labelCoord.x > cx + 25) textAnchor = 'start';
            else if (labelCoord.x < cx - 25) textAnchor = 'end';

            return (
              <g
                key={`label-${pillar.id}`}
                className="cursor-pointer select-none"
                onMouseEnter={() => setHoveredPillarId(pillar.id)}
                onMouseLeave={() => setHoveredPillarId(null)}
              >
                <text
                  x={labelCoord.x}
                  y={labelCoord.y - 6}
                  textAnchor={textAnchor}
                  fontSize="12"
                  fontWeight={isHovered ? '700' : '600'}
                  fill={isHovered ? dim.hex : '#191817'}
                  className="font-serif transition-colors"
                >
                  {pillar.name}
                </text>
                <text
                  x={labelCoord.x}
                  y={labelCoord.y + 8}
                  textAnchor={textAnchor}
                  fontSize="10"
                  fontWeight="600"
                  fill={dim.hex}
                  className="font-mono"
                >
                  {res ? `${res.percentage}% (${res.score}/35)` : ''}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip / Detail overlay */}
        {hoveredPillarId && pillarResults[hoveredPillarId] && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-charcoal text-warm-50 px-4 py-2 rounded-xl text-xs shadow-lg pointer-events-none transition-all z-20 flex items-center gap-2 font-sans print:hidden">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{
                backgroundColor:
                  DIMENSIONS[pillarResults[hoveredPillarId].pillar.dimension].hex,
              }}
            />
            <span className="font-semibold">
              {pillarResults[hoveredPillarId].pillar.name}:
            </span>
            <span>
              {pillarResults[hoveredPillarId].score}/35 (
              {pillarResults[hoveredPillarId].percentage}%)
            </span>
            <span className="text-charcoal-light">·</span>
            <span className="italic">
              {pillarResults[hoveredPillarId].band.label}
            </span>
          </div>
        )}
      </div>

      {/* Accessible Table representation for screen readers & quick reference */}
      <div className="sr-only">
        <table>
          <caption>RISE Diagnostic Radar Results</caption>
          <thead>
            <tr>
              <th>Pillar</th>
              <th>Dimension</th>
              <th>Score</th>
              <th>Percentage</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {PILLARS.map((p) => {
              const res = pillarResults[p.id];
              return (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.dimension}</td>
                  <td>{res.score} / 35</td>
                  <td>{res.percentage}%</td>
                  <td>{res.band.label}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
