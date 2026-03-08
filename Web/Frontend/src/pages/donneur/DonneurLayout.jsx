import React from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, Calendar, History, User, LogOut } from 'lucide-react';
import styles from './DonneurLayout.module.css';

const DonneurLayout = () => {
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
                        BloodLink <span>Donneur</span>
                    </Link>
                </div>

                <nav className={styles.nav}>
                    <NavLink
                        to="/donneur/dashboard"
                        className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}
                    >
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </NavLink>
                    <NavLink
                        to="/donneur/appointments"
                        className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}
                    >
                        <Calendar size={20} />
                        <span>Rendez-vous</span>
                    </NavLink>
                    <NavLink
                        to="/donneur/history"
                        className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}
                    >
                        <History size={20} />
                        <span>Historique</span>
                    </NavLink>
                    <NavLink
                        to="/donneur/profile"
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

export default DonneurLayout;
