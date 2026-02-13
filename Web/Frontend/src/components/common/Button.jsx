import React from 'react';
import styles from './Button.module.css';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    fullWidth = false,
    className = '',
    ...props
}) => {
    return (
        <button
            className={`
        ${styles.button} 
        ${styles[variant]} 
        ${styles[size]} 
        ${fullWidth ? styles.fullWidth : ''}
        ${isLoading ? styles.loading : ''}
        ${className}
      `}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading ? (
                <span className={styles.spinner}></span>
            ) : children}
        </button>
    );
};

export default Button;
