import React, { useState, useEffect } from 'react';
import { Droplet, MapPin, Hospital, User, Calendar, MessageSquare, CheckCircle, Search, Info } from 'lucide-react';
import { getAvailableDemands, helpDemand } from '../../api/donneur';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import styles from './BloodDemands.module.css';

const BloodDemands = () => {
    const [demands, setDemands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [message, setMessage] = useState(null);

    useEffect(() => {
        fetchDemands();
    }, []);

    const fetchDemands = async () => {
        setLoading(true);
        try {
            const response = await getAvailableDemands();
            if (response.data.success) {
                setDemands(response.data.data);
            }
        } catch (err) {
            console.error("Error fetching available demands:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleHelp = async (demandId) => {
        try {
            const response = await helpDemand(demandId);
            if (response.data.success) {
                setMessage(response.data.message);
                // Remove the demand from the list since the donor helped
                setDemands(prev => prev.filter(d => d.id !== demandId));
                // Clear message after 5 seconds
                setTimeout(() => setMessage(null), 5000);
            }
        } catch (err) {
            alert(err.response?.data?.message || "Une erreur est survenue.");
        }
    };

    const filteredDemands = demands.filter(d => 
        d.blood_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.hospital_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className={styles.loader}>Chargement des demandes urgentes...</div>;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1>Demandes de Sang Urgentes</h1>
                    <p>Ces personnes ont besoin de votre aide. Proposez votre don et sauvez une vie.</p>
                </div>
                <div className={styles.searchWrapper}>
                    <Input 
                        placeholder="Rechercher par groupe, ville, hôpital..."
                        icon={Search}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </header>

            {message && (
                <div className={styles.successBanner}>
                    <CheckCircle size={20} />
                    <span>{message}</span>
                </div>
            )}

            <div className={styles.grid}>
                {filteredDemands.length > 0 ? (
                    filteredDemands.map(demand => (
                        <div key={demand.id} className={styles.card}>
                            <div className={styles.cardHeader}>
                                <div className={styles.bloodBadge}>
                                    {demand.blood_type}
                                </div>
                                <div className={styles.meta}>
                                    <span className={styles.city}><MapPin size={14} /> {demand.city}</span>
                                    <span className={styles.date}><Calendar size={14} /> Posté le {new Date(demand.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <div className={styles.cardBody}>
                                <div className={styles.infoRow}>
                                    <Hospital size={18} className={styles.icon} />
                                    <span>{demand.hospital_name}</span>
                                </div>
                                <div className={styles.infoRow}>
                                    <User size={18} className={styles.icon} />
                                    <span>{demand.user?.name || 'Demandeur'}</span>
                                </div>
                                {demand.description && (
                                    <div className={styles.description}>
                                        <Info size={16} />
                                        <p>{demand.description}</p>
                                    </div>
                                )}
                            </div>
                            <div className={styles.cardActions}>
                                <Button 
                                    onClick={() => handleHelp(demand.id)}
                                    fullWidth
                                    className={styles.helpBtn}
                                >
                                    <MessageSquare size={18} /> Proposer mon aide
                                </Button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className={styles.emptyState}>
                        <Droplet size={48} />
                        <p>Aucune demande urgente ne correspond à votre recherche.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BloodDemands;
