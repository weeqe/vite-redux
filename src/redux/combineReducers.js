export default function combineReducers(reducers) {
    const reducerKeys = Object.keys(reducers)
    const finalReducers = {}
    reducerKeys.forEach(key => {
        if (typeof reducers[key] === 'function') {
            finalReducers[key] = reducers[key]
        }
    })
    const finalReducerKeys = Object.keys(finalReducers)

    return function combination(state = {}, action) {
        let hasChanged = false
        const nextState = {}
        finalReducerKeys.forEach(key => {
            const reducer = finalReducers[key]
            const previousStateForKey = state[key]
            const nextStateForKey = reducer(previousStateForKey, action)
            nextState[key] = nextStateForKey
            hasChanged = hasChanged || nextStateForKey !== previousStateForKey
        })
        return hasChanged ? nextState : state
    }
}
