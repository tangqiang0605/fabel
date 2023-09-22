普通的 http 请求可以使用 http 模块，但遇到 https 请求时，则需要使用 https。
注意，后台环境没有 fetchApi，但 axios 底层使用 xhr、fetch 和 node: http、node: https，因此可以使用。

使用 node 原生发送 https 请求并判断响应内容的类型：

```
const https = require('https');
const url = require('url');

// HTTPS请求URL
const requestUrl = 'https://raw.githubusercontent.com/tangqiang0605/test/main/static/Pasted%20image%2020262526.png';

// 解析URL
const parsedUrl = url.parse(requestUrl);

// HTTPS请求选项
const options = {
  hostname: parsedUrl.hostname,
  path: parsedUrl.path,
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  },
  rejectUnauthorized: false
};

// 发送HTTPS请求
const req = https.request(options, res => {
  let data = '';

  // 获取响应头中的Content-Type字段
  const contentType = res.headers['content-type'];
  console.log(contentType)
  if (contentType.includes('image')) {
    console.log('响应的文件格式是图片');
    // 图片存在
  } else if (contentType.includes('html')) {
    console.log('响应的文件格式是HTML');
  } else {
    console.log('响应的文件格式是其他类型');
    // 404
  }

  // 接收响应数据
  res.on('data', chunk => {
    data += chunk;
  });

  // 响应完成处理
  res.on('end', () => {
    console.log(data.search(404));
  });
});

// 处理请求错误
req.on('error', error => {
  console.error(error);
});

// 发送请求
req.end();
```
