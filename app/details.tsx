import { usePokemonDetails } from "@/hooks/usePokemonDetails";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { LoadingPokeball } from "./components/LoadingPokeball";
import { StatsChart } from "./components/StatsChart";

function getTypeColor(type?: string): string {
  switch (type) {
    case "fire":
      return "#f97316";
    case "water":
      return "#3b82f6";
    case "grass":
      return "#22c55e";
    case "electric":
      return "#eab308";
    case "bug":
      return "#84cc16";
    case "normal":
      return "#a8a29e";
    case "poison":
      return "#a855f7";
    case "ground":
      return "#ca8a04";
    case "fairy":
      return "#f9a8d4";
    case "fighting":
      return "#f97373";
    case "psychic":
      return "#ec4899";
    case "rock":
      return "#a16207";
    case "ghost":
      return "#6366f1";
    case "ice":
      return "#7dd3fc";
    case "dragon":
      return "#4f46e5";
    case "steel":
      return "#9ca3af";
    default:
      return "#9ca3af";
  }
}

export default function PokemonDetailsScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  console.log("🚀 ~ PokemonDetailsScreen ~ id?:", params.id);

  const { data: pokemon, loading, error } = usePokemonDetails(params.id);

  const formattedName = pokemon?.name
    ? pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)
    : "Details";

  if (loading) {
    return (
      <>
        <Stack.Screen options={{ title: "Loading" }} />
        <View style={styles.centeredContainer}>
          <LoadingPokeball loading={loading} />
          <Text style={styles.message}>Loading Pokémon...</Text>
        </View>
      </>
    );
  }

  if (error || !pokemon) {
    return (
      <>
        <Stack.Screen options={{ title: "Details" }} />
        <View style={styles.container}>
          <Text style={styles.title}>Could not load Pokémon</Text>
          {error && <Text style={styles.message}>{error}</Text>}
          <Link href="/" style={styles.link}>
            <Text style={styles.linkText}>Back to list</Text>
          </Link>
        </View>
      </>
    );
  }

  const primaryType = pokemon.types && pokemon.types.length > 0
    ? pokemon.types[0]
    : undefined;
  const backgroundColor = getTypeColor(primaryType);

  return (
    <>
      <Stack.Screen options={{ title: formattedName }} />
      <View style={[styles.screen, { backgroundColor }]}>
        <ScrollView contentContainerStyle={styles.scrollContentContainer}>
          <View style={styles.card}>
            <View style={styles.headerSection}>
              {pokemon.spriteUrl && (
                <View style={styles.imageWrapper}>
                  <Image
                    source={{ uri: pokemon.spriteUrl }}
                    style={styles.mainSprite}
                    resizeMode="contain"
                  />
                </View>
              )}
              <Text style={styles.title}>{formattedName}</Text>
              <Text style={styles.subtitle}>
                #{String(pokemon.id).padStart(3, "0")}
              </Text>
            </View>

            {pokemon.types && pokemon.types.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Types</Text>
                <View style={styles.chipsRow}>
                  {pokemon.types.map((type) => (
                    <View key={type} style={styles.typeChip}>
                      <Text style={styles.typeChipText}>{type}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {(typeof pokemon.height === "number" ||
              typeof pokemon.weight === "number" ||
              typeof pokemon.baseExperience === "number") && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Basic Info</Text>
                <View style={styles.infoRow}>
                  {typeof pokemon.height === "number" && (
                    <Text style={styles.infoText}>Height: {pokemon.height}</Text>
                  )}
                  {typeof pokemon.weight === "number" && (
                    <Text style={styles.infoText}>Weight: {pokemon.weight}</Text>
                  )}
                  {typeof pokemon.baseExperience === "number" && (
                    <Text style={styles.infoText}>
                      Base Experience: {pokemon.baseExperience}
                    </Text>
                  )}
                </View>
              </View>
            )}

            {pokemon.abilities && pokemon.abilities.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Abilities</Text>
                {pokemon.abilities.map((ability) => (
                  <Text key={ability} style={styles.infoText}>
                    
 {ability}
                  </Text>
                ))}
              </View>
            )}

            {pokemon.stats && pokemon.stats.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Stats</Text>
                <StatsChart stats={pokemon.stats} primaryColor={backgroundColor} />
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 24,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    gap: 12,
  },
  centeredContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 24,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  scrollContentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    gap: 20,
  },
  headerSection: {
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
    color: "#111827",
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    color: "#111827",
  },
  message: {
    fontSize: 16,
  },
  section: {
    paddingTop: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
    color: "#111827",
  },
  link: {
    marginTop: 16,
  },
  linkText: {
    fontSize: 16,
    color: "#1d4ed8",
  },
  imageWrapper: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  mainSprite: {
    width: 150,
    height: 150,
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  typeChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "#e5e7eb",
  },
  typeChipText: {
    fontSize: 14,
    textTransform: "capitalize",
  },
  infoRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  infoText: {
    fontSize: 14,
    color: "#111827",
  },
  card: {
    width: "100%",
    maxWidth: 480,
    alignSelf: "center",
    backgroundColor: "rgba(249, 250, 251, 0.96)",
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 24,
    shadowColor: "#000000",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
});
