import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { User, Phone, MapPin, Droplet, FileText, Lock, Save, AlertCircle, CheckCircle } from 'lucide-react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { getReceveurProfile, updateReceveurProfile } from '../../api/receveur';
import styles from './Profile.module.css';

const Profile = () => {
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const { register, handleSubmit, reset, formState: { errors }, watch } = useForm();
    const newPassword = watch('new_password');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await getReceveurProfile();
            if (response.data.success) {
                const { user, profile } = response.data.data;
                reset({
                    nom: profile.nom,
                    prenom: profile.prenom,
                    email: user.email,
                    telephone: profile.telephone,
                    ville: user.ville,
                    groupe_sanguin_recherche: profile.groupe_sanguin_recherche,
                    description_maladie: profile.description_maladie || '',
                });
            }
        } catch (err) {
            console.error('Error fetching profile:', err);
            setError('Impossible de charger votre profil.');
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data) => {
        setSubmitting(true);
        setMessage(null);
        setError(null);
        try {
            const response = await updateReceveurProfile(data);
            if (response.data.success) {
                setMessage('Profil mis à jour avec succès !');
                // Update local storage if email changed
                const user = JSON.parse(localStorage.getItem('USER'));
                user.email = data.email;
                user.name = `${data.prenom} ${data.nom}`;
                localStorage.setItem('USER', JSON.stringify(user));

                // Clear password fields
                reset({ ...data, current_password: '', new_password: '', new_password_confirmation: '' });
            }
        } catch (err) {
            console.error('Error updating profile:', err);
            if (err.response?.status === 422) {
                const validationErrors = err.response.data.errors;
                setError(Object.values(validationErrors).flat()[0]);
            } else {
                setError('Une erreur est survenue lors de la mise à jour.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className={styles.loading}>Chargement du profil...</div>;

    return (
        <div className={styles.profileContainer}>
            <div className={styles.header}>
                <h1>Mon Profil</h1>
                <p>Gérez vos informations personnelles et vos paramètres de compte.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                {message && (
                    <div className={styles.successBox}>
                        <CheckCircle size={20} />
                        <span>{message}</span>
                    </div>
                )}
                {error && (
                    <div className={styles.errorBox}>
                        <AlertCircle size={20} />
                        <span>{error}</span>
                    </div>
                )}

                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>
                        <User size={20} />
                        Informations Personnelles
                    </h3>
                    <div className={styles.grid}>
                        <Input
                            label="Nom"
                            {...register('nom', { required: 'Le nom est requis' })}
                            error={errors.nom}
                        />
                        <Input
                            label="Prénom"
                            {...register('prenom', { required: 'Le prénom est requis' })}
                            error={errors.prenom}
                        />
                        <Input
                            label="Email"
                            type="email"
                            {...register('email', { required: 'L\'email est requis' })}
                            error={errors.email}
                        />
                        <Input
                            label="Téléphone"
                            {...register('telephone', { required: 'Le téléphone est requis' })}
                            error={errors.telephone}
                            icon={Phone}
                        />
                    </div>
                </div>

                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>
                        <MapPin size={20} />
                        Localisation & Santé
                    </h3>
                    <div className={styles.grid}>
                        <Input
                            label="Ville"
                            {...register('ville', { required: 'La ville est requise' })}
                            error={errors.ville}
                            icon={MapPin}
                        />
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Groupe Sanguin Recherché</label>
                            <div className={styles.selectWrapper}>
                                <Droplet className={styles.selectIcon} size={18} />
                                <select
                                    className={styles.select}
                                    {...register('groupe_sanguin_recherche', { required: true })}
                                >
                                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'INCONNU'].map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Description de la maladie (le cas échéant)</label>
                        <div className={styles.textareaWrapper}>
                            <FileText className={styles.textareaIcon} size={18} />
                            <textarea
                                className={styles.textarea}
                                {...register('description_maladie')}
                                placeholder="Donnez plus de détails sur votre situation médicale..."
                            />
                        </div>
                    </div>
                </div>

                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>
                        <Lock size={20} />
                        Changer le mot de passe
                    </h3>
                    <div className={styles.grid}>
                        <Input
                            label="Mot de passe actuel"
                            type="password"
                            {...register('current_password')}
                            placeholder="Laisser vide pour ne pas changer"
                        />
                        <Input
                            label="Nouveau mot de passe"
                            type="password"
                            {...register('new_password', {
                                minLength: { value: 8, message: 'Minimum 8 caractères' }
                            })}
                            error={errors.new_password}
                        />
                        <Input
                            label="Confirmer le nouveau mot de passe"
                            type="password"
                            {...register('new_password_confirmation', {
                                validate: value => value === newPassword || 'Les mots de passe ne correspondent pas'
                            })}
                            error={errors.new_password_confirmation}
                        />
                    </div>
                </div>

                <div className={styles.actions}>
                    <Button type="submit" isLoading={submitting} size="lg">
                        <Save size={20} style={{ marginRight: '8px' }} />
                        Sauvegarder les modifications
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default Profile;
