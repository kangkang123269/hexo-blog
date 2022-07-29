# 手写一个vite mock插件（篇二）

### 前言
这里先给demo地址，可以直接看源码：[demo地址](https://github.com/kangkang123269/kate-demo/tree/main/vite/vite-mock-plugin)

### 编写思路
- 一开始干嘛？初始化。mock插件初始化什么，入口和能支持mock能力的devServer
- 初始化完了，发现是不是有post，get等方法的路由请求，需不要给它分类？需要
- 那怎么分类？考完重构一个对象的能力，是不是`so easy`.
- 分为类是不是需要判断是否有效？有效就返回mock数据，无效执行下一个中间件
- 前期这样想完全没有问题。

来一条华丽的分割线

----
后期发现问题：
- 发现中间件的next方法和res.send方法同时执行或导致程序中断

解决这个问题我们需要判断路由是否有效，且不能在无效的时候去send和mock（假装自己知道就好了）

- send函数在请求的时候需要给相应的信息，所以需要二次封装

### 初始化

我们从[vite初始篇一](https://juejin.cn/post/7125746860567822350)开始了解vite插件的钩子，我们需要开启一个服务去支持mock能力，需要用到`devServer`，很明显我们需要在`configureServer`这个钩子里面写，且需要mock数据的路径

所以我们初始化的插件函数需要做两件事情：
- 需要options参数入口，且为空的时候要给默认的入口
- 在return的对象要用到`configureServer`的`server.middlewares`

> server.middlewares相当于`express`的`app`

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

再给我们的mock也初始下,下面看到我们是用的ES Moudle抛出方式，因为vite是不支持commonJS模块。所以我们需要用到`export default`，不能用到`module.exports`，本人亲测自己写一个支持require的插件也作用不到`mock`这个插件。（一个伤心的经历）

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

我们需要的路由表是这种结构，一个方法对应多个路由，所以我们需要创建路由表。

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

首先获取路由，我们不能用require，所以用import. 但import是异步的，那么我们需要加上async/await等待加载完模块，用解构的方式获取mockObj

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
创建完路由表，需要中间件里面的逻辑,也就是破路由和send数据到路由上面了。

### 执行匹配路由和自定义send
我们接下的逻辑可以这样写，先获取路由匹配的结果，如果匹配成功就send 

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
          // 自定义send
          res.send = send;
          // 执行路由的`response`回调函数，可以把代码往前翻
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

### 总结

vite插件的掌握还是需要写些插件，看看别人的源码，了解为什么这么写，自己之后可以这样写。根据自己需求出去，应用到实践中去。
