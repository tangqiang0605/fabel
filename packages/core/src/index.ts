import fs from "node:fs"
import path from "node:path"
// import https from 'node:https'
// import url from 'url'
import { throwErr, isFunction } from "@fabel/utils"
/**
 * 遍历文件并执行transer
 * @param {*} transformer
 * @param {*} dirPath
 * @returns transer返回的结果report
 */
export function traverser(transformer: Function, dirPath: string) {
  // TODO 支持transformer数组，方便一次遍历，而不是调用多次traverse去遍历
  let report = null
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

// todo 抽取report
/**
 *
 * @param {*} getOld
 * @param {*} getNew
 * @returns
 */
// const report = {
//   readFileCounter: 0,
//   transformCounter: 0,
//   writeFileCounter: 0,
//   notUploaded: 0,
// }

export function genTransformer(
  getOld: Function,
  getNew: Function,
  report: { data: any },
  config: object,
) {
  /**
   * 输入文件并转换
   * @param {*} filePath
   * @returns
   */
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
          report.data.transformCounter++
        } catch (e) {
          // TODO
          handleErr(e as Error)
        }
      }
      fs.writeFileSync(filePath, text)
      report.data.writeFileCounter++
    }
    return report.data
  }
  return transformer
}

function handleErr(error: Error, cb?: Function) {
  if (error.name == "GetNewStrError") {
    // continue;
    // report.notUploaded++
    cb && isFunction(cb) && cb()
    // todo,调用report的自定义函数更新report的数据
  } else {
    throw error
  }
}
