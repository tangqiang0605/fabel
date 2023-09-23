```
new Promise((resolve,reject)=>{
	resolve('yes')
})
```

## 构造函数
1. promise 的构造函数接收一个函数executor，该函数被注入 resolve 和 reject 方法。
2. resolve 和 reject 在 value 为 pending 的时候才执行，否则跳过。
4. resolve 和 reject 在执行后调用回调，而这些回调是通过 then、catch 注册的。

## 原型方法
1. 挂载在构造函数的. prototype 对象上。
2. then 接收两个参数并进行处理：函数不处理，非函数赋给一个默认的只返回传入参数的简单函数。
3. then 方法也是返回一个 promise。
4. 根据 this 的状态调用不同的函数处理。如果是成功 fulfilled 或失败 rejected，将值传给入参函数，将其返回值传给 resolvePromise 方法。
5. 如果是 pending，将函数加入待执行队列中，等待 promise 进行 resolve 或 reject。
6. 这个过程中，执行回调是用 setTimeout 包住的。
7. resolvePromise 是处理 then 回调的返回值，用来决定 then 的 promise 的状态。会接收 then 的 promise 的 resolve 和 reject。
8. then 的 promise 的状态和 then 的回调的返回值，如果 then 回调的返回值是thenable