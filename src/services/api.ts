export async function delay<T>(value: T, timeMs = 180): Promise<T> {
  return await new Promise<T>((resolve) => {
    window.setTimeout(() => resolve(value), timeMs)
  })
}