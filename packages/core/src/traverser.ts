import fs from "node:fs"
import path from "node:path"
import { TraverserConfig } from "./config"
import { FabelTransformer } from "./transformer"
/**
 * 遍历文件并执行transer
 * @param {*} transformer
 * @param {*} dirPath
 * @returns transer返回的结果report
 */
export function traverser(transformer: FabelTransformer, config: TraverserConfig) {
  // TODO 支持transformer数组，方便一次遍历，而不是调用多次traverse去遍历
  let report = null
  const { entry: dirPath, output } = config
  const readResult = fs.readdirSync(dirPath)
  for (const file of readResult) {
    const pathName = path.resolve(dirPath, file)
    if (fs.lstatSync(pathName).isFile()) {
      // 任意一个transformer返回的都是同一个promise对象，所以只需要赋值一次
      if (!report) {
        report = transformer(pathName)
      } else {
        transformer(pathName)
      }
    } else {
      traverser(transformer, pathName)
    }
  }
  return report
}
