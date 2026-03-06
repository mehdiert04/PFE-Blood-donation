import React from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, ClipboardList, PlusCircle, LogOut, User } from 'lucide-react';
import styles from './ReceveurLayout.module.css';

const ReceveurLayout = () => {
    const handleLogout = () => {
        localStorage.removeItem('ACCESS_TOKEN');
        window.location.href = '/auth/login';
    };

    return (
        <div className={styles.layout}>
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <Link to="/" className={styles.logo}>
                        BloodLink <span>Receveur</span>
                    </Link>
                </div>

                <nav className={styles.nav}>
                    <NavLink
                        to="/receveur/dashboard"
                        className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}
                    >
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </NavLink>
                    <NavLink
                        to="/receveur/demands"
                        end
                        className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}
                    >
                        <ClipboardList size={20} />
                        <span>My Demands</span>
                    </NavLink>
                    <NavLink
                        to="/receveur/demands/create"
                        className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}
                    >
                        <PlusCircle size={20} />
                        <span>Create Demand</span>
                    </NavLink>
                    <NavLink
                        to="/receveur/profile"
                        className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}
                    >
                        <User size={20} />
                        <span>Mon Profil</span>
                    </NavLink>
                </nav>

                <div className={styles.sidebarFooter}>
                    <button onClick={handleLogout} className={styles.logoutBtn}>
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            <main className={styles.mainContent}>
                <Outlet />
            </main>
        </div>
    );
};

export default ReceveurLayout;
