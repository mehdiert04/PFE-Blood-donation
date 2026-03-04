import React, { useEffect, useState } from 'react';
import { getReceveurStats } from '../../api/receveur';
import styles from './Receveur.module.css';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        fulfilled: 0,
        cancelled: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await getReceveurStats();
                setStats(response.data);
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return <div className={styles.loader}>Loading statistics...</div>;
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Receiver Dashboard</h1>
                <p>Track and manage your blood donation requests.</p>
            </header>

            <div className={styles.statsGrid}>
                <div className={`${styles.statCard} ${styles.total}`}>
                    <h3>Total Demands</h3>
                    <div className={styles.statValue}>{stats.total}</div>
                </div>
                <div className={`${styles.statCard} ${styles.pending}`}>
                    <h3>Pending</h3>
                    <div className={styles.statValue}>{stats.pending}</div>
                </div>
                <div className={`${styles.statCard} ${styles.fulfilled}`}>
                    <h3>Fulfilled</h3>
                    <div className={styles.statValue}>{stats.fulfilled}</div>
                </div>
                <div className={`${styles.statCard} ${styles.cancelled}`}>
                    <h3>Cancelled</h3>
                    <div className={styles.statValue}>{stats.cancelled}</div>
                </div>
            </div>

            <div className={styles.actions}>
                <Link to="/receveur/demands/create" className={styles.primaryButton}>
                    Create New Demand
                </Link>
                <Link to="/receveur/demands" className={styles.secondaryButton}>
                    View All Demands
                </Link>
            </div>
        </div>
    );
};

export default Dashboard;
