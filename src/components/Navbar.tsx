import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/admin" className="nav-link">Admin</Link>
        <Link to="/profile" className="nav-link">Profile</Link>
      </div>
    </nav>
  );
}
