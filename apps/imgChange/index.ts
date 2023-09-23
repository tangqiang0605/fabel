import { isExistRemote } from "@fabel/utils"
import { FabelVistor, traverse } from "@fabel/traverse"
import path from "node:path"
import fs from "node:fs"

let fileCounter = 0
const dirPath = path.resolve(__dirname, "text")
const vistor: FabelVistor = {
  md: async (file) => {
    const { text, pathName } = file
    let result = text
    const matchResult = text.match(/!\[\[[\w\s.]+\]\]/g) || []
    for (let i = 0; i < matchResult.length; i++) {
      const old = matchResult[i]

      let newStr = ""
      try {
        newStr = await getGhImg(old)
        result = result.replace(old, newStr)
      } catch (err) {
        continue
      }
    }

    const matchLink = text.match(/[^!]\[\[[\s\w.\u4e00-\u9fa5|]+\]\]/g) || []
    for (const link of matchLink) {
      // console.log(link)
      let newStr = ""
      try {
        newStr = await getGhArticle(link)
        console.log(newStr)
        result = result.replace(link, newStr)
      } catch (err) {
        continue
      }
    }

    const outputDir = path.resolve("dist")
    const output = path.resolve(outputDir, path.relative(dirPath, pathName))

    const directory = path.dirname(output)
    const dirs = directory.split(path.sep)
    if (!dirs.includes("temp")) {
      // try {
      //   fs.accessSync(directory)
      // } catch (err) {
      //   fs.mkdirSync(directory, { recursive: true })
      // }
      // fs.writeFileSync(output, result)
      fileCounter++
    }
  },
}
traverse(dirPath, vistor).then((res) => {
  console.log(fileCounter)
})

async function getGhArticle(str: string) {
  const textStart = str.indexOf("|")
  let prefix = ""
  let suffix = ""
  if (textStart > -1) {
    suffix = str.slice(textStart + 1, str.length - 2)
    prefix = str.slice(3, textStart)
  } else {
    suffix = str.slice(3, str.length - 2)
    prefix = suffix
  }
  // console.log(text)
  return `![${suffix}](${encodeURI(
    `https://github.com/tangqiang0605/tqit-notes/blob/main/x7%E5%90%8E%E5%8F%B0/${prefix}.md`,
  )})`
}
//github.com/tangqiang0605/tqit-notes/blob/main/x7%E5%90%8E%E5%8F%B0/express%E5%92%8Ckoa.md
//github.com/tangqiang0605/tqit-notes/blob/main/x7%E5%90%8E%E5%8F%B0/express%E5%92%8Ckoa.md
async function getGhImg(picName: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const fileName = picName.slice(3, picName.length - 2)
    const { baseURL, user, repo, branch, localPath } = {
      baseURL: "https://raw.githubusercontent.com",
      user: "tangqiang0605",
      repo: "tqit-notes",
      branch: "main",
      localPath: "static",
    }
    const uri = encodeURI(`${baseURL}/${user}/${repo}/${branch}/${localPath}/${fileName}`)
    isExistRemote(uri)
      .then((res) => {
        if (res) {
          resolve(`![${fileName}](${uri})`)
        } else {
          reject("图片不存在")
        }
      })
      .catch((err) => reject(err))
  })
}
