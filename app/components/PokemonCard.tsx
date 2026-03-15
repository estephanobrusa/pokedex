import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

export interface PokemonDetailCardProps {
  id: number;
  name: string;
  spriteFrontUrl?: string;
  spriteBackUrl?: string;
  types?: string[];
  height?: number;
  weight?: number;
  abilities?: string[];
}

const DEFAULT_TYPE_COLOR = "#f2f2f2";

const TYPE_COLORS: Record<string, string> = {
  normal: "#A0A29F",
  fire: "#F57D31",
  water: "#6493EB",
  electric: "#F9CF30",
  grass: "#74CB48",
  ice: "#9AD6DF",
  fighting: "#C12239",
  poison: "#A43E9E",
  ground: "#DEC16B",
  flying: "#A891EC",
  psychic: "#FB5584",
  bug: "#A7B723",
  rock: "#B69E31",
  ghost: "#70559B",
  dragon: "#7037FF",
  dark: "#75574C",
  steel: "#B7B9D0",
  fairy: "#E69EAC",
};

export default function PokemonCard({
  id,
  name,
  spriteFrontUrl,
  spriteBackUrl,
  types,
  height,
  weight,
  abilities,
}: PokemonDetailCardProps) {
  const primaryType = types?.[0]?.toLowerCase();
  const backgroundColor =
    (primaryType && TYPE_COLORS[primaryType] + 50) || DEFAULT_TYPE_COLOR;

  const formattedId = `#${String(id).padStart(3, "0")}`;

  return (
    <View style={[styles.card, { backgroundColor }]}>
      <View style={styles.headerRow}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.id}>{formattedId}</Text>
      </View>

      <View style={styles.imagesRow}>
        {spriteFrontUrl && (
          <Image
            source={{ uri: spriteFrontUrl }}
            style={styles.sprite}
            resizeMode="contain"
          />
        )}
        {spriteBackUrl && spriteBackUrl !== spriteFrontUrl && (
          <Image
            source={{ uri: spriteBackUrl }}
            style={[styles.sprite, styles.spriteBack]}
            resizeMode="contain"
          />
        )}
      </View>

      {types && types.length > 0 && (
        <View style={styles.typesRow}>
          {types.map((type) => (
            <View key={type} style={styles.typeBadge}>
              <Text style={styles.typeText}>{type}</Text>
            </View>
          ))}
        </View>
      )}

      {(typeof height === "number" || typeof weight === "number") && (
        <View style={styles.metricsRow}>
          {typeof height === "number" && (
            <Text style={styles.metricText}>Height: {height}</Text>
          )}
          {typeof weight === "number" && (
            <Text style={styles.metricText}>Weight: {weight}</Text>
          )}
        </View>
      )}

      {abilities && abilities.length > 0 && (
        <View style={styles.abilitiesRow}>
          <Text style={styles.abilitiesLabel}>Abilities:</Text>
          <Text style={styles.abilitiesText}>
            {abilities.slice(0, 3).join(", ")}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
    width: "100%",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: "600",
    textTransform: "capitalize",
    color: "#ffffff",
  },
  id: {
    fontSize: 16,
    fontWeight: "500",
    color: "#ffffff",
    opacity: 0.85,
  },
  imagesRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  sprite: {
    width: 80,
    height: 80,
    maxWidth: "100%",
  },
  spriteBack: {
    marginLeft: 8,
  },
  typesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  typeBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  typeText: {
    color: "#ffffff",
    fontSize: 12,
    textTransform: "capitalize",
    fontWeight: "500",
  },
  metricsRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 12,
    marginTop: 8,
  },
  metricText: {
    color: "#ffffff",
    fontSize: 12,
    opacity: 0.9,
  },
  abilitiesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginTop: 6,
  },
  abilitiesLabel: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "500",
    marginRight: 4,
  },
  abilitiesText: {
    color: "#ffffff",
    fontSize: 12,
    flexShrink: 1,
  },
});
