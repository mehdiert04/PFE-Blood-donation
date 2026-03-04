import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getBloodDemand, cancelBloodDemand } from '../../api/receveur';
import styles from './Receveur.module.css';

const DemandDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [demand, setDemand] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDemand = async () => {
            try {
                const response = await getBloodDemand(id);
                if (response.data && response.data.data) {
                    setDemand(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching demand details:", error);
                alert("Could not load demand details.");
                navigate('/receveur/demands');
            } finally {
                setLoading(false);
            }
        };
        fetchDemand();
    }, [id, navigate]);

    const handleCancel = async () => {
        if (window.confirm("Are you sure you want to cancel this demand?")) {
            try {
                await cancelBloodDemand(id);
                setDemand(prev => ({ ...prev, status: 'cancelled' }));
            } catch (error) {
                alert("Failed to cancel demand.");
            }
        }
    };

    if (loading) return <div className={styles.loader}>Loading demand details...</div>;
    if (!demand) return <div className={styles.error}>Demand not found.</div>;

    return (
        <div className={styles.container}>
            <div className={styles.detailCard}>
                <header className={styles.detailHeader}>
                    <button onClick={() => navigate('/receveur/demands')} className={styles.backButton}>
                        &larr; Back to List
                    </button>
                    <h1>Demand Details</h1>
                    <span className={`${styles.statusBadge} ${styles[demand.status]}`}>
                        {demand.status}
                    </span>
                </header>

                <div className={styles.detailContent}>
                    <div className={styles.infoGrid}>
                        <div className={styles.infoItem}>
                            <label>Blood Type</label>
                            <p className={styles.bloodTypeLarge}>{demand.blood_type}</p>
                        </div>
                        <div className={styles.infoItem}>
                            <label>Quantity</label>
                            <p>{demand.quantity} Unit(s)</p>
                        </div>
                        <div className={styles.infoItem}>
                            <label>Hospital</label>
                            <p>{demand.hospital_name}</p>
                        </div>
                        <div className={styles.infoItem}>
                            <label>City</label>
                            <p>{demand.city}</p>
                        </div>
                    </div>

                    <div className={styles.descriptionSection}>
                        <label>Description</label>
                        <p>{demand.description || "No description provided."}</p>
                    </div>

                    <div className={styles.metaSection}>
                        <p>Requested on: {new Date(demand.created_at).toLocaleDateString()}</p>
                        {demand.status === 'fulfilled' && (
                            <p>Fulfilled on: {new Date(demand.updated_at).toLocaleDateString()}</p>
                        )}
                    </div>
                </div>

                <div className={styles.detailActions}>
                    {demand.status === 'pending' && (
                        <button onClick={handleCancel} className={styles.cancelButtonLarge}>
                            Cancel Demand
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DemandDetails;
