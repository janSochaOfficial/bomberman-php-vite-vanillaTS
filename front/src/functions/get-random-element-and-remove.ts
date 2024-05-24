export function getRandomElementAndRemove<T>(array: T[]): T | undefined {
  if (array.length === 0) {
    return undefined;
  }
  const randomIndex = Math.floor(Math.random() * array.length);
  const [removedElement] = array.splice(randomIndex, 1);
  return removedElement;
}
