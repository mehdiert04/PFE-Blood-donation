import React from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, Users, User, LogOut, Droplet, Clock } from 'lucide-react';
import styles from './HospitalLayout.module.css';

const HospitalLayout = () => {
    const handleLogout = () => {
        localStorage.removeItem('ACCESS_TOKEN');
        localStorage.removeItem('USER');
        window.location.href = '/auth/login';
    };

    return (
        <div className={styles.layout}>
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <Link to="/" className={styles.logo}>
                        BloodLink <span>Hôpital</span>
                    </Link>
                </div>

                <nav className={styles.nav}>
                    <NavLink
                        to="/hospital/dashboard"
                        className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}
                    >
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </NavLink>
                    <NavLink
                        to="/hospital/donor-requests"
                        className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}
                    >
                        <Droplet size={20} />
                        <span>Offres de Dons</span>
                    </NavLink>
                    <NavLink
                        to="/hospital/appointments"
                        className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}
                    >
                        <Clock size={20} />
                        <span>Rendez-vous</span>
                    </NavLink>
                    <NavLink
                        to="/hospital/profile"
                        className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}
                    >
                        <User size={20} />
                        <span>Mon Profil</span>
                    </NavLink>
                </nav>

                <div className={styles.sidebarFooter}>
                    <button onClick={handleLogout} className={styles.logoutBtn}>
                        <LogOut size={20} />
                        <span>Déconnexion</span>
                    </button>
                </div>
            </aside>

            <main className={styles.mainContent}>
                <Outlet />
            </main>
        </div>
    );
};

export default HospitalLayout;
