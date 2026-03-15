import { Text } from "@react-navigation/elements";
import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";
import { PokeballSvg } from "./PokeballSvg";

interface LoadingPokeballProps {
  loading: boolean;
}

export function LoadingPokeball({ loading }: LoadingPokeballProps) {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let animation: Animated.CompositeAnimation | undefined;

    if (loading) {
      rotation.setValue(0);
      animation = Animated.loop(
        Animated.timing(rotation, {
          toValue: 1,
          duration: 1200,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      );
      animation.start();
    } else {
      rotation.stopAnimation(() => {
        rotation.setValue(0);
      });
    }

    return () => {
      if (animation) {
        animation.stop();
      }
    };
  }, [loading, rotation]);

  if (!loading) {
    return null;
  }

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.loadingContainer}>
      <Animated.View
        style={[styles.loadingImage, { transform: [{ rotate: spin }] }]}
      >
        <PokeballSvg size={80} />
      </Animated.View>
      <Text style={styles.loadingText}>Loading Pokémon...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    paddingVertical: 32,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingImage: {
    width: 96,
    height: 96,
    marginBottom: 12,
  },
  loadingText: {
    fontSize: 16,
  },
});
