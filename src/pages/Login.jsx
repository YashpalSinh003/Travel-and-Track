import { Link, useNavigate } from "react-router-dom";
import AppNav from "../components/PageNav";
import styles from "./Login.module.css";
import { useEffect, useState } from "react";
import useAuth from "../Hooks/useAuth";

export default function Login() {
  // PRE-FILL FOR DEV PURPOSES
  const [email, setEmail] = useState("jack@example.com");
  const [password, setPassword] = useState("qwerty");
  const { login, isAuthenticated, loginError } = useAuth();
  const navigate = useNavigate();

  function handleLogin() {
    if (email && password) login(email, password);
  }

  useEffect(
    function () {
      if (isAuthenticated) navigate("/applayout", { replace: true });
    },
    [isAuthenticated, navigate]
  );

  return (
    <main className={styles.login}>
      <AppNav />
      <form className={styles.form}>
        <div className={styles.row}>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>

        <div className={styles.loginError}>
          <Link>
            <button className={styles.btnLogin} onClick={handleLogin}>
              Login
            </button>
          </Link>
          {loginError ? (
            <h3 className={styles.errMessage}>{loginError}</h3>
          ) : null}
        </div>
      </form>
    </main>
  );
}
