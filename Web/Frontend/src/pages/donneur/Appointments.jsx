import React, { useState, useEffect } from 'react';
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
    const [submitting, setSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    useEffect(() => {
        fetchData();
        fetchHospitals();
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

    const fetchHospitals = async () => {
        try {
            const response = await axiosClient.get('/hospitals');
            if (response.data.success) {
                setHospitals(response.data.data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const onSubmit = async (data) => {
        setSubmitting(true);
        setError(null);
        try {
            const response = await createAppointment(data);
            if (response.data.success) {
                setMessage('Rendez-vous réservé avec succès !');
                setShowForm(false);
                reset();
                fetchData();
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de la réservation.');
        } finally {
            setSubmitting(false);
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
                    <p>Prenez un nouveau rendez-vous ou gérez vos réservations actuelles.</p>
                </div>
                {!showForm && (
                    <Button onClick={() => setShowForm(true)} className={styles.addBtn}>
                        <Plus size={20} /> Nouveau RDV
                    </Button>
                )}
            </div>

            {message && <div className={styles.successMessage}><CheckCircle size={18} /> {message}</div>}
            {error && <div className={styles.errorMessage}><AlertCircle size={18} /> {error}</div>}

            {showForm && (
                <div className={styles.formCard}>
                    <div className={styles.formHeader}>
                        <h2>Prendre un rendez-vous</h2>
                        <button onClick={() => setShowForm(false)} className={styles.closeBtn}>×</button>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                        <div className={styles.grid}>
                            <div className={styles.field}>
                                <label><MapPin size={16} /> Hôpital / Centre</label>
                                <select {...register('hopital_id', { required: true })} className={styles.select}>
                                    <option value="">Sélectionnez un hôpital</option>
                                    {hospitals.map(h => (
                                        <option key={h.id} value={h.id}>
                                            {h.hopital_profile?.nom_etablissement} ({h.ville})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className={styles.field}>
                                <label><Droplet size={16} /> Type de Don</label>
                                <select {...register('type_don', { required: true })} className={styles.select}>
                                    <option value="Sang Total">Sang Total</option>
                                    <option value="Plasma">Plasma</option>
                                    <option value="Plaquettes">Plaquettes</option>
                                </select>
                            </div>
                            <Input
                                label="Date"
                                type="date"
                                icon={Calendar}
                                {...register('date_rdv', { required: true })}
                                min={new Date().toISOString().split('T')[0]}
                            />
                            <Input
                                label="Heure"
                                type="time"
                                icon={Clock}
                                {...register('heure_rdv', { required: true })}
                            />
                        </div>
                        <div className={styles.formActions}>
                            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Annuler</Button>
                            <Button type="submit" isLoading={submitting}>Confirmer la réservation</Button>
                        </div>
                    </form>
                </div>
            )}

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
