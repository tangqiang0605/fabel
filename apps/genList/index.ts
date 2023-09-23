import { FabelVistor, traverse } from "@fabel/traverse"
import path from "node:path"
import fs from "node:fs"
const entry = path.resolve("..", "..", "..", "..", "tqit-notes")
let text = ""
let count = 0
const vistor: FabelVistor = {
  md: (file) => {
    const directory = path.relative(entry, file.pathName)
    const dirs = directory.split(path.sep)
    // if(dirs)
    for (const ignore of ["temp", ".git"]) if (dirs.includes(ignore)) return
    let line = ""
    // for(dirs )
    dirs.reduce(() => (line += "\t"))
    line += path.basename(file.pathName).slice(0, -3)
    text = text + "\n" + line
    // console.log(file.pathName)
    count++
    // text+=`\n`
  },
  DIR: (file) => {
    // console.log(file.pathName)
    const directory = path.relative(entry, file.pathName)
    const dirs = directory.split(path.sep)
    for (const ignore of ["temp", ".git", ".obsidian", ".scripts", ".trash", "static"])
      if (dirs.includes(ignore)) return
    let line = ""
    for (let i = 0; i < dirs.length; i++) {
      if (i == dirs.length - 1) {
        line += dirs[i]
      } else {
        line += "\t"
      }
    }
    text = text + "\n" + line
  },
}
traverse(entry, vistor).then((resul) => {
  console.log(count)
  fs.writeFileSync("result.txt", text.trim())
})
