import { NavLink } from "react-router";
import styles from "./Nav.module.css";
import logoImg from "../../assets/logo.png";
import { useAuth } from "../../context/AuthContext";

const Navbar = (): React.JSX.Element => {
  const { user, logout } = useAuth();
  const getLinkClass = ({ isActive }: { isActive: boolean }): string => {
    return isActive ? `${styles.link} ${styles.active}` : styles.link;
  };

  return (
    <header className={styles.header}>
      <nav className={`${styles.navbar} container`}>
        <NavLink to="/" className={styles.logo}>
          <img src={logoImg} alt="Job Market" className={styles.logoImg} />
          <span>Job Market</span>
        </NavLink>

        <div className={styles.links}>
          <NavLink to="/" className={getLinkClass}>
            Dashboard
          </NavLink>

          <NavLink to="/jobs" className={getLinkClass}>
            Jobs
          </NavLink>

          <NavLink to="/companies" className={getLinkClass}>
            Companies
          </NavLink>
        </div>

        <div className={styles.user}>
          {user?.picture && (
            <img
              src={user.picture}
              alt={user?.name ?? "User"}
              className={styles.avatar}
            />
          )}

          <span className={styles.userName}>{user?.name ?? "Guest"}</span>

          <button
            type="button"
            className={styles.logoutButton}
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
