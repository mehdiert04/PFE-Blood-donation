import React, { useEffect, useState } from 'react';
import { getReceveurStats, getBloodDemands } from '../../api/receveur';
import styles from './Receveur.module.css';
import { Link } from 'react-router-dom';
import { 
    Activity, 
    Clock, 
    CheckCircle, 
    XCircle, 
    PlusCircle, 
    ArrowRight,
    Droplets,
    FileText,
    MapPin,
    Calendar
} from 'lucide-react';

const Dashboard = () => {
    const [stats, setStats] = useState({
        total_demands: 0,
        pending_demands: 0,
        fulfilled_demands: 0,
        cancelled_demands: 0
    });
    const [recentDemands, setRecentDemands] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [statsRes, demandsRes] = await Promise.all([
                    getReceveurStats(),
                    getBloodDemands()
                ]);

                if (statsRes.data && statsRes.data.data) {
                    setStats(statsRes.data.data);
                }
                if (demandsRes.data && demandsRes.data.data) {
                    setRecentDemands(demandsRes.data.data.slice(0, 3));
                }
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className={styles.loaderContainer}>
                <div className={styles.spinner}></div>
                <p>Chargement de votre espace...</p>
            </div>
        );
    }

    return (
        <div className={styles.dashboardContainer}>
            <div className={styles.dashboardHeader}>
                <div>
                    <h1>Tableau de Bord Receveur</h1>
                    <p>Gérez vos demandes de sang et suivez leur progression en temps réel.</p>
                </div>
                <Link to="/receveur/demands/create" className={styles.premiumAddBtn}>
                    <PlusCircle size={20} />
                    Nouvelle Demande
                </Link>
            </div>

            <div className={styles.statsGridPremium}>
                <div className={`${styles.statCardPremium} ${styles.blue}`}>
                    <div className={styles.statIcon}><FileText size={24} /></div>
                    <div className={styles.statInfo}>
                        <h3>Total Demandes</h3>
                        <p>{stats.total_demands}</p>
                    </div>
                </div>
                <div className={`${styles.statCardPremium} ${styles.orange}`}>
                    <div className={styles.statIcon}><Clock size={24} /></div>
                    <div className={styles.statInfo}>
                        <h3>En Attente</h3>
                        <p>{stats.pending_demands}</p>
                    </div>
                </div>
                <div className={`${styles.statCardPremium} ${styles.green}`}>
                    <div className={styles.statIcon}><CheckCircle size={24} /></div>
                    <div className={styles.statInfo}>
                        <h3>Satisfaites</h3>
                        <p>{stats.fulfilled_demands}</p>
                    </div>
                </div>
                <div className={`${styles.statCardPremium} ${styles.red}`}>
                    <div className={styles.statIcon}><XCircle size={24} /></div>
                    <div className={styles.statInfo}>
                        <h3>Annulées</h3>
                        <p>{stats.cancelled_demands}</p>
                    </div>
                </div>
            </div>

            <div className={styles.dashboardGridTwoCol}>
                <div className={styles.recentDemandsSection}>
                    <div className={styles.sectionHeader}>
                        <h2>Demandes Récentes</h2>
                        <Link to="/receveur/demands">Voir tout <ArrowRight size={16} /></Link>
                    </div>
                    <div className={styles.recentList}>
                        {recentDemands.length > 0 ? (
                            recentDemands.map(demand => (
                                <div key={demand.id} className={styles.recentItem}>
                                    <div className={styles.bloodTypeSmall}>{demand.blood_type}</div>
                                    <div className={styles.recentInfo}>
                                        <h4>{demand.hospital_name}</h4>
                                        <p><MapPin size={12} /> {demand.city}</p>
                                    </div>
                                    <div className={styles.recentMeta}>
                                        <span className={`${styles.statusBadge} ${styles[demand.status]}`}>
                                            {demand.status === 'pending' ? 'En attente' : demand.status}
                                        </span>
                                        <p><Calendar size={12} /> {new Date(demand.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className={styles.noData}>
                                <p>Aucune demande trouvée.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className={styles.quickActionsSection}>
                    <div className={styles.actionCardSmall}>
                        <div className={styles.actionIconSmall}><Droplets size={24} /></div>
                        <div>
                            <h3>Besoin de sang ?</h3>
                            <p>Créez une alerte pour les donneurs.</p>
                            <Link to="/receveur/demands/create">Créer une demande</Link>
                        </div>
                    </div>
                    <div className={styles.actionCardSmall}>
                        <div className={styles.actionIconSmall}><Activity size={24} /></div>
                        <div>
                            <h3>Consulter le stock</h3>
                            <p>Vérifiez les disponibilités générales.</p>
                            <Link to="/request-blood">Voir les demandes publiques</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
