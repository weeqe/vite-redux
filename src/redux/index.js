export default function createStore(reducer, preloadedState, enhancer) {

    if (typeof enhancer === 'function') {
        return enhancer(createStore)(reducer, preloadedState)
    }

    // 记录当前reducer
    let currentReducer = reducer
    let currentState = preloadedState
    // 声明 listeners 数组 用于记录在 subscribe中订阅的事件
    let listeners = []
    // 记录当前是否正在进行 dispatch
    let isDispatching = false

    const getState = () => {
        return currentState
    }

    const dispatch = (action) => {
        if (isDispatching) {
            throw new Error('Reducers may not dispatch actions.')
        }
        try {
            isDispatching = true
            currentState = currentReducer(currentState, action)
        } finally {
            isDispatching = false
        }
        listeners.forEach(fn => fn())
        return action
    }

    // subscribe 订阅方法，在 dispatch 后执行 listeners 数组的内容
    const subscribe = (listener) => {
        if (typeof listener !== 'function') {
            throw new Error('listener is not a function')
        }
        // 防止多次调用 unsubscribe 函数
        let isSubscribe = true
        listeners.push(listener)
        return function unsubscribe() {
            if (!isSubscribe) {
                return
            }
            isSubscribe = false
            const index = listeners.findIndex(listener)
            listeners.splice(index, 1)
        }
    }

    const replaceReducer = (nextReducer) => {
        currentReducer = nextReducer
        return store
    }
    // 初始化数据 每个reducer都会返回他的初始值
    dispatch({type: ActionTypes.INIT})
    const store = {
        getState,
        dispatch,
        subscribe,
        replaceReducer
    }
    return store
}


const randomString = () =>
    Math.random().toString(36).substring(7).split('').join('.')

const ActionTypes = {
    INIT: `@@redux/INIT${/* #__PURE__ */ randomString()}`,
    REPLACE: `@@redux/REPLACE${/* #__PURE__ */ randomString()}`,
    PROBE_UNKNOWN_ACTION: () => `@@redux/PROBE_UNKNOWN_ACTION${randomString()}`
}

