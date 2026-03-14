import React, { useState, useEffect } from 'react';
import { createBloodDemand } from '../../api/receveur';
import { getHospitals } from '../../api/hospital';
import styles from './Receveur.module.css';
import { useNavigate } from 'react-router-dom';

const CreateDemand = () => {
    const navigate = useNavigate();
    const [hospitals, setHospitals] = useState([]);
    const [formData, setFormData] = useState({
        blood_type: '',
        hopital_id: '',
        hospital_name: '',
        city: '',
        description: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchHospitals = async () => {
            try {
                const response = await getHospitals();
                if (response.data.success) {
                    setHospitals(response.data.data);
                }
            } catch (err) {
                console.error("Error fetching hospitals:", err);
            }
        };
        fetchHospitals();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'hopital_id') {
            const selectedHospital = hospitals.find(h => h.id === parseInt(value));
            setFormData(prev => ({ 
                ...prev, 
                hopital_id: value,
                hospital_name: selectedHospital ? selectedHospital.hopital_profile.nom_etablissement : '',
                city: selectedHospital ? selectedHospital.ville : ''
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setErrors({});

        try {
            await createBloodDemand(formData);
            navigate('/receveur/demands');
        } catch (error) {
            if (error.response && error.response.data && error.response.data.errors) {
                setErrors(error.response.data.errors);
            } else {
                alert("An error occurred. Please try again.");
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.formCard}>
                <header className={styles.formHeader}>
                    <h1>Demander du Sang</h1>
                    <p>Remplissez les informations pour votre demande urgente.</p>
                </header>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="blood_type">Groupe Sanguin</label>
                        <select
                            id="blood_type"
                            name="blood_type"
                            value={formData.blood_type}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Sélectionnez le groupe</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                        </select>
                        {errors.blood_type && <span className={styles.error}>{errors.blood_type[0]}</span>}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="hopital_id">Hôpital / Centre de santé</label>
                        <select
                            id="hopital_id"
                            name="hopital_id"
                            value={formData.hopital_id}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Sélectionnez un établissement</option>
                            {hospitals.map(hospital => (
                                <option key={hospital.id} value={hospital.id}>
                                    {hospital.hopital_profile?.nom_etablissement} ({hospital.city || hospital.ville})
                                </option>
                            ))}
                        </select>
                        {errors.hopital_id && <span className={styles.error}>{errors.hopital_id[0]}</span>}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="city">Ville</label>
                        <input
                            type="text"
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            placeholder="Sélectionnez l'hôpital d'abord"
                            required
                            readOnly
                        />
                        {errors.city && <span className={styles.error}>{errors.city[0]}</span>}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="description">Description (Optionnel)</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Précisez l'urgence ou les détails..."
                            rows="4"
                        ></textarea>
                        {errors.description && <span className={styles.error}>{errors.description[0]}</span>}
                    </div>

                    <div className={styles.formActions}>
                        <button
                            type="button"
                            onClick={() => navigate('/receveur/demands')}
                            className={styles.secondaryButton}
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className={styles.primaryButton}
                        >
                            {submitting ? 'Envoi...' : 'Créer la demande'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateDemand;
