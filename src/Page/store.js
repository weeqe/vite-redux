import { createStore} from "redux";
import  applyMiddleware from '../redux/applyMiddleware'
// import logger from 'redux-logger'


const initState = {
    userInfo: {
        userName: 'zhangsan',
        age: 12,
    },
    menu: ['xulong', 'boss']
}

const reducer = (state=initState, action) => {
    switch (action.type) {
        case 'changeUser':
            return {...state, userInfo: {...state.userInfo, ...action.payload}}
        default:
            return state
    }
}


const thunk = ({dispatch, getState}) => next => action =>{
    if (typeof action === 'function') {
        return action(dispatch)
    }
    console.log('thunk')
    return next(action)
}

const logger = ({dispatch, getState}) => next => action => {
    const prevState = getState()
    next(action)
    console.group('action', action.type)
    console.log(`%c prev state `, 'color: green; font-weight: 700', prevState)
    console.log('acton', action)
    console.log('next state', getState())
    console.groupEnd()
}


const store = createStore(reducer, applyMiddleware(thunk, logger))

// const prevDispatch = store.dispatch
//
// store.dispatch = (action) => {
//     console.log('prevState: ', store.getState())
//     prevDispatch(action)
//     console.log('nextDispatch: ', store.getState())
// }

export default store
