import React from 'react';
import styles from './AuthLayout.module.css';

const AuthLayout = ({ children, title, subtitle }) => {
    return (
        <div className={styles.container}>
            <div className={styles.formSection}>
                <div className={styles.formWrapper}>
                    <div className={styles.header}>
                        <h1 className={styles.logo}>BloodLink</h1>
                        <h2 className={styles.title}>{title}</h2>
                        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
