
### 前言

项目地址：[地址](https://github.com/kangkang123269/kate-demo/tree/main/css/css-animation-demo)

### js操作css类

1. 添加类名
~~~js
document.getElementById("myDiv").classList.add('mystyle');
~~~

2. 删除类名
~~~js
document.getElementById("myDiv").classList.remove('mystyle');
~~~

3. 检查是否含有某个css类：

~~~js
myDiv.classList.contains('myCssClass');
~~~

> 注意：`document.querySelector('class').classList`是静态获取类名，不能操作类名


### 导入css

~~~css
@import url('./fadeIn.css');
@import url('./fadeleftIn.css');
@import url('./fadelogIn.css');
@import url('./popIn.css');
~~~

### 弹窗动画

- 从上往下：

~~~css
.fadeIn {
    -webkit-animation: fadeInDown .3s;
    animation: fadeInDown .3s;
}
@keyframes fadeInDown {
    0% {
        -webkit-transform: translate3d(0, -20%, 0);
        -webkit-transform: translate3d(0, -20%, 0);
        transform: translate3d(0, -20%, 0);
        transform: translate3d(0, -20%, 0);
        opacity: 0;
    }
    100% {
        -webkit-transform: none;
        transform: none;
        opacity: 1;
    }
}
@-webkit-keyframes fadeInDown {
    0% {
        -webkit-transform: translate3d(0, -20%, 0);
        opacity: 0;
    }
    100% {
        -webkit-transform: none;
        opacity: 1;
    }
}
~~~

- 从右往左：

~~~css
.fadelogIn {
    -webkit-animation: fadelogIn .4s;
    animation: fadelogIn .4s;
}
@keyframes fadelogIn {
    0% {
        -webkit-transform: translate3d(0, 100%, 0);
        -webkit-transform: translate3d(0, 100%, 0);
        transform: translate3d(0, 100%, 0);
        transform: translate3d(0, 100%, 0);
    }
    100% {
        -webkit-transform: none;
        transform: none;
    }
}
@-webkit-keyframes fadelogIn {
    0% {
        -webkit-transform: translate3d(0, 100%, 0);
    }
    100% {
        -webkit-transform: none;
    }
}

~~~

- 从右往左：

~~~css
.fadeleftIn {
    -webkit-animation: fadeleftIn .4s;
    animation: fadeleftIn .4s;
}
@keyframes fadeleftIn {
    0% {
        -webkit-transform: translate3d(100%, 0, 0);
        -webkit-transform: translate3d(100%, 0, 0);
        transform: translate3d(100%, 0, 0);
        transform: translate3d(100%, 0, 0);
    }
    100% {
        -webkit-transform: none;
        transform: none;
    }
}
@-webkit-keyframes fadeleftIn {
    0% {
        -webkit-transform: translate3d(100%, 0, 0);
    }
    100% {
        -webkit-transform: none;
    }
}
~~~

- 放大：

~~~css
.popIn {
    -webkit-animation: fadeleftIn .4s;
    animation: fadeleftIn .4s;
    -webkit-animation-name: popIn;
    animation-name: popIn;
}
@-webkit-keyframes popIn {
    0% {
        -webkit-transform: scale3d(0, 0, 0);
        transform: scale3d(0.5, 0.5, 0.5);
        opacity: 0;
    }
    50% {
        -webkit-animation-timing-function: cubic-bezier(0.47, 0, 0.745, 0.715);
        animation-timing-function: cubic-bezier(0.47, 0, 0.745, 0.715);
    }
    100% {
        -webkit-transform: scale3d(1, 1, 1);
        transform: scale3d(1, 1, 1);
        -webkit-animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
        animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
        opacity: 1;
    }
}
@keyframes popIn {
    0% {
        -webkit-transform: scale3d(0, 0, 0);
        transform: scale3d(0.5, 0.5, 0.5);
        opacity: 0;
    }
    50% {
        -webkit-animation-timing-function: cubic-bezier(0.47, 0, 0.745, 0.715);
        animation-timing-function: cubic-bezier(0.47, 0, 0.745, 0.715);
    }
    100% {
        -webkit-transform: scale3d(1, 1, 1);
        transform: scale3d(1, 1, 1);
        -webkit-animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
        animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
        opacity: 1;
    }
}
~~~