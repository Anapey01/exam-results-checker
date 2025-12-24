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
    Search,
    Menu,
    X,
    Clock,
    Zap,
    Lightbulb,
    FileUp,
    Moon,
    Sun,
    Bell,
    Activity,
    ShoppingCart,
    ArrowUpRight,
    ArrowDownRight,
    Settings,
    History,
    Download,
    Trash2,
    CheckSquare,
    Square
} from 'lucide-react';
import {
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    XAxis
} from 'recharts';

// Mock revenue data for chart
const revenueData = [
    { day: 'Mon', revenue: 1200 },
    { day: 'Tue', revenue: 2100 },
    { day: 'Wed', revenue: 800 },
    { day: 'Thu', revenue: 1600 },
    { day: 'Fri', revenue: 2400 },
    { day: 'Sat', revenue: 1800 },
    { day: 'Sun', revenue: 2200 },
];

// Mock activity feed
const activityFeed = [
    { id: 1, type: 'sale', message: 'WASSCE PIN sold to Accra', time: '2 min ago', amount: 50 },
    { id: 2, type: 'sale', message: 'BECE PIN sold to Kumasi', time: '5 min ago', amount: 30 },
    { id: 3, type: 'upload', message: '200 new PINs imported', time: '12 min ago' },
    { id: 4, type: 'sale', message: 'WASSCE PIN sold to Takoradi', time: '18 min ago', amount: 50 },
    { id: 5, type: 'alert', message: 'NVTI stock running low', time: '25 min ago' },
];

// Color palette
const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

    // Inventory State
    const [pins, setPins] = useState([]);
    const [pinPage, setPinPage] = useState(1);
    const [totalPins, setTotalPins] = useState(0);

    const navigate = useNavigate();
    const token = localStorage.getItem('adminToken');

    // Theme colors
    const theme = {
        bg: darkMode ? '#0f172a' : '#f8fafc',
        card: darkMode ? '#1e293b' : 'white',
        cardBorder: darkMode ? '#334155' : '#e2e8f0',
        text: darkMode ? '#f1f5f9' : '#0f172a',
        textMuted: darkMode ? '#94a3b8' : '#64748b',
        sidebar: darkMode ? '#0f172a' : '#1e293b',
    };

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
            const response = await fetch(`/api/admin/pins?page=${pinPage}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setPins(data.data);
                setTotalPins(data.pagination.total);
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
            } else {
                alert('Upload Failed: ' + data.message);
            }
        } catch (error) {
            alert('Upload Error');
        } finally {
            setUploading(false);
        }
    };

    // Prepare pie chart data
    const pieData = stats?.inventory?.map(item => ({
        name: item.type,
        value: item.available
    })) || [];

    return (
        <div className="admin-layout" style={{
            display: 'flex',
            minHeight: '100vh',
            background: theme.bg,
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            transition: 'background 0.3s ease'
        }}>

            {/* Mobile Header */}
            <div className="mobile-header" style={{
                display: 'none',
                padding: '1rem',
                background: theme.sidebar,
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'fixed',
                width: '100%',
                zIndex: 50
            }}>
                <span style={{ color: 'white', fontWeight: 'bold' }}>RESULTGATE</span>
                <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ background: 'none', border: 'none', color: 'white' }}>
                    {mobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Sidebar */}
            <aside className={`sidebar ${mobileMenuOpen ? 'open' : ''}`} style={{
                width: '260px',
                background: theme.sidebar,
                color: '#94a3b8',
                display: 'flex',
                flexDirection: 'column',
                borderRight: `1px solid ${darkMode ? '#1e293b' : '#334155'}`,
                transition: 'all 0.3s ease',
                zIndex: 40
            }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid #334155' }}>
                    <div style={{ color: 'white', fontWeight: '800', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img
                            src="/logo.png"
                            alt="ResultGate"
                            style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '10px',
                                objectFit: 'contain'
                            }}
                        />
                        <div>
                            <div style={{ fontSize: '0.9rem' }}>ResultGate</div>
                            <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: '500' }}>Admin Console</div>
                        </div>
                    </div>
                </div>

                <nav style={{ padding: '1rem', flex: 1 }}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <p style={{ fontSize: '0.65rem', fontWeight: '600', textTransform: 'uppercase', marginBottom: '0.75rem', paddingLeft: '0.75rem', letterSpacing: '0.05em' }}>Overview</p>
                        <NavItem
                            icon={<LayoutDashboard size={18} />}
                            label="Dashboard"
                            active={activeTab === 'dashboard'}
                            onClick={() => setActiveTab('dashboard')}
                        />
                        <NavItem
                            icon={<Zap size={18} />}
                            label="Forecasts"
                            badge="AI"
                            active={activeTab === 'forecasts'}
                            onClick={() => setActiveTab('forecasts')}
                        />
                        <NavItem
                            icon={<Activity size={18} />}
                            label="Analytics"
                            badge="New"
                            active={activeTab === 'analytics'}
                            onClick={() => setActiveTab('analytics')}
                        />
                    </div>

                    <div>
                        <p style={{ fontSize: '0.65rem', fontWeight: '600', textTransform: 'uppercase', marginBottom: '0.75rem', paddingLeft: '0.75rem', letterSpacing: '0.05em' }}>Management</p>
                        <NavItem
                            icon={<Package size={18} />}
                            label="Inventory"
                            active={activeTab === 'inventory'}
                            onClick={() => setActiveTab('inventory')}
                        />
                        <NavItem
                            icon={<Users size={18} />}
                            label="Customers"
                            active={activeTab === 'customers'}
                            onClick={() => setActiveTab('customers')}
                        />
                        <NavItem
                            icon={<ShoppingCart size={18} />}
                            label="Orders"
                            active={activeTab === 'orders'}
                            onClick={() => setActiveTab('orders')}
                        />
                        <NavItem
                            icon={<History size={18} />}
                            label="Audit Log"
                            active={activeTab === 'auditlog'}
                            onClick={() => setActiveTab('auditlog')}
                        />
                        <NavItem
                            icon={<Settings size={18} />}
                            label="Settings"
                            active={activeTab === 'settings'}
                            onClick={() => setActiveTab('settings')}
                        />
                    </div>
                </nav>

                <div style={{ padding: '1rem', borderTop: '1px solid #334155' }}>
                    <button
                        onClick={() => { localStorage.removeItem('adminToken'); navigate('/admin/login'); }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: 'none',
                            color: '#ef4444',
                            fontWeight: '600',
                            cursor: 'pointer',
                            width: '100%',
                            padding: '0.75rem',
                            borderRadius: '8px',
                            fontSize: '0.875rem',
                            transition: 'background 0.2s'
                        }}
                    >
                        <LogOut size={18} /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, padding: '1.5rem 2rem', overflowY: 'auto' }} className="main-content">
                {activeTab === 'dashboard' && (
                    <>
                        {/* Header with Dark Mode & Notifications */}
                        <header style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                            <div>
                                <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: theme.text, marginBottom: '0.25rem' }}>
                                    Executive Dashboard
                                </h1>
                                <p style={{ color: theme.textMuted, fontSize: '0.875rem' }}>Real-time business intelligence</p>
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                {/* Dark Mode Toggle */}
                                <button
                                    onClick={() => setDarkMode(!darkMode)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: '40px',
                                        height: '40px',
                                        background: theme.card,
                                        border: `1px solid ${theme.cardBorder}`,
                                        borderRadius: '10px',
                                        cursor: 'pointer',
                                        color: theme.textMuted,
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                                </button>

                                {/* Notifications */}
                                <div style={{ position: 'relative' }}>
                                    <button
                                        onClick={() => setShowNotifications(!showNotifications)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: '40px',
                                            height: '40px',
                                            background: theme.card,
                                            border: `1px solid ${theme.cardBorder}`,
                                            borderRadius: '10px',
                                            cursor: 'pointer',
                                            color: theme.textMuted,
                                            position: 'relative'
                                        }}
                                    >
                                        <Bell size={18} />
                                        <span style={{
                                            position: 'absolute',
                                            top: '8px',
                                            right: '8px',
                                            width: '8px',
                                            height: '8px',
                                            background: '#ef4444',
                                            borderRadius: '50%'
                                        }}></span>
                                    </button>

                                    {/* Notifications Dropdown */}
                                    {showNotifications && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '50px',
                                            right: 0,
                                            width: '320px',
                                            background: theme.card,
                                            border: `1px solid ${theme.cardBorder}`,
                                            borderRadius: '12px',
                                            boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                                            zIndex: 100,
                                            overflow: 'hidden'
                                        }}>
                                            <div style={{ padding: '1rem', borderBottom: `1px solid ${theme.cardBorder}` }}>
                                                <h4 style={{ fontWeight: '600', color: theme.text, fontSize: '0.875rem' }}>Notifications</h4>
                                            </div>
                                            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                                <NotificationItem title="Low Stock Alert" message="NVTI inventory running low" time="25m ago" type="warning" theme={theme} />
                                                <NotificationItem title="New Sale" message="WASSCE PIN sold to Accra" time="2m ago" type="success" theme={theme} />
                                                <NotificationItem title="Import Complete" message="200 new PINs imported" time="12m ago" type="info" theme={theme} />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <button style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.6rem 1rem',
                                    background: theme.card,
                                    border: `1px solid ${theme.cardBorder}`,
                                    borderRadius: '10px',
                                    fontWeight: '500',
                                    color: theme.textMuted,
                                    fontSize: '0.875rem',
                                    cursor: 'pointer'
                                }}>
                                    <Search size={16} /> Search
                                </button>
                            </div>
                        </header>

                        {/* KPI Grid with Skeleton Loading */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                            {loading ? (
                                <>
                                    <SkeletonCard theme={theme} />
                                    <SkeletonCard theme={theme} />
                                    <SkeletonCard theme={theme} />
                                    <SkeletonCard theme={theme} />
                                </>
                            ) : (
                                <>
                                    <KPICard
                                        title="Total Revenue"
                                        value={`GHS ${stats?.revenue?.toLocaleString() || 0}`}
                                        change="+12.5%"
                                        positive
                                        icon={<CreditCard size={20} />}
                                        theme={theme}
                                        sparkData={[30, 40, 35, 50, 49, 60, 70]}
                                    />
                                    <KPICard
                                        title="Total Inventory"
                                        value={stats?.available?.toLocaleString() || 0}
                                        change={`${stats?.sold || 0} sold`}
                                        positive
                                        icon={<Package size={20} />}
                                        theme={theme}
                                        sparkData={[20, 30, 25, 40, 35, 45, 50]}
                                    />
                                    <KPICard
                                        title="Retention Rate"
                                        value={`${stats?.retentionRate || 0}%`}
                                        change="Loyalty"
                                        positive={true}
                                        icon={<Users size={20} />}
                                        theme={theme}
                                        sparkData={[15, 18, 20, 19, 22, 24, 25]}
                                    />
                                    <KPICard
                                        title="Total Sales"
                                        value={stats?.sold?.toLocaleString() || 0}
                                        change="+8.2%"
                                        positive
                                        icon={<TrendingUp size={20} />}
                                        theme={theme}
                                        sparkData={[10, 15, 12, 20, 18, 25, 30]}
                                    />
                                </>
                            )}
                        </div>

                        {/* Charts Row */}
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>

                            {/* Revenue Chart */}
                            <div style={{
                                background: theme.card,
                                borderRadius: '16px',
                                border: `1px solid ${theme.cardBorder}`,
                                padding: '1.25rem',
                                boxShadow: darkMode ? 'none' : '0 1px 3px rgba(0,0,0,0.05)'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <div>
                                        <h3 style={{ fontWeight: '600', color: theme.text, fontSize: '0.95rem' }}>Revenue Trend</h3>
                                        <p style={{ fontSize: '0.75rem', color: theme.textMuted }}>Last 7 days</p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <span style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem', background: darkMode ? '#334155' : '#f1f5f9', borderRadius: '4px', color: theme.textMuted }}>Daily</span>
                                    </div>
                                </div>
                                <ResponsiveContainer width="100%" height={180}>
                                    <AreaChart data={revenueData}>
                                        <defs>
                                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: theme.textMuted }} />
                                        <Tooltip
                                            contentStyle={{
                                                background: theme.card,
                                                border: `1px solid ${theme.cardBorder}`,
                                                borderRadius: '8px',
                                                fontSize: '0.75rem'
                                            }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="revenue"
                                            stroke="#3b82f6"
                                            strokeWidth={2}
                                            fillOpacity={1}
                                            fill="url(#colorRevenue)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Inventory Distribution Pie */}
                            <div style={{
                                background: theme.card,
                                borderRadius: '16px',
                                border: `1px solid ${theme.cardBorder}`,
                                padding: '1.25rem',
                                boxShadow: darkMode ? 'none' : '0 1px 3px rgba(0,0,0,0.05)'
                            }}>
                                <h3 style={{ fontWeight: '600', color: theme.text, fontSize: '0.95rem', marginBottom: '0.5rem' }}>Inventory by Type</h3>
                                <p style={{ fontSize: '0.75rem', color: theme.textMuted, marginBottom: '1rem' }}>Current stock distribution</p>
                                <ResponsiveContainer width="100%" height={140}>
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={35}
                                            outerRadius={55}
                                            paddingAngle={3}
                                            dataKey="value"
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
                                    {pieData.map((item, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.7rem' }}>
                                            <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: CHART_COLORS[i] }}></span>
                                            <span style={{ color: theme.textMuted }}>{item.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Bottom Section: Activity + Quick Stats */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>

                            {/* Activity Feed */}
                            <div style={{
                                background: theme.card,
                                borderRadius: '16px',
                                border: `1px solid ${theme.cardBorder}`,
                                padding: '1.25rem',
                                boxShadow: darkMode ? 'none' : '0 1px 3px rgba(0,0,0,0.05)'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                    <Activity size={16} style={{ color: theme.textMuted }} />
                                    <h3 style={{ fontWeight: '600', color: theme.text, fontSize: '0.95rem' }}>Live Activity</h3>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {activityFeed.slice(0, 4).map(item => (
                                        <ActivityItem key={item.id} item={item} theme={theme} />
                                    ))}
                                </div>
                            </div>

                            {/* Peak Hours */}
                            <div style={{
                                background: theme.card,
                                borderRadius: '16px',
                                border: `1px solid ${theme.cardBorder}`,
                                padding: '1.25rem'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                    <Clock size={16} style={{ color: theme.textMuted }} />
                                    <h3 style={{ fontWeight: '600', color: theme.text, fontSize: '0.95rem' }}>Peak Hours</h3>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'flex-end', height: '100px', gap: '6px', marginBottom: '0.75rem' }}>
                                    {stats?.busyHours?.map((h, i) => (
                                        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                                            <div style={{
                                                width: '100%',
                                                height: `${(h.sales / 100) * 100}%`,
                                                background: i === 3 ? 'linear-gradient(180deg, #3b82f6, #1d4ed8)' : (darkMode ? '#334155' : '#e2e8f0'),
                                                borderRadius: '4px',
                                                transition: 'all 0.3s ease'
                                            }}></div>
                                            <span style={{ fontSize: '0.6rem', color: theme.textMuted }}>{h.hour}</span>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ padding: '0.6rem', background: darkMode ? '#1e3a5f' : '#eff6ff', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Lightbulb size={12} style={{ color: '#3b82f6', flexShrink: 0 }} />
                                    <p style={{ fontSize: '0.7rem', color: '#3b82f6', fontWeight: '500', margin: 0 }}>
                                        Best ad time: 6PM
                                    </p>
                                </div>
                            </div>

                            {/* Import Card */}
                            <div style={{
                                background: theme.card,
                                borderRadius: '16px',
                                border: `1px solid ${theme.cardBorder}`,
                                padding: '1.25rem'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                    <FileUp size={16} style={{ color: theme.textMuted }} />
                                    <h3 style={{ fontWeight: '600', color: theme.text, fontSize: '0.95rem' }}>Import Data</h3>
                                </div>
                                <form onSubmit={handleUpload}>
                                    <label style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: '1.25rem',
                                        background: darkMode ? '#0f172a' : '#f8fafc',
                                        borderRadius: '10px',
                                        border: `2px dashed ${darkMode ? '#334155' : '#cbd5e1'}`,
                                        cursor: 'pointer',
                                        marginBottom: '0.75rem',
                                        transition: 'all 0.2s'
                                    }}>
                                        <Upload size={20} style={{ color: theme.textMuted, marginBottom: '0.5rem' }} />
                                        <span style={{ fontSize: '0.75rem', color: theme.textMuted, fontWeight: '500', textAlign: 'center' }}>
                                            {file ? file.name : 'Drop CSV or click'}
                                        </span>
                                        <input
                                            type="file"
                                            accept=".csv"
                                            onChange={(e) => setFile(e.target.files[0])}
                                            style={{ display: 'none' }}
                                        />
                                    </label>
                                    <button type="submit" disabled={!file || uploading} style={{
                                        width: '100%',
                                        padding: '0.6rem',
                                        background: file ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' : (darkMode ? '#334155' : '#e2e8f0'),
                                        color: file ? 'white' : theme.textMuted,
                                        fontWeight: '600',
                                        borderRadius: '8px',
                                        border: 'none',
                                        cursor: file ? 'pointer' : 'not-allowed',
                                        fontSize: '0.8rem'
                                    }}>
                                        {uploading ? 'Processing...' : 'Upload'}
                                    </button>
                                </form>
                            </div>
                        </div>

                        <style>{`
                            @media (max-width: 1024px) {
                                .main-content > div[style*="grid-template-columns: 2fr 1fr"] { grid-template-columns: 1fr !important; }
                                .main-content > div[style*="grid-template-columns: 1fr 1fr 1fr"] { grid-template-columns: 1fr !important; }
                            }
                            @media (max-width: 768px) {
                                .sidebar { transform: translateX(-100%); position: fixed; height: 100%; top: 0; }
                                .sidebar.open { transform: translateX(0); }
                                .mobile-header { display: flex !important; }
                                .main-content { padding: 1rem !important; padding-top: 70px !important; }
                            }
                        `}</style>
                    </>
                )}

                {/* Forecasts Tab */}
                {activeTab === 'forecasts' && (
                    <ForecastsSection theme={theme} darkMode={darkMode} stats={stats} />
                )}

                {/* Analytics Tab */}
                {activeTab === 'analytics' && (
                    <AnalyticsSection theme={theme} darkMode={darkMode} stats={stats} />
                )}

                {/* Inventory Tab */}
                {activeTab === 'inventory' && (
                    <InventorySection
                        theme={theme}
                        darkMode={darkMode}
                        pins={pins}
                        pinPage={pinPage}
                        setPinPage={setPinPage}
                        totalPins={totalPins}
                        file={file}
                        setFile={setFile}
                        uploading={uploading}
                        handleUpload={handleUpload}
                    />
                )}

                {/* Customers Tab */}
                {activeTab === 'customers' && (
                    <CustomersSection theme={theme} darkMode={darkMode} />
                )}

                {/* Orders Tab */}
                {activeTab === 'orders' && (
                    <OrdersSection theme={theme} darkMode={darkMode} />
                )}

                {/* Audit Log Tab */}
                {activeTab === 'auditlog' && (
                    <AuditLogSection theme={theme} darkMode={darkMode} />
                )}

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                    <SettingsSection theme={theme} darkMode={darkMode} />
                )}
            </main>
        </div>
    );
}

// === Sub-Components ===

function NavItem({ icon, label, active, badge, onClick }) {
    return (
        <div onClick={onClick} style={{
            display: 'flex',
            alignItems: 'center',
            padding: '0.6rem 0.75rem',
            color: active ? 'white' : '#94a3b8',
            background: active ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' : 'transparent',
            borderRadius: '8px',
            cursor: 'pointer',
            marginBottom: '0.25rem',
            transition: 'all 0.2s',
            fontSize: '0.875rem'
        }}>
            {icon}
            <span style={{ marginLeft: '0.75rem', fontWeight: '500' }}>{label}</span>
            {badge && <span style={{ marginLeft: 'auto', fontSize: '0.6rem', fontWeight: '600', background: badge === 'AI' ? '#8b5cf6' : '#10b981', color: 'white', padding: '2px 6px', borderRadius: '4px' }}>{badge}</span>}
        </div>
    )
}

function KPICard({ title, value, change, positive, icon, theme, sparkData }) {
    return (
        <div style={{
            background: theme.card,
            padding: '1.25rem',
            borderRadius: '16px',
            border: `1px solid ${theme.cardBorder}`,
            boxShadow: theme.card === 'white' ? '0 1px 3px rgba(0,0,0,0.05)' : 'none',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.8rem', color: theme.textMuted, fontWeight: '500' }}>{title}</span>
                <div style={{ padding: '8px', background: theme.bg, borderRadius: '8px', color: theme.textMuted }}>{icon}</div>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: theme.text, marginBottom: '0.25rem' }}>{value}</div>
            <div style={{ fontSize: '0.75rem', fontWeight: '600', color: positive ? '#10b981' : '#ef4444', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                {positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {change}
            </div>
            {/* Mini Sparkline */}
            <div style={{ position: 'absolute', bottom: 0, right: 0, width: '80px', height: '40px', opacity: 0.3 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={sparkData.map((v, i) => ({ v }))}>
                        <Area type="monotone" dataKey="v" stroke={positive ? '#10b981' : '#ef4444'} fill={positive ? '#10b981' : '#ef4444'} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

function SkeletonCard({ theme }) {
    return (
        <div style={{
            background: theme.card,
            padding: '1.25rem',
            borderRadius: '16px',
            border: `1px solid ${theme.cardBorder}`
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ width: '60%', height: '12px', background: theme.bg, borderRadius: '4px', animation: 'pulse 1.5s infinite' }}></div>
                <div style={{ width: '32px', height: '32px', background: theme.bg, borderRadius: '8px', animation: 'pulse 1.5s infinite' }}></div>
            </div>
            <div style={{ width: '50%', height: '24px', background: theme.bg, borderRadius: '4px', marginBottom: '0.5rem', animation: 'pulse 1.5s infinite' }}></div>
            <div style={{ width: '30%', height: '12px', background: theme.bg, borderRadius: '4px', animation: 'pulse 1.5s infinite' }}></div>
            <style>{`@keyframes pulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }`}</style>
        </div>
    )
}

function ActivityItem({ item, theme }) {
    const iconMap = {
        sale: <ShoppingCart size={14} />,
        upload: <Upload size={14} />,
        alert: <AlertCircle size={14} />
    };
    const colorMap = {
        sale: '#10b981',
        upload: '#3b82f6',
        alert: '#f59e0b'
    };
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: `${colorMap[item.type]}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colorMap[item.type] }}>
                {iconMap[item.type]}
            </div>
            <div style={{ flex: 1 }}>
                <p style={{ fontSize: '0.75rem', color: theme.text, margin: 0, fontWeight: '500' }}>{item.message}</p>
                <p style={{ fontSize: '0.65rem', color: theme.textMuted, margin: 0 }}>{item.time}</p>
            </div>
            {item.amount && <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#10b981' }}>+GHS {item.amount}</span>}
        </div>
    )
}

function NotificationItem({ title, message, time, type, theme }) {
    const colors = { warning: '#f59e0b', success: '#10b981', info: '#3b82f6' };
    return (
        <div style={{ padding: '0.75rem 1rem', borderBottom: `1px solid ${theme.cardBorder}`, display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: colors[type], marginTop: '6px', flexShrink: 0 }}></div>
            <div>
                <p style={{ fontSize: '0.8rem', fontWeight: '600', color: theme.text, margin: 0 }}>{title}</p>
                <p style={{ fontSize: '0.7rem', color: theme.textMuted, margin: '0.25rem 0' }}>{message}</p>
                <p style={{ fontSize: '0.65rem', color: theme.textMuted, margin: 0 }}>{time}</p>
            </div>
        </div>
    )
}

function Badge({ children, type }) {
    const bg = type === 'success' ? '#dcfce7' : '#fee2e2';
    const color = type === 'success' ? '#166534' : '#991b1b';
    return (
        <span style={{ background: bg, color: color, padding: '4px 10px', borderRadius: '99px', fontSize: '0.7rem', fontWeight: '600', textTransform: 'uppercase' }}>
            {children}
        </span>
    )
}

const tableStyles = {
    th: { padding: '0.875rem 1rem', fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '0.05em' },
    td: { padding: '0.875rem 1rem' }
};

// Mock data for sections
const forecastData = [
    { month: 'Jan', predicted: 4000, actual: 4200 },
    { month: 'Feb', predicted: 3800, actual: 3600 },
    { month: 'Mar', predicted: 5000, actual: 5200 },
    { month: 'Apr', predicted: 4500, actual: 4800 },
    { month: 'May', predicted: 5500, actual: 5300 },
    { month: 'Jun', predicted: 6000, actual: null },
];

const mockCustomers = [
    { id: 1, name: 'Kwame Asante', phone: '0244123456', region: 'Greater Accra', purchases: 5, totalSpent: 250, lastPurchase: '2024-12-20' },
    { id: 2, name: 'Ama Serwaa', phone: '0201234567', region: 'Ashanti', purchases: 3, totalSpent: 150, lastPurchase: '2024-12-18' },
    { id: 3, name: 'Kofi Mensah', phone: '0559876543', region: 'Western', purchases: 8, totalSpent: 400, lastPurchase: '2024-12-22' },
    { id: 4, name: 'Akosua Darko', phone: '0271112233', region: 'Central', purchases: 2, totalSpent: 100, lastPurchase: '2024-12-15' },
    { id: 5, name: 'Yaw Boateng', phone: '0545556677', region: 'Eastern', purchases: 6, totalSpent: 300, lastPurchase: '2024-12-21' },
];

const mockOrders = [
    { id: 'ORD-001', customer: 'Kwame Asante', examType: 'WASSCE', amount: 50, status: 'completed', date: '2024-12-24 14:30' },
    { id: 'ORD-002', customer: 'Ama Serwaa', examType: 'BECE', amount: 30, status: 'completed', date: '2024-12-24 13:15' },
    { id: 'ORD-003', customer: 'Kofi Mensah', examType: 'WASSCE', amount: 50, status: 'pending', date: '2024-12-24 12:45' },
    { id: 'ORD-004', customer: 'Akosua Darko', examType: 'NVTI', amount: 40, status: 'completed', date: '2024-12-24 11:20' },
    { id: 'ORD-005', customer: 'Yaw Boateng', examType: 'WASSCE', amount: 50, status: 'failed', date: '2024-12-24 10:00' },
];

// === Section Components ===

function ForecastsSection({ theme, darkMode, stats }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: theme.text, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Zap size={20} /> AI Forecasts
                    </h2>
                    <p style={{ color: theme.textMuted, fontSize: '0.85rem' }}>Predictive analytics powered by machine learning</p>
                </div>
                <span style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)', color: 'white', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '600' }}>
                    AI Powered
                </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                {/* Prediction Chart */}
                <div style={{ background: theme.card, borderRadius: '16px', border: `1px solid ${theme.cardBorder}`, padding: '1.5rem' }}>
                    <h3 style={{ fontWeight: '600', color: theme.text, marginBottom: '1rem', fontSize: '0.95rem' }}>Sales Forecast vs Actual</h3>
                    <ResponsiveContainer width="100%" height={220}>
                        <AreaChart data={forecastData}>
                            <defs>
                                <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: theme.textMuted }} />
                            <Tooltip contentStyle={{ background: theme.card, border: `1px solid ${theme.cardBorder}`, borderRadius: '8px' }} />
                            <Area type="monotone" dataKey="predicted" stroke="#8b5cf6" strokeWidth={2} fill="url(#colorPredicted)" name="Predicted" />
                            <Area type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={2} fill="url(#colorActual)" name="Actual" />
                        </AreaChart>
                    </ResponsiveContainer>
                    <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#8b5cf6' }}></span>
                            <span style={{ fontSize: '0.75rem', color: theme.textMuted }}>Predicted</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#10b981' }}></span>
                            <span style={{ fontSize: '0.75rem', color: theme.textMuted }}>Actual</span>
                        </div>
                    </div>
                </div>

                {/* Forecast Cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ background: theme.card, borderRadius: '16px', border: `1px solid ${theme.cardBorder}`, padding: '1.25rem' }}>
                        <p style={{ fontSize: '0.75rem', color: theme.textMuted, marginBottom: '0.5rem' }}>Next Month Prediction</p>
                        <p style={{ fontSize: '1.5rem', fontWeight: '700', color: theme.text }}>GHS 6,200</p>
                        <p style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: '600' }}>+12% expected growth</p>
                    </div>
                    <div style={{ background: theme.card, borderRadius: '16px', border: `1px solid ${theme.cardBorder}`, padding: '1.25rem' }}>
                        <p style={{ fontSize: '0.75rem', color: theme.textMuted, marginBottom: '0.5rem' }}>Stockout Risk</p>
                        <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#f59e0b' }}>NVTI</p>
                        <p style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: '600' }}>Low stock in 5 days</p>
                    </div>
                    <div style={{ background: theme.card, borderRadius: '16px', border: `1px solid ${theme.cardBorder}`, padding: '1.25rem' }}>
                        <p style={{ fontSize: '0.75rem', color: theme.textMuted, marginBottom: '0.5rem' }}>Model Accuracy</p>
                        <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#10b981' }}>94.2%</p>
                        <p style={{ fontSize: '0.75rem', color: theme.textMuted }}>Based on last 30 days</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function AnalyticsSection({ theme, darkMode, stats }) {
    const [selectedPeriod, setSelectedPeriod] = useState('7D');

    // Different data sets for each time period
    const periodData = {
        '7D': {
            traffic: [
                { date: 'Dec 18', visitors: 2400, pageViews: 4800, sessions: 1800 },
                { date: 'Dec 19', visitors: 1398, pageViews: 3200, sessions: 1200 },
                { date: 'Dec 20', visitors: 3800, pageViews: 7200, sessions: 2800 },
                { date: 'Dec 21', visitors: 3908, pageViews: 7800, sessions: 3100 },
                { date: 'Dec 22', visitors: 4800, pageViews: 9200, sessions: 3600 },
                { date: 'Dec 23', visitors: 3800, pageViews: 7600, sessions: 2900 },
                { date: 'Dec 24', visitors: 4300, pageViews: 8500, sessions: 3300 },
            ],
            metrics: [
                { label: 'Total Visitors', value: '24,847', change: '+18.2%', positive: true, icon: <Users size={18} />, sparkData: [30, 40, 35, 50, 49, 60, 70] },
                { label: 'Page Views', value: '48,392', change: '+24.5%', positive: true, icon: <Activity size={18} />, sparkData: [20, 30, 25, 40, 35, 50, 65] },
                { label: 'Bounce Rate', value: '32.4%', change: '-8.1%', positive: true, icon: <TrendingUp size={18} />, sparkData: [50, 45, 42, 38, 35, 33, 32] },
                { label: 'Conversion', value: '12.0%', change: '+3.2%', positive: true, icon: <ShoppingCart size={18} />, sparkData: [8, 9, 10, 9, 11, 11, 12] },
            ]
        },
        '30D': {
            traffic: [
                { date: 'Week 1', visitors: 12400, pageViews: 28800, sessions: 9800 },
                { date: 'Week 2', visitors: 15398, pageViews: 32200, sessions: 11200 },
                { date: 'Week 3', visitors: 18800, pageViews: 42200, sessions: 14800 },
                { date: 'Week 4', visitors: 21908, pageViews: 47800, sessions: 17100 },
            ],
            metrics: [
                { label: 'Total Visitors', value: '68,506', change: '+22.4%', positive: true, icon: <Users size={18} />, sparkData: [40, 50, 55, 70, 75, 85, 95] },
                { label: 'Page Views', value: '151,000', change: '+31.2%', positive: true, icon: <Activity size={18} />, sparkData: [30, 45, 55, 60, 70, 80, 90] },
                { label: 'Bounce Rate', value: '29.8%', change: '-12.3%', positive: true, icon: <TrendingUp size={18} />, sparkData: [45, 40, 38, 35, 32, 30, 29] },
                { label: 'Conversion', value: '14.2%', change: '+5.8%', positive: true, icon: <ShoppingCart size={18} />, sparkData: [10, 11, 12, 12, 13, 14, 14] },
            ]
        },
        '90D': {
            traffic: [
                { date: 'Oct', visitors: 42400, pageViews: 98800, sessions: 32800 },
                { date: 'Nov', visitors: 55398, pageViews: 122200, sessions: 41200 },
                { date: 'Dec', visitors: 68506, pageViews: 151000, sessions: 54800 },
            ],
            metrics: [
                { label: 'Total Visitors', value: '166,304', change: '+45.6%', positive: true, icon: <Users size={18} />, sparkData: [50, 60, 70, 80, 90, 100, 120] },
                { label: 'Page Views', value: '372,000', change: '+52.1%', positive: true, icon: <Activity size={18} />, sparkData: [40, 55, 65, 75, 85, 95, 110] },
                { label: 'Bounce Rate', value: '27.5%', change: '-15.8%', positive: true, icon: <TrendingUp size={18} />, sparkData: [40, 35, 32, 30, 28, 27, 27] },
                { label: 'Conversion', value: '15.8%', change: '+8.4%', positive: true, icon: <ShoppingCart size={18} />, sparkData: [11, 12, 13, 14, 15, 15, 16] },
            ]
        }
    };

    const trafficData = periodData[selectedPeriod].traffic;
    const metricsData = periodData[selectedPeriod].metrics;

    const conversionData = [
        { stage: 'Landing', value: 10000, rate: '100%', color: '#3b82f6' },
        { stage: 'Browse', value: 6500, rate: '65%', color: '#6366f1' },
        { stage: 'Cart', value: 3500, rate: '35%', color: '#8b5cf6' },
        { stage: 'Checkout', value: 2000, rate: '20%', color: '#f59e0b' },
        { stage: 'Purchase', value: 1200, rate: '12%', color: '#10b981' },
    ];

    const sourceData = [
        { name: 'Direct', value: 35, color: '#3b82f6' },
        { name: 'Organic', value: 28, color: '#10b981' },
        { name: 'Social', value: 22, color: '#8b5cf6' },
        { name: 'Referral', value: 15, color: '#f59e0b' },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: theme.text, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Activity size={20} /> Analytics Dashboard
                    </h2>
                    <p style={{ color: theme.textMuted, fontSize: '0.85rem' }}>Detailed metrics and performance insights</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {['7D', '30D', '90D'].map((period) => (
                        <button
                            key={period}
                            onClick={() => setSelectedPeriod(period)}
                            style={{
                                padding: '0.4rem 0.8rem',
                                background: selectedPeriod === period ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' : (darkMode ? '#334155' : '#f1f5f9'),
                                color: selectedPeriod === period ? 'white' : theme.textMuted,
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >{period}</button>
                    ))}
                </div>
            </div>

            {/* Premium Metrics Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                {metricsData.map((metric, i) => (
                    <div key={i} style={{
                        background: theme.card,
                        borderRadius: '16px',
                        border: `1px solid ${theme.cardBorder}`,
                        padding: '1.25rem',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                            <p style={{ fontSize: '0.75rem', color: theme.textMuted, fontWeight: '500' }}>{metric.label}</p>
                            <div style={{ padding: '6px', background: darkMode ? '#334155' : '#f8fafc', borderRadius: '8px', color: theme.textMuted }}>
                                {metric.icon}
                            </div>
                        </div>
                        <p style={{ fontSize: '1.5rem', fontWeight: '700', color: theme.text, marginBottom: '0.25rem' }}>{metric.value}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            {metric.positive ? <ArrowUpRight size={14} style={{ color: '#10b981' }} /> : <ArrowDownRight size={14} style={{ color: '#ef4444' }} />}
                            <span style={{ fontSize: '0.75rem', color: metric.positive ? '#10b981' : '#ef4444', fontWeight: '600' }}>{metric.change}</span>
                            <span style={{ fontSize: '0.7rem', color: theme.textMuted, marginLeft: '0.25rem' }}>vs last week</span>
                        </div>
                        {/* Mini Sparkline */}
                        <div style={{ position: 'absolute', bottom: 0, right: 0, width: '80px', height: '40px', opacity: 0.25 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={metric.sparkData.map((v) => ({ v }))}>
                                    <Area type="monotone" dataKey="v" stroke={metric.positive ? '#10b981' : '#ef4444'} fill={metric.positive ? '#10b981' : '#ef4444'} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Charts Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                {/* Traffic Trends Chart */}
                <div style={{
                    background: theme.card,
                    borderRadius: '16px',
                    border: `1px solid ${theme.cardBorder}`,
                    padding: '1.5rem',
                    boxShadow: darkMode ? 'none' : '0 4px 20px rgba(0,0,0,0.04)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                        <div>
                            <h3 style={{ fontWeight: '600', color: theme.text, fontSize: '0.95rem' }}>Traffic Overview</h3>
                            <p style={{ fontSize: '0.75rem', color: theme.textMuted }}>Visitors, page views & sessions</p>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            {[
                                { label: 'Visitors', color: '#3b82f6' },
                                { label: 'Page Views', color: '#8b5cf6' },
                                { label: 'Sessions', color: '#10b981' }
                            ].map((item, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                    <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: item.color }}></span>
                                    <span style={{ fontSize: '0.7rem', color: theme.textMuted }}>{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={220}>
                        <AreaChart data={trafficData}>
                            <defs>
                                <linearGradient id="gradVisitors" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="gradPageViews" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="gradSessions" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: theme.textMuted }} />
                            <Tooltip
                                contentStyle={{
                                    background: theme.card,
                                    border: `1px solid ${theme.cardBorder}`,
                                    borderRadius: '10px',
                                    fontSize: '0.8rem',
                                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                                }}
                            />
                            <Area type="monotone" dataKey="pageViews" stroke="#8b5cf6" strokeWidth={2} fill="url(#gradPageViews)" />
                            <Area type="monotone" dataKey="visitors" stroke="#3b82f6" strokeWidth={2} fill="url(#gradVisitors)" />
                            <Area type="monotone" dataKey="sessions" stroke="#10b981" strokeWidth={2} fill="url(#gradSessions)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Traffic Sources */}
                <div style={{
                    background: theme.card,
                    borderRadius: '16px',
                    border: `1px solid ${theme.cardBorder}`,
                    padding: '1.5rem',
                    boxShadow: darkMode ? 'none' : '0 4px 20px rgba(0,0,0,0.04)'
                }}>
                    <h3 style={{ fontWeight: '600', color: theme.text, fontSize: '0.95rem', marginBottom: '1rem' }}>Traffic Sources</h3>
                    <ResponsiveContainer width="100%" height={140}>
                        <PieChart>
                            <Pie
                                data={sourceData}
                                cx="50%"
                                cy="50%"
                                innerRadius={40}
                                outerRadius={60}
                                paddingAngle={4}
                                dataKey="value"
                            >
                                {sourceData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '0.75rem' }}>
                        {sourceData.map((item, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: item.color }}></span>
                                    <span style={{ fontSize: '0.8rem', color: theme.text }}>{item.name}</span>
                                </div>
                                <span style={{ fontSize: '0.8rem', fontWeight: '600', color: theme.text }}>{item.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Premium Conversion Funnel */}
            <div style={{
                background: theme.card,
                borderRadius: '16px',
                border: `1px solid ${theme.cardBorder}`,
                padding: '1.5rem',
                boxShadow: darkMode ? 'none' : '0 4px 20px rgba(0,0,0,0.04)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div>
                        <h3 style={{ fontWeight: '600', color: theme.text, fontSize: '0.95rem' }}>Conversion Funnel</h3>
                        <p style={{ fontSize: '0.75rem', color: theme.textMuted }}>Customer journey analysis</p>
                    </div>
                    <div style={{ padding: '0.4rem 0.8rem', background: darkMode ? '#1e3a5f' : '#eff6ff', borderRadius: '6px' }}>
                        <span style={{ fontSize: '0.75rem', color: '#3b82f6', fontWeight: '600' }}>12% Overall Conversion</span>
                    </div>
                </div>

                {/* Funnel Visualization */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {conversionData.map((item, i) => (
                        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            {/* Bar container */}
                            <div style={{
                                width: '100%',
                                height: '160px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                                position: 'relative'
                            }}>
                                {/* Value */}
                                <span style={{
                                    fontSize: '0.85rem',
                                    fontWeight: '700',
                                    color: theme.text,
                                    marginBottom: '0.5rem'
                                }}>{item.value.toLocaleString()}</span>

                                {/* Bar */}
                                <div style={{
                                    width: `${85 - i * 10}%`,
                                    height: `${(item.value / 10000) * 120}px`,
                                    background: `linear-gradient(180deg, ${item.color}, ${item.color}99)`,
                                    borderRadius: '8px 8px 0 0',
                                    boxShadow: `0 -4px 20px ${item.color}40`,
                                    transition: 'all 0.3s ease',
                                    position: 'relative'
                                }}>
                                    {/* Rate badge */}
                                    <div style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        background: 'rgba(255,255,255,0.9)',
                                        padding: '0.2rem 0.5rem',
                                        borderRadius: '4px',
                                        fontSize: '0.7rem',
                                        fontWeight: '600',
                                        color: item.color
                                    }}>{item.rate}</div>
                                </div>
                            </div>

                            {/* Stage label */}
                            <span style={{
                                fontSize: '0.75rem',
                                color: theme.textMuted,
                                marginTop: '0.75rem',
                                fontWeight: '500'
                            }}>{item.stage}</span>

                            {/* Arrow */}
                            {i < conversionData.length - 1 && (
                                <div style={{
                                    position: 'absolute',
                                    right: `-${12 / conversionData.length}%`,
                                    top: '45%',
                                    color: theme.textMuted,
                                    fontSize: '1.2rem'
                                }}>→</div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function CustomersSection({ theme, darkMode }) {
    const [searchTerm, setSearchTerm] = useState('');
    const filteredCustomers = mockCustomers.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone.includes(searchTerm)
    );

    const handleExportCustomers = () => {
        const headers = ['Name', 'Phone', 'Region', 'Purchases', 'Total Spent', 'Last Purchase'];
        const csvContent = [
            headers.join(','),
            ...mockCustomers.map(c =>
                [c.name, c.phone, c.region, c.purchases, c.totalSpent, c.lastPurchase].join(',')
            )
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `customers_export_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    return (
        <div style={{ background: theme.card, borderRadius: '16px', padding: '1.5rem', border: `1px solid ${theme.cardBorder}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: theme.text, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Users size={20} /> Customer Management
                    </h2>
                    <p style={{ color: theme.textMuted, fontSize: '0.85rem' }}>{mockCustomers.length} total customers</p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: darkMode ? '#0f172a' : '#f8fafc', padding: '0.5rem 1rem', borderRadius: '8px', border: `1px solid ${theme.cardBorder}` }}>
                        <Search size={16} style={{ color: theme.textMuted }} />
                        <input
                            type="text"
                            placeholder="Search customers..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ background: 'transparent', border: 'none', outline: 'none', color: theme.text, fontSize: '0.85rem', width: '150px' }}
                        />
                    </div>
                    <button onClick={handleExportCustomers} style={{
                        padding: '0.5rem 1rem',
                        background: darkMode ? '#334155' : '#f1f5f9',
                        border: 'none',
                        borderRadius: '8px',
                        color: theme.textMuted,
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        transition: 'all 0.2s'
                    }}>
                        <Download size={14} /> Export CSV
                    </button>
                </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead style={{ background: darkMode ? '#0f172a' : '#f8fafc' }}>
                    <tr>
                        <th style={{ ...tableStyles.th, color: theme.textMuted, textAlign: 'left' }}>Customer</th>
                        <th style={{ ...tableStyles.th, color: theme.textMuted, textAlign: 'left' }}>Phone</th>
                        <th style={{ ...tableStyles.th, color: theme.textMuted, textAlign: 'left' }}>Region</th>
                        <th style={{ ...tableStyles.th, color: theme.textMuted, textAlign: 'center' }}>Purchases</th>
                        <th style={{ ...tableStyles.th, color: theme.textMuted, textAlign: 'right' }}>Total Spent</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredCustomers.map(customer => (
                        <tr key={customer.id} style={{ borderBottom: `1px solid ${theme.cardBorder}` }}>
                            <td style={{ ...tableStyles.td, color: theme.text, fontWeight: '600' }}>{customer.name}</td>
                            <td style={{ ...tableStyles.td, color: theme.textMuted }}>{customer.phone}</td>
                            <td style={{ ...tableStyles.td, color: theme.textMuted }}>{customer.region}</td>
                            <td style={{ ...tableStyles.td, textAlign: 'center' }}>
                                <span style={{ background: darkMode ? '#334155' : '#e2e8f0', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', color: theme.text }}>{customer.purchases}</span>
                            </td>
                            <td style={{ ...tableStyles.td, color: '#10b981', fontWeight: '600', textAlign: 'right' }}>GHS {customer.totalSpent}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function OrdersSection({ theme, darkMode }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [showNewOrderModal, setShowNewOrderModal] = useState(false);
    const ordersPerPage = 5;

    // Pagination
    const totalPages = Math.ceil(mockOrders.length / ordersPerPage);
    const startIndex = (currentPage - 1) * ordersPerPage;
    const displayedOrders = mockOrders.slice(startIndex, startIndex + ordersPerPage);

    const getStatusBadge = (status) => {
        const styles = {
            completed: { bg: '#dcfce7', color: '#166534' },
            pending: { bg: '#fef3c7', color: '#92400e' },
            failed: { bg: '#fee2e2', color: '#991b1b' }
        };
        const s = styles[status] || styles.pending;
        return (
            <span style={{ background: s.bg, color: s.color, padding: '4px 10px', borderRadius: '99px', fontSize: '0.7rem', fontWeight: '600', textTransform: 'uppercase' }}>
                {status}
            </span>
        );
    };

    // Export to CSV
    const handleExport = () => {
        const headers = ['Order ID', 'Customer', 'Exam Type', 'Amount', 'Status', 'Date'];
        const csvContent = [
            headers.join(','),
            ...mockOrders.map(order =>
                [order.id, order.customer, order.examType, order.amount, order.status, order.date].join(',')
            )
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `orders_export_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    return (
        <div style={{ background: theme.card, borderRadius: '16px', padding: '1.5rem', border: `1px solid ${theme.cardBorder}` }}>
            {/* New Order Modal */}
            {showNewOrderModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        background: theme.card,
                        borderRadius: '16px',
                        padding: '2rem',
                        width: '400px',
                        maxWidth: '90%',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontWeight: '700', color: theme.text, fontSize: '1.1rem' }}>Create New Order</h3>
                            <button onClick={() => setShowNewOrderModal(false)} style={{ background: 'none', border: 'none', color: theme.textMuted, cursor: 'pointer', fontSize: '1.5rem' }}>×</button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', color: theme.textMuted, marginBottom: '0.5rem' }}>Customer Name</label>
                                <input type="text" placeholder="Enter customer name" style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: '8px',
                                    border: `1px solid ${theme.cardBorder}`,
                                    background: darkMode ? '#0f172a' : '#f8fafc',
                                    color: theme.text,
                                    fontSize: '0.875rem'
                                }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', color: theme.textMuted, marginBottom: '0.5rem' }}>Exam Type</label>
                                <select style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: '8px',
                                    border: `1px solid ${theme.cardBorder}`,
                                    background: darkMode ? '#0f172a' : '#f8fafc',
                                    color: theme.text,
                                    fontSize: '0.875rem'
                                }}>
                                    <option>WASSCE</option>
                                    <option>BECE</option>
                                    <option>NVTI</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', color: theme.textMuted, marginBottom: '0.5rem' }}>Amount (GHS)</label>
                                <input type="number" placeholder="50" style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: '8px',
                                    border: `1px solid ${theme.cardBorder}`,
                                    background: darkMode ? '#0f172a' : '#f8fafc',
                                    color: theme.text,
                                    fontSize: '0.875rem'
                                }} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                            <button onClick={() => setShowNewOrderModal(false)} style={{
                                flex: 1,
                                padding: '0.75rem',
                                background: darkMode ? '#334155' : '#e2e8f0',
                                border: 'none',
                                borderRadius: '8px',
                                color: theme.text,
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}>Cancel</button>
                            <button onClick={() => { setShowNewOrderModal(false); alert('Order created! (Demo)'); }} style={{
                                flex: 1,
                                padding: '0.75rem',
                                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                                border: 'none',
                                borderRadius: '8px',
                                color: 'white',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}>Create Order</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: theme.text, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <ShoppingCart size={20} /> Order History
                    </h2>
                    <p style={{ color: theme.textMuted, fontSize: '0.85rem' }}>{mockOrders.length} total orders</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button onClick={handleExport} style={{
                        padding: '0.5rem 1rem',
                        background: darkMode ? '#334155' : '#f1f5f9',
                        border: 'none',
                        borderRadius: '8px',
                        color: theme.textMuted,
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        transition: 'all 0.2s'
                    }}>
                        <FileUp size={14} /> Export CSV
                    </button>
                    <button onClick={() => setShowNewOrderModal(true)} style={{
                        padding: '0.5rem 1rem',
                        background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                        border: 'none',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        transition: 'all 0.2s'
                    }}>
                        + New Order
                    </button>
                </div>
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                    <thead style={{ background: darkMode ? '#0f172a' : '#f8fafc' }}>
                        <tr>
                            <th style={{ ...tableStyles.th, color: theme.textMuted, textAlign: 'left' }}>Order ID</th>
                            <th style={{ ...tableStyles.th, color: theme.textMuted, textAlign: 'left' }}>Customer</th>
                            <th style={{ ...tableStyles.th, color: theme.textMuted, textAlign: 'left' }}>Type</th>
                            <th style={{ ...tableStyles.th, color: theme.textMuted, textAlign: 'right' }}>Amount</th>
                            <th style={{ ...tableStyles.th, color: theme.textMuted, textAlign: 'center' }}>Status</th>
                            <th style={{ ...tableStyles.th, color: theme.textMuted, textAlign: 'right' }}>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayedOrders.map(order => (
                            <tr key={order.id} style={{ borderBottom: `1px solid ${theme.cardBorder}` }}>
                                <td style={{ ...tableStyles.td, color: theme.text, fontWeight: '600', fontFamily: 'monospace' }}>{order.id}</td>
                                <td style={{ ...tableStyles.td, color: theme.text }}>{order.customer}</td>
                                <td style={{ ...tableStyles.td }}>
                                    <span style={{ background: darkMode ? '#334155' : '#e2e8f0', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', color: theme.text }}>{order.examType}</span>
                                </td>
                                <td style={{ ...tableStyles.td, color: '#10b981', fontWeight: '600', textAlign: 'right' }}>GHS {order.amount}</td>
                                <td style={{ ...tableStyles.td, textAlign: 'center' }}>{getStatusBadge(order.status)}</td>
                                <td style={{ ...tableStyles.td, color: theme.textMuted, textAlign: 'right', fontSize: '0.8rem' }}>{order.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Responsive Pagination */}
            <div style={{
                marginTop: '1.25rem',
                display: 'flex',
                gap: '0.5rem',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap'
            }}>
                <span style={{ fontSize: '0.8rem', color: theme.textMuted }}>
                    Showing {startIndex + 1}-{Math.min(startIndex + ordersPerPage, mockOrders.length)} of {mockOrders.length}
                </span>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        style={{
                            padding: '0.5rem 1rem',
                            background: currentPage === 1 ? (darkMode ? '#1e293b' : '#f1f5f9') : (darkMode ? '#334155' : '#e2e8f0'),
                            border: 'none',
                            borderRadius: '6px',
                            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                            color: currentPage === 1 ? theme.textMuted : theme.text,
                            fontSize: '0.8rem',
                            opacity: currentPage === 1 ? 0.5 : 1,
                            transition: 'all 0.2s'
                        }}
                    >← Prev</button>

                    {/* Page Numbers */}
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                style={{
                                    width: '32px',
                                    height: '32px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: currentPage === page ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' : 'transparent',
                                    color: currentPage === page ? 'white' : theme.textMuted,
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '0.8rem',
                                    fontWeight: currentPage === page ? '600' : '400',
                                    transition: 'all 0.2s'
                                }}
                            >{page}</button>
                        ))}
                    </div>

                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        style={{
                            padding: '0.5rem 1rem',
                            background: currentPage === totalPages ? (darkMode ? '#1e293b' : '#f1f5f9') : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                            color: currentPage === totalPages ? theme.textMuted : 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                            fontSize: '0.8rem',
                            opacity: currentPage === totalPages ? 0.5 : 1,
                            transition: 'all 0.2s'
                        }}
                    >Next →</button>
                </div>
            </div>
        </div>
    );
}

// === Audit Log Section ===
const mockAuditLog = [
    { id: 1, action: 'CSV Upload', details: 'Uploaded 150 WASSCE PINs', timestamp: '2024-12-24 18:30', user: 'Admin' },
    { id: 2, action: 'Login', details: 'Successful login from 192.168.1.1', timestamp: '2024-12-24 18:00', user: 'Admin' },
    { id: 3, action: 'PIN Sold', details: 'WASSCE PIN #ABC123 sold to 0244123456', timestamp: '2024-12-24 14:22', user: 'System' },
    { id: 4, action: 'Settings Changed', details: 'Dark mode preference updated', timestamp: '2024-12-24 12:15', user: 'Admin' },
    { id: 5, action: 'CSV Upload', details: 'Uploaded 200 BECE PINs', timestamp: '2024-12-23 09:45', user: 'Admin' },
];

function AuditLogSection({ theme, darkMode }) {
    const getActionIcon = (action) => {
        const icons = {
            'CSV Upload': <Upload size={14} />,
            'Login': <Users size={14} />,
            'PIN Sold': <ShoppingCart size={14} />,
            'Settings Changed': <Settings size={14} />
        };
        return icons[action] || <Activity size={14} />;
    };

    const getActionColor = (action) => {
        const colors = {
            'CSV Upload': '#3b82f6',
            'Login': '#10b981',
            'PIN Sold': '#8b5cf6',
            'Settings Changed': '#f59e0b'
        };
        return colors[action] || '#64748b';
    };

    return (
        <div style={{ background: theme.card, borderRadius: '16px', padding: '1.5rem', border: `1px solid ${theme.cardBorder}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: theme.text, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <History size={20} /> Audit Log
                    </h2>
                    <p style={{ color: theme.textMuted, fontSize: '0.85rem' }}>Track all admin activities</p>
                </div>
                <button style={{
                    padding: '0.5rem 1rem',
                    background: darkMode ? '#334155' : '#f1f5f9',
                    border: 'none',
                    borderRadius: '8px',
                    color: theme.textMuted,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    <Download size={14} /> Export Log
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {mockAuditLog.map(log => (
                    <div key={log.id} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        padding: '1rem',
                        background: darkMode ? '#0f172a' : '#f8fafc',
                        borderRadius: '10px',
                        border: `1px solid ${theme.cardBorder}`
                    }}>
                        <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '10px',
                            background: `${getActionColor(log.action)}20`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: getActionColor(log.action)
                        }}>
                            {getActionIcon(log.action)}
                        </div>
                        <div style={{ flex: 1 }}>
                            <p style={{ fontSize: '0.875rem', fontWeight: '600', color: theme.text, marginBottom: '0.25rem' }}>{log.action}</p>
                            <p style={{ fontSize: '0.8rem', color: theme.textMuted }}>{log.details}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ fontSize: '0.75rem', color: theme.textMuted }}>{log.timestamp}</p>
                            <p style={{ fontSize: '0.7rem', color: theme.textMuted }}>{log.user}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// === Settings Section ===
function SettingsSection({ theme, darkMode }) {
    const [notifications, setNotifications] = useState({
        emailAlerts: true,
        lowStockWarnings: true,
        salesNotifications: false,
        weeklyReports: true
    });

    const toggleNotification = (key) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Password Change */}
            <div style={{ background: theme.card, borderRadius: '16px', padding: '1.5rem', border: `1px solid ${theme.cardBorder}` }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: theme.text, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    <Settings size={20} /> Account Settings
                </h2>

                <div style={{ maxWidth: '400px' }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: '600', color: theme.text, marginBottom: '1rem' }}>Change Password</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', color: theme.textMuted, marginBottom: '0.5rem' }}>Current Password</label>
                            <input type="password" placeholder="••••••••" style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: '8px',
                                border: `1px solid ${theme.cardBorder}`,
                                background: darkMode ? '#0f172a' : '#f8fafc',
                                color: theme.text,
                                fontSize: '0.875rem'
                            }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', color: theme.textMuted, marginBottom: '0.5rem' }}>New Password</label>
                            <input type="password" placeholder="••••••••" style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: '8px',
                                border: `1px solid ${theme.cardBorder}`,
                                background: darkMode ? '#0f172a' : '#f8fafc',
                                color: theme.text,
                                fontSize: '0.875rem'
                            }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', color: theme.textMuted, marginBottom: '0.5rem' }}>Confirm New Password</label>
                            <input type="password" placeholder="••••••••" style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: '8px',
                                border: `1px solid ${theme.cardBorder}`,
                                background: darkMode ? '#0f172a' : '#f8fafc',
                                color: theme.text,
                                fontSize: '0.875rem'
                            }} />
                        </div>
                        <button onClick={() => alert('Password updated! (Demo)')} style={{
                            padding: '0.75rem 1.5rem',
                            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                            border: 'none',
                            borderRadius: '8px',
                            color: 'white',
                            fontWeight: '600',
                            cursor: 'pointer',
                            width: 'fit-content'
                        }}>Update Password</button>
                    </div>
                </div>
            </div>

            {/* Notification Preferences */}
            <div style={{ background: theme.card, borderRadius: '16px', padding: '1.5rem', border: `1px solid ${theme.cardBorder}` }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: '600', color: theme.text, marginBottom: '1rem' }}>Notification Preferences</h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {[
                        { key: 'emailAlerts', label: 'Email Alerts', desc: 'Receive important system notifications' },
                        { key: 'lowStockWarnings', label: 'Low Stock Warnings', desc: 'Get notified when inventory is running low' },
                        { key: 'salesNotifications', label: 'Sales Notifications', desc: 'Receive alerts for each new sale' },
                        { key: 'weeklyReports', label: 'Weekly Reports', desc: 'Get weekly summary reports via email' }
                    ].map(item => (
                        <div key={item.key} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '1rem',
                            background: darkMode ? '#0f172a' : '#f8fafc',
                            borderRadius: '10px'
                        }}>
                            <div>
                                <p style={{ fontSize: '0.875rem', fontWeight: '600', color: theme.text }}>{item.label}</p>
                                <p style={{ fontSize: '0.8rem', color: theme.textMuted }}>{item.desc}</p>
                            </div>
                            <button
                                onClick={() => toggleNotification(item.key)}
                                style={{
                                    width: '48px',
                                    height: '26px',
                                    borderRadius: '13px',
                                    background: notifications[item.key] ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' : (darkMode ? '#334155' : '#e2e8f0'),
                                    border: 'none',
                                    cursor: 'pointer',
                                    position: 'relative',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <div style={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    background: 'white',
                                    position: 'absolute',
                                    top: '3px',
                                    left: notifications[item.key] ? '25px' : '3px',
                                    transition: 'left 0.2s',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                }}></div>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// === Inventory Section with Search, Filter & Bulk Actions ===
function InventorySection({ theme, darkMode, pins, pinPage, setPinPage, totalPins, file, setFile, uploading, handleUpload }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterExamType, setFilterExamType] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [selectedPins, setSelectedPins] = useState([]);

    // Get unique exam types from pins
    const examTypes = [...new Set(pins.map(p => p.examType))];

    // Filter pins
    const filteredPins = pins.filter(pin => {
        const matchesSearch = searchTerm === '' ||
            pin.serial?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pin.pin?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesExamType = filterExamType === '' || pin.examType === filterExamType;
        const matchesStatus = filterStatus === '' || pin.status === filterStatus;
        return matchesSearch && matchesExamType && matchesStatus;
    });

    const toggleSelectAll = () => {
        if (selectedPins.length === filteredPins.length) {
            setSelectedPins([]);
        } else {
            setSelectedPins(filteredPins.map(p => p.id));
        }
    };

    const toggleSelectPin = (pinId) => {
        if (selectedPins.includes(pinId)) {
            setSelectedPins(selectedPins.filter(id => id !== pinId));
        } else {
            setSelectedPins([...selectedPins, pinId]);
        }
    };

    const handleBulkExport = () => {
        const selectedData = pins.filter(p => selectedPins.includes(p.id));
        const headers = ['ID', 'Exam Type', 'Serial', 'PIN', 'Status'];
        const csvContent = [
            headers.join(','),
            ...selectedData.map(p => [p.id, p.examType, p.serial, p.pin, p.status].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pins_export_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        setSelectedPins([]);
    };

    const handleBulkDelete = () => {
        if (confirm(`Delete ${selectedPins.length} selected PINs? (Demo only)`)) {
            alert(`${selectedPins.length} PINs would be deleted. (Demo mode)`);
            setSelectedPins([]);
        }
    };

    const selectStyle = {
        padding: '0.5rem 0.75rem',
        background: darkMode ? '#0f172a' : '#f8fafc',
        border: `1px solid ${theme.cardBorder}`,
        borderRadius: '8px',
        color: theme.text,
        fontSize: '0.8rem',
        cursor: 'pointer'
    };

    return (
        <div style={{ background: theme.card, borderRadius: '16px', padding: '1.5rem', border: `1px solid ${theme.cardBorder}` }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem', color: theme.text }}>
                        <Package size={20} /> Inventory Management
                    </h2>
                    <p style={{ color: theme.textMuted, fontSize: '0.85rem' }}>{totalPins} total PINs</p>
                </div>

                {/* Search & Filters */}
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: darkMode ? '#0f172a' : '#f8fafc', padding: '0.5rem 0.75rem', borderRadius: '8px', border: `1px solid ${theme.cardBorder}` }}>
                        <Search size={14} style={{ color: theme.textMuted }} />
                        <input
                            type="text"
                            placeholder="Search PIN/Serial..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ background: 'transparent', border: 'none', outline: 'none', color: theme.text, fontSize: '0.8rem', width: '120px' }}
                        />
                    </div>
                    <select value={filterExamType} onChange={(e) => setFilterExamType(e.target.value)} style={selectStyle}>
                        <option value="">All Exams</option>
                        {examTypes.map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                    <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={selectStyle}>
                        <option value="">All Status</option>
                        <option value="AVAILABLE">Available</option>
                        <option value="SOLD">Sold</option>
                    </select>
                </div>
            </div>

            {/* Bulk Actions Bar */}
            {selectedPins.length > 0 && (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '0.75rem 1rem',
                    background: darkMode ? '#1e3a5f' : '#eff6ff',
                    borderRadius: '8px',
                    marginBottom: '1rem'
                }}>
                    <span style={{ fontSize: '0.85rem', color: theme.text, fontWeight: '500' }}>
                        {selectedPins.length} selected
                    </span>
                    <button onClick={handleBulkExport} style={{
                        padding: '0.4rem 0.75rem',
                        background: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem'
                    }}>
                        <Download size={12} /> Export
                    </button>
                    <button onClick={handleBulkDelete} style={{
                        padding: '0.4rem 0.75rem',
                        background: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem'
                    }}>
                        <Trash2 size={12} /> Delete
                    </button>
                    <button onClick={() => setSelectedPins([])} style={{
                        padding: '0.4rem 0.75rem',
                        background: 'transparent',
                        color: theme.textMuted,
                        border: 'none',
                        fontSize: '0.75rem',
                        cursor: 'pointer'
                    }}>
                        Clear selection
                    </button>
                </div>
            )}

            {/* Table */}
            <div className="table-responsive" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', minWidth: '650px', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                    <thead style={{ background: darkMode ? '#0f172a' : '#f8fafc', fontWeight: '600', textAlign: 'left' }}>
                        <tr>
                            <th style={{ ...tableStyles.th, width: '40px' }}>
                                <button onClick={toggleSelectAll} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}>
                                    {selectedPins.length === filteredPins.length && filteredPins.length > 0
                                        ? <CheckSquare size={16} style={{ color: '#3b82f6' }} />
                                        : <Square size={16} style={{ color: theme.textMuted }} />
                                    }
                                </button>
                            </th>
                            <th style={{ ...tableStyles.th, color: theme.textMuted }}>ID</th>
                            <th style={{ ...tableStyles.th, color: theme.textMuted }}>Exam Type</th>
                            <th style={{ ...tableStyles.th, color: theme.textMuted }}>Serial</th>
                            <th style={{ ...tableStyles.th, color: theme.textMuted }}>PIN</th>
                            <th style={{ ...tableStyles.th, color: theme.textMuted }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPins.map(pin => (
                            <tr key={pin.id} style={{ borderBottom: `1px solid ${theme.cardBorder}`, background: selectedPins.includes(pin.id) ? (darkMode ? '#1e3a5f20' : '#eff6ff') : 'transparent' }}>
                                <td style={{ ...tableStyles.td }}>
                                    <button onClick={() => toggleSelectPin(pin.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}>
                                        {selectedPins.includes(pin.id)
                                            ? <CheckSquare size={16} style={{ color: '#3b82f6' }} />
                                            : <Square size={16} style={{ color: theme.textMuted }} />
                                        }
                                    </button>
                                </td>
                                <td style={{ ...tableStyles.td, color: theme.textMuted }}>#{pin.id?.slice(0, 8)}</td>
                                <td style={{ ...tableStyles.td, color: theme.text, fontWeight: '600' }}>{pin.examType}</td>
                                <td style={{ ...tableStyles.td, color: theme.textMuted }}>{pin.serial}</td>
                                <td style={tableStyles.td}>
                                    <span style={{ fontFamily: 'monospace', background: darkMode ? '#334155' : '#f1f5f9', padding: '2px 8px', borderRadius: '4px', color: theme.text, fontSize: '0.8rem' }}>{pin.pin}</span>
                                </td>
                                <td style={tableStyles.td}>
                                    <Badge type={pin.status === 'AVAILABLE' ? 'success' : 'danger'}>{pin.status}</Badge>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.5rem', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.8rem', color: theme.textMuted }}>
                    Showing {filteredPins.length} of {pins.length} PINs
                </span>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <button disabled={pinPage === 1} onClick={() => setPinPage(p => p - 1)} style={{ padding: '0.5rem 1rem', background: darkMode ? '#334155' : '#e2e8f0', border: 'none', borderRadius: '6px', cursor: pinPage === 1 ? 'not-allowed' : 'pointer', color: theme.text, fontSize: '0.8rem', opacity: pinPage === 1 ? 0.5 : 1 }}>← Prev</button>
                    <span style={{ padding: '0.5rem 1rem', color: theme.textMuted, fontSize: '0.8rem' }}>Page {pinPage} of {Math.ceil(totalPins / 50)}</span>
                    <button disabled={pinPage * 50 >= totalPins} onClick={() => setPinPage(p => p + 1)} style={{ padding: '0.5rem 1rem', background: pinPage * 50 >= totalPins ? (darkMode ? '#334155' : '#e2e8f0') : 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: pinPage * 50 >= totalPins ? theme.textMuted : 'white', border: 'none', borderRadius: '6px', cursor: pinPage * 50 >= totalPins ? 'not-allowed' : 'pointer', fontSize: '0.8rem', opacity: pinPage * 50 >= totalPins ? 0.5 : 1 }}>Next →</button>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
