import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Clock, Users, ArrowRight, Info, AlertCircle } from 'lucide-react';
import { getCampaigns } from '../../api/campaigns';
import Button from '../../components/common/Button';
import styles from './Campaigns.module.css';

const Campaigns = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const userString = localStorage.getItem('USER');
    const user = userString ? JSON.parse(userString) : null;
    const isAuthenticated = !!localStorage.getItem('ACCESS_TOKEN');

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const response = await getCampaigns();
                setCampaigns(response.data.data);
            } catch (err) {
                console.error("Error fetching campaigns:", err);
                setError("Impossible de charger les campagnes pour le moment.");
            } finally {
                setLoading(false);
            }
        };
        fetchCampaigns();
    }, []);

    const handleParticipate = (campaign) => {
        if (!isAuthenticated) {
            navigate('/auth/login', { state: { from: '/campaigns', message: 'Veuillez vous connecter pour participer à une campagne.' } });
            return;
        }

        if (user.role === 'receveur') {
            alert("Cette opération est réservée aux donneurs. En tant que receveur, vous pouvez faire une demande de sang depuis votre tableau de bord.");
            return;
        }

        if (user.role === 'donneur') {
            alert("Merci de votre intérêt ! L'organisateur de la campagne vous contactera prochainement pour confirmer votre participation et fixer un créneau.");
            return;
        }

        // Handle other roles or edge cases
        alert("Action non autorisée pour votre rôle.");
    };

    if (loading) return <div className={styles.loading}>Chargement des campagnes...</div>;

    return (
        <div className={styles.container}>
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <h1>Campagnes de Don</h1>
                    <p>Découvrez les événements de collecte près de chez vous et sauvez des vies aujourd’hui.</p>
                </div>
            </section>

            {error && (
                <div className={styles.errorBanner}>
                    <AlertCircle size={20} />
                    <span>{error}</span>
                </div>
            )}

            <div className={styles.grid}>
                {campaigns.length > 0 ? (
                    campaigns.map(campaign => (
                        <div key={campaign.id} className={styles.card}>
                            <div className={styles.imageContainer}>
                                <img
                                    src={campaign.image_url || 'https://images.unsplash.com/photo-1542884748-2b87b36c6b90?q=80&w=800&auto=format&fit=crop'}
                                    alt={campaign.titre}
                                    className={styles.image}
                                />
                                <div className={styles.badge}>{campaign.statut}</div>
                            </div>
                            <div className={styles.content}>
                                <h3>{campaign.titre}</h3>
                                <p className={styles.description}>{campaign.description}</p>

                                <div className={styles.infoGrid}>
                                    <div className={styles.infoItem}>
                                        <MapPin size={16} />
                                        <span>{campaign.lieu}, {campaign.ville}</span>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <Calendar size={16} />
                                        <span>Du {new Date(campaign.date_debut).toLocaleDateString()} au {new Date(campaign.date_fin).toLocaleDateString()}</span>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <Clock size={16} />
                                        <span>{campaign.heure_debut.substring(0, 5)} - {campaign.heure_fin.substring(0, 5)}</span>
                                    </div>
                                    {campaign.organizer?.hopital_profile && (
                                        <div className={styles.infoItem}>
                                            <Users size={16} />
                                            <span>Organisé par: {campaign.organizer.hopital_profile.nom_etablissement}</span>
                                        </div>
                                    )}
                                </div>

                                {campaign.sponsors && (
                                    <div className={styles.sponsors}>
                                        <strong>Sponsors & Partenaires:</strong>
                                        <p>{campaign.sponsors}</p>
                                    </div>
                                )}

                                <div className={styles.actions}>
                                    <Button
                                        onClick={() => handleParticipate(campaign)}
                                        className={styles.participateBtn}
                                        fullWidth
                                    >
                                        Je participe <ArrowRight size={18} />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className={styles.empty}>
                        <Info size={48} />
                        <p>Aucune campagne active pour le moment. Revenez bientôt !</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Campaigns;
