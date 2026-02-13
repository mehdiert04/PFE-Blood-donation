import React from 'react';
import styles from './AuthLayout.module.css';

const AuthLayout = ({ children, title, subtitle }) => {
    return (
        <div className={styles.container}>
            {/* Left Side - Branding */}
            <div className={styles.brandingSection}>
                <div className={styles.overlay}></div>
                <div className={styles.brandContent}>
                    <h1 className={styles.logo}>BloodLink</h1>
                    <p className={styles.quote}>
                        "Votre don peut sauver 3 vies. Rejoignez notre communauté aujourd'hui."
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className={styles.formSection}>
                <div className={styles.formWrapper}>
                    <div className={styles.header}>
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
