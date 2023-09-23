## new的初步描述

1. new的调用：new(构造器,构造器参数1,构造器参数2...)
2. new的返回值：返回一个对象
   1. 该对象的属性由构造器函数以及传入new的构造器参数决定。
   2. 属性指向该对象。
   3. 该对象的原型对象指向构造器的显示原型。



## new的初步实现

1、完成传参和返回值

``` javascript
function _new(Ctor,...args){
    let obj={};
    return obj;
}
```

2、使用构造器创建对象

``` javascript
function _new(Ctor,...args){
    let obj={};
    Ctor.apply(obj,args);
    return obj;
}
```

3、绑定对象原型

``` javascript
function _new(Ctor,...args){
    let obj={};
    obj.__proto__=Ctor.prototype;
    Ctor.apply(obj,args);
    return obj;
}
```



## new的进一步描述

1. 参数：Ctor非函数时报错
2. 返回值：Ctor函数没有return时，返回new函数里生成的对象。
3. 返回值：Ctor函数return一个null对象，返回值同2。
4. 返回值：Ctor函数return一个对象（除了null对象）或函数时，返回该对象或函数。



## new的进一步实现

1、参数校验（抛出异常）

``` javascript
function _new(Ctor,...args){
    if(!Ctor.hasOwnProperty;("protorype")){
        throw new TypeError('Ctor is not a constructor');
    }
    let obj={};
    obj.__proto__=Ctor.prototype;
    Ctor.apply(obj,args);
    return obj;
}
```

2、代码优化（使用Object.create函数）

``` javascript
function _new(Ctor,...args){
    if(!Ctor.hasOwnProperty;("protorype")){
        throw new TypeError('Ctor is not a constructor');
    }
    // 创建一个绑定原型对象的对象
    // 效果等同：let obj={};obj.__proto__=Ctor.prototype;
    let obj=Object.create(Ctor.prototype);
    Ctor.apply(obj,args);
    return obj;
}
```

3、返回值处理（根据Ctor的返回值情况）

``` javascript
function _new(Ctor,...args){
    if(!Ctor.hasOwnProperty;("protorype")){
        throw new TypeError('Ctor is not a constructor');
    }
    let obj=Object.create(Ctor.prototype)
    let result=Ctor.apply(obj,args);
    if(result!=null&&(typeof result=="object"||typeof result=="function")){
        return result;
    }
    return obj;
}
```



