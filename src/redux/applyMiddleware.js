export default function applyMiddleware(...middlewares) {
    return (createStore) => (reducer, preloadedState) => {
        const store = createStore(reducer, preloadedState)
        let dispatch = () => {
            throw new Error(
                'Dispatching while constructing your middleware is not allowed. ' +
                'Other middleware would not be applied to this dispatch.'
            )
        }
        const middlewareAPI = {
            getState: store.getState,
            dispatch: (action, ...args) =>  {
                return dispatch(action, ...args)
            }
        }

        const chain = middlewares.map(middleware => middleware(middlewareAPI))
        dispatch = compose(...chain)(store.dispatch)
        return {
            ...store,
            dispatch
        }
    }
}
//合成的多个函数。预计每个函数都接收一个参数。它的返回值将作为一个参数提供给它左边的函数
function compose(...funcs) {
    if (funcs.length === 0) {
        return (args) => args
    }
    if (funcs.length === 1) {
        return funcs[0]
    }
    return funcs.reduce((a,b) => (...args) => a(b(...args)))
}
