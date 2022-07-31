

### 前言

这里先给项目地址：[地址](https://github.com/kangkang123269/kate-demo/tree/main/html5/fullScreen-demo)

### 支持全屏的api

1. 浏览器是否支持全屏模式：`document.fullscreenEnabled`
2. 使元素进入全屏模式：`Element.requestFullscreen()`
3. 退出全屏：`document.exitFullscreen()`
4. 检查当前是否有节点处于全屏状态：`document.fullscreenElement`
5. 进入全屏/离开全屏，触发事件：`document.fullscreenchange`
6. 无法进入全屏时触发: `document.fullscreenerror`

### 浏览器前缀：

目前并不是所有的浏览器都实现了API的无前缀版本，所以我们需要针对不同浏览器，做一下API的兼容:

我们需要写成类的形式：

~~~js
/**
 * @description: 是否支持全屏+判断浏览器前缀
 * @param {Function} fn 不支持全屏的回调函数 这里设了一个默认值
 */
isFullscreen(fn) {
  let fullscreenEnabled;
  // 判断浏览器前缀
  if (document.fullscreenEnabled) {
    fullscreenEnabled = document.fullscreenEnabled;
  } else if (document.webkitFullscreenEnabled) {
    fullscreenEnabled = document.webkitFullscreenEnabled;
    this.prefixName = 'webkit';
  } else if (document.mozFullScreenEnabled) {
    fullscreenEnabled = document.mozFullScreenEnabled;
    this.prefixName = 'moz';
  } else if (document.msFullscreenEnabled) {
    fullscreenEnabled = document.msFullscreenEnabled;
    this.prefixName = 'ms';
  }
  if (!fullscreenEnabled) {
    if (fn !== undefined) fn(); // 执行不支持全屏的回调
    this.isFullscreenData = false;
  }
}
~~~

### 1. 浏览器是否支持全屏模式：document.fullscreenEnabled

`document.fullscreenEnabled`属性返回一个布尔值，表示当前文档是否可以切换到全屏状态。

### 2. 使元素进入全屏模式：Element.requestFullscreen()

~~~js
/**
 * @description: 将传进来的元素全屏
 * @param {String} domName 要全屏的dom名称
 */
Fullscreen(domName) {
  const element = document.querySelector(domName); // 获取dom
  const methodName =
    this.prefixName === ''
      ? 'requestFullscreen'
      : `${this.prefixName}RequestFullScreen`; // API前缀
  element[methodName](); // 调用全屏
}
~~~

### 3. 退出全屏：document.exitFullscreen()

~~~js
exitFullscreen() {
  const methodName =
    this.prefixName === ''
      ? 'exitFullscreen'
      : `${this.prefixName}ExitFullscreen`; // API 前缀
  document[methodName](); // 调用
}
~~~

### 4. 检查当前是否有节点处于全屏状态：document.fullscreenElement

~~~js
/**
 * @description: 检测有没有元素处于全屏状态
 * @return 布尔值
 */
isElementFullScreen() {
  const fullscreenElement =
    document.fullscreenElement ||
    document.msFullscreenElement ||
    document.mozFullScreenElement ||
    document.webkitFullscreenElement; // 有前缀的f是大写，没前缀是小写
  if (fullscreenElement === null) {
    return false; // 当前没有元素在全屏状态
  } else {
    return true; // 有元素在全屏状态
  }
}
~~~

事实上，还有一个属性`document.fullscreen`，返回一个布尔值，表示文档是否处于全屏模式。

两个方法效果是一样，但因为IE不支持这个属性，所以这里用的是`document.fullscreenElement`.

### 5. 进入全屏/离开全屏，触发事件：document.fullscreenchange

当我们进入全屏和离开全屏的时候，都会触发一个`fullscreenchange`事件。

> 注意：此事件不会提供任何信息，表明是进入全屏或退出全屏。

~~~js
/**
 * @description: 监听进入/离开全屏
 * @param {Function} enter 进入全屏的回调
 *  @param {Function} quit 离开全屏的回调
 */
screenChange(enter,quit) {
  if (!this.isFullscreenData) return;
  const methodName = `on${this.prefixName}fullscreenchange`;
  document[methodName] = e => {
    if (this.isElementFullScreen()) {
      enter && enter(e); // 进入全屏回调
    } else {
      quit && quit(e); // 离开全屏的回调
    }
  };
}
~~~

**注意：多层全屏的情况**

1. 先进入左边全屏(进入全屏回调)，再进入红色全屏(进入全屏回调)
2. 退出全屏,此时退出红色全屏，左边仍是全屏(触发进入全屏回调)
3. 出现这种情况，可以在点击按钮的时候，做一些状态限制。或者根据全屏事件返回的dom信息来进行判断。


### 6. 无法进入全屏时触发: document.fullscreenerror

比如全屏请求不是在事件处理函数中调用,会在这里拦截到错误:

~~~js
/**
 * @description: 浏览器无法进入全屏时触发
 * @param {Function} enterErrorFn 回调
 */
screenError(enterErrorFn) {
  const methodName = `on${this.prefixName}fullscreenerror`;
  document[methodName] = e => {
    enterErrorFn && enterErrorFn(e)
  };
}
~~~

### Css： 全屏模式下的样式

1. 默认设置黑色背景

~~~css
:not(:root):-webkit-full-screen::backdrop {
  position: fixed;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  background: black; // 会将背景设为黑色的 如果你没为你的dom设置背景的话，全屏下会为黑色
}
~~~

2. 默认样式：

~~~css
:not(:root):-webkit-full-screen {
  object-fit: contain;
  position: fixed !important;
  top: 0px !important;
  right: 0px !important;
  bottom: 0px !important;
  left: 0px !important;
  box-sizing: border-box !important;
  min-width: 0px !important;
  max-width: none !important;
  min-height: 0px !important;
  max-height: none !important;
  width: 100% !important;
  height: 100% !important;
  transform: none !important;
  margin: 0px !important;
}
~~~

### 全屏状态的CSS：

全屏状态下，大多数浏览器的CSS支持:full-screen伪类，只有IE11支持:fullscreen伪类。使用这个伪类，可以对全屏状态设置单独的CSS属性。

~~~css
/* 针对dom的全屏设置 */
.div:-webkit-full-screen {
  background: #fff;
}
/* 全屏属性 */
:-webkit-full-screen {}
:-moz-full-screen {}
:-ms-fullscreen {}
/* 全屏伪类 当前chrome:70 不支持 */
:full-screen {
}
:fullscreen {
  /* IE11支持 */
}
~~~

参考资料：阮一峰老师的[Fullscreen API：全屏操作](https://javascript.ruanyifeng.com/htmlapi/fullscreen.html#toc0)



这里是一条华丽的分割线，讲完原理开始实战
-------

### 项目的html

index.html：

~~~html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="./index.css" />
  <title>Document</title>
</head>

<body>
  <iframe src="https://codesandbox.io/s/" id="iframe-one" name="iframe-one
      width=" 100%" height="200" scrolling="no" frameborder="0"></iframe>
  <img src="vscode.svg" onclick="iframeScreen()" id="vscode" width="100" height="100" alt="">
  <script src="./index.js"></script>
</body>

</html>
~~~

### 项目中的css

index.css：

~~~css
#iframe-one {  // 随便是什么元素，一开始不展示元素
  display: none;
}
/* 针对dom的全屏设置 */
.left:-webkit-full-screen {
  background: #fff;
}
/* 全屏属性 */
:-webkit-full-screen {
}
:-moz-full-screen {

}
:-ms-fullscreen {
}
/* 全屏伪类 当前chrome:70 不支持 */
:full-screen {

}
:fullscreen {
  /* IE11支持 */
}

~~~

### 封装完成的js文件

以后无论遇到什么全屏问题都可以用改封装得class

index.js：

~~~js
class fullScreen {
  constructor(fn) {
    // fn是失败的回调函数
    this.prefixName = ''; // 浏览器前缀
    this.isFullscreenData = true; // 浏览器支持全屏
    this.isFullscreen(fn);
  }
  /**
   * @description: 是否支持全屏+判断浏览器前缀
   * @param {Function} fn 不支持全屏的回调函数 这里设了一个默认值
   */
  isFullscreen(fn) {
    let fullscreenEnabled; // 是否支持全屏
    // 判断浏览器前缀
    if (document.fullscreenEnabled) {
      fullscreenEnabled = document.fullscreenEnabled;
    } else if (document.webkitFullscreenEnabled) {
      fullscreenEnabled = document.webkitFullscreenEnabled;
      this.prefixName = 'webkit';
    } else if (document.mozFullScreenEnabled) {
      fullscreenEnabled = document.mozFullScreenEnabled;
      this.prefixName = 'moz';
    } else if (document.msFullscreenEnabled) {
      fullscreenEnabled = document.msFullscreenEnabled;
      this.prefixName = 'ms';
    }
    if (!fullscreenEnabled) {
      if (fn !== undefined) fn(); // 执行不支持全屏的回调
      this.isFullscreenData = false;
    }
  }

  /**
   * @description: 将传进来的元素全屏
   * @param {String} domName 要全屏的dom名称
   */
  Fullscreen(element) {
    const methodName =
      this.prefixName === ''
        ? 'requestFullscreen'
        : `${this.prefixName}RequestFullScreen`; // API前缀
    element[methodName](); // 调用全屏
  }

  // 退出全屏
  exitFullscreen() {
    const methodName =
      this.prefixName === ''
        ? 'exitFullscreen'
        : `${this.prefixName}ExitFullscreen`; // API 前缀
    document[methodName](); // 调用
  }

  /**
   * @description: 检测有没有元素处于全屏状态
   * @return 布尔值
   */
  isElementFullScreen() {
    const fullscreenElement =
      document.fullscreenElement ||
      document.msFullscreenElement ||
      document.mozFullScreenElement ||
      document.webkitFullscreenElement; // 有前缀的f是大写，没前缀是小写
    if (fullscreenElement === null) {
      return false; // 当前没有元素在全屏状态
    } else {
      return true; // 有元素在全屏状态
    }
  }

  /**
   * @description: 监听进入/离开全屏
   * @param {Function} enter 进入全屏的回调
   *  @param {Function} quit 离开全屏的回调
   */
  screenChange(enter, quit) {
    if (!this.isFullscreenData) return;
    const methodName = `on${this.prefixName}fullscreenchange`;
    document[methodName] = (e) => {
      console.log(e);
      if (this.isElementFullScreen()) {
        enter && enter(); // 进入全屏回调
      } else {
        quit && quit(); // 离开全屏的回调
      }
    };
  }

  /**
   * @description: 浏览器无法进入全屏时触发
   * @param {Function} enterErrorFn 回调
   */
  screenError(enterErrorFn) {
    const methodName = `on${this.prefixName}fullscreenerror`;
    document[methodName] = (e) => {
      enterErrorFn && enterErrorFn(e);
    };
  }
}
~~~

### 对元素一开始显示或者隐藏处理

这里可以这样处理调用`screenChange`方法，里面执行进入屏幕的回调和离开屏幕的回调，既进入显示，离开隐藏

index.js：

~~~js
let full = new fullScreen(() => {
  console.log('不支持');
});

const iframe = {
  enter: function (element) {
    // 显示
    element.style.display = 'block';
  },
  quit: function (element) {
    // 隐藏
    element.style.display = 'none';
  },
};

function iframeScreen() {
  const element = document.querySelector('#iframe-one');
  full.Fullscreen(element);
  full.screenChange(
    () => iframe.enter(element),
    () => iframe.quit(element)
  );
}
~~~

