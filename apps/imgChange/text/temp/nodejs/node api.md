```
fs文件处理
fs.existsSync(path)

__dirname代码所在根目录
process.cwd()执行命令所在目录

fs.readFileSync(path):buffer
fs.writeFileSync(path, buffer);

path兼容性路径处理
path.dirname(path)截取到文件夹部分
path.extname(from) 返回文件扩展名
```

```
fs.readdirSync(path).forEach(folder=>{
	连接
	const filePath=resolve(path,folder)
	const filemeta=fs.statSync(filePath)
	filemeta.isDirectory()
	fs.readFileSync(filePath)
	reg.test(string)
})
```

path.resolve( \[from…\], to )的路径拼接规则：

从后向前拼接路径；
若 to 以 / 开头，不会拼接到前面的路径；
若 to 以 ../ 开头，拼接前面的路径，且不含最后一节路径；
若 to 以 ./ 开头或者没有符号，则拼接前面路径。
