import { useState, useEffect, useRef } from 'react';
import './TrustSection.css';

// Animated counter hook
function useCountUp(end, duration = 2000, startOnView = true) {
    const [count, setCount] = useState(0);
    const [hasStarted, setHasStarted] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        if (!startOnView) {
            setHasStarted(true);
        }
    }, [startOnView]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasStarted) {
                    setHasStarted(true);
                }
            },
            { threshold: 0.3 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [hasStarted]);

    useEffect(() => {
        if (!hasStarted) return;

        let startTime;
        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            setCount(Math.floor(progress * end));
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        requestAnimationFrame(animate);
    }, [hasStarted, end, duration]);

    return { count, ref };
}

function TrustSection() {
    // TODO: Fetch student count from backend API when live
    // Example: const { data } = useFetch('/api/stats');
    // const studentCount = data?.totalStudents || 5000;
    const studentCount = 5200; // <-- This will come from API

    // Animated counters (static values - just for visual effect)
    const stat1 = useCountUp(100, 1500);
    // Student count is the only dynamic value from backend
    const stat4 = useCountUp(Math.floor(studentCount / 1000), 2000);

    return (
        <section className="trust-section">
            <div className="container">
                {/* Section Header */}
                <div className="trust-header">
                    <span className="trust-label">Why ResultGate</span>
                    <h2 className="trust-title">
                        Simple. Secure. <span className="trust-highlight">Fast.</span>
                    </h2>
                    <p className="trust-subtitle">
                        Access your exam results without the stress.
                    </p>
                </div>

                {/* Animated Stats Display */}
                <div className="trust-stats-row" ref={stat1.ref}>
                    <div className="stat-item">
                        <div className="stat-number">{stat1.count}<span className="stat-unit">%</span></div>
                        <div className="stat-text">Secure</div>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-item">
                        <div className="stat-number">24<span className="stat-unit">/7</span></div>
                        <div className="stat-text">Available</div>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-item">
                        <div className="stat-number">&lt;1<span className="stat-unit">min</span></div>
                        <div className="stat-text">Delivery</div>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-item">
                        <div className="stat-number">{stat4.count}K<span className="stat-unit">+</span></div>
                        <div className="stat-text">Students</div>
                    </div>
                </div>

                {/* Trust Badges - Simple inline list */}
                <div className="trust-badges">
                    <div className="trust-badge">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                            <polyline points="9 12 11 14 15 10" />
                        </svg>
                        <span>Encrypted Payments</span>
                    </div>
                    <div className="trust-badge">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                        </svg>
                        <span>Instant Delivery</span>
                    </div>
                    <div className="trust-badge">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                        <span>Official Access</span>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default TrustSection;
