import './Skeleton.css';

/**
 * Skeleton - Loading placeholder component
 */
export function Skeleton({ width, height, variant = 'text', className = '' }) {
    const style = {
        width: width || '100%',
        height: height || (variant === 'text' ? '1em' : variant === 'avatar' ? '40px' : '100%'),
    };

    return (
        <div
            className={`skeleton skeleton-${variant} ${className}`}
            style={style}
        />
    );
}

/**
 * SkeletonCard - Full card skeleton for loading states
 */
export function SkeletonCard() {
    return (
        <div className="skeleton-card">
            <Skeleton variant="rectangle" height="120px" />
            <div className="skeleton-card-content">
                <Skeleton width="60%" height="1.5em" />
                <Skeleton width="80%" />
                <Skeleton width="40%" />
            </div>
        </div>
    );
}

/**
 * SkeletonTable - Table loading skeleton
 */
export function SkeletonTable({ rows = 3 }) {
    return (
        <div className="skeleton-table">
            <div className="skeleton-table-header">
                <Skeleton height="40px" />
            </div>
            {Array(rows).fill(null).map((_, i) => (
                <div key={i} className="skeleton-table-row">
                    <Skeleton height="60px" />
                </div>
            ))}
        </div>
    );
}

/**
 * SkeletonStats - Stats grid skeleton
 */
export function SkeletonStats({ count = 3 }) {
    return (
        <div className="skeleton-stats">
            {Array(count).fill(null).map((_, i) => (
                <div key={i} className="skeleton-stat">
                    <Skeleton variant="rectangle" width="80px" height="48px" style={{ margin: '0 auto' }} />
                    <Skeleton width="60%" height="14px" style={{ margin: '8px auto 0' }} />
                </div>
            ))}
        </div>
    );
}
