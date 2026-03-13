import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Droplet, MapPin, Hospital, Info, Search, Phone, User, Calendar, MessageSquare } from 'lucide-react';
import { getPublicDemands } from '../../api/publicDemands';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import styles from './BloodRequests.module.css';

const BloodRequests = () => {
    const [demands, setDemands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ blood_type: '', city: '' });
    const navigate = useNavigate();

    const userString = localStorage.getItem('USER');
    const user = userString ? JSON.parse(userString) : null;
    const isAuthenticated = !!localStorage.getItem('ACCESS_TOKEN');

    useEffect(() => {
        fetchDemands();
    }, []);

    const fetchDemands = async (currentFilters = filters) => {
        setLoading(true);
        try {
            const response = await getPublicDemands(currentFilters);
            setDemands(response.data.data);
        } catch (err) {
            console.error("Error fetching demands:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchDemands();
    };

    const handleDonate = (demand) => {
        if (!isAuthenticated) {
            navigate('/auth/login', { state: { from: '/request-blood', message: 'Veuillez vous connecter pour contacter le demandeur.' } });
            return;
        }

        if (user.role === 'receveur') {
            alert("Cette opération est réservée aux donneurs.");
            return;
        }

        // Ideally, show a modal with contact details or a message form
        alert(`Vous souhaitez aider pour cette demande ? Contactez l'hôpital ${demand.hospital_name} ou le demandeur.`);
    };

    return (
        <div className={styles.container}>
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <h1>Demandes Urgentes de Sang</h1>
                    <p>Chaque minute compte. Parcourez les demandes actuelles et sauvez une vie en donnant votre sang.</p>
                </div>
            </section>

            <div className={styles.contentWrapper}>
                <form className={styles.filterBar} onSubmit={handleSearch}>
                    <div className={styles.filterGroup}>
                        <label>Groupe Sanguin</label>
                        <select name="blood_type" value={filters.blood_type} onChange={handleFilterChange} className={styles.select}>
                            <option value="">Tous les groupes</option>
                            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                    <div className={styles.filterGroup}>
                        <label>Ville</label>
                        <Input
                            name="city"
                            placeholder="Ex: Casablanca"
                            value={filters.city}
                            onChange={handleFilterChange}
                            icon={MapPin}
                        />
                    </div>
                    <Button type="submit" className={styles.searchBtn}>
                        <Search size={20} /> Rechercher
                    </Button>
                </form>

                {loading ? (
                    <div className={styles.loading}>Chargement des demandes...</div>
                ) : (
                    <div className={styles.grid}>
                        {demands.length > 0 ? (
                            demands.map(demand => (
                                <div key={demand.id} className={styles.card}>
                                    <div className={styles.cardHeader}>
                                        <div className={`${styles.bloodBadge} ${styles[demand.blood_type.replace('+', 'Plus').replace('-', 'Minus')]}`}>
                                            {demand.blood_type}
                                        </div>
                                        <div className={styles.location}>
                                            <MapPin size={16} />
                                            <span>{demand.city}</span>
                                        </div>
                                    </div>

                                    <div className={styles.cardBody}>
                                        <div className={styles.infoRow}>
                                            <Hospital size={18} className={styles.icon} />
                                            <div>
                                                <strong>Hôpital</strong>
                                                <p>{demand.hospital_name}</p>
                                            </div>
                                        </div>
                                        <div className={styles.infoRow}>
                                            <User size={18} className={styles.icon} />
                                            <div>
                                                <strong>Demandeur</strong>
                                                <p>{demand.user?.name || 'Utilisateur'}</p>
                                            </div>
                                        </div>
                                        <div className={styles.infoRow}>
                                            <Calendar size={18} className={styles.icon} />
                                            <div>
                                                <strong>Posté le</strong>
                                                <p>{new Date(demand.created_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>

                                        {demand.description && (
                                            <div className={styles.description}>
                                                <Info size={18} className={styles.icon} />
                                                <p>{demand.description}</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className={styles.cardFooter}>
                                        <Button
                                            onClick={() => handleDonate(demand)}
                                            fullWidth
                                            className={styles.helpBtn}
                                        >
                                            <MessageSquare size={18} /> Aider cette personne
                                        </Button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className={styles.emptyState}>
                                <Info size={48} />
                                <p>Aucune demande correspondante n'a été trouvée.</p>
                                <Button onClick={() => setFilters({ blood_type: '', city: '' })} variant="outline">
                                    Réinitialiser les filtres
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BloodRequests;
