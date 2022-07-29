### 分析
- 能移动dom元素的位置，肯定与它的(x,y)坐标有关及改变dom元素的（left,top）的大小
- 那怎么监听鼠标的（x,y）这里用的事件是鼠标移动事件`onmousemove`、按压事件`mousedown`及松开事件`onmouseup`
- 那我们大胆的想一下接下来通过鼠标的怎么控制它移动的呢
    - 元素肯定先绑定鼠标按压事件`mousedown`
    - 在按压事件触发后，我们在监听鼠标移动事件`onmousemove`，鼠标移动的（x,y）貌似是dom元素位置(x,y)，这其实需要减去鼠标在dom元素的(x,y)才是
    - 最后鼠标松开事件`onmouseup`清除所有事件，以免否则鼠标抬起后还可以继续拖拽方块
### 初始化
- 这里头部引入jQuery更好的dom操作
~~~html
<script src="https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.js"></script>
~~~
- 需要再页面中初始化drag的位置
~~~html
<!-- index.html -->
 <div class="drag" style="left: 0; top: 0">按住拖动</div>
~~~
- 初始化css
~~~css
// index.css
.drag {
    background-color: skyblue;
    position: absolute;
    line-height: 100px;
    text-align: center;
    width: 100px;
    height: 100px;
}
~~~
- 初始化js，获取dom原生
~~~js
// index.js
let dragDiv = document.getElementsByClassName('drag')[0];
~~~

### 绑定鼠标按下事件
~~~js
dragDiv.addEventListener('mousedown', putDown, false);
~~~

### 编写putDown里面的逻辑
- 这里面就是计算dom元素的（left,top）
- 之后清除所有事件
~~~js
let putDown = function (event) {
  dragDiv.style.cursor = 'pointer';
  let offsetX = parseInt(dragDiv.style.left); // 获取当前的x轴距离
  let offsetY = parseInt(dragDiv.style.top); // 获取当前的y轴距离
  let innerX = event.clientX - offsetX; // 获取鼠标在方块内的x轴距
  let innerY = event.clientY - offsetY; // 获取鼠标在方块内的y轴距
  // 按住鼠标时为div添加一个border
  dragDiv.style.borderStyle = 'solid';
  dragDiv.style.borderColor = 'red';
  dragDiv.style.borderWidth = '3px';
  // 鼠标移动的时候不停的修改div的left和top值
  document.onmousemove = function (event) {
    dragDiv.style.left = event.clientX - innerX + 'px';
    dragDiv.style.top = event.clientY - innerY + 'px';
    // 边界判断
    if (parseInt(dragDiv.style.left) <= 0) {
      dragDiv.style.left = '0px';
    }
    if (parseInt(dragDiv.style.top) <= 0) {
      dragDiv.style.top = '0px';
    }
    if (
      parseInt(dragDiv.style.left) >=
      window.innerWidth - parseInt(dragDiv.style.width)
    ) {
      dragDiv.style.left =
        window.innerWidth - parseInt(dragDiv.style.width) + 'px';
    }
    if (
      parseInt(dragDiv.style.top) >=
      window.innerHeight - parseInt(dragDiv.style.height)
    ) {
      dragDiv.style.top =
        window.innerHeight - parseInt(dragDiv.style.height) + 'px';
    }
  };
  // 鼠标抬起时，清除绑定在文档上的mousemove和mouseup事件
  // 否则鼠标抬起后还可以继续拖拽方块
  document.onmouseup = function () {
    document.onmousemove = null;
    document.onmouseup = null;
    // 清除border
    dragDiv.style.borderStyle = '';
    dragDiv.style.borderColor = '';
    dragDiv.style.borderWidth = '';
  };
};
~~~

项目地址在这：[实现拖拽的demo](https://github.com/kangkang123269/kate-demo/tree/main/jQuery)