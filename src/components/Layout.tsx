import React from "react";
import { Link, useLocation } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="app">
      <header className="header">
        <Link to="/settings" className="settings-icon" title="設定">
          ⚙️
        </Link>
      </header>
      <main className="main-content">{children}</main>
    </div>
  );
};

export default Layout;
