import React, {createContext, useContext, useEffect, useState} from "react";

export const createStore = (reducer, initState) => {
    store.state = initState
    store.reducer = reducer
    return store
}


const store = {
    state: undefined,
    reducer: undefined,
    setState(newState) {
        store.state = newState
        store.listeners.map(fn => fn())
    },
    listeners: [],
    subscribe: (fn) => {
        store.listeners.push(fn)
        return () => {
            const index = store.listeners.findIndex(fn)
            store.listeners.splice(index, 1)
        }
    }
}

const changed = (oldData, newData) => {
    return Object.keys(oldData).some(key => {
        return oldData[key] !== newData[key]
    })
}

// connect 是react-redux 提供的
export const connect = (selector, dispatchToProps) => Component => {
    return (props) => {
        const {state, setState} = useContext(appContext)
        const [, update] = useState({})
        const data = selector ? selector(state) : {state}
        useEffect(() => {
            const unsubscribe = store.subscribe(() => {
                const newData = selector ? selector(store.state) : {state: store.state}
                // 根据新旧数据是否相等来决定是否跟新
                if (changed(data, newData)) {
                    update({})
                }
            })
            return () => unsubscribe()
        }, [selector])
        const dispatch = (action) => {
            setState(store.reducer(state, action))
        }
        const dispatchers = dispatchToProps ? dispatchToProps(dispatch) : {dispatch}
        return <Component {...props} {...data} {...dispatchers} />
    }
}


export const appContext = createContext(null)

export const Provider = ({store, children}) => {
    return <appContext.Provider value={store}>
        {children}
    </appContext.Provider>
}
