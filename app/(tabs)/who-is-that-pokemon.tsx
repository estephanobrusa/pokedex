import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

interface PokemonSprites {
  other: {
    "official-artwork": {
      front_default: string | null;
    };
  };
}

interface WhoIsThatPokemon {
  id: number;
  name: string;
  sprites: PokemonSprites;
}

const MIN_ID = 1;
const MAX_ID = 151;

function randomPokemonId(): number {
  return Math.floor(Math.random() * (MAX_ID - MIN_ID + 1)) + MIN_ID;
}

export default function WhoIsThatPokemonScreen() {
  const [pokemon, setPokemon] = useState<WhoIsThatPokemon | null>(null);
  const [hasText, setHasText] = useState<boolean>(false);
  const [revealed, setRevealed] = useState<boolean>(false);
  const [resultMessage, setResultMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const inputRef = useRef<TextInput>(null);
  const inputValueRef = useRef<string>("");

  const fetchRandomPokemon = useCallback(async () => {
    setLoading(true);
    setPokemon(null);
    inputRef.current?.clear();
    inputValueRef.current = "";
    setHasText(false);
    setRevealed(false);
    setResultMessage("");

    const id = randomPokemonId();

    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch Pokémon: ${response.status}`);
      }

      const data: WhoIsThatPokemon = await response.json();
      setPokemon(data);
    } catch (err) {
      console.error("Error fetching Pokémon:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRandomPokemon();
  }, [fetchRandomPokemon]);

  const handleSubmit = useCallback(() => {
    if (!pokemon) return;

    const correct =
      inputValueRef.current.toLowerCase().trim() === pokemon.name.toLowerCase();

    setRevealed(true);
    inputRef.current?.clear();
    inputValueRef.current = "";
    setHasText(false);

    if (correct) {
      setResultMessage("Correct! 🎉");
    } else {
      const formattedName =
        pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
      setResultMessage(`Wrong! The Pokémon was ${formattedName}`);
    }
  }, [pokemon]);

  const imageUri =
    pokemon?.sprites.other["official-artwork"].front_default ?? null;

  const canSubmit =
    hasText && !revealed && pokemon !== null;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
      <Text style={styles.title}>Who is That Pokémon?</Text>

      <View style={styles.imageContainer}>
        {loading && <ActivityIndicator size="large" color="#e53e3e" />}

        {!loading && imageUri && (
          <View style={styles.pokemonImageWrapper}>
            {/* Silhouette layer — always rendered, hidden when revealed */}
            <Image
              source={{ uri: imageUri }}
              style={[
                styles.pokemonImage,
                styles.silhouette,
                { opacity: revealed ? 0 : 1 },
              ]}
              resizeMode="contain"
            />
            {/* Full-color layer — always rendered, hidden until revealed */}
            <Image
              source={{ uri: imageUri }}
              style={[
                styles.pokemonImage,
                styles.pokemonImageColor,
                { opacity: revealed ? 1 : 0 },
              ]}
              resizeMode="contain"
            />
          </View>
        )}

        {!loading && !imageUri && pokemon !== null && (
          <Text style={styles.noImageText}>No image available</Text>
        )}
      </View>

      <TextInput
        ref={inputRef}
        style={styles.input}
        defaultValue=""
        onChangeText={(text) => {
          inputValueRef.current = text;
          setHasText(text.trim().length > 0);
        }}
        placeholder="Type Pokémon name..."
        placeholderTextColor="#9ca3af"
        autoCapitalize="none"
        autoCorrect={false}
        editable={!revealed && !loading}
        onSubmitEditing={canSubmit ? handleSubmit : undefined}
        returnKeyType="done"
      />

      <Pressable
        style={[
          styles.button,
          styles.submitButton,
          !canSubmit && styles.buttonDisabled,
        ]}
        onPress={handleSubmit}
        disabled={!canSubmit}
      >
        <Text
          style={[styles.buttonText, !canSubmit && styles.buttonTextDisabled]}
        >
          Submit
        </Text>
      </Pressable>

      {resultMessage.length > 0 && (
        <Text
          style={[
            styles.resultMessage,
            resultMessage.startsWith("Correct") ? styles.correct : styles.wrong,
          ]}
        >
          {resultMessage}
        </Text>
      )}

      {revealed && (
        <Pressable
          style={[styles.button, styles.nextButton]}
          onPress={fetchRandomPokemon}
        >
          <Text style={styles.buttonText}>Next Pokémon</Text>
        </Pressable>
      )}
    </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 32,
    gap: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
  },
  imageContainer: {
    width: 200,
    height: 200,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 16,
  },
  pokemonImage: {
    width: 200,
    height: 200,
    borderRadius: 16,
  },
  pokemonImageWrapper: {
    width: 200,
    height: 200,
    position: "relative",
  },
  pokemonImageColor: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 200,
    height: 200,
    borderRadius: 16,
  },
  silhouette: {
    tintColor: "black",
  },
  noImageText: {
    fontSize: 14,
    color: "#6b7280",
  },
  input: {
    width: "100%",
    maxWidth: 320,
    borderWidth: 1.5,
    borderColor: "#d1d5db",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    color: "#111827",
    backgroundColor: "#ffffff",
  },
  button: {
    width: "100%",
    maxWidth: 320,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButton: {
    backgroundColor: "#e53e3e",
  },
  nextButton: {
    backgroundColor: "#2563eb",
  },
  buttonDisabled: {
    backgroundColor: "#e5e7eb",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
  buttonTextDisabled: {
    color: "#9ca3af",
  },
  resultMessage: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  correct: {
    color: "#16a34a",
  },
  wrong: {
    color: "#dc2626",
  },
});
