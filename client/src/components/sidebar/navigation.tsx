import "./navigation.css";
import { useState } from "react";
import { useContext } from "react";
import { UserContext } from "../../../context/userContext";
import { Sidebar, Menu, MenuItem, sidebarClasses } from "react-pro-sidebar";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMediaQuery } from "@chakra-ui/react";
import {
  faHouse,
  faChalkboardUser,
  faUsers,
  faGear,
  faAnglesRight,
  faAnglesLeft,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import UserImage from "../../assets/userTempImg.png";

const Navigation = () => {
  const { user } = useContext(UserContext);
  const [isMobile] = useMediaQuery("(max-width: 768px)"); // mobile
  const [collapsed, setCollapsed] = useState(true);

  const navigationLinks = [
    {
      index: 0,
      link: "/",
      icon: faHouse,
      iconSize: "21px",
      navigation: "Dashboard",
    },
    {
      index: 2,
      link: "/MyGroups",
      icon: faChalkboardUser,
      iconSize: "21px",
      navigation: "My Groups",
    },
    {
      index: 3,
      link: "/JoinedGroups",
      icon: faUsers,
      iconSize: "21px",
      navigation: "Joined Groups",
    },
    {
      index: 4,
      link: "/Settings",
      icon: faGear,
      iconSize: "24px",
      navigation: "Settings",
    },
  ];

  return (
    <>
      {/* Overlay when sidebar is open on mobile */}
      {isMobile && (
        <div
          className={`sidebar-overlay ${!collapsed ? "active" : ""}`}
          onClick={() => setCollapsed(true)}
        ></div>
      )}
      <Sidebar
        collapsed={collapsed}
        className={`sidebar ${collapsed ? "collapsed" : "expanded"}`}
        rootStyles={{
          [`.${sidebarClasses.container}`]: {
            backgroundColor: "#2B3241",
            color: "#FFFFFF",
            display: "flex",
            flexDirection: "column",
            position: "fixed",
            justifyContent: "space-between",
            padding: 0,
            margin: 0,
            height: "100vh",
            transition: "width 0.3s ease, transform 0.3s ease",
            zIndex: 10, /* Lower than overlay */
          },
        }}
      >
        <div>
          <Menu>
            <MenuItem onClick={() => setCollapsed(!collapsed)}>
              <FontAwesomeIcon
                icon={collapsed ? faAnglesRight : faAnglesLeft}
                className="toggle-menu-btn"
              />
            </MenuItem>

            <MenuItem className="user-info-item">
              <div className="user-info-container">
                <div className="user-avatar">
                  <img src={UserImage} alt="user avatar" />
                </div>
                {!collapsed && (
                  <div className="user-info-user-details">
                    <div className="user-info-username">
                      {!!user && <h1>{user.name}</h1>}
                    </div>
                    <div className="user-info-email">
                      {!!user && <h1>{user.email}</h1>}
                    </div>
                  </div>
                )}
              </div>
            </MenuItem>

            <div className="menu-divide-line"></div>

            {navigationLinks.map((navigation) => (
              <MenuItem
                key={navigation.index}
                component={<Link to={navigation.link} />}
              >
                <span className="menu-items">
                  <FontAwesomeIcon
                    icon={navigation.icon}
                    style={{ fontSize: navigation.iconSize }}
                    className="menu-icon"
                  />
                  {!collapsed && navigation.navigation}
                </span>
              </MenuItem>
            ))}
          </Menu>
        </div>

        <Menu>
          <div className="menu-divide-line"></div>
          <MenuItem>
            <FontAwesomeIcon
              icon={faSignOutAlt}
              fontSize={isMobile ? "15px" : "23px"}
              style={{ fontSize: isMobile ? "15px" : "23px", marginLeft: 7 }}
              className="menu-icon"
            />
          </MenuItem>
        </Menu>
      </Sidebar>
    </>
  );
};

export default Navigation;