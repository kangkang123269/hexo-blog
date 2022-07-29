# 手写一个vite mock插件（篇二）

### 前言
这里先给demo地址，没耐心等话直接用demo自己操作看源码：[demo地址](https://github.com/kangkang123269/kate-demo/tree/main/vite/vite-mock-plugin)
### 初始化

我们从篇一开始了解vite插件的钩子，我们需要用到devServer，很明显我们需要在`configureServer`这个钩子里面写，且需要mock数据的路径

所以我们初始化的插件函数为：

~~~js
import path from 'path';

export default function (options = {}) {
  // 获取mock文件入口，默认index
  options.entry = options.entry || './mock/index.js';

  // 转换为绝对路径
  if (!path.isAbsolute(options.entry)) {
    options.entry = path.resolve(process.cwd(), options.entry);
  }

  return {
    configureServer: function ({ middlewares: app }) {
        // 定义中间件：路由匹配
      const middleware = (req, res, next) => {

      };
      app.use(middleware);
    }
  };
}
~~~

再给我们的mock也初始下,下面看到我们是用的ES Moudle抛出方式，因为vite是不支持commonJS模块

~~~js
// /mock/index.js
export default [
  {
    url: '/api/users',
    type: 'get',
    response: function (req, res) {
      return res.send([
        {
          username: 'tom',
          age: 18,
        },
        {
          username: 'Tom',
          age: 19,
        },
      ]);
    },
  },
];
~~~

### 创建路由表

我们需要的路由表是这种结构，所以我们需要创建路由

~~~json
{
    "get": [
        {
            "url": "/api/1",
            "type": "get",
            "response": function 
        },
        {
            "url": "/api/2",
            "type": "get",
            "response": function 
        },
    ],
    "post": [
        {
            "url": "/api/1",
            "type": "get",
            "response": function 
        },
        {
            "url": "/api/2",
            "type": "get",
            "response": function 
        },
    ]
}
~~~

首先获取路由，我们不能用require，所以用import. 但import是异步的，那么我们需要加上async/await等待加载完模块，上述代码是这样的:

~~~js
...
return {
    configureServer: function ({ middlewares: app }) {
        // 定义路由表
        const mockObj = { ...(await import(options.entry)) }.default;
        // 创建路由表
        createRoute(mockObj);

        ....
         // 定义中间件：路由匹配
        const middleware = (req, res, next) => {

        };
        app.use(middleware)
    }
};
...
~~~

那么我们现在开始写`createRoute`函数，多尝试，也就一个简单的变量处理，下列写成函数如下：

~~~js
function createRoute(mockConfList) {
  mockConfList.forEach((mockConf) => {
    let method = mockConf.type || 'get';
    let path = mockConf.url;
    let handler = mockConf.response;
    // 路由对象
    let route = { path, method: method.toLowerCase(), handler };
    // 如果没有改请求方法就初始化为空数组
    if (!mockRouteMap[method]) {
      mockRouteMap[method] = [];
    }
    console.log('create mock api: ', route.method, route.path);
    // 存入映射对象中
    mockRouteMap[method].push(route);
  });
}
~~~
创建完路由表，需要中间件里面的逻辑

### 执行匹配路由和自定义send

~~~js
...
return {
    configureServer: async function ({ middlewares: app }) {
      // 定义路由表
      const mockObj = { ...(await import(options.entry)) }.default;
      // 创建路由表
      createRoute(mockObj);

      // 定义中间件：路由匹配
      const middleware = (req, res, next) => {
        // 1. 执行匹配过程
        let route = matchRoute(req);

        // 2. 存在匹配，则这个是一个mock请求
        if (route) {
          console.log('mock request', route.method, route.path);
          res.send = send;
          route.handler(req, res);
        } else {
          next();
        }
      };
      app.use(middleware);
    },
};

...
~~~

#### 匹配路由

根据我们浏览器请求的路由去匹配路由信息

~~~js
function matchRoute(req) {
  let url = req.url;
  let method = req.method.toLowerCase();
  let routeList = mockRouteMap[method];

  return routeList && routeList.find((item) => item.path === url);
}
~~~

我们请求一个试下：

`成功匹配`:

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e09bdc4eda6c458c90290fef6420279b~tplv-k3u1fbpfcp-watermark.image?)


#### 自定义send

这里自定义send我们可以添加请求头字段，能够知道请求的东西的类型，长度等信息

~~~js
function send(body) {
  let chunk = JSON.stringify(body);
  // Content-Length
  if (chunk) {
    chunk = Buffer.from(chunk, 'utf-8');
    this.setHeader('Content-Length', chunk.length);
  }
  // content-type
  this.setHeader('Content-Type', 'application/json');
  // status
  this.statusCode = 200;
  // response
  this.end(chunk, 'utf8');
}
~~~

