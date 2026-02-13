import React, { forwardRef } from 'react';
import styles from './Select.module.css';

const Select = forwardRef(({ label, error, icon: Icon, options = [], ...props }, ref) => {
    return (
        <div className={styles.wrapper}>
            {label && <label className={styles.label}>{label}</label>}
            <div className={`${styles.inputContainer} ${error ? styles.hasError : ''}`}>
                {Icon && <Icon className={styles.iconStyles} size={20} />}
                <select
                    ref={ref}
                    className={`${styles.selectField} ${!Icon ? styles.noIcon : ''}`}
                    {...props}
                >
                    <option value="" disabled>Select an option</option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <div className={styles.arrow} />
            </div>
            {error && <span className={styles.errorMessage}>{error.message || error}</span>}
        </div>
    );
});

Select.displayName = 'Select';

export default Select;
