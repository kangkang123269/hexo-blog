1. 获取时间格式化为YY-MM-DD HH:MM:SS

~~~js
function getNowFormatDate() {
    var date = new Date();
     
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var d = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
     
    if(month<10){
        month = "0" + month;
    }
     
    if(d<10){
        d = "0" + d;
    }
     
    if(hour<10){
        hour = "0" + hour;
    }
     
    if(minute<10){
        minute = "0" + hour;
    }
     
    if(second<10){
        second = "0" + second;
    }
    
    return year + "-" + month + "-" + d + " " +hour + ":" + minute + ":" + second;
}
~~~

2. 随机获取订单号

~~~js
/**
 * @desc 0
 * @param falg代表是否是赠送卡片和收卡界面
 */

function getNowFormatDate(flag) {
    var date = new Date();
     
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var d = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
     
    if(month<10){
        month = "0" + month;
    }
     
    if(d<10){
        d = "0" + d;
    }
     
    if(hour<10){
        hour = "0" + hour;
    }
     
    if(minute<10){
        minute = "0" + hour;
    }
     
    if(second<10){
        second = "0" + second;
    }
    
    return year + "-" + month + "-" + d + (flag ? " " +hour + ":" + minute + ":" + second : "");
}
~~~

