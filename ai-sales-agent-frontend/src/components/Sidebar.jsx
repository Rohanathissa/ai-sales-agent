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

  const isDashboardActive = location.pathname === '/dashboard' || location.pathname === '/';
  const isProductsActive = location.pathname === '/products';
  const isManagersActive = location.pathname === '/managers';
  const isChatActive = location.pathname === '/chat-simulator';
  const isManualActive = location.pathname === '/user-manual';
  const isLegalActive = location.pathname.startsWith('/privacy') || location.pathname.startsWith('/terms') || location.pathname.startsWith('/return') || location.pathname.startsWith('/legal');

  const handleDashboardClick = () => {
    navigate('/dashboard');
  };

  const handleProductsClick = () => {
    navigate('/products');
  };

  const handleManagersClick = () => {
    navigate('/managers');
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

          <button className={`nav-item ${isLegalActive ? 'active' : ''}`} onClick={() => navigate('/privacy')}>
            <span className="nav-icon">🛡️</span>
            <span>Legal & Policies</span>
          </button>
        </nav>
      </div>

      {/* User */}
      <div className="user-footer">

        <div className="avatar">
          {user ? getInitials(user?.name) : 'GC'}
        </div>

        <div className="user-info">
          <p className="user-name">
            {user?.name || 'GemConnect'}
          </p>
          <p className="user-email">
            {user?.email || 'Public Policy View'}
          </p>
        </div>

        <button className="logout-btn" onClick={handleLogout} title={user ? "Logout" : "Admin Login"}>
          {user ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
              <line x1="12" y1="2" x2="12" y2="12" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
          )}
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;