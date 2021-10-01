import React, { useEffect, useState } from "react";
import { useImmerReducer } from "use-immer";
import ReactDOM from "react-dom";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import StateContext from "./StateContext";
import DispatchContext from "./DispatchContext";
import Axios from "axios";
Axios.defaults.baseURL =
  process.env.BACKENDURL || "https://chatappback-end.herokuapp.com/";

//components
import Login from "./components/Login";
import Chat from "./components/Chat";
import Signup from "./components/Signup";
import Flash from "./components/Flash";

function Main() {
  const intialState = {
    loggedIn: Boolean(localStorage.getItem("complexappToken")),
    flashMessages: [],
    user: {
      token: localStorage.getItem("complexappToken"),
      username: localStorage.getItem("complexappUsername"),
    },
  };

  function ourReducer(draft, action) {
    switch (action.type) {
      case "login":
        draft.loggedIn = true;
        draft.user = action.data;
        return;
      case "logout":
        draft.loggedIn = false;
        return;
      case "flashMessage":
        draft.flashMessages.push(action.value);
        return;
    }
  }
  const [state, dispatch] = useImmerReducer(ourReducer, intialState);
  useEffect(() => {
    if (state.loggedIn) {
      localStorage.setItem("complexappToken", state.user.token);
      localStorage.setItem("complexappUsername", state.user.username);
    } else {
      localStorage.removeItem("complexappToken");
      localStorage.removeItem("complexappUsername");
    }
  }, [state.loggedIn]);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <Flash messages={state.flashMessages} />
          <Switch>
            <Route exact path="/">
              {state.loggedIn ? <Chat /> : <Login />}
            </Route>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/signup">
              <Signup />
            </Route>
          </Switch>
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

ReactDOM.render(<Main />, document.querySelector("#app"));

if (module.hot) {
  module.hot.accept();
}
