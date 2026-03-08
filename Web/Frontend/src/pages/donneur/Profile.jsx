import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { User, Phone, MapPin, Droplet, FileText, Lock, Save, AlertCircle, CheckCircle, Calendar, Weight, UserCircle } from 'lucide-react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { getDonneurProfile, updateDonneurProfile } from '../../api/donneur';
import styles from './Profile.module.css';

const Profile = () => {
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const { register, handleSubmit, reset, formState: { errors }, watch } = useForm();
    const newPassword = watch('new_password');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await getDonneurProfile();
                if (response.data.success) {
                    const { user, profile } = response.data.data;
                    reset({
                        nom: profile.nom,
                        prenom: profile.prenom,
                        email: user.email,
                        telephone: profile.telephone,
                        ville: user.ville,
                        groupe_sanguin: profile.groupe_sanguin,
                        poids: profile.poids,
                        sexe: profile.sexe,
                        date_naissance: profile.date_naissance.substring(0, 10),
                    });
                }
            } catch (err) {
                console.error('Error fetching profile:', err);
                setError('Impossible de charger votre profil.');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [reset]);

    const onSubmit = async (data) => {
        setSubmitting(true);
        setMessage(null);
        setError(null);
        try {
            const response = await updateDonneurProfile(data);
            if (response.data.success) {
                setMessage('Profil mis à jour avec succès !');
                const user = JSON.parse(localStorage.getItem('USER'));
                user.email = data.email;
                user.name = `${data.prenom} ${data.nom}`;
                localStorage.setItem('USER', JSON.stringify(user));
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
                <h1>Mon Profil Donneur</h1>
                <p>Vos informations médicales aident à assurer la sécurité du processus de don.</p>
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
                        <Input label="Nom" {...register('nom', { required: true })} error={errors.nom} />
                        <Input label="Prénom" {...register('prenom', { required: true })} error={errors.prenom} />
                        <Input label="Email" type="email" {...register('email', { required: true })} error={errors.email} />
                        <Input label="Téléphone" {...register('telephone', { required: true })} error={errors.telephone} icon={Phone} />
                    </div>
                </div>

                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>
                        <Droplet size={20} />
                        Détails Médicaux & Localisation
                    </h3>
                    <div className={styles.grid}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Groupe Sanguin</label>
                            <div className={styles.selectWrapper}>
                                <Droplet className={styles.selectIcon} size={18} />
                                <select className={styles.select} {...register('groupe_sanguin', { required: true })}>
                                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <Input label="Poids (kg)" type="number" {...register('poids', { required: true })} error={errors.poids} icon={Weight} />
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Sexe</label>
                            <div className={styles.selectWrapper}>
                                <UserCircle className={styles.selectIcon} size={18} />
                                <select className={styles.select} {...register('sexe', { required: true })}>
                                    <option value="Homme">Homme</option>
                                    <option value="Femme">Femme</option>
                                </select>
                            </div>
                        </div>
                        <Input label="Date de Naissance" type="date" {...register('date_naissance', { required: true })} error={errors.date_naissance} icon={Calendar} />
                        <Input label="Ville" {...register('ville', { required: true })} error={errors.ville} icon={MapPin} />
                    </div>
                </div>

                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>
                        <Lock size={20} />
                        Sécurité du Compte
                    </h3>
                    <div className={styles.grid}>
                        <Input label="Mot de passe actuel" type="password" {...register('current_password')} />
                        <Input label="Nouveau mot de passe" type="password" {...register('new_password')} error={errors.new_password} />
                        <Input label="Confirmer" type="password" {...register('new_password_confirmation', { validate: v => v === newPassword || 'Les mots de passe ne correspondent pas' })} error={errors.new_password_confirmation} />
                    </div>
                </div>

                <div className={styles.actions}>
                    <Button type="submit" isLoading={submitting} size="lg">
                        <Save size={20} style={{ marginRight: '8px' }} />
                        Appliquer les changements
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default Profile;
