import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

interface Stat {
  name: string;
  base: number;
}

interface StatsChartProps {
  stats: Stat[];
  primaryColor?: string;
}

const MAX_STAT = 255;

const STAT_LABELS: Record<string, string> = {
  hp: "HP",
  attack: "ATK",
  defense: "DEF",
  "special-attack": "Sp.ATK",
  "special-defense": "Sp.DEF",
  speed: "SPD",
};

const STAT_COLORS: Record<string, string> = {
  hp: "#4ade80",
  attack: "#f97316",
  defense: "#60a5fa",
  "special-attack": "#c084fc",
  "special-defense": "#93c5fd",
  speed: "#fbbf24",
};

function getStatLabel(name: string): string {
  return STAT_LABELS[name] ?? name.toUpperCase().slice(0, 6);
}

function getStatColor(name: string, primaryColor?: string): string {
  if (primaryColor) return primaryColor;
  return STAT_COLORS[name] ?? "#9ca3af";
}

interface AnimatedBarProps {
  stat: Stat;
  primaryColor?: string;
  index: number;
}

function AnimatedBar({ stat, primaryColor, index }: AnimatedBarProps) {
  const animValue = useRef(new Animated.Value(0)).current;
  const percentage = Math.min(stat.base / MAX_STAT, 1);
  const barColor = getStatColor(stat.name, primaryColor);

  useEffect(() => {
    Animated.timing(animValue, {
      toValue: percentage,
      duration: 600,
      delay: index * 80,
      useNativeDriver: false,
    }).start();
  }, [animValue, percentage, index]);

  const widthInterpolated = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", `${percentage * 100}%`],
  });

  return (
    <View style={styles.statRow}>
      <View style={styles.labelContainer}>
        <Text style={styles.statLabel}>{getStatLabel(stat.name)}</Text>
      </View>
      <Text style={styles.statValue}>{stat.base}</Text>
      <View style={styles.trackContainer}>
        <View style={styles.track}>
          <Animated.View
            style={[
              styles.fill,
              {
                width: widthInterpolated,
                backgroundColor: barColor,
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
}

export function StatsChart({ stats, primaryColor }: StatsChartProps) {
  if (!stats || stats.length === 0) return null;

  return (
    <View style={styles.container}>
      {stats.map((stat, index) => (
        <AnimatedBar
          key={stat.name}
          stat={stat}
          primaryColor={primaryColor}
          index={index}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  labelContainer: {
    width: 58,
    alignItems: "flex-end",
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  statValue: {
    width: 30,
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
    textAlign: "right",
  },
  trackContainer: {
    flex: 1,
  },
  track: {
    height: 10,
    backgroundColor: "#e5e7eb",
    borderRadius: 999,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 999,
    opacity: 0.85,
  },
});
