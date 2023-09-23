import fs from "node:fs"
import path from "node:path"

interface FabelFile {
  pathName: string
  suffix: string
  fileName: string
  text: string
}
export interface FabelVistor {
  [propname: string]: (file: FabelFile) => any
}

export async function traverse(dirPath: string, vistor: FabelVistor) {
  const readResult = fs.readdirSync(dirPath)
  for (const fileName of readResult) {
    const pathName = path.resolve(dirPath, fileName)
    const suffix = path.extname(fileName).slice(1)
    if (fs.lstatSync(pathName).isFile()) {
      if (Reflect.has(vistor, suffix)) {
        await Reflect.get(
          vistor,
          suffix,
        )({ pathName, suffix, fileName, text: fs.readFileSync(pathName, "utf-8") })
      }
    } else {
      if (Reflect.has(vistor, "DIR")) {
        await Reflect.get(vistor, "DIR")({ pathName, suffix, fileName, text: "" })
      }
      await traverse(pathName, vistor)
    }
  }
}
