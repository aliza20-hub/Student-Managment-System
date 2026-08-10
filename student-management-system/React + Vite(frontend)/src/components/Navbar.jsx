import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/dashboard">SMS</Link>
      </div>
      {isAuthenticated && (
        <div className="navbar-links">
          <Link to="/students">Students</Link>
          <Link to="/courses">Courses</Link>
          <span className="navbar-user">{user.username} · {user.roles.join(', ')}</span>
          <button className="btn-link" onClick={handleLogout}>Log out</button>
        </div>
      )}
    </nav>
  );
}
