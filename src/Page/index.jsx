import React from 'react'
import {connect, Provider} from "react-redux";
import store from "./store";



const App = () => {
    return <Provider store={store}>
        <UserInfo />
        <Menu />
    </Provider>
}

const UserInfo = connect((state) => {
    return {
        userInfo: state.userInfo
    }
})(props => {
    // thunk
    const changeUser = dispatch => {
        setTimeout(() => {
            dispatch({type: 'changeUser', payload: {userName: 'lisi'} })
        }, 2000)
    }

    const handleChange = () => {
        // props.dispatch({type: 'changeUser', payload: {userName: 'lisi'} })
        props.dispatch(changeUser)
        // console.log('props dispatch', props.dispatch)
    }
    return <div>
        userName: {props.userInfo.userName}
        <button onClick={handleChange}>change user </button>
    </div>
})

const Menu = connect()(props => {
    // console.log('menu', props)
    return <div>menu</div>
})


export default App
