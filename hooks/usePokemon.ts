import { useCallback, useEffect, useState } from "react";

export interface PokemonListItem {
  name: string;
  url: string;
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
}

interface UsePokemonResult {
  data: PokemonDetail[];
  loading: boolean;
  error: string | null;
  loadMore: () => void;
  hasMore: boolean;
}

const PAGE_LIMIT = 20;

export function usePokemon(): UsePokemonResult {
  const [data, setData] = useState<PokemonDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const fetchPage = useCallback(
    async (currentOffset: number) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/?limit=${PAGE_LIMIT}&offset=${currentOffset}`,
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch Pokémon list: ${response.status}`);
        }

        const data: { results: PokemonListItem[]; next: string | null } =
          await response.json();

        const pokemonDetails = await Promise.all(
          data.results.map(async (item) => {
            const detailResponse = await fetch(item.url);

            if (!detailResponse.ok) {
              throw new Error(
                `Failed to fetch Pokémon detail for ${item.name}: ${detailResponse.status}`,
              );
            }

            const detailData = await detailResponse.json();

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
            };

            return pokemonDetail;
          }),
        );

        setData((prev) =>
          currentOffset === 0 ? pokemonDetails : [...prev, ...pokemonDetails],
        );
        setHasMore(Boolean(data.next));
      } catch (err) {
        console.error("Error fetching Pokémon data:", err);
        setError("Failed to load Pokémon. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    fetchPage(0);
  }, [fetchPage]);

  const loadMore = useCallback(() => {
    if (loading || !hasMore) {
      return;
    }
    const nextOffset = offset + PAGE_LIMIT;
    setOffset(nextOffset);
    fetchPage(nextOffset);
  }, [offset, fetchPage, hasMore, loading]);

  return { data, loading, error, loadMore, hasMore };
}
