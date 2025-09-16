import React from 'react';
import { Link, useLocation } from 'react-router-dom';

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
      <nav className="sidebar">
        <h1 style={{ marginBottom: '30px', fontSize: '20px', fontWeight: 'bold' }}>
          健康管理アプリ
        </h1>
        <Link 
          to="/" 
          className={`nav-item ${isActive('/') ? 'active' : ''}`}
        >
          ホーム
        </Link>
        <Link 
          to="/record" 
          className={`nav-item ${isActive('/record') ? 'active' : ''}`}
        >
          体調記録
        </Link>
        <Link 
          to="/settings" 
          className={`nav-item ${isActive('/settings') ? 'active' : ''}`}
        >
          設定
        </Link>
      </nav>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;