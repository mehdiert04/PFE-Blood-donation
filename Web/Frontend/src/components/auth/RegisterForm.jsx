import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, HeartPulse, Building2, Calendar, Mail, Phone, MapPin, AlertCircle } from 'lucide-react';
import { donneurSchema, receveurSchema } from '../../lib/schemas';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import styles from './AuthForms.module.css';

const ROLES = [
    { id: 'donneur', label: 'Donneur', icon: User },
    { id: 'receveur', label: 'Receveur', icon: HeartPulse },
];

const BLOOD_GROUPS = [
    { value: 'A+', label: 'A+' }, { value: 'A-', label: 'A-' },
    { value: 'B+', label: 'B+' }, { value: 'B-', label: 'B-' },
    { value: 'AB+', label: 'AB+' }, { value: 'AB-', label: 'AB-' },
    { value: 'O+', label: 'O+' }, { value: 'O-', label: 'O-' },
];

/* ─── Per-role form rendered separately so useForm re-mounts on role change ─── */

const DonneurForm = ({ onSubmit, onSwitchToLogin, submitError }) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: zodResolver(donneurSchema),
        mode: 'onBlur',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFormSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            await onSubmit(data);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className={styles.form}>
            <div className={styles.grid2}>
                <Input label="Nom" {...register('nom')} error={errors.nom} />
                <Input label="Prénom" {...register('prenom')} error={errors.prenom} />
            </div>
            <Input type="date" label="Date de naissance" {...register('date_naissance')} error={errors.date_naissance} icon={Calendar} />
            <div className={styles.grid2}>
                <Select label="Sexe" options={[{ value: 'M', label: 'Masculin' }, { value: 'F', label: 'Féminin' }]} {...register('sexe')} error={errors.sexe} />
                <Select label="Groupe Sanguin (Optionnel)" options={BLOOD_GROUPS} {...register('groupe_sanguin')} error={errors.groupe_sanguin} />
            </div>
            <Input label="Téléphone" {...register('telephone')} error={errors.telephone} icon={Phone} />
            <Input type="email" label="Email" {...register('email')} error={errors.email} icon={Mail} />
            <Input label="Ville" {...register('ville')} error={errors.ville} icon={MapPin} />
            <Input type="password" label="Mot de passe" {...register('password')} error={errors.password} />
            <Input type="password" label="Confirmer le mot de passe" {...register('confirmPassword')} error={errors.confirmPassword} />

            {submitError && (
                <div className={styles.errorMessage}>
                    <AlertCircle size={20} />
                    <span>{submitError}</span>
                </div>
            )}

            <Button type="submit" fullWidth isLoading={isSubmitting} size="lg">
                S'inscrire
            </Button>
            <div className={styles.links}>
                <p>
                    Déjà inscrit?{' '}
                    <button type="button" onClick={onSwitchToLogin} className={styles.linkButton}>
                        Se connecter
                    </button>
                </p>
            </div>
        </form>
    );
};

const ReceveurForm = ({ onSubmit, onSwitchToLogin, submitError }) => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(receveurSchema),
        mode: 'onBlur',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFormSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            await onSubmit(data);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className={styles.form}>
            <Input label="Nom du patient" {...register('nom_patient')} error={errors.nom_patient} icon={User} />
            <div className={styles.grid2}>
                <Input type="number" label="Âge" {...register('age', { valueAsNumber: true })} error={errors.age} />
                <Select label="Groupe Sanguin Requis" options={BLOOD_GROUPS} {...register('groupe_sanguin_requis')} error={errors.groupe_sanguin_requis} />
            </div>
            <div className={styles.grid2}>
                <Input type="number" label="Quantité (Poches)" {...register('quantite', { valueAsNumber: true })} error={errors.quantite} />
                <Select label="Niveau d'urgence" options={[{ value: 'normal', label: 'Normal' }, { value: 'eleve', label: 'Élevé' }, { value: 'critique', label: 'Critique' }]} {...register('urgence')} error={errors.urgence} />
            </div>
            <Input label="Hôpital / Clinique" {...register('hopital_clinique')} error={errors.hopital_clinique} icon={Building2} />
            <div className={styles.grid2}>
                <Input label="Ville" {...register('ville')} error={errors.ville} icon={MapPin} />
                <Input label="Service (Urgence, Réa...)" {...register('service')} error={errors.service} />
            </div>

            <h4 className={styles.sectionTitle}>Contact d'urgence</h4>
            <Input label="Nom du contact" {...register('contact_nom')} error={errors.contact_nom} icon={User} />
            <div className={styles.grid2}>
                <Input label="Téléphone" {...register('contact_telephone')} error={errors.contact_telephone} icon={Phone} />
                <Input type="email" label="Email" {...register('contact_email')} error={errors.contact_email} icon={Mail} />
            </div>


            {submitError && (
                <div className={styles.errorMessage}>
                    <AlertCircle size={20} />
                    <span>{submitError}</span>
                </div>
            )}

            <Button type="submit" fullWidth isLoading={isSubmitting} size="lg">
                S'inscrire
            </Button>
            <div className={styles.links}>
                <p>
                    Déjà inscrit?{' '}
                    <button type="button" onClick={onSwitchToLogin} className={styles.linkButton}>
                        Se connecter
                    </button>
                </p>
            </div>
        </form>
    );
};

/* ─── Main RegisterForm shell (handles role tab + passes submit handler down) ─── */

const RegisterForm = () => {
    const { onSwitchToLogin } = useOutletContext();
    const navigate = useNavigate();
    const [selectedRole, setSelectedRole] = useState('donneur');
    const [submitError, setSubmitError] = useState(null);

    const handleSubmit = async (data) => {
        setSubmitError(null);
        // Simulate API call — replace with real API later
        await new Promise(resolve => setTimeout(resolve, 2000));
        navigate('/auth/verify-email', {
            state: { email: data.email || data.contact_email || '' }
        });
    };

    return (
        <div className={styles.formContainer}>
            {/* Role Tabs */}
            <div className={styles.roleSelector}>
                {ROLES.map((role) => {
                    const Icon = role.icon;
                    return (
                        <button
                            key={role.id}
                            type="button"
                            className={`${styles.roleTab} ${selectedRole === role.id ? styles.activeRole : ''}`}
                            onClick={() => { setSelectedRole(role.id); setSubmitError(null); }}
                        >
                            <Icon size={18} />
                            <span>{role.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Render the correct sub-form — keyed by role so it remounts cleanly */}
            {selectedRole === 'donneur' && (
                <DonneurForm
                    key="donneur"
                    onSubmit={handleSubmit}
                    onSwitchToLogin={onSwitchToLogin}
                    submitError={submitError}
                />
            )}
            {selectedRole === 'receveur' && (
                <ReceveurForm
                    key="receveur"
                    onSubmit={handleSubmit}
                    onSwitchToLogin={onSwitchToLogin}
                    submitError={submitError}
                />
            )}
        </div>
    );
};

export default RegisterForm;
