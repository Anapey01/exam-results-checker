import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import { fetchUserOrders } from '../services/api';
import './Dashboard.css';

function Dashboard() {
    const [activeTab, setActiveTab] = useState('orders');
    const [expandedOrder, setExpandedOrder] = useState(null);

    // API-driven state
    const [orders, setOrders] = useState([]);
    const [stats, setStats] = useState({ totalOrders: 0, totalCodes: 0, deliveredOrders: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch orders from API on mount
    useEffect(() => {
        const loadOrders = async () => {
            try {
                setIsLoading(true);
                const response = await fetchUserOrders();
                if (response.success) {
                    setOrders(response.data.orders);
                    setStats(response.data.stats);
                }
            } catch (err) {
                setError('Failed to load orders. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };
        loadOrders();
    }, []);

    const handleExportCSV = (order) => {
        const csvContent = 'PIN,Serial Number\n' +
            order.codes.map(c => `${c.pin},${c.serial}`).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `resultgate-${order.id}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="dashboard-page">
            {/* Sidebar */}
            <aside className="dashboard-sidebar">
                <Link to="/" className="dash-logo">
                    <img src={logo} alt="ResultGate" />
                    <span>ResultGate</span>
                </Link>

                <nav className="dash-nav">
                    <button
                        className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
                        onClick={() => setActiveTab('orders')}
                    >
                        <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                            <line x1="12" y1="22.08" x2="12" y2="12" />
                        </svg>
                        <span>Orders</span>
                    </button>
                    <button
                        className={`nav-item ${activeTab === 'support' ? 'active' : ''}`}
                        onClick={() => setActiveTab('support')}
                    >
                        <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                        <span>Support</span>
                    </button>
                    <button
                        className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
                        onClick={() => setActiveTab('settings')}
                    >
                        <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="3" />
                            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                        </svg>
                        <span>Settings</span>
                    </button>
                </nav>

                <div className="dash-user">
                    <div className="user-avatar">JD</div>
                    <div className="user-info">
                        <span className="user-name">John Doe</span>
                        <span className="user-email">john@school.edu</span>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="dashboard-main">
                <header className="dash-header">
                    <div>
                        <h1>Dashboard</h1>
                        <p>Manage your bulk access purchases</p>
                    </div>
                    <Link to="/bulk" state={{ fromDashboard: true }} className="btn btn-accent">
                        + New Bulk Purchase
                    </Link>
                </header>

                {activeTab === 'orders' && (
                    <div className="orders-section">
                        {/* Loading State */}
                        {isLoading && (
                            <div className="loading-state">
                                <div className="loading-spinner"></div>
                                <p>Loading your orders...</p>
                            </div>
                        )}

                        {/* Error State */}
                        {error && (
                            <div className="error-state">
                                <p>{error}</p>
                                <button onClick={() => window.location.reload()}>Retry</button>
                            </div>
                        )}

                        {/* Stats - from API */}
                        {!isLoading && !error && (
                            <>
                                <div className="stats-grid">
                                    <div className="stat-card">
                                        <span className="stat-value">{stats.totalOrders}</span>
                                        <span className="stat-label">Total Orders</span>
                                    </div>
                                    <div className="stat-card">
                                        <span className="stat-value">{stats.totalCodes}</span>
                                        <span className="stat-label">Total Codes</span>
                                    </div>
                                    <div className="stat-card">
                                        <span className="stat-value">{stats.deliveredOrders}</span>
                                        <span className="stat-label">Delivered</span>
                                    </div>
                                </div>

                                {/* Orders Table */}
                                <div className="orders-table-container">
                                    <table className="orders-table">
                                        <thead>
                                            <tr>
                                                <th>Order ID</th>
                                                <th>Date</th>
                                                <th>Quantity</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orders.map((order) => (
                                                <>
                                                    <tr key={order.id}>
                                                        <td data-label="Order ID" className="order-id">{order.id}</td>
                                                        <td data-label="Date">{order.date}</td>
                                                        <td data-label="Quantity">{order.quantity} codes</td>
                                                        <td data-label="Status">
                                                            <span className={`status-badge status-${order.status}`}>
                                                                {order.status}
                                                            </span>
                                                        </td>
                                                        <td className="actions-cell">
                                                            <button
                                                                className="action-btn"
                                                                onClick={() => setExpandedOrder(
                                                                    expandedOrder === order.id ? null : order.id
                                                                )}
                                                            >
                                                                {expandedOrder === order.id ? 'Hide' : 'View'}
                                                            </button>
                                                            <button
                                                                className="action-btn action-export"
                                                                onClick={() => handleExportCSV(order)}
                                                            >
                                                                Export
                                                            </button>
                                                        </td>
                                                    </tr>
                                                    {expandedOrder === order.id && (
                                                        <tr className="expanded-row">
                                                            <td colSpan="5">
                                                                <div className="codes-preview">
                                                                    <h4>Access Codes (showing first 10)</h4>
                                                                    <div className="codes-grid">
                                                                        {order.codes.slice(0, 10).map((code, i) => (
                                                                            <div key={i} className="code-item">
                                                                                <span className="code-label">PIN:</span>
                                                                                <span className="code-value">{code.pin}</span>
                                                                                <span className="code-label">Serial:</span>
                                                                                <span className="code-value">{code.serial}</span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                    <p className="codes-note">
                                                                        Export CSV to view all {order.quantity} codes
                                                                    </p>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {activeTab === 'support' && (
                    <div className="support-section">
                        <div className="support-card">
                            <div className="support-header">
                                <svg className="support-header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                                    <line x1="12" y1="17" x2="12.01" y2="17" />
                                </svg>
                                <div>
                                    <h2>Get Support</h2>
                                    <p>We're here to help you</p>
                                </div>
                            </div>

                            <div className="support-options">
                                <a href="mailto:support@resultgate.com" className="support-option">
                                    <div className="support-icon-wrapper">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                            <polyline points="22,6 12,13 2,6" />
                                        </svg>
                                    </div>
                                    <div className="support-info">
                                        <h3>Email</h3>
                                        <span>support@resultgate.com</span>
                                    </div>
                                    <svg className="support-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="9 18 15 12 9 6" />
                                    </svg>
                                </a>

                                <a href="tel:+233545142658" className="support-option">
                                    <div className="support-icon-wrapper">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                        </svg>
                                    </div>
                                    <div className="support-info">
                                        <h3>Phone</h3>
                                        <span>+233 54 5142658</span>
                                    </div>
                                    <svg className="support-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="9 18 15 12 9 6" />
                                    </svg>
                                </a>

                                <a href="https://wa.me/233545142658" target="_blank" rel="noopener noreferrer" className="support-option support-whatsapp">
                                    <div className="support-icon-wrapper whatsapp">
                                        <svg viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                        </svg>
                                    </div>
                                    <div className="support-info">
                                        <h3>WhatsApp</h3>
                                        <span>Chat with us</span>
                                    </div>
                                    <svg className="support-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="9 18 15 12 9 6" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="settings-section">
                        <div className="settings-card">
                            <h2>Account Settings</h2>
                            <div className="settings-group">
                                <label>Email Address</label>
                                <input type="email" value="john@school.edu" readOnly />
                            </div>
                            <div className="settings-group">
                                <label>Phone Number</label>
                                <input type="tel" value="+233 20 123 4567" readOnly />
                            </div>
                            <div className="settings-group">
                                <label>Organization</label>
                                <input type="text" value="Springfield High School" readOnly />
                            </div>
                            <button className="btn btn-secondary">Update Profile</button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default Dashboard;
