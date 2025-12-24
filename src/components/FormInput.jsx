import './FormInput.css';

/**
 * FormInput - Styled input with validation feedback
 */
export function FormInput({
    label,
    name,
    type = 'text',
    error,
    hint,
    required,
    icon,
    ...props
}) {
    return (
        <div className={`form-field ${error ? 'has-error' : ''}`}>
            {label && (
                <label htmlFor={name} className="form-label">
                    {label}
                    {required && <span className="required-mark">*</span>}
                </label>
            )}
            <div className="input-wrapper">
                {icon && <span className="input-icon">{icon}</span>}
                <input
                    id={name}
                    name={name}
                    type={type}
                    className={`form-input ${icon ? 'has-icon' : ''}`}
                    aria-describedby={error ? `${name}-error` : hint ? `${name}-hint` : undefined}
                    {...props}
                />
            </div>
            {error && (
                <span id={`${name}-error`} className="form-error" role="alert">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    {error}
                </span>
            )}
            {hint && !error && (
                <span id={`${name}-hint`} className="form-hint">{hint}</span>
            )}
        </div>
    );
}

/**
 * FormSelect - Styled select dropdown
 */
export function FormSelect({
    label,
    name,
    error,
    options,
    placeholder,
    required,
    ...props
}) {
    return (
        <div className={`form-field ${error ? 'has-error' : ''}`}>
            {label && (
                <label htmlFor={name} className="form-label">
                    {label}
                    {required && <span className="required-mark">*</span>}
                </label>
            )}
            <select
                id={name}
                name={name}
                className="form-select"
                {...props}
            >
                {placeholder && <option value="">{placeholder}</option>}
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            {error && (
                <span className="form-error" role="alert">{error}</span>
            )}
        </div>
    );
}
