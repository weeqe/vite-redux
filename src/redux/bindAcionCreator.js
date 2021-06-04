export default function bindActionCreators(actionCreators, dispatch) {
    if (typeof actionCreators === 'function') {
        return function (){
            dispatch(actionCreators.apply(this, arguments))
        }
    }
}

