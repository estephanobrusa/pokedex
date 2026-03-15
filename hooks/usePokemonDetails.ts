import { useEffect, useState } from "react";

export interface PokemonStat {
  name: string;
  base: number;
}

export interface PokemonDetail {
  id: number;
  name: string;
  spriteUrl?: string;
  spriteBackUrl?: string;
  types?: string[];
  height?: number;
  weight?: number;
  abilities?: string[];
  baseExperience?: number;
  stats?: PokemonStat[];
}

export interface UsePokemonDetailsResult {
  data: PokemonDetail | null;
  loading: boolean;
  error: string | null;
}

export function usePokemonDetails(
  id: string | number | undefined | null,
): UsePokemonDetailsResult {
  const [data, setData] = useState<PokemonDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // if (!id) {
    //   setData(null);
    //   setLoading(false);
    //   setError("Missing Pokémon id");
    //   return;
    // }

    let isMounted = true;

    const fetchPokemon = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch Pokémon detail: ${response.status}`);
        }

        const detailData = await response.json();

        const pokemonDetail: PokemonDetail = {
          id: detailData.id,
          name: detailData.name,
          spriteUrl: detailData.sprites?.front_default,
          spriteBackUrl: detailData.sprites?.back_default,
          types: Array.isArray(detailData.types)
            ? detailData.types.map(
                (t: { type: { name: string } }) => t.type.name,
              )
            : undefined,
          height:
            typeof detailData.height === "number"
              ? detailData.height
              : undefined,
          weight:
            typeof detailData.weight === "number"
              ? detailData.weight
              : undefined,
          abilities: Array.isArray(detailData.abilities)
            ? detailData.abilities
                .map(
                  (a: { ability?: { name?: string } }) =>
                    a?.ability?.name ?? "",
                )
                .filter((name: string) => name)
                .map(
                  (name: string) =>
                    name.charAt(0).toUpperCase() + name.slice(1),
                )
            : undefined,
          baseExperience:
            typeof detailData.base_experience === "number"
              ? detailData.base_experience
              : undefined,
          stats: Array.isArray(detailData.stats)
            ? detailData.stats
                .map((s: { base_stat?: number; stat?: { name?: string } }) => ({
                  base: typeof s.base_stat === "number" ? s.base_stat : 0,
                  name: s.stat?.name ?? "",
                }))
                .filter((s: PokemonStat) => s.name)
            : undefined,
        };

        if (isMounted) {
          setData(pokemonDetail);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error fetching Pokémon detail:", err);
        if (isMounted) {
          setError("Failed to load Pokémon detail. Please try again.");
          setLoading(false);
        }
      }
    };

    fetchPokemon();

    return () => {
      isMounted = false;
    };
  }, [id]);

  return { data, loading, error };
}
