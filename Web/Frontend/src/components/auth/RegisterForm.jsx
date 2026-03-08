import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, HeartPulse, Calendar, Mail, Phone, MapPin, AlertCircle } from 'lucide-react';
import { donneurSchema, receveurRegistrationSchema } from '../../lib/schemas';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import styles from './AuthForms.module.css';
import { registerDonneur, registerReceveur } from '../../api/auth';

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

const RegisterForm = () => {
    const { onSwitchToLogin } = useOutletContext();
    const navigate = useNavigate();
    const [selectedRole, setSelectedRole] = useState('donneur');
    const [submitError, setSubmitError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Schema selection based on role
    const currentSchema = selectedRole === 'donneur' ? donneurSchema : receveurRegistrationSchema;

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: zodResolver(currentSchema),
        mode: 'onBlur',
    });

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        setSubmitError(null);
        try {
            // Prepare data for backend (laravel expects password_confirmation)
            const payload = {
                ...data,
                password_confirmation: data.confirmPassword,
            };

            let response;
            if (selectedRole === 'donneur') {
                // Map frontend 'M'/'F' to backend 'Homme'/'Femme'
                payload.sexe = data.sexe === 'M' ? 'Homme' : 'Femme';
                response = await registerDonneur(payload);
            } else {
                response = await registerReceveur(payload);
            }

            if (response.data.success) {
                navigate('/auth/verify-email', {
                    state: { email: data.email }
                });
            }
        } catch (err) {
            console.error('Registration error:', err);
            const message = err.response?.data?.message || "Une erreur est survenue lors de l'inscription.";
            setSubmitError(message);

            // If there are specific validation errors from backend
            if (err.response?.data?.errors) {
                const firstError = Object.values(err.response.data.errors)[0][0];
                setSubmitError(firstError);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRoleChange = (roleId) => {
        if (selectedRole !== roleId) {
            setSelectedRole(roleId);
            setSubmitError(null);
            reset(); // Clear form when switching roles
        }
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
                            onClick={() => handleRoleChange(role.id)}
                        >
                            <Icon size={18} />
                            <span>{role.label}</span>
                        </button>
                    );
                })}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                <div className={styles.grid2}>
                    <Input label="Nom" {...register('nom')} error={errors.nom} />
                    <Input label="Prénom" {...register('prenom')} error={errors.prenom} />
                </div>

                <Input type="email" label="Email" {...register('email')} error={errors.email} icon={Mail} />

                <div className={styles.grid2}>
                    <Input label="Téléphone" {...register('telephone')} error={errors.telephone} icon={Phone} />
                    {selectedRole === 'donneur' ? (
                        <Select
                            label="Groupe Sanguin"
                            options={BLOOD_GROUPS}
                            {...register('groupe_sanguin')}
                            error={errors.groupe_sanguin}
                        />
                    ) : (
                        <Select
                            label="Groupe Sanguin Requis"
                            options={[...BLOOD_GROUPS, { value: 'INCONNU', label: 'Inconnu' }]}
                            {...register('groupe_sanguin_recherche')}
                            error={errors.groupe_sanguin_recherche}
                        />
                    )}
                </div>

                {selectedRole === 'donneur' && (
                    <div className={styles.grid2}>
                        <Input type="date" label="Date de naissance" {...register('date_naissance')} error={errors.date_naissance} icon={Calendar} />
                        <Select
                            label="Sexe"
                            options={[{ value: 'M', label: 'Masculin' }, { value: 'F', label: 'Féminin' }]}
                            {...register('sexe')}
                            error={errors.sexe}
                        />
                    </div>
                )}

                {selectedRole === 'donneur' && (
                    <div className={styles.grid2}>
                        <Input label="Ville" {...register('ville')} error={errors.ville} icon={MapPin} />
                        <Input type="number" label="Poids (kg)" {...register('poids', { valueAsNumber: true })} error={errors.poids} />
                    </div>
                )}

                {selectedRole === 'receveur' && (
                    <div className={styles.grid2}>
                        <Input label="Ville" {...register('ville')} error={errors.ville} icon={MapPin} />
                        <Input
                            label="Situation Médicale"
                            {...register('description_maladie')}
                            error={errors.description_maladie}
                            placeholder="Brève description du besoin..."
                        />
                    </div>
                )}

                <div className={styles.grid2}>
                    <Input type="password" label="Mot de passe" {...register('password')} error={errors.password} />
                    <Input type="password" label="Confirmer" {...register('confirmPassword')} error={errors.confirmPassword} />
                </div>

                {submitError && (
                    <div className={styles.errorMessage}>
                        <AlertCircle size={20} />
                        <span>{submitError}</span>
                    </div>
                )}

                <Button type="submit" fullWidth isLoading={isSubmitting} size="lg">
                    S'inscrire en tant que {selectedRole}
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
        </div>
    );
};

export default RegisterForm;
