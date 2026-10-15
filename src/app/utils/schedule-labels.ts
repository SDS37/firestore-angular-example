export interface NamedDocument {
  $key: string;
  name: string;
}

export function scheduleEntryLabel(
  value: string,
  items: readonly NamedDocument[] | null | undefined
): string {
  const byId = items?.find(item => item.$key === value);
  if (byId) {
    return byId.name;
  }
  const byName = items?.find(item => item.name === value);
  if (byName) {
    return byName.name;
  }
  return 'Deleted';
}
