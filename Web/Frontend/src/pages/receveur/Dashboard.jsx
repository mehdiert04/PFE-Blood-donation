import React, { useEffect, useState } from 'react';
import { getReceveurStats } from '../../api/receveur';
import styles from './Receveur.module.css';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [stats, setStats] = useState({
        total_demands: 0,
        pending_demands: 0,
        fulfilled_demands: 0,
        cancelled_demands: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await getReceveurStats();
                if (response.data && response.data.data) {
                    setStats(response.data.data);
                }
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
                    <div className={styles.statValue}>{stats.total_demands || 0}</div>
                </div>
                <div className={`${styles.statCard} ${styles.pending}`}>
                    <h3>Pending</h3>
                    <div className={styles.statValue}>{stats.pending_demands || 0}</div>
                </div>
                <div className={`${styles.statCard} ${styles.fulfilled}`}>
                    <h3>Fulfilled</h3>
                    <div className={styles.statValue}>{stats.fulfilled_demands || 0}</div>
                </div>
                <div className={`${styles.statCard} ${styles.cancelled}`}>
                    <h3>Cancelled</h3>
                    <div className={styles.statValue}>{stats.cancelled_demands || 0}</div>
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
