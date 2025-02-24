import "./layout.css";
import { Outlet } from "react-router-dom";
import Sidebar from "./components/sidebar/navigation";
import Header from "./components/Header/header";

const Layout = () => {
  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside>
        <Sidebar />
      </aside>

      {/* Main Content */}
      <div className="main-content-container">
        {/* Header */}
        <header>
          <Header />
        </header>

        {/* Page Content */}
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;