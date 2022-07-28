### 1、获取字符串中的字符数

~~~js
const characterCount = (str, char) => str.split(char).length - 1
~~~

### 2、检查对象是否为空

~~~js
const isEmpty = obj => Reflect.ownKeys(obj).length === 0 && obj.constructor === Object
~~~

### 3、等待一段时间再执行

~~~js
const wait = async (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
~~~

### 4、 获取两个日期之间的日差

~~~js
const daysBetween = (date1, date2) => Math.ceil(Math.abs(date1 - date2) / (1000 * 60 * 60 * 24))
~~~

### 5、重定向到另一个 URL

~~~js
const redirect = url => location.href = url
~~~

### 6、检查设备上的触摸支持
~~~js
const touchSupported = () => ('ontouchstart' in window || DocumentTouch && document instanceof DocumentTouch)
~~~

### 7、 在元素后插入 HTML 字符串

~~~js
const insertHTMLAfter = (html, el) => el.insertAdjacentHTML('afterend', html)
~~~

### 8、随机排列数组

~~~js
const shuffle = arr => arr.sort(() => 0.5 - Math.random())
~~~

### 9、在网页上获取选定的文本

~~~js
const getSelectedText = () => window.getSelection().toString()
~~~

### 10、获取随机布尔值

~~~js
const getRandomBoolean = () => Math.random() >= 0.5
~~~

### 11、计算数组的平均值

~~~js
const average = (arr) => arr.reduce((a, b) => a + b) / arr.length
~~~
