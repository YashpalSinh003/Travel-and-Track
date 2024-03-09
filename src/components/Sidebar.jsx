import styles from "./Sidebar.module.css";
import Logo from "./Logo.jsx";
import { Outlet } from "react-router-dom";
import AppNav from "./AppNav";

export default function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <Logo />
      <AppNav />
      <Outlet />
    </div>
  );
}
