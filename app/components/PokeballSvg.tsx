import React from "react";
import Svg, { Circle, Path, Rect } from "react-native-svg";

export interface PokeballSvgProps {
  size?: number;
}

export function PokeballSvg({ size = 80 }: PokeballSvgProps) {
  const radius = 50;
  const center = 50;

  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      {/* Outer border */}
      <Circle cx={center} cy={center} r={radius} fill="#FFFFFF" stroke="#000000" strokeWidth={4} />

      {/* Top half - red */}
      <Path d="M50 4 A46 46 0 0 1 96 50 H4 A46 46 0 0 1 50 4 Z" fill="#EE1515" />

      {/* Bottom half - white */}
      <Path d="M4 50 H96 A46 46 0 0 1 50 96 A46 46 0 0 1 4 50 Z" fill="#FFFFFF" />

      {/* Middle band */}
      <Rect x={4} y={44} width={92} height={12} fill="#000000" />

      {/* Center circle outer */}
      <Circle cx={center} cy={center} r={12} fill="#FFFFFF" stroke="#000000" strokeWidth={4} />

      {/* Center circle inner */}
      <Circle cx={center} cy={center} r={6} fill="#FFFFFF" />
    </Svg>
  );
}
