## call的描述

1、是函数的公有方法，任何函数都可以调用

2、参数：对象，参数1，参数2...

3、函数执行过程中，this指向call的第一个参数，参数接受call的传过来的参数1、2……

4、无参时call的是window

5、参数是基本类型时包装为对象再call

6、返回值：函数的返回值



## call的实现

1、将call挂载到Fuction类的显示原型上

 ``` javascript
 function mycall(){
     
 }
 Function.prototype.mycall=mycall;
 ```

2、忽略这段代码的声明位置，立即执行这个挂载过程（不论这段代码在第一行行还是最后一行）

``` javascript
;(function(){
    function mycall(){
        
    }
    Function.prototype.mycall=mycall;
})()
```

3、参数接受与返回值

``` javascript
;(function(){
    function mycall(context){
        let args=[];
        for(let i=1;i<arguments.length;i++){
            args.push(arguments[i]);
        }
        // 此时执行过程调用call的函数中的this仍未指向对象
        // 返回值是以this指向window计算得出的，并不准确
        // 此处的return只是临时为了有返回值而存在
        return this();
    }
    Function.prototype.mycall=mycall;
})()
```

4、参数包装

``` javascript
;(function(){
    function mycall(context){
        context=context?Object(context):window;
        let args=[];
        for(let i=1;i<arguments.length;i++){
            args.push(arguments[i]);
        }       
        // 不准确的返回值
        return this();
    }
    Function.prototype.mycall=mycall;
})()
```

5、改变函数this的指向（通过挂载为obj.f并调用obj.f）

``` javascript
;(function(){
    function mycall(context){
        context=context?Object(context):window;
        let args=[];
        for(let i=1;i<arguments.length;i++){
            args.push(arguments[i]);
        }       
                
        context.f=this;
        return context.f(...args)
    }
    Function.prototype.mycall=mycall;
})()
```

6、去掉副作用（去掉挂载的context.f）

``` javascript
;(function(){
    function mycall(context){
        context=context?Object(context):window;
        let args=[];
        for(let i=1;i<arguments.length;i++){
            args.push(arguments[i]);
        }       
                
        context.f=this;
        let res=context.f(...args);
        delete context.f;
        return res;
    }
    Function.prototype.mycall=mycall;
})()
```



## 知识拓展

函数接受实参的方法：

1、形参

2、通过参数...args存入数组args中

3、arguments伪数组（Array.isArray(arguments)==false且有长度length可通过arguments[n]读取元素）

``` javascript
// method one
function fn(arg){
    
}

// method two
funciton fn(...args){
    // red args from array args;
}

// method three
function fn(){
    // red args from array-like(伪数组) arguments;
}
```

