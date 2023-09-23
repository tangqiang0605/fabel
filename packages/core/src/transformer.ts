import fs from "node:fs"
import { throwErr, handleErr } from "@fabel/utils"
import { TraverserConfig } from "./config"

export type FabelTransformer = Function
/**
 * 生成transformer函数
 * @param getOld
 * @param getNew
 * @param report
 * @param config
 * @returns
 */
export function genTransformer(
  getOld: Function,
  getNew: Function,
  // report?: { data: any },
  // config: TraverserConfig,
) {
  /**
   * 输入文件并转换
   * @param {*} filePath
   * @returns
   */
  // const { report } = config
  async function transformer(filePath: string) {
    // TODO 判断后缀是否符合配置
    let text = fs.readFileSync(filePath, "utf-8")
    // TODO 读取到匹配文件的回调
    // report.data.readFileCounter++;
    let matchResult = null
    try {
      // 匹配到的回调
      // TODO
      matchResult = await getOld(text, throwErr)
    } catch (e) {
      // 匹配不到的回调
      // TODO
      handleErr(e as Error)
      return
    }
    if (matchResult) {
      for (let i = 0; i < matchResult.length; i++) {
        const old = matchResult[i]
        let newStr = ""
        try {
          newStr = await getNew(old, throwErr)
          // TODO 支持正则匹配
          text = text.replace(old, newStr)
          // TODO
          // report.data.transformCounter++
        } catch (e) {
          // TODO
          handleErr(e as Error)
        }
      }
      fs.writeFileSync(filePath, text)
      // report.data.writeFileCounter++
    }
    // return report.data
  }
  return transformer
}
