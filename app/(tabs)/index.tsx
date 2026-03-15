import { Text } from "@react-navigation/elements";
import { Link } from "expo-router";
import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { usePokemon } from "../../hooks/usePokemon";
import { LoadingPokeball } from "../components/LoadingPokeball";
import PokemonCard from "../components/PokemonCard";

export default function Index() {
  const { data: pokemons, loading, error, loadMore, hasMore } = usePokemon();

  return (
    <FlatList
      contentContainerStyle={styles.listContentContainer}
      data={pokemons}
      keyExtractor={(item) => String(item.id)}
      numColumns={1}
      renderItem={({ item }) => (
        <View
          style={[styles.cardItem, { width: "100%", paddingHorizontal: 8 }]}
        >
          <Link
            href={{
              pathname: "/details",
              params: { id: String(item.id) },
            }}
            style={styles.cardLink}
          >
            <PokemonCard
              id={item.id}
              name={item.name}
              spriteFrontUrl={item.spriteUrl}
              spriteBackUrl={item.spriteBackUrl}
              types={item.types}
              height={item.height}
              weight={item.weight}
              abilities={item.abilities}
            />
          </Link>
        </View>
      )}
      ListHeaderComponent={
        <>
          <LoadingPokeball
            loading={loading && (!pokemons || pokemons.length === 0)}
          />
          {error && (
            <View style={styles.errorContainer}>
              <Text>{error}</Text>
            </View>
          )}
        </>
      }
      ListFooterComponent={
        loading && pokemons && pokemons.length > 0 ? (
          <LoadingPokeball loading={true} />
        ) : null
      }
      onEndReached={() => {
        if (hasMore && !loading) {
          loadMore();
        }
      }}
      onEndReachedThreshold={0.5}
      ListEmptyComponent={
        !loading && !error ? (
          <View style={styles.emptyContainer}>
            <Text>No Pokémon found.</Text>
          </View>
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  listContentContainer: {
    paddingVertical: 16,
  },
  errorContainer: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  cardLink: {
    paddingVertical: 8,
  },
  cardItem: {
    width: "100%",
  },
  columnWrapper: {
    justifyContent: "center",
  },
  emptyContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  listContainer: {
    flexDirection: "column",
  },
  listContainerTablet: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  outerContainer: {
    alignItems: "center",
    paddingHorizontal: 16,
  },
  contentWrapper: {
    width: "100%",
    maxWidth: 960,
  },
});
