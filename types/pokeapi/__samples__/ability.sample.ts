import type { Ability } from '../ability';

// Dev-only sanity check: a minimal Ability-typed object
// This file is not imported by app code and exists only
// to help TypeScript validate the Ability interface.

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const sampleAbility: Ability = {
  id: 65,
  name: 'overgrow',
  is_main_series: true,
  generation: {
    name: 'generation-iii',
    url: 'https://pokeapi.co/api/v2/generation/3/',
  },
  names: [],
  effect_entries: [],
  effect_changes: [],
  flavor_text_entries: [],
  pokemon: [],
};
