# 初识vite插件（篇一）

### vite插件形式
先举个简单的例子来认识下vite插件的结构：
~~~js
export default function myExample () {
  return {
    name: 'my-example', // 名称用于警告和错误展示
    resolveId ( source ) {
      if (source === 'virtual-module') {
        return source; // 返回source表明命中，vite不再询问其他插件处理该id请求
      }
      return null; // 返回null表明是其他id要继续处理
    },
    load ( id ) {
      if (id === 'virtual-module') {
        return 'export default "This is virtual!"'; // 返回"virtual-module"模块源码
      }
      return null; // 其他id继续处理
    }
  };
}
~~~

### 通用钩子

下面钩子会在服务器启动时调用一次:

- `options` 替换或操纵rollup选项
- `buildStart` 开始创建

下面钩子每次有模块请求时都会被调用:

- `resolveId` 创建自定义确认函数，常用语定位第三方依赖
- `load` 创建自定义加载函数，可用于返回自定义的内容
- `transform` 可用于转换已加载的模块内容

下面钩子会在服务器关闭时调用一次:

- buildEnd
- closeBundle

### Vite特有钩子

- `config`: 修改Vite配置
- `configResolved`：Vite配置确认
- `configureServer`：用于配置dev server
- `transformIndexHtml`：用于转换宿主页
- `handleHotUpdate`：自定义HMR更新时调用

那我们去走一下钩子的顺序：

~~~js
export default function myExample () {
  // 返回的是插件对象
  return {
    name: 'hooks-order', 
    // 初始化hooks，只走一次
    options(opts) {
      console.log('options', opts);
    },
    buildStart() {
      console.log('buildStart');
    },
    // vite特有钩子
    config(config) {
      console.log('config', config);
      return {}
    },
    configResolved(resolvedCofnig) {
      console.log('configResolved');
    },
    configureServer(server) {
      console.log('configureServer');
      // server.app.use((req, res, next) => {
      //   // custom handle request...
      // })
    },
    transformIndexHtml(html) {
      console.log('transformIndexHtml');
      return html
      // return html.replace(
      //   /<title>(.*?)<\/title>/,
      //   `<title>Title replaced!</title>`
      // )
    },
    // 通用钩子
    resolveId ( source ) {
      if (source === 'virtual-module') {
        console.log('resolvedId', source);
        return source; 
      }
      return null; 
    },
    load ( id ) {
      if (id === 'virtual-module') {
        console.log('load');
        return 'export default "This is virtual!"';
      }
      return null;
    },
    transform(code, id) {
      if (id === 'virtual-module') {
        console.log('transform');
      }
      return code
    },
  };
}
~~~
执行顺序：
~~~js
// config -> configResolved -> options -> configureServer -> buildStart -> Vite dev server ready -> transformIndexHtml -> resolvedId -> load -> transform
~~~

### 插件顺序

- 别名处理Alias
- 用户插件设置enforce: 'pre'
- Vite核心插件
- 用户插件未设置enforce
- Vite构建插件
- 用户插件设置enforce: 'post'
- Vite构建后置插件(minify, manifest, reporting)



接下来可以看看第二篇文章实战一下：[手写一个vite mock插件（篇二）](https://juejin.cn/post/7125745067758878756)