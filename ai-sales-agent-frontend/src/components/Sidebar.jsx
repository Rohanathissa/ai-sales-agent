import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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

  return (
    <aside className="sidebar">

      <div>

        {/* Logo */}
        <div className="logo">
          <div className="logo-icon">B</div>

          <span className="logo-name">
            BizAdmin
          </span>
        </div>

        {/* Navigation */}
        <nav className="nav">

          <button className="nav-item active" onClick={() => navigate('/dashboard')}>
            <span className="nav-icon">📊</span>
            <span>Dashboard</span>
          </button>

          <button className="nav-item">
            <span className="nav-icon">📦</span>
            <span>Products</span>
          </button>

          <button className="nav-item">
            <span className="nav-icon">👥</span>

            <span>Product Managers</span>

            <span className="admin-badge">
              Admin
            </span>
          </button>

          <button className="nav-item">
            <span className="nav-icon">⚙️</span>
            <span>Settings</span>
          </button>

        </nav>
        <button className="nav-item" onClick={() => navigate('/chat-simulator')}>
          <span className="nav-icon">💬</span>
          <span>Chat Simulator</span>
        </button>
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