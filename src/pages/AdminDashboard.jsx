import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    LogOut,
    TrendingUp,
    Users,
    CreditCard,
    MapPin,
    Upload,
    AlertCircle,
    CheckCircle2,
    Search,
    Menu,
    X,
    Clock,
    Zap
} from 'lucide-react';

function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [file, setFile] = useState(null); // Keep for potential upload logic reuse
    const [uploading, setUploading] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Inventory State
    const [pins, setPins] = useState([]);
    const [pinPage, setPinPage] = useState(1);
    const [totalPins, setTotalPins] = useState(0);

    const navigate = useNavigate();
    const token = localStorage.getItem('adminToken');

    useEffect(() => {
        if (!token) {
            navigate('/admin/login');
            return;
        }
        if (activeTab === 'dashboard') fetchStats();
        if (activeTab === 'inventory') fetchPins();
    }, [token, navigate, activeTab, pinPage]);

    const fetchStats = async () => {
        try {
            const response = await fetch('/api/admin/stats', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.status === 401) return navigate('/admin/login');
            const data = await response.json();
            if (data.success) setStats(data.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const fetchPins = async () => {
        try {
            console.log('Fetching pins page:', pinPage);
            const response = await fetch(`/api/admin/pins?page=${pinPage}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            console.log('Pins API Data:', data);

            if (data.success) {
                setPins(data.data);
                setTotalPins(data.pagination.total);
            } else {
                console.error('Fetch pins failed:', data.message);
            }
        } catch (error) { console.error('Fetch error:', error); }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/api/admin/import-pins', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });
            const data = await response.json();
            if (data.success) {
                alert('Upload Successful: ' + data.message);
                fetchStats();
                setFile(null);
                e.target.reset();
            } else {
                alert('Upload Failed: ' + data.message);
            }
        } catch (error) {
            alert('Upload Error');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="admin-layout" style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: 'Inter, sans-serif' }}>

            {/* Mobile Header */}
            <div style={{ display: 'none', padding: '1rem', background: '#1e293b', alignItems: 'center', justifyContent: 'space-between', position: 'fixed', width: '100%', zIndex: 50 }} className="mobile-header">
                <span style={{ color: 'white', fontWeight: 'bold' }}>RESULTGATE ADMIN</span>
                <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ background: 'none', border: 'none', color: 'white' }}>
                    {mobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Sidebar */}
            <aside className={`sidebar ${mobileMenuOpen ? 'open' : ''}`} style={{
                width: '260px', background: '#1e293b', color: '#94a3b8', display: 'flex', flexDirection: 'column',
                borderRight: '1px solid #334155', transition: 'transform 0.3s ease', zIndex: 40
            }}>
                <div style={{ padding: '2rem', borderBottom: '1px solid #334155' }}>
                    <div style={{ color: 'white', fontWeight: '800', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '32px', height: '32px', background: '#3b82f6', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>RG</div>
                        ANALYTICS
                    </div>
                </div>

                <nav style={{ padding: '1.5rem', flex: 1 }}>
                    <div style={{ marginBottom: '2rem' }}>
                        <p style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '1rem', paddingLeft: '0.75rem' }}>Overview</p>
                        <NavItem
                            icon={<LayoutDashboard size={20} />}
                            label="Dashboard"
                            active={activeTab === 'dashboard'}
                            onClick={() => setActiveTab('dashboard')}
                        />
                        <NavItem icon={<Zap size={20} />} label="Forecasts" badge="AI" />
                    </div>

                    <div>
                        <p style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '1rem', paddingLeft: '0.75rem' }}>Management</p>
                        <NavItem
                            icon={<Package size={20} />}
                            label="Inventory"
                            active={activeTab === 'inventory'}
                            onClick={() => setActiveTab('inventory')}
                        />
                        <NavItem icon={<Users size={20} />} label="Customers" />
                    </div>
                </nav>

                <div style={{ padding: '1.5rem', borderTop: '1px solid #334155' }}>
                    <button
                        onClick={() => { localStorage.removeItem('adminToken'); navigate('/admin/login'); }}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'none', border: 'none', color: '#ef4444', fontWeight: '600', cursor: 'pointer', width: '100%', padding: '0.75rem', borderRadius: '8px', transition: 'background 0.2s' }}
                    >
                        <LogOut size={20} /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, padding: '2rem', overflowY: 'auto', paddingTop: '80px' }} className="main-content">
                {activeTab === 'dashboard' ? (
                    <>
                        <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
                            <div>
                                <h1 style={{ fontSize: '1.875rem', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    Executive Dashboard
                                </h1>
                                <p style={{ color: '#64748b', marginTop: '0.25rem' }}>Real-time business intelligence and sales logistics.</p>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1rem', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', fontWeight: '600', color: '#64748b' }}>
                                    <Search size={18} /> Search
                                </button>
                                <button style={{ padding: '0.6rem 1rem', background: '#0f172a', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600' }}>
                                    Download Report
                                </button>
                            </div>
                        </header>

                        {/* KPI Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                            <KPICard
                                title="Total Revenue"
                                value={`GHS ${stats?.revenue?.toLocaleString() || 0}`}
                                change="+12.5%"
                                positive
                                icon={<CreditCard className="text-emerald-600" size={24} />}
                            />
                            <KPICard
                                title="Retention Rate"
                                value={`${stats?.retentionRate || 0}%`}
                                change="Loyal Customers"
                                positive={true}
                                icon={<Users className="text-blue-600" size={24} />}
                            />
                            <KPICard
                                title="Total Sales"
                                value={stats?.sold?.toLocaleString() || 0}
                                change="+8.2%"
                                positive
                                icon={<TrendingUp className="text-indigo-600" size={24} />}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>

                            {/* Inventory Forecast Table */}
                            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                                <div style={{ padding: '1.25rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h3 style={{ fontWeight: '700', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Package size={18} /> Inventory Forecast
                                    </h3>
                                </div>
                                <div className="table-responsive" style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                                        <thead>
                                            <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                                                <th style={table.th}>Exam</th>
                                                <th style={table.th}>Stock</th>
                                                <th style={table.th}>Runout Est.</th>
                                                <th style={table.th}>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {stats?.inventory?.map((item, i) => (
                                                <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                                    <td style={table.td}><b>{item.type}</b></td>
                                                    <td style={table.td}>{item.available}</td>
                                                    <td style={{ ...table.td, color: item.stockoutDays < 7 && item.stockoutDays >= 0 ? '#ef4444' : '#64748b', fontWeight: '600' }}>
                                                        {item.stockoutDays === -1 ? 'Calculating...' : (item.stockoutDays < 999 ? `${item.stockoutDays} Days` : '> 30 Days')}
                                                    </td>
                                                    <td style={table.td}>
                                                        <Badge type={item.stockoutDays !== -1 && item.stockoutDays < 7 ? 'danger' : 'success'}>
                                                            {item.stockoutDays !== -1 && item.stockoutDays < 7 ? 'Restock Soon' : 'Healthy'}
                                                        </Badge>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Peak Hours & Geo */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                                {/* Peak Hours Heatmap */}
                                <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.5rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                        <div>
                                            <h3 style={{ fontWeight: '700', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <Clock size={18} /> Peak Sales Hours
                                            </h3>
                                            <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Best time to run ads.</p>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'flex-end', height: '100px', gap: '8px' }}>
                                        {stats?.busyHours?.map((h, i) => (
                                            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                                                <div style={{ width: '100%', height: `${(h.sales / 100) * 100}%`, background: i === 3 ? '#ec4899' : '#cbd5e1', borderRadius: '4px' }}></div>
                                                <span style={{ fontSize: '0.65rem', color: '#64748b' }}>{h.hour}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#fdf2f8', borderRadius: '8px', border: '1px solid #fbcfe8' }}>
                                        <p style={{ fontSize: '0.75rem', color: '#db2777', fontWeight: '600' }}>
                                            🔥 Insight: Run ads at 6PM for max conversion.
                                        </p>
                                    </div>
                                </div>

                                {/* Location Intelligence */}
                                <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.5rem' }}>
                                    <h3 style={{ fontWeight: '700', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                        <MapPin size={18} /> Geo-Targeting
                                    </h3>
                                    {stats?.geoStats?.map((geo, idx) => (
                                        <div key={idx} style={{ marginBottom: '0.75rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                                <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>{geo.region}</span>
                                                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{geo.percentage}%</span>
                                            </div>
                                            <div style={{ width: '100%', height: '4px', background: '#f1f5f9', borderRadius: '2px' }}>
                                                <div style={{ width: `${geo.percentage}%`, height: '100%', background: '#2563eb' }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Import Card */}
                                <div style={{ background: '#f8fafc', borderRadius: '12px', border: '2px dashed #e2e8f0', padding: '1rem', textAlign: 'center' }}>
                                    <form onSubmit={handleUpload}>
                                        <input
                                            type="file"
                                            accept=".csv"
                                            onChange={(e) => setFile(e.target.files[0])}
                                            style={{ display: 'block', width: '100%', fontSize: '0.75rem', marginBottom: '0.5rem' }}
                                        />
                                        <button type="submit" disabled={!file || uploading} style={{ width: '100%', padding: '0.5rem', background: file ? '#0f172a' : '#cbd5e1', color: 'white', fontWeight: '600', borderRadius: '6px', border: 'none', cursor: file ? 'pointer' : 'not-allowed', fontSize: '0.75rem' }}>
                                            {uploading ? 'Processing...' : 'Upload CSV'}
                                        </button>
                                    </form>
                                </div>

                            </div>
                        </div>

                        {/* Style Helpers */}
                        <style>{`
                    @media (max-width: 768px) {
                        .sidebar { transform: translateX(-100%); position: fixed; height: 100%; top: 0; }
                        .sidebar.open { transform: translateX(0); }
                        .mobile-header { display: flex !important; }
                        .main-content { padding-top: 80px !important; padding: 1rem !important; }
                    }
                `}</style>
                    </>
                ) : (
                    <div style={{ background: 'white', borderRadius: '12px', padding: '2rem', border: '1px solid #e2e8f0' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Package /> Inventory Management
                        </h2>
                        <div className="table-responsive" style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                                <thead style={{ background: '#f8fafc', fontWeight: '600', textAlign: 'left' }}>
                                    <tr>
                                        <th style={table.th}>ID</th>
                                        <th style={table.th}>Exam Type</th>
                                        <th style={table.th}>Serial</th>
                                        <th style={table.th}>PIN</th>
                                        <th style={table.th}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pins.map(pin => (
                                        <tr key={pin.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                            <td style={table.td}>#{pin.id}</td>
                                            <td style={table.td}><b>{pin.examType}</b></td>
                                            <td style={table.td}>{pin.serial}</td>
                                            <td style={table.td}><span style={{ fontFamily: 'monospace', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>{pin.pin}</span></td>
                                            <td style={table.td}>
                                                <Badge type={pin.status === 'AVAILABLE' ? 'success' : 'danger'}>{pin.status}</Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                            <button disabled={pinPage === 1} onClick={() => setPinPage(p => p - 1)} style={{ padding: '0.5rem 1rem', background: '#cbd5e1', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Prev</button>
                            <span style={{ padding: '0.5rem 1rem' }}>Page {pinPage} of {Math.ceil(totalPins / 50)}</span>
                            <button disabled={pinPage * 50 >= totalPins} onClick={() => setPinPage(p => p + 1)} style={{ padding: '0.5rem 1rem', background: '#0f172a', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Next</button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

function NavItem({ icon, label, active, badge, onClick }) {
    return (
        <div onClick={onClick} style={{ display: 'flex', alignItems: 'center', padding: '0.75rem', color: active ? 'white' : '#94a3b8', background: active ? '#334155' : 'transparent', borderRadius: '8px', cursor: 'pointer', marginBottom: '0.25rem', transition: 'all 0.2s' }}>
            {icon}
            <span style={{ marginLeft: '0.75rem', fontWeight: '500', fontSize: '0.875rem' }}>{label}</span>
            {badge && <span style={{ marginLeft: 'auto', fontSize: '0.6rem', fontWeight: '700', background: '#3b82f6', color: 'white', padding: '2px 6px', borderRadius: '4px' }}>{badge}</span>}
        </div>
    )
}

function KPICard({ title, value, change, positive, icon }) {
    return (
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: '500' }}>{title}</span>
                <div style={{ padding: '8px', background: '#f8fafc', borderRadius: '8px' }}>{icon}</div>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.25rem' }}>{value}</div>
            <div style={{ fontSize: '0.75rem', fontWeight: '600', color: positive ? '#16a34a' : '#ef4444', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                {positive ? <TrendingUp size={12} /> : <AlertCircle size={12} />}
                {change}
            </div>
        </div>
    )
}

function Badge({ children, type }) {
    const bg = type === 'success' ? '#dcfce7' : '#fee2e2';
    const color = type === 'success' ? '#166534' : '#991b1b';
    return (
        <span style={{ background: bg, color: color, padding: '4px 10px', borderRadius: '99px', fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase' }}>
            {children}
        </span>
    )
}

const table = {
    th: { padding: '1rem', fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b', fontWeight: '600', borderBottom: '1px solid #e2e8f0' },
    td: { padding: '1rem', color: '#334155', borderBottom: '1px solid #f1f5f9' }
};

export default AdminDashboard;
