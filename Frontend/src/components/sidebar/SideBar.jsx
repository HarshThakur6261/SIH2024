import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleRight,
  faCalendarAlt,
  faChartPie,
  faHome,
} from "@fortawesome/free-solid-svg-icons";
import { Menu } from "@mui/icons-material";
import styles from "./Sidebar.module.css";

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className={styles.sidebar}>
      {/* Logo Section */}
      <div className={styles.logo}>
        <div className={styles.logoIcon}>
          <img src="/assets/logo.png" alt="Logo" />
        </div>
      </div>

      {/* Profile Section */}
      <div className={styles.profile}>
        <img src="/assets/user.jpeg" alt="User" />
        <div>
          <h4>Rahul Vyass</h4>
          <p>Branch Manager</p>
        </div>
      </div>

      {/* Navigation Section */}
      <nav className={styles.nav}>
        <div className={styles.section}>
          <Link
            to="/Home/Dashboard"
            className={`${styles.navItem} ${
              location.pathname === "/Home/Dashboard" ? styles.active : ""
            }`}
          >
            <FontAwesomeIcon icon={faHome} className={styles.icon} />
            Dashboard
          </Link>
          <Link
            to="/Home/demographic-insights"
            className={`${styles.navItem} ${
              [
                "/Home/demographic-insights",
                "/Home/demographic-insights/maps",
                "/Home/demographic-insights/maps/graphs",
              ].includes(location.pathname)
                ? styles.active
                : ""
            }`}
          >
            <FontAwesomeIcon icon={faChartPie} className={styles.icon} />
            Demographic Insights
          </Link>
          <Link
            to="/Home/calendar"
            className={`${styles.navItem} ${
              location.pathname === "/Home/calendar" ? styles.active : ""
            }`}
          >
            <FontAwesomeIcon icon={faCalendarAlt} className={styles.icon} />
            Calendar
          </Link>
          <Link
            to="/Home/Feedback"
            className={`${styles.navItem} ${
              location.pathname === "/Home/Feedback" ? styles.active : ""
            }`}
          >
            
            <Menu className={styles.icon} />
            Feedback
          </Link>
          <Link
            to="/Home/PredictAccountOpening"
            className={`${styles.navItem} ${
              location.pathname === "/Home/PredictAccountOpening" ? styles.active : ""
            }`}
          >
            
            <Menu className={styles.icon} />
            PredictAccountOpening
          </Link>
          <Link
            to="/Home/Track"
            className={`${styles.navItem} ${
              location.pathname === "/Home/Track" ? styles.active : ""
            }`}
          >
            
            <Menu className={styles.icon} />
            Track
          </Link>
        </div>
      </nav>

      {/* Footer Section */}
      <div className={styles.footer}>
        <Link to="/help" className={styles.help}>
          Help
        </Link>
        <Link to="/logout" className={styles.logout}>
          Logout Account
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
