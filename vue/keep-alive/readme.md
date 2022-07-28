# Vue中使用keep-alive

### 一、路由router添加meta配置

~~~js
const routes = [
  {
    path: '/keepalive',
    name: 'keepalive',
    component: ()=>import('../views/keepalive.vue'),
    meta: {
          keepAlive: false //设置页面是否需要使用缓存
    }
  }
]
~~~

### 二、在Vue2.0的keep-alive的使用
vue2.0中直接在你想要做缓存的位置，一般使用场景为配合router-view进行使用。
~~~js
<template>
    <!-- vue2.x配置 --> 
    <keep-alive> 
        <router-view v-if="$route.meta.keepAlive" /> 
    </keep-alive> 
    <router-view v-if="!$route.meta.keepAlive"/> 
</template>
~~~

### 三、在Vue3.0的keep-alive的使用
Vue3.0配合的slot插槽使用，使用is来绑定对应路由的组件。

> 修改添加key值的绑定，如果不加key值无法实现页面缓存。
~~~js
<template> 
    <!-- vue3.0配置 --> 
    <router-view v-slot="{ Component }"> 
    <keep-alive> 
        <component :is="Component" :key="$route.name" v-if="$route.meta.keepAlive"/> 
    </keep-alive> 
        <component :is="Component" :key="$route.name" v-if="!$route.meta.keepAlive"/> 
    </router-view> 
</template>
~~~