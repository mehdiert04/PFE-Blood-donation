import React, { useState, useEffect } from 'react';
import { Heart, Droplet, Users, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getDonneurStats } from '../../api/donneur';
import styles from './Dashboard.module.css';

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getDonneurStats();
                setData(response.data.data);
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className={styles.loading}>Chargement de vos statistiques...</div>;

    const stats = data?.stats || { total_dons: 0, volume_total: 0, vies_sauvees: 0 };
    const nextRdv = data?.next_appointment;
    const recentHistory = data?.recent_history || [];

    return (
        <div className={styles.dashboard}>
            <header className={styles.header}>
                <h1>Bonjour de nouveau !</h1>
                <p>Votre générosité fait la différence. Voici un aperçu de votre impact.</p>
            </header>

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={`${styles.iconWrapper} ${styles.red}`}>
                        <Droplet size={24} />
                    </div>
                    <div className={styles.statInfo}>
                        <h3>{stats.total_dons}</h3>
                        <p>Dons Total</p>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={`${styles.iconWrapper} ${styles.blue}`}>
                        <Heart size={24} />
                    </div>
                    <div className={styles.statInfo}>
                        <h3>{stats.volume_total}L</h3>
                        <p>Volume Donné</p>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={`${styles.iconWrapper} ${styles.green}`}>
                        <Users size={24} />
                    </div>
                    <div className={styles.statInfo}>
                        <h3>{stats.vies_sauvees}</h3>
                        <p>Vies Sauvées</p>
                    </div>
                </div>
            </div>

            <div className={styles.mainGrid}>
                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2>Prochain Rendez-vous</h2>
                        <Link to="/donneur/appointments" className={styles.viewAll}>Gérer <ArrowRight size={16} /></Link>
                    </div>
                    {nextRdv ? (
                        <div className={styles.nextRdvCard}>
                            <div className={styles.rdvDate}>
                                <Calendar size={40} />
                                <div>
                                    <h4>{new Date(nextRdv.date_rdv).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</h4>
                                    <p>{nextRdv.heure_rdv.substring(0, 5)}</p>
                                </div>
                            </div>
                            <div className={styles.rdvInfo}>
                                <p><strong>Lieu:</strong> {nextRdv.hopital?.hopital_profile?.nom_etablissement || 'Hôpital'}</p>
                                <p><strong>Type:</strong> {nextRdv.type_don}</p>
                                <span className={`${styles.badge} ${styles[nextRdv.statut.toLowerCase().replace(' ', '')]}`}>{nextRdv.statut}</span>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.emptyCard}>
                            <p>Vous n'avez pas de rendez-vous prévu.</p>
                            <Link to="/donneur/appointments" className={styles.btnSecondary}>Prendre rendez-vous</Link>
                        </div>
                    )}
                </section>

                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2>Dons Récents</h2>
                        <Link to="/donneur/history" className={styles.viewAll}>Historique <ArrowRight size={16} /></Link>
                    </div>
                    <div className={styles.historyList}>
                        {recentHistory.length > 0 ? (
                            recentHistory.map(rdv => (
                                <div key={rdv.id} className={styles.historyItem}>
                                    <div className={styles.historyIcon}>
                                        <ShieldCheck size={20} />
                                    </div>
                                    <div className={styles.historyInfo}>
                                        <p className={styles.historyLieu}>{rdv.hopital?.hopital_profile?.nom_etablissement}</p>
                                        <p className={styles.historyDate}>{new Date(rdv.date_rdv).toLocaleDateString()}</p>
                                    </div>
                                    <span className={styles.historyType}>{rdv.type_don}</span>
                                </div>
                            ))
                        ) : (
                            <p className={styles.emptyText}>Aucun don enregistré pour le moment.</p>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Dashboard;
