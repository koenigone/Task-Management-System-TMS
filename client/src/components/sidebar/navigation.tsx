import "./navigation.css";
import { useState } from "react";
import { Sidebar, Menu, MenuItem, sidebarClasses } from "react-pro-sidebar";
import { Link } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faPlus,
  faChalkboardUser,
  faUsers,
  faGear,
  faAnglesRight,
  faAnglesLeft,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import UserImage from '../../assets/userTempImg.png'

const Navigation = () => {
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
      index: 1,
      link: "/CreateGroup",
      icon: faPlus,
      iconSize: "27px",
      navigation: "Create Group",
    },
    {
      index: 2,
      link: "/MyGroups",
      icon: faChalkboardUser,
      iconSize: "20px",
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
            transition: "width 0.3s ease",
        },
      }}
    >
      <div>
        <Menu>
          <MenuItem onClick={() => setCollapsed(!collapsed)}>
            <FontAwesomeIcon icon={collapsed ? faAnglesRight : faAnglesLeft} />
          </MenuItem>

          <MenuItem>
            <div className="user-info">
              <div className="user-avatar">
                <img src={UserImage} alt="user avatar" />
              </div>
              {!collapsed && (
                <div className="user-info-container">
                  <div className="user-info-username">username</div>
                  <div className="user-info-email">mm6dd.mh@gmail.com</div>
                </div>
              )}
            </div>
          </MenuItem>

          <div className="menu-divide-line"></div>

          {navigationLinks.map((navigation) => (
            <MenuItem className="menu-items" key={navigation.index} component={<Link to={navigation.link} />}>
              <FontAwesomeIcon icon={navigation.icon} style={{ fontSize: navigation.iconSize }} className="menu-icon" />
              {!collapsed && navigation.navigation}
            </MenuItem>
          ))}
        </Menu>
      </div>

      <Menu>
        <div className="menu-divide-line"></div>
        <MenuItem onClick={() => console.log("Signing out...")}>
          <FontAwesomeIcon icon={faSignOutAlt} style={{ fontSize: 23, marginLeft: 7 }} className="menu-icon" />
          {!collapsed && "Sign Out"}
        </MenuItem>
      </Menu>
    </Sidebar>
  );
};

export default Navigation;
