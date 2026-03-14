import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Calendar, Clock, MapPin, Droplet, Plus, Trash2, AlertCircle, CheckCircle } from 'lucide-react';
import { getAppointments, createAppointment, cancelAppointment } from '../../api/donneur';
import axiosClient from '../../api/axios-client';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import styles from './Appointments.module.css';

const Appointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [hospitals, setHospitals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const location = useLocation();
    const campaignHospitalId = location.state?.hospitalId || null;

    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await getAppointments();
            if (response.data.success) {
                setAppointments(response.data.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };


    const handleCancel = async (id) => {
        if (!window.confirm('Voulez-vous vraiment annuler ce rendez-vous ?')) return;
        try {
            await cancelAppointment(id);
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className={styles.loading}>Chargement...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1>Mes Rendez-vous</h1>
                    <p>Consultez vos rendez-vous programmés pour vos dons.</p>
                </div>
            </div>

            {message && <div className={styles.successMessage}><CheckCircle size={18} /> {message}</div>}
            {error && <div className={styles.errorMessage}><AlertCircle size={18} /> {error}</div>}


            <div className={styles.list}>
                {appointments.length > 0 ? (
                    appointments.map(rdv => (
                        <div key={rdv.id} className={styles.item}>
                            <div className={styles.itemDate}>
                                <span>{new Date(rdv.date_rdv).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</span>
                                <strong>{rdv.heure_rdv.substring(0, 5)}</strong>
                            </div>
                            <div className={styles.itemInfo}>
                                <h3>{rdv.hopital?.hopital_profile?.nom_etablissement}</h3>
                                <p><MapPin size={14} /> {rdv.hopital?.ville}</p>
                                <span className={styles.itemType}>{rdv.type_don}</span>
                            </div>
                            <div className={styles.itemStatus}>
                                <span className={`${styles.badge} ${styles[rdv.statut.toLowerCase().replace(' ', '')]}`}>
                                    {rdv.statut}
                                </span>
                            </div>
                            <div className={styles.itemActions}>
                                {(rdv.statut === 'En attente' || rdv.statut === 'Confirmé') && (
                                    <button onClick={() => handleCancel(rdv.id)} className={styles.cancelBtn} title="Annuler">
                                        <Trash2 size={18} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className={styles.empty}>
                        <Calendar size={48} />
                        <p>Aucun rendez-vous trouvé.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Appointments;
