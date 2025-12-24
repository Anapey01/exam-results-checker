import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import './ThemeToggle.css';
import logo from '../assets/logo.png';
import './Navbar.css';

function Navbar() {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = [
        { path: '/', label: 'Home' },
        { path: '/#how-it-works', label: 'How It Works' },
        { path: '/bulk', label: 'For Schools' },
    ];

    const isActive = (path) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path.split('#')[0]);
    };

    const handleNavClick = (path) => {
        setIsMobileMenuOpen(false);
        if (path.includes('#')) {
            const element = document.getElementById(path.split('#')[1]);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    return (
        <nav className="navbar" role="navigation" aria-label="Main navigation">
            <div className="navbar-container">
                {/* Logo */}
                <Link to="/" className="navbar-brand">
                    <img src={logo} alt="ResultGate" className="navbar-logo" />
                    <span className="navbar-title">ResultGate</span>
                </Link>

                {/* Desktop Navigation */}
                <ul className="navbar-nav">
                    {navItems.map((item) => (
                        <li key={item.path}>
                            <Link
                                to={item.path}
                                className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                                onClick={() => handleNavClick(item.path)}
                            >
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* Theme Toggle & CTA */}
                <div className="navbar-actions">
                    <ThemeToggle />
                    <Link to="/single" className="navbar-cta">
                        Access Results
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className={`navbar-toggle ${isMobileMenuOpen ? 'open' : ''}`}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>

            {/* Mobile Menu */}
            <div className={`navbar-mobile ${isMobileMenuOpen ? 'open' : ''}`}>
                <ul className="mobile-nav">
                    {navItems.map((item) => (
                        <li key={item.path}>
                            <Link
                                to={item.path}
                                className={`mobile-link ${isActive(item.path) ? 'active' : ''}`}
                                onClick={() => handleNavClick(item.path)}
                            >
                                {item.label}
                            </Link>
                        </li>
                    ))}
                    <li>
                        <Link
                            to="/single"
                            className="mobile-cta"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Access Results
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;
