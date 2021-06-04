import React, {useState, useEffect, createContext} from 'react'

let state = undefined
let reducer = undefined
const listeners = []
const setState = (_state) => {
    state = _state
    listeners.forEach(fn => fn())
}


export const createStore = (_reducer, initialState) => {
    state = initialState
    reducer = _reducer
    return store
}

const store = {
    getState() {
        return state
    },
    dispatch: (action) => {
        setState(reducer(state, action))
    },
    subscribe(fn) {
        listeners.push(fn)
        return () => {
            const index = listeners.findIndex(fn)
            listeners.splice(index, 1)
        }
    }
}

const isPromise = (obj) => {
    return obj !== null && (typeof obj === 'function' || typeof obj === 'object') && typeof obj.then === 'function'
}

const prevDispatch = store.dispatch
let dispatch = store.dispatch

dispatch = (fn) => {
    if (typeof fn === 'function') {
        fn(dispatch)
    } else {
        prevDispatch(fn)
    }
}

const prevDispatch2 = dispatch

dispatch = action => {
    const {type, payload} = action
    if (isPromise(payload)) {
        payload.then(data => {
            prevDispatch2({type, payload: data})
        })
    } else {
        prevDispatch2(action)
    }
}

const isChange = (oldData, newData) => {
    return Object.keys(newData).some((key) => {
        return oldData[key] !== newData[key]
    })
}

export const connect = (mapStateToProps, mapDispatchToProps) => (Component) => {
    return (props) => {
        const [, setUpdate] = useState({})
        const data = mapStateToProps ? mapStateToProps(state) : {state}
        useEffect(() => {
            const unsubscribe = store.subscribe(() => {
                const newData = mapStateToProps ? mapStateToProps(state) : {state}
                if (isChange(data, newData)) {
                    setUpdate({})
                }
            })
            return () => unsubscribe()
        }, [mapStateToProps])
        console.log('d', data)
        const newDispatch = mapDispatchToProps ? mapDispatchToProps(dispatch) : {dispatch}
        return <Component  {...data} {...newDispatch} {...props}/>
    }
}

const AppContext = createContext(null)

export const Provider = ({store, children}) => {
    return <AppContext.Provider value={store}>
        {children}
    </AppContext.Provider>
}



