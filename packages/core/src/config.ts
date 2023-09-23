export type TraverserConfig = {
  entry: string
  output: string
  // report: object
  // a: number
}

const traverserConfig: TraverserConfig = {
  entry: ".",
  output: "./output",
  // report: {},
}

export function getTraverserConfig() {
  return traverserConfig
}
export function setTraverserConfig(config: TraverserConfig) {
  // traverserConfig = config
  const keys = Reflect.ownKeys(config) as any
  for (const key of keys) {
    if (Reflect.has(traverserConfig, key)) {
      Reflect.set(traverserConfig, key, config[key as keyof TraverserConfig])
      // traverserConfig[key as keyof typeof traverserConfig] =
      // config[key as keyof TraverserConfig]
    } else {
      // TODO
      // throw new TypeError("TraverserConfig has not a property named" + String(key))
    }
  }
}
export function getReport() {
  return traverserConfig.report
}
