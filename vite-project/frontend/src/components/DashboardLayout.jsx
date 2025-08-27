import React, { useState } from "react";
import "./dashboard.css"; // Aquí va tu CSS unificado

const DashboardLayout = ({ 
  title = "Clínica Psicológica", 
  buttons = [], 
  menuItems = [], 
  children 
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "" : "collapsed"}`}>
        <div className="sidebar-header">
          <div className="header-logo">
            <img src="https://via.placeholder.com/46" alt="Logo" />
          </div>
          <button className="sidebar-toggler" onClick={toggleSidebar}>
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
        <nav className="sidebar-nav">
          <ul className="nav-list primary-nav">
            {menuItems.map((item, index) => (
              <li key={index} className="nav-item">
                <button className="nav-link" onClick={item.onClick}>
                  <span className="material-symbols-outlined">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Contenedor principal */}
      <div className="main-container" style={{ marginLeft: sidebarOpen ? 270 : 85 }}>
        {/* Navbar superior */}
        <header className="navbar">
          <h1>{title}</h1>
          <div className="navbar-right">
            {buttons.map((btn, index) => (
              <button key={index} onClick={btn.onClick}>
                <span className="material-symbols-outlined">{btn.icon}</span> {btn.label}
              </button>
            ))}
          </div>
        </header>

        {/* Área de contenido */}
        <main>{children}</main>

        {/* Footer */}
        <footer className="footer">
          <div className="footer-content">
            <p>&copy; 2024 Clínica Psicológica "Alma Libre". Todos los derechos reservados.</p>
            <p><a href="mailto:contacto@clinica.com">Contacto</a></p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;
