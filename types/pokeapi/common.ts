export type LanguageCode =
  | 'en'
  | 'ja'
  | 'ja-Hrkt'
  | 'ko'
  | 'zh-Hant'
  | 'fr'
  | 'de'
  | 'es'
  | 'it'
  | 'nl'
  | 'pt-BR'
  | 'ru'
  | 'zh-Hans';

export interface NamedAPIResource {
  name: string;
  url: string;
}

export interface NamedAPIResourceList<TResource extends NamedAPIResource = NamedAPIResource> {
  count: number;
  next: string | null;
  previous: string | null;
  results: TResource[];
}

export interface Name {
  name: string;
  language: NamedAPIResource & { name: LanguageCode };
}

export interface VerboseEffect {
  effect: string;
  short_effect: string;
  language: NamedAPIResource & { name: LanguageCode };
}

export interface EffectEntry {
  effect: string;
  language: NamedAPIResource & { name: LanguageCode };
}
