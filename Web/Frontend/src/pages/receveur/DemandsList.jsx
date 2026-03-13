import React, { useEffect, useState } from 'react';
import { getBloodDemands, cancelBloodDemand } from '../../api/receveur';
import styles from './Receveur.module.css';
import { Link } from 'react-router-dom';

const DemandsList = () => {
    const [demands, setDemands] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchDemands = async () => {
        try {
            const response = await getBloodDemands();
            if (response.data && response.data.data) {
                setDemands(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching demands:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDemands();
    }, []);

    const handleCancel = async (id) => {
        if (window.confirm("Are you sure you want to cancel this demand?")) {
            try {
                await cancelBloodDemand(id);
                fetchDemands(); // Refresh list
            } catch (error) {
                alert("Failed to cancel demand.");
            }
        }
    };

    if (loading) {
        return <div className={styles.loader}>Loading demands...</div>;
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <h1>My Blood Demands</h1>
                    <Link to="/receveur/demands/create" className={styles.primaryButton}>
                        + New Demand
                    </Link>
                </div>
            </header>

            <div className={styles.tableResponsive}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Blood Type</th>
                            <th>Hospital</th>
                            <th>City</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {demands.length > 0 ? (
                            demands.map((demand) => (
                                <tr key={demand.id}>
                                    <td className={styles.bloodType}>{demand.blood_type}</td>
                                    <td>{demand.hospital_name}</td>
                                    <td>{demand.city}</td>
                                    <td>
                                        <span className={`${styles.statusBadge} ${styles[demand.status]}`}>
                                            {demand.status}
                                        </span>
                                    </td>
                                    <td className={styles.tableActions}>
                                        <Link to={`/receveur/demands/${demand.id}`} className={styles.viewLink}>
                                            View
                                        </Link>
                                        {demand.status === 'pending' && (
                                            <button
                                                onClick={() => handleCancel(demand.id)}
                                                className={styles.cancelButton}
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className={styles.emptyMessage}>
                                    No demands found. Create one to get started.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DemandsList;
