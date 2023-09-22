# nodejs服务器

## 模块

![image-20221031123011376](D:\tplmydata\tplmydoc\文档图片\image-20221031123011376.png)

![image-20221031122825523](D:\tplmydata\tplmydoc\文档图片\image-20221031122825523.png)

![image-20221031122910338](D:\tplmydata\tplmydoc\文档图片\image-20221031122910338.png)

removeAllListeners

## 原生

querystring已被遗弃，使用querystringify

### 一、认识nodejs

nodejs的作用：js运行时，读写文件，链接数据库，充当web服务器

下载nodejs，node -v

node test.js

### 二、http请求

dns解析域名，建立tcp三次握手连接，发起http请求。network》headers》general》remote address、request headers

服务器处理请求，返回数据。network》headers（response headers）、response

客户端处理数据，渲染页面。

### 三、处理请求

get请求（客户端获取服务端数据）

```js
const http=require('http');
const url=require('url');

const server=http.createServer((req,res)=>{
    const method=req.method;
    const myUrl=req.url;
    const path=myUrl.split('?')[0];
    const query=url.parse(myUrl.split('?')[1]);

    const responseData={
        method,
        myUrl,
        path,
        query
    }

    res.setHeader('Content-Type','application/json');

    if(method==='GET'){
        res.end(JSON.stringify(responseData))
    }

    if(method==='POST'){
        let postData=='';
        req.on('data',chunk=>{
            postData+=chunk.toString();
        })
        req.on('end',()=>{
            responseData.postData=postData;
            res.end(JSON.stringify(responseData))
        })
    }
});

server.listen(5000,()=>{
    console.log('server running at port 5000');
})
```

```js
const http = require("http")
const url = require("url")

const server = http.createServer((req, res) => {
  console.log(req.method)
  const myUrl = req.url
  console.log(myUrl)
  获得问号后面的参数并转化为对象
  req.query = url.parse(myUrl.split("?")[1])
  对象转json字符串
  res.end(JSON.stringify(req.query))
})

server.listen(5000, () => {
  console.log("server running at port 5000")
})
```

查看请求，network》all

改变代码需要重启服务器

post请求（服务端获取客户端数据）

流传递：数据量大传输大，通过流来传递好

```js
const http = require("http")
const url = require("url")

const server = http.createServer((req, res) => {
  if (req.method === "POST") {
    let postData = ""
    监听data事件
    req.on("data", (chunk) => {
      postData += chunk.toString()
    })
    接受完毕
    req.on("end", () => {
      res.end("数据接受完毕")
      请求的数据格式比如json
      console.log(req.headers["content-type"])
    })
  }
})
```

postman（post）：post》body》raw》json

### 四、项目实战

#### 开发环境配置

1. npm initi -y生成packagejson

main改为“bin/www.js”，scripts改为“dev” :"nodemon bin/www.js"

1. bin文件夹www.js
2. wwwjs写代码

```js
const http = require("http")
const serverHandler = require("../app")
const PORT = 5000
const server = http.createServer(serverHandler)

server.listen(PORT, () => {
  console.log(`server running at port '${PORT}`)
})
```

4. 根目录下的appjs

```js
const serverHandler = (req, res) => {
  res.setHeader("Content-Type", "application/json")
  const responseData = {}

  res.end(JSON.stringify(responseData))
}

module.exports = serverHandler
```

5. npm install nodemon -D

#### 业务模块

主要写appjs

#### 路由

初始化路由、涉及接口

新建src/routes/blog.js

```js
const handleBlogRoute=(req,res)=>{
    const method=req.method;
    const url=req.url;
    const path=url.split('?')[0];
    这是两个路由，一个映射就是一个路由
    接口一
    if(method==='GET'&&path==='/api/blog/list'){
        return {
            返回给blogData的对象
        }
    }
    接口二
    if(method==='POST'&&path==='/api/blog/new'){
        return {
            返回给blogData的对象
        }
    }

}
```

appjs使用route

```js
const handleBlogRoute = require("./src/routes/blog")

const serverHandler = (req, res) => {
  res.setHeader("Content-Type", "application/json")

  const blogData = handleBlogRoute(req, res)

  if (blogData) {
    res.end(JSON.stringify(blogData))
    return
  }

  res.writeHead(404, { "Content-Type": "text/plain" })
  res.write("404 Not Found")
  res.end()
}

module.exports = serverHandler
```

#### 连接数据库mysql

npm install mysql

```js
const mysql = require("mysql")

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  port: 3306,
  database: "myblog",
})

connection.connect()

const sql = `select * from blogs`

connection.query(sql, (err, result) => {
  if (err) {
    console.error("error", err)
    return
  }
  console.log("result", result)
})

conneciton.end()
```

#### 连接数据库mongoDB

route优化

### 五、开发模板

优化：wwwjs的配置还可以放到src/config中

bin/www.js

```js
const http = require("http")
const serverHandler = require("../app")
const PORT = 5000
const server = http.createServer(serverHandler)

server.listen(PORT, () => {
  console.log(`server running at port ${PORT}`)
})
```

appjs

```js
const handleBlogRoute=require('./src/routes/blog');

处理post流
const getPostData=(req)=>{
    const promise =new Promise((resolve,reject)=>{
        if(req.method!=='POST'){
            resolve({});
            return;
        }
        TODO:此时只支持json格式
        if(req.headers['content-type']!=='application/json'){
            resolve({});
            return;
        }

        let postData='';
        req.on('data',chunk=>{
            postData+=chunk.toString();
        });
        req.on('end',()=>{
            没有传过来数据
            if(!postData){
                resolve({});
                return；
            }
            resolve(JSON.parse(postData));
        })
    })
}

const serverHandler=(req,res)=>{
    res.setHeader('Content-Type','application/json');

    req.path=req.url.split('?')[0];
    req.query=querystringify.parse(url.split('?')[1]);

    TODO：处理post流是一个异步过程，其实可以加个if根据是不是post来分别执行。get直接不在意post的body了
    getPostData(req).then((postData)=>{
        req.body=postData;
    	const blogData=handleBlogRoute(req,res);
    	//if(blogData){
        	//res.end(JSON.stringify(blogData));
        	//return;
    	//}

        ?
            处理的是promise，所以其他接口return也要改为返回promise（用async包装handleBlogRoute让他比返回promise也行。这样get中的普通值，也是返回值为普通值的成功promise.但这里我们让get也放回promise。异步操作）
        线索是这样的：查询数据库返回的是一个promise。get或post调用查询数据库，将得到的数据再封装为值为responsemodel的promise。然后我们appjs服务器监听调用路由，所以得到的也是一个promise。并进行处理。因为从一开始查询数据库就是返回promise，所以get也全是promise而不是普通值。

        if(blogData){
            blogData.then((blogData)=>{
               res.end(JSON.stringify(blogData));
            });
            return;
        }

        res.writeHead(404,{'Content-Type':'text/plain'});
    	res.write('404 Not Found');
    	res.end();
    })

}

module.exports=serverHandler;
```

blogjs

```js
const{ SuccessModel}=require("../model/responseModel");
const {getList}=require('../controllers/blog')

const handleBlogRoute=(req,res)=>{
    const {method,path,requry,body}=req;

    接口一
    if(method==='GET'&&path==='/api/blog/list'){
        const author=req.query.author||'';
        const keyword=req.query.context||'';

        const listData=getList(author,keyword);
        return listData.then(listData=>{
            不懂这里，返回了一个包含successModel的promise？为什么有return，别人的promisethen里面没有return。懂了。没问题。
            获取一个promise，并通过then包装为resposemodel的promise
            return new SuccessMOdel(listData);
        });
    }
    接口二

    if(method==='GET'&&path==='/api/blog/detail'){
        return new SuccessModel(getDetail(req.query.id));
    }

    接口三
    if(method==='POST'&&path==='/api/blog/new'){
        return {
            返回给blogData的对象
        }
    }

}

modules.exports=handleBlogRoute;
```

src/model/responseModel.js

```js
响应模型（规范化）
class BaseModel{
    constructor(data,message){
        data可以没有，但message必须要，只有一个参数时，填的是message
        if(typeof data==='string'){
            this.message=data;
            data=null;
            message=null;

        }
        if(data){
            this.data=data;
        }
        if(message){
            this.message=message;
        }
    }
}

class SuccessModel extends BaseMOdel {
    constructor(data,message){
        super(data,message);
        this.errno=0;

    }

}

class ErrorModel extends BaseModel{
    constructor(data,message){
        super(data,message);
        this.errno=-1;
    }
}

modules.exports = { SuccessModel, ErrorModel };
```

src/controllers/blog.js

```js
const { execSQL } = require("../db/mysql")

const getList = (author, keyword) => {
  const sql = `select * from blogs where 1=1 `

  if (author) {
    sql += `and author ='${author} '`
  }
  if (keyword) {
    sql += `and title like '%${keyword}%'`
  }

  return execSQL(sql)
}

const getDetail = (id) => {
  const sql = "select * from blogs"
  execSQL(sql).then((result) => {
    concole.log(result)
  })
  return {}
}

module.exports = {
  getList,
  getDetail,
}
```

src/db/mysql.js

```js
const mysql=require('mysql');
const {MYSQL_CONFIG}=require('../config/db');

const connection=mysql.createConnection(MYSQL_CONFIG);

connection.connect();

/*可以拿来复制用的callback。
(err,result)=>{
    if(err){
        console.error('error',err);
        return;
    }
    console.log('result',result);
}

function execSQL(sql,callback){
    connection.query(sql,callback);
}*/
查询的话返回的是一个row数组，就是存储查询到的所有行
function execSQL(sql){
    const promise=new Promise((resolve,reject)=>{
       connecion.query(sql,(err,result)=>{
           if(err){
               reject(err);
               return;
           }
           resolve(result);
       })
    });
    return promise;
}

module.exports={
    execSQL
}
```

src/config/db.js

```js
let MYSQL_CONFIG = {}

MYSQL_CONFIG = {
  host: "localhost",
  user: "root",
  password: "1234",
  port: 3306,
  database: "myblog",
}
module.exports = {
  MYSQL_CONFIG,
}
```

专注业务：只需修改路由返回值和控制器中的函数即可

## express

npm i express@4.17.1

![image-20221030235005365](D:\tplmydata\tplmydoc\文档图片\image-20221030235005365.png)

![image-20221030235133352](D:\tplmydata\tplmydoc\文档图片\image-20221030235133352.png)

req.query空对象或get的参数

req.params动态参数，默认空对象/:id/:name/:score

![image-20221030235742398](D:\tplmydata\tplmydoc\文档图片\image-20221030235742398.png)

![image-20221030235849254](D:\tplmydata\tplmydoc\文档图片\image-20221030235849254.png)

![image-20221031000017439](D:\tplmydata\tplmydoc\文档图片\image-20221031000017439.png)

![image-20221031000122111](D:\tplmydata\tplmydoc\文档图片\image-20221031000122111.png)

![image-20221031000241552](D:\tplmydata\tplmydoc\文档图片\image-20221031000241552.png)

![image-20221031000321416](D:\tplmydata\tplmydoc\文档图片\image-20221031000321416.png)

根据参数个数与是否包含next分辨路由和中间件

![image-20221031000457301](C:\Users\taipanlan\Desktop\image-20221031000457301.png)

![image-20221031000615141](C:\Users\taipanlan\Desktop\image-20221031000615141.png)

![image-20221031000904141](D:\tplmydata\tplmydoc\文档图片\image-20221031000904141.png)

![image-20221031000935387](D:\tplmydata\tplmydoc\文档图片\image-20221031000935387.png)

![image-20221031080955266](D:\tplmydata\tplmydoc\文档图片\image-20221031080955266.png)

![image-20221031081048066](D:\tplmydata\tplmydoc\文档图片\image-20221031081048066.png)

![image-20221031081116287](D:\tplmydata\tplmydoc\文档图片\image-20221031081116287.png)

![image-20221031082417871](D:\tplmydata\tplmydoc\文档图片\image-20221031082417871.png)

![image-20221031083457833](D:\tplmydata\tplmydoc\文档图片\image-20221031083457833.png)原生cookie

## koa

## mysql

![image-20221031081743589](D:\tplmydata\tplmydoc\文档图片\image-20221031081743589.png)

![image-20221031081834705](D:\tplmydata\tplmydoc\文档图片\image-20221031081834705.png)

![image-20221031081857822](D:\tplmydata\tplmydoc\文档图片\image-20221031081857822.png)

![image-20221031082006713](D:\tplmydata\tplmydoc\文档图片\image-20221031082006713.png)

![image-20221031082037158](D:\tplmydata\tplmydoc\文档图片\image-20221031082037158.png)

![image-20221031082102887](D:\tplmydata\tplmydoc\文档图片\image-20221031082102887.png)

## mongodb

mongocompass的使用.连接服务,新建db与collection,新建数据document,刷新

npm i mongoose

```js
const mongoose = require("mongoose")
// export1
mongoose
  .connect("mongodb://localhost:27017/tempdb", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("cg")
  })
  .catch((err) => {
    console.log("fail")
  })
// export2 模型对象
const userSchema = new mongoose.Schema({
  username: String,
  pwd: String,
})
// 集合名。model实现集合和schema（文档结构）的映射
const User = mongoose.model("tempusers", userSchema)

// 使用
User.create({ username: "lisi", pwd: "1234" })
  .then((rel) => {})
  .catch((err = {}))
// User.updateOne({
// 需要修改的属性id等
// }, {
// 修改及其内容
// }).then();
// User.deleteMany({}).then();
// User.find({}).then();
// User.findOne({}).then();

// module.exports = () => {
//   mongoose.connect('mongodb://localhost:27017/users', { useNewUrlParser: true }).then(() => {
//     console.log('cg');
//   }).catch(err => {
//     console.log('fail');
//   })
// }

// var stuSchema = new Schema({
//   name: String,
//   age: Number,
//   gender: {
//     type: String,
//     default: 'male'
//   },
//   addr: String
// })
```

// const { model: usersModel } = users;

// usersModel.create();
