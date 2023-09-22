express：

```
npm init -y
npm i express

app=express()
// 中间件
express.json() 解析req.body
express.Router()
app.use(中间件)
// 实例方法
app.listen(port,callback)
app.get(path,routeCallBack)
app.post(path,routeCallBack)
app.delete(path,routeCallBack)
app.put(path,routeCallBack)
// req方法
res.send()
res.status()
res.params()
// route
在文件routes/index导出注册方法：
(app)=>app.use(prepath,route)
在app.js中引入：
import routes from './routes'
routes(app)
```

koa：

```
npm i koa koa-router koa-bodyparser koa-json-error

app=new Koa()
app.use(ccb)
app.listen()
// koa的中间件就是一个函数
middleware:(ctx,next)=>{}
// ctx
ctx.throw(403)
ctx.body
ctx.params
ctx.url
ctx.method
ctx.query
ctx.set(响应头)
ctx.request.body 请求体(客户端post时)

// 路由
router=new Router(prefix)
app.use(router.routes())
app.use(router.allowedMethods()) 响应option
全局
app.use(auth)
app.use(path,auth,mid)
```
