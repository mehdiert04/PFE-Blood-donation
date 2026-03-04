import React, { useState } from 'react';
import { createBloodDemand } from '../../api/receveur';
import styles from './Receveur.module.css';
import { useNavigate } from 'react-router-dom';

const CreateDemand = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        blood_type: '',
        quantity: 1,
        hospital_name: '',
        city: '',
        description: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
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
                    <h1>Create Blood Demand</h1>
                    <p>Provide details about the blood needed.</p>
                </header>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label htmlFor="blood_type">Blood Type</label>
                            <select
                                id="blood_type"
                                name="blood_type"
                                value={formData.blood_type}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Type</option>
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
                            <label htmlFor="quantity">Quantity (Units)</label>
                            <input
                                type="number"
                                id="quantity"
                                name="quantity"
                                min="1"
                                value={formData.quantity}
                                onChange={handleChange}
                                required
                            />
                            {errors.quantity && <span className={styles.error}>{errors.quantity[0]}</span>}
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="hospital_name">Hospital Name</label>
                        <input
                            type="text"
                            id="hospital_name"
                            name="hospital_name"
                            value={formData.hospital_name}
                            onChange={handleChange}
                            placeholder="e.g. Ibn Sina Hospital"
                            required
                        />
                        {errors.hospital_name && <span className={styles.error}>{errors.hospital_name[0]}</span>}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="city">City</label>
                        <input
                            type="text"
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            placeholder="e.g. Casablanca"
                            required
                        />
                        {errors.city && <span className={styles.error}>{errors.city[0]}</span>}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="description">Description / Reason (Optional)</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Briefly describe the urgency or reason..."
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
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className={styles.primaryButton}
                        >
                            {submitting ? 'Submitting...' : 'Create Demand'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateDemand;
