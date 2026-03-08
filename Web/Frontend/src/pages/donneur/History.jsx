import React, { useState, useEffect } from 'react';
import { History as HistoryIcon, ShieldCheck, MapPin, Droplet, Calendar } from 'lucide-react';
import { getAppointments } from '../../api/donneur';
import styles from './History.module.css';

const History = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await getAppointments();
                if (response.data.success) {
                    // Filter completed donations
                    const completed = response.data.data.filter(rdv => rdv.statut === 'Terminé');
                    setHistory(completed);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    if (loading) return <div className={styles.loading}>Chargement de l'historique...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Historique des Dons</h1>
                <p>Retrouvez tous vos dons passés et les vies que vous avez aidé à sauver.</p>
            </div>

            <div className={styles.grid}>
                {history.length > 0 ? (
                    history.map(item => (
                        <div key={item.id} className={styles.card}>
                            <div className={styles.cardIcon}>
                                <div className={styles.checkSeal}>
                                    <ShieldCheck size={32} />
                                </div>
                            </div>
                            <div className={styles.cardContent}>
                                <div className={styles.cardMain}>
                                    <h3>Don de {item.type_don}</h3>
                                    <p className={styles.hospital}><MapPin size={16} /> {item.hopital?.hopital_profile?.nom_etablissement}</p>
                                </div>
                                <div className={styles.divider}></div>
                                <div className={styles.cardFooter}>
                                    <span className={styles.date}><Calendar size={14} /> {new Date(item.date_rdv).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                    <span className={styles.volume}><Droplet size={14} /> 450ml</span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className={styles.empty}>
                        <HistoryIcon size={64} />
                        <p>Aucun don terminé pour le moment.</p>
                        <p className={styles.subText}>Vos dons apparaîtront ici une fois confirmés par les centres.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default History;
