import React, { forwardRef } from 'react';
import styles from './Input.module.css';

const Input = forwardRef(({ label, error, icon: Icon, type = 'text', ...props }, ref) => {
    return (
        <div className={styles.wrapper}>
            {label && <label className={styles.label}>{label}</label>}
            <div className={`${styles.inputContainer} ${error ? styles.hasError : ''}`}>
                {Icon && <Icon className={styles.iconStyles} size={20} />}
                <input
                    ref={ref}
                    type={type}
                    className={`${styles.inputField} ${!Icon ? styles.noIcon : ''}`}
                    {...props}
                />
            </div>
            {error && <span className={styles.errorMessage}>{error.message || error}</span>}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
