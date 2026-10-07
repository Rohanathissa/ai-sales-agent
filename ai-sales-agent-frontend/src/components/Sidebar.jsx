import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Generate initials from user's name (e.g. "Rohana Hettiarachchi" -> "RH")
  const getInitials = (name) => {
    if (!name) return '??';
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const isProductsActive = location.pathname === '/dashboard' && location.hash === '#products-section';
  const isManagersActive = location.pathname === '/dashboard' && location.hash === '#managers-section';
  const isChatActive = location.pathname === '/chat-simulator';
  const isManualActive = location.pathname === '/user-manual';
  const isDashboardActive = location.pathname === '/dashboard' && !isProductsActive && !isManagersActive;

  const handleDashboardClick = () => {
    if (location.pathname === '/dashboard') {
      window.history.pushState(null, '', '/dashboard');
      const mainContent = document.querySelector('.content');
      if (mainContent) mainContent.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/dashboard');
    }
  };

  const handleProductsClick = () => {
    if (location.pathname === '/dashboard') {
      window.location.hash = '#products-section';
      const el = document.getElementById('products-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/dashboard#products-section');
    }
  };

  const handleManagersClick = () => {
    if (location.pathname === '/dashboard') {
      window.location.hash = '#managers-section';
      const el = document.getElementById('managers-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/dashboard#managers-section');
    }
  };

  return (
    <aside className="sidebar">

      <div>

        {/* Logo */}
        <div className="logo" style={{ cursor: 'pointer' }} onClick={handleDashboardClick}>
          <div className="logo-icon">B</div>

          <span className="logo-name">
            BizAdmin
          </span>
        </div>

        {/* Navigation */}
        <nav className="nav">

          <button className={`nav-item ${isDashboardActive ? 'active' : ''}`} onClick={handleDashboardClick}>
            <span className="nav-icon">📊</span>
            <span>Dashboard</span>
          </button>

          <button className={`nav-item ${isProductsActive ? 'active' : ''}`} onClick={handleProductsClick}>
            <span className="nav-icon">📦</span>
            <span>Products</span>
          </button>

          <button className={`nav-item ${isManagersActive ? 'active' : ''}`} onClick={handleManagersClick}>
            <span className="nav-icon">👥</span>
            <span>Product Managers</span>

            <span className="admin-badge">
              Admin
            </span>
          </button>

          <button className={`nav-item ${isChatActive ? 'active' : ''}`} onClick={() => navigate('/chat-simulator')}>
            <span className="nav-icon">💬</span>
            <span>Chat Simulator</span>
          </button>

          <button className={`nav-item ${isManualActive ? 'active' : ''}`} onClick={() => navigate('/user-manual')}>
            <span className="nav-icon">📖</span>
            <span>User Manual</span>
          </button>
        </nav>
      </div>

      {/* User */}
      <div className="user-footer">

        <div className="avatar">
          {getInitials(user?.name)}
        </div>

        <div className="user-info">

          <p className="user-name">
            {user?.name || 'Unknown User'}
          </p>

          <p className="user-email">
            {user?.email || ''}
          </p>

        </div>

        <button className="logout-btn" onClick={handleLogout} title="Logout">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
            <line x1="12" y1="2" x2="12" y2="12" />
          </svg>
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;