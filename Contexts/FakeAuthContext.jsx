import { createContext, useReducer } from "react";

const initialObj = { user: null, isAuthenticated: false, loginError: "" };
function reducer(state, action) {
  switch (action.type) {
    case "login/success":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loginError: "",
      };
    case "logout":
      return { ...state, user: action.payload, isAuthenticated: false };
    case "login/fail":
      return {
        ...state,
        loginError: "Incorrect Email/Password",
      };
    default:
      throw new Error("Unknown Action");
  }
}

const FAKE_USER = {
  name: "Jack",
  email: "jack@example.com",
  password: "qwerty",
  avatar: "https://i.pravatar.cc/100?u=zz",
};

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialObj);
  const { user, isAuthenticated, loginError } = state;

  function login(userName, password) {
    userName === FAKE_USER.email && password === FAKE_USER.password
      ? dispatch({ type: "login/success", payload: FAKE_USER })
      : dispatch({
          type: "login/fail",
        });
  }

  function logout() {
    dispatch({ type: "logout", payload: null });
  }

  return (
    <AuthContext.Provider
      value={{ login, logout, user, isAuthenticated, loginError }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
