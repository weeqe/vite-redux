import React from "react";

import { connect, createStore, Provider } from "./redux";

const initState = {
  userInfo: { name: "z" },
  menu: [],
};

const reducer = (state, action) => {
  if (action.type === "changeUserName") {
    return {
      ...state,
      userInfo: {
        name: action.payload,
      },
    };
  } else if (action.type === "changeMenu") {
    return {
      ...state,
      menu: action.payload,
    };
  } else {
    return state;
  }
};

const store = createStore(reducer, initState);

const App = () => {
  return (
    <Provider store={store}>
      <UserInfo />
      <ChangeUser />
      <A />
      <ChangeMenu />
    </Provider>
  );
};

const A = connect((state) => {
  return {
    menu: state.menu,
  };
})(({ menu }) => {
  console.log("a");
  return <div>menu: {menu}</div>;
});

const ChangeMenu = connect((state) => {
  return {
    menu: state.menu,
  };
})(({ menu, dispatch }) => {
  console.log("menu");
  const handleChange = (e) => {
    dispatch({ type: "changeMenu", payload: e.target.value });
  };
  return <input type="text" value={menu} onChange={handleChange} />;
});

const UserInfo = connect((state) => {
  return {
    userInfo: state.userInfo,
  };
})((props) => {
  console.log("userInfo");
  const { userInfo } = props;
  return <div>USER: {userInfo.name}</div>;
});

const ChangeUser = connect((state) => {
  return {
    name: state.userInfo.name,
  };
})((props) => {
  console.log("ChangeUser");
  const { name, dispatch } = props;
  const handleChange = (e) => {
    dispatch({ type: "changeUserName", payload: e.target.value });
    // changeUserName(e.target.value)
  };

  const fetch = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(123);
      }, 1000);
    });
  };

  const fetchUser = (dis) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        dis({ type: "changeUserName", payload: 233 });
      }, 1000);
    });
  };
  const handleClick = () => {
    dispatch({ type: "changeUserName", payload: fetch() });
    // dispatch(fetchUser)
  };
  return (
    <div>
      <input type="text" value={name} onChange={handleChange} />
      <button onClick={handleClick}>fetch</button>
    </div>
  );
});

export default App;
