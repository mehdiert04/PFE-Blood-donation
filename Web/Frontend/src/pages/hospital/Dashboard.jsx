import React, { useState, useEffect } from 'react';
import { Users, Droplet, Calendar, Clock, Activity, TrendingUp, AlertCircle } from 'lucide-react';
import { getDemandResponses } from '../../api/hospital';
import styles from './Hospital.module.css';

const Dashboard = () => {
    const [stats, setStats] = useState({
        pendingOffers: 0,
        todayAppointments: 0,
        activeDemands: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const res = await getDemandResponses();
            if (res.data.success) {
                const offers = res.data.data;
                setStats({
                    pendingOffers: offers.filter(o => o.status === 'pending').length,
                    todayAppointments: 0, // Placeholder
                    activeDemands: [...new Set(offers.map(o => o.blood_demand_id))].length
                });
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className={styles.loader}>Chargement...</div>;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Tableau de bord Hôpital</h1>
                <p>Aperçu de l'activité de votre établissement.</p>
            </header>

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={`${styles.iconWrapper} ${styles.blue}`}>
                        <Droplet size={24} />
                    </div>
                    <div className={styles.statInfo}>
                        <h3>{stats.pendingOffers}</h3>
                        <p>Nouvelles offres de don</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={`${styles.iconWrapper} ${styles.green}`}>
                        <Calendar size={24} />
                    </div>
                    <div className={styles.statInfo}>
                        <h3>{stats.todayAppointments}</h3>
                        <p>RDV aujourd'hui</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={`${styles.iconWrapper} ${styles.red}`}>
                        <Activity size={24} />
                    </div>
                    <div className={styles.statInfo}>
                        <h3>{stats.activeDemands}</h3>
                        <p>Demandes en cours</p>
                    </div>
                </div>
            </div>

            <div className={styles.mainGrid}>
                <div className={styles.welcomeCard}>
                    <h2>Bienvenue sur BloodLink</h2>
                    <p>Vous pouvez maintenant gérer les offres de dons des donneurs bénévoles. Accédez à la section "Offres de Dons" pour valider les propositions et fixer des rendez-vous.</p>
                    <div className={styles.actionPrompt}>
                        <TrendingUp size={20} />
                        <span>Votre réactivité sauve des vies.</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
