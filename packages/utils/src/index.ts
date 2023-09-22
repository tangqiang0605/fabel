// import fs from 'node:fs'
// import path from 'node:path'
import https from "node:https"
import url from "url"

/**
 * 工具类，当替换内容函数抛出该异常时，表示不需要转换。
 */
class GetNewStrError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "GetNewStrError"
  }
}
/**
 * 抛出 GetNewStrError 以取消本次匹配或替换操作
 * @param mes
 */
export function throwErr(mes: string) {
  throw new GetNewStrError(mes)
}

export const isFunction = (param: any): param is Function => {
  return (
    typeof param === "function" &&
    typeof param.nodeType !== "number" &&
    typeof param.item !== "function"
  )
}

/**
 * 判断图片是否存在云端
 * @param {*} requestUrl
 * @returns
 */
export function isExistRemote(requestUrl: string) {
  return new Promise((resolve, reject) => {
    // 解析URL
    const uri = new url.URL(requestUrl)

    // HTTPS请求选项
    const options = {
      hostname: uri.hostname,
      path: uri.pathname + uri.search,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      rejectUnauthorized: false,
    }

    // 发送HTTPS请求
    const req = https.request(options, (res) => {
      // 获取响应头中的Content-Type字段
      const contentType = res.headers["content-type"]
      resolve(contentType?.includes("image"))
    })

    // 处理请求错误
    req.on("error", (error) => {
      reject(error)
    })

    // 发送请求
    req.end()
  })
}
