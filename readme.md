### redux

官方描述：
> Redux 是 JavaScript 状态容器，提供可预测化的状态管理

redux的组成

- store: 存放数据的地方 应用中有且仅有一个 store
- state: store对象里的数据
- action: 动作，是对变化的描述。state的变化会导致view的变化，但是用户接触不到state,所以state的变化是由 view 导致的。**action 就是 view 发出的通知**，表示 state 要发生变化了
- dispatch: view 发出通知的方法，`dispatch(action)`
- reducer: 是一个纯函数，接收`action`和`state`，并返回一个新的 state

redux 特点：

单向数据流，在单项数据流中，状态的变化是可预测的。
状态的更改由 view 触发 action，然后通过 dispatch 把这个action传入 store 调用 reducer 方法，返回新的state，state 发生变化后，就会调用 subscribe 监听的函数 更新 view

redux api:
- createStore: 创建一个store 全局数据，应用中有且仅有一个 store

```js
createStore(reducer, prloadedState, enhancer)
return {getState, dispatch, subscribe, replaceReducer} // 返回了这些方法
```
- getState: 返回当前的 state
```js
function getState(){
    return currentState
}
```
- replaceReducer: 替换当前的reducer 并重新初始化state
```js
function replaceReducer(nextReducer){
    currentReducer = nextReducer
    dispatch({ type: ActionTypes.REPLACE })
    return store
}
```
- dispatch, subscribe 这两个相当于是发布订阅模式
    - subscribe: 注册监听事件，，收集依赖到`listeners`数组中, 并返回一个函数用来解绑监听函数。
    - dispatch: 派发action 修改state的唯一方式,当 `dispatch action`后，redux会在reducer执行完成后，将`listeners`数组中的函数一次执行

```js
// dispatch 部分源码
// 如果正在dispatch 则不允许调用 防止在reducer中调动dispatch造成死循环
if (isDispatching) {
    throw new Error('Reducers may not dispatch actions.')
}
try {
    isDispatching = true
    currentState = currentReducer(currentState, action)
} finally {
    isDispatching = false
}
// 触发订阅 listeners = currentListeners = nextListeners 然后遍历
const listeners = (currentListeners = nextListeners)
for (let i = 0; i < listeners.length; i++) {
    const listener = listeners[i]
    listener()
}
```

````js
// subscribe
function subscribe(listener: () => void) {
    if (typeof listener !== 'function') {
        throw new Error(
            `Expected the listener to be a function. Instead, received: '${kindOf(
                listener
            )}'`
        )
    }
    // 禁止在 reducer 的时候调用 dispatch
    if (isDispatching) {
        throw new Error(
            'You may not call store.subscribe() while the reducer is executing. ' +
            'If you would like to be notified after the store has been updated, subscribe from a ' +
            'component and invoke store.getState() in the callback to access the latest state. ' +
            'See https://redux.js.org/api/store#subscribelistener for more details.'
        )
    }

    let isSubscribed = true
    // 确保 nextListeners 和 currentListeners 不指向同一个引用
    ensureCanMutateNextListeners()
    // 注册监听
    nextListeners.push(listener)

    return function unsubscribe() {
        if (!isSubscribed) {
            return
        }
        if (isDispatching) {
            throw new Error(
                'You may not unsubscribe from a store listener while the reducer is executing. ' +
                'See https://redux.js.org/api/store#subscribelistener for more details.'
            )
        }
        isSubscribed = false
        ensureCanMutateNextListeners()
        // 取消监听
        const index = nextListeners.indexOf(listener)
        nextListeners.splice(index, 1)
        currentListeners = null
    }
}
````

`currentlistenets` 用于确保监听函数执行过程中的稳定性


### applyMiddleware(...middleware)
```js
createStore(reducer, preloadedState, applyMiddleware(...middlewares))


return enhancer(createStore)(
    reducer,
    preloadedState
)

applyMiddleware(...middlewares)(createStore)(reducer, preloadedState)
```
中间件就是一个函数，对store.dispatch方法进行了改造，在发出 Action 和执行 Reducer 这两步之间，添加了其他功能。


其实就是返回一个增强了 `dispatch` 的 store对象

通过包装 store 的 `dispatch` 方法来达到想要的目的
多个 middleware 可以一起组合使用 比如使用`redux-thunk` 让 dispatch 支持 传入 function,被 dispatch 的 function 接收 dispatch 作为参数并可以调用它

```js
// compose 从右到左来组合多个函数。预计每个函数都接收一个参数，他的返回值将作为参数提供给左边的函数
funcs.reduce((a,b) => (...args) => a(b(...args)))

compose(funcA, funcB, funcC)
compose(funA(funB(funC(...args))))
```
### combineReducers
随着应用越来越复杂，可以将`reducer`拆分成多个单独的函数
`combineReducers` 的作用的是，把多个不同的`reducer`函数作为`value`组成一个`object`。最终合并成一个 `reducer` 函数，
