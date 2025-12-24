import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import './NotFound.css';

function NotFound() {
    return (
        <div className="not-found-page">
            <div className="not-found-content">
                <Link to="/" className="nf-logo">
                    <img src={logo} alt="ResultGate" />
                    <span>ResultGate</span>
                </Link>

                <div className="nf-illustration">
                    <span className="nf-404">404</span>
                </div>

                <h1>Page Not Found</h1>
                <p>Sorry, the page you're looking for doesn't exist or has been moved.</p>

                <div className="nf-actions">
                    <Link to="/" className="btn btn-accent">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            <polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                        Back to Home
                    </Link>
                    <Link to="/faq" className="btn btn-secondary">
                        Need Help?
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default NotFound;
