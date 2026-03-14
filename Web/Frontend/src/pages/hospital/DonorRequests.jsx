import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Calendar, User, Phone, Droplet, Hash, Check } from 'lucide-react';
import { getDemandResponses, approveDemandResponse } from '../../api/hospital';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import styles from './Hospital.module.css';

const DonorRequests = () => {
    const [responses, setResponses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [approvingId, setApprovingId] = useState(null);
    const [rdvData, setRdvData] = useState({
        date_rdv: new Date().toISOString().split('T')[0],
        heure_rdv: '09:00',
        type_don: 'Sang Total'
    });

    useEffect(() => {
        fetchResponses();
    }, []);

    const fetchResponses = async () => {
        try {
            const response = await getDemandResponses();
            if (response.data.success) {
                setResponses(response.data.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        setApprovingId(id);
        try {
            const res = await approveDemandResponse(id, rdvData);
            if (res.data.success) {
                alert("Rendez-vous créé avec succès !");
                setApprovingId(null);
                fetchResponses();
            }
        } catch (err) {
            alert(err.response?.data?.message || "Erreur lors de l'approbation.");
            setApprovingId(null);
        }
    };

    if (loading) return <div className={styles.loader}>Chargement des offres de dons...</div>;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Offres de Dons</h1>
                <p>Gérez les propositions des donneurs ayant répondu aux demandes de sang de votre établissement.</p>
            </header>

            <div className={styles.grid}>
                {responses.length > 0 ? (
                    responses.map(resp => (
                        <div key={resp.id} className={styles.card}>
                            <div className={styles.cardHeader}>
                                <div className={styles.statusBadge}>
                                    {resp.status === 'pending' ? <Clock size={16} /> : <CheckCircle size={16} />}
                                    <span>{resp.status === 'pending' ? 'Nouvelle offre' : 'Contacté'}</span>
                                </div>
                                <div className={styles.bloodType}>
                                    {resp.blood_demand?.blood_type}
                                </div>
                            </div>

                            <div className={styles.cardBody}>
                                <div className={styles.section}>
                                    <h3><User size={18} /> Donneur</h3>
                                    <p><strong>Nom:</strong> {resp.donneur?.name}</p>
                                    <p><strong>Email:</strong> {resp.donneur?.email}</p>
                                    {resp.donneur?.donneur_profile?.telephone && (
                                        <p><strong>Tel:</strong> {resp.donneur.donneur_profile.telephone}</p>
                                    )}
                                </div>

                                <div className={styles.section}>
                                    <h3><Droplet size={18} /> Demande Initiale</h3>
                                    <p><strong>De:</strong> {resp.blood_demand?.user?.name}</p>
                                    <p><strong>Ref:</strong> #{resp.blood_demand?.id}</p>
                                </div>

                                {resp.status === 'pending' && (
                                    <div className={styles.approveForm}>
                                        <h4>Fixer un Rendez-vous</h4>
                                        <div className={styles.formRow}>
                                            <div className={styles.inputGroup}>
                                                <label>Date</label>
                                                <input 
                                                    type="date" 
                                                    value={rdvData.date_rdv}
                                                    onChange={(e) => setRdvData({...rdvData, date_rdv: e.target.value})}
                                                    min={new Date().toISOString().split('T')[0]}
                                                />
                                            </div>
                                            <div className={styles.inputGroup}>
                                                <label>Heure</label>
                                                <input 
                                                    type="time" 
                                                    value={rdvData.heure_rdv}
                                                    onChange={(e) => setRdvData({...rdvData, heure_rdv: e.target.value})}
                                                />
                                            </div>
                                        </div>
                                        <div className={styles.inputGroup}>
                                            <label>Type de don</label>
                                            <select 
                                                value={rdvData.type_don}
                                                onChange={(e) => setRdvData({...rdvData, type_don: e.target.value})}
                                            >
                                                <option value="Sang Total">Sang Total</option>
                                                <option value="Plasma">Plasma</option>
                                                <option value="Plaquettes">Plaquettes</option>
                                            </select>
                                        </div>
                                        <Button 
                                            fullWidth 
                                            onClick={() => handleApprove(resp.id)}
                                            isLoading={approvingId === resp.id}
                                            className={styles.approveBtn}
                                        >
                                            <Check size={18} /> Valider & Créer RDV
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className={styles.empty}>
                        <Clock size={48} />
                        <p>Aucune offre de don en attente pour le moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DonorRequests;
