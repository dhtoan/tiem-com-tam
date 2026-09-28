export type EndingId =
  | "perfect"
  | "family"
  | "jd"
  | "neighborhood"
  | "husband-finance"
  | "comeback";

export interface EndingDefinition {
  id: EndingId;
  title: string;
  subtitle: string;
  description: string;
  silhouette: string;
  endlessModifierDescription: string;
}
