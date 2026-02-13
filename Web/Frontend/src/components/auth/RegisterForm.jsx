import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useOutletContext } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Building2, HeartPulse, Upload, Calendar, Mail, Phone, MapPin, CheckCircle, AlertCircle } from 'lucide-react';
import { donneurSchema, hopitalSchema, receveurSchema } from '../../lib/schemas';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import styles from './AuthForms.module.css';

const ROLES = [
    { id: 'donneur', label: 'Donneur', icon: User },
    { id: 'hopital', label: 'Hôpital', icon: Building2 },
    { id: 'receveur', label: 'Receveur', icon: HeartPulse },
];

const RegisterForm = () => {
    const { onSwitchToLogin } = useOutletContext();
    const [selectedRole, setSelectedRole] = useState('donneur');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const getSchema = () => {
        switch (selectedRole) {
            case 'hopital': return hopitalSchema;
            case 'receveur': return receveurSchema;
            default: return donneurSchema;
        }
    };

    const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({
        resolver: zodResolver(getSchema()),
        mode: 'onBlur',
    });

    const typeEtablissement = watch('type_etablissement');

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        setSubmitError(null);
        try {
            console.log('Registering as:', selectedRole, data);
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            setSubmitSuccess(true);
            reset(); // Clear form
        } catch (err) {
            setSubmitError("Une erreur est survenue lors de l'inscription. Veuillez réessayer.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRoleChange = (roleId) => {
        setSelectedRole(roleId);
        reset(); // Reset form when switching roles
        setSubmitError(null);
        setSubmitSuccess(false);
    };

    if (submitSuccess) {
        return (
            <div className={styles.successMessage}>
                <CheckCircle size={48} className={styles.successIcon} />
                <h3>Inscription réussie !</h3>
                <p>Votre compte a été créé avec succès.</p>
                <Button onClick={onSwitchToLogin} fullWidth>Se connecter</Button>
            </div>
        );
    }

    return (
        <div className={styles.formContainer}>
            {/* Role Selection Tabs */}
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
                {/* DONNEUR FIELDS */}
                {selectedRole === 'donneur' && (
                    <>
                        <div className={styles.grid2}>
                            <Input label="Nom" {...register('nom')} error={errors.nom} />
                            <Input label="Prénom" {...register('prenom')} error={errors.prenom} />
                        </div>
                        <Input type="date" label="Date de naissance" {...register('date_naissance')} error={errors.date_naissance} icon={Calendar} />
                        <div className={styles.grid2}>
                            <Select label="Sexe" options={[{ value: 'M', label: 'Masculin' }, { value: 'F', label: 'Féminin' }]} {...register('sexe')} error={errors.sexe} />
                            <Select label="Groupe Sanguin (Optionnel)" options={[{ value: 'A+', label: 'A+' }, { value: 'O+', label: 'O+' }, { value: 'B+', label: 'B+' }, { value: 'AB+', label: 'AB+' }, { value: 'A-', label: 'A-' }, { value: 'O-', label: 'O-' }, { value: 'B-', label: 'B-' }, { value: 'AB-', label: 'AB-' }]} {...register('groupe_sanguin')} error={errors.groupe_sanguin} />
                        </div>
                        <Input label="Téléphone" {...register('telephone')} error={errors.telephone} icon={Phone} />
                        <Input type="email" label="Email" {...register('email')} error={errors.email} icon={Mail} />
                        <Input label="Ville" {...register('ville')} error={errors.ville} icon={MapPin} />
                        <Input type="password" label="Mot de passe" {...register('password')} error={errors.password} />
                        <Input type="password" label="Confirmer le mot de passe" {...register('confirmPassword')} error={errors.confirmPassword} />
                    </>
                )}

                {/* HOPITAL FIELDS */}
                {selectedRole === 'hopital' && (
                    <>
                        <Input label="Nom officiel de l’hôpital" {...register('nom_officiel')} error={errors.nom_officiel} icon={Building2} />
                        <Input label="Code établissement (Ministère)" {...register('code_etablissement')} error={errors.code_etablissement} />
                        <Select label="Type d'établissement" options={[{ value: 'public', label: 'Public' }, { value: 'prive', label: 'Privé' }]} {...register('type_etablissement')} error={errors.type_etablissement} />

                        {typeEtablissement === 'prive' && (
                            <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
                                <Input label="ICE (Requis)" {...register('ice')} error={errors.ice} />
                            </div>
                        )}

                        <Input label="Ville" {...register('ville')} error={errors.ville} icon={MapPin} />
                        <Input label="Adresse complète" {...register('adresse')} error={errors.adresse} icon={MapPin} />
                        <div className={styles.grid2}>
                            <Input type="email" label="Email professionnel" {...register('email')} error={errors.email} icon={Mail} />
                            <Input label="Téléphone officiel" {...register('telephone')} error={errors.telephone} icon={Phone} />
                        </div>
                        <div className={styles.grid2}>
                            <Input label="Nom du responsable" {...register('responsable_nom')} error={errors.responsable_nom} icon={User} />
                            <Input label="Fonction (Directeur/Médecin Chef)" {...register('responsable_fonction')} error={errors.responsable_fonction} />
                        </div>
                        <div className={styles.fileInputWrapper}>
                            <label>Document justificatif (Autorisation/Attestation)</label>
                            <input type="file" {...register('document_justificatif')} className={styles.fileInput} />
                            {errors.document_justificatif && <span className={styles.errorText}>{errors.document_justificatif.message}</span>}
                        </div>
                        <Input type="password" label="Mot de passe" {...register('password')} error={errors.password} />
                        <Input type="password" label="Confirmer le mot de passe" {...register('confirmPassword')} error={errors.confirmPassword} />
                    </>
                )}

                {/* RECEVEUR FIELDS */}
                {selectedRole === 'receveur' && (
                    <>
                        <Input label="Nom du patient" {...register('nom_patient')} error={errors.nom_patient} icon={User} />
                        <div className={styles.grid2}>
                            <Input type="number" label="Âge" {...register('age', { valueAsNumber: true })} error={errors.age} />
                            <Select label="Groupe Sanguin Requis" options={[{ value: 'A+', label: 'A+' }, { value: 'O+', label: 'O+' }, { value: 'B+', label: 'B+' }, { value: 'AB+', label: 'AB+' }, { value: 'A-', label: 'A-' }, { value: 'O-', label: 'O-' }, { value: 'B-', label: 'B-' }, { value: 'AB-', label: 'AB-' }]} {...register('groupe_sanguin_requis')} error={errors.groupe_sanguin_requis} />
                        </div>
                        <div className={styles.grid2}>
                            <Input type="number" label="Quantité (Poches)" {...register('quantite', { valueAsNumber: true })} error={errors.quantite} />
                            <Select label="Niveau d'urgence" options={[{ value: 'normal', label: 'Normal' }, { value: 'eleve', label: 'Élevé' }, { value: 'critique', label: 'Critique' }]} {...register('urgence')} error={errors.urgence} />
                        </div>
                        <Input label="Hôpital / Clinique (Lieu d'hospitalisation)" {...register('hopital_clinique')} error={errors.hopital_clinique} icon={Building2} />
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

                        <div className={styles.fileInputWrapper}>
                            <label>Justificatif (Ordonnance/Attestation médicale)</label>
                            <input type="file" {...register('justificatif')} className={styles.fileInput} />
                            <p className={styles.hint}>Photo ou PDF obligatoire</p>
                            {errors.justificatif && <span className={styles.errorText}>{errors.justificatif.message}</span>}
                        </div>
                    </>
                )}

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
        </div>
    );
};

export default RegisterForm;
