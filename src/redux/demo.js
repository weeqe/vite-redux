function counter(state = 0, action) {
    switch (action.type) {
        case 'INCREMENT':
            return state + 1
        case 'DECREMENT':
            return state - 1
        default:
            return state
    }
}

function todos(state = [], action) {
    switch (action.type) {
        case 'ADD_TODO':
            return state.concat([action.text])
        default:
            return state
    }
}

import combineReducers from './combineReducers'
import createStore from "./index";
import bindActionCreators from './bindAcionCreator'

const reducer = combineReducers({
    todos: todos,
    counter: counter
})




const store = createStore(reducer)

// store.dispatch({
//     type: 'ADD_TODO',
//     text: 'Use Redux'
// })

// actionCreator
const ChangeText = (text) => {
    return {
        type: 'ADD_TODO',
        text
    }
}

store.subscribe(() => {
    console.log(11, store.getState())
})

const handleChangeText = bindActionCreators(ChangeText, store.dispatch)
handleChangeText('this is text')
console.log(store.getState())


// 正常我们的 dispatch 接收一个action 是有type类型的对象 如 dispatch({type: 'add', payload: 1})
// 如果我们想 dispatch({type: 'add', payload: fetchNum}) 就需要用第三方插件
