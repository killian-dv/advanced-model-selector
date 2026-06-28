import type { Model } from "@/lib/models";

export function filterModels(models: Model[], query: string): Model[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return models;
  }

  return models.filter(
    (model) =>
      model.name.toLowerCase().includes(normalized) ||
      model.provider.toLowerCase().includes(normalized)
  );
}
