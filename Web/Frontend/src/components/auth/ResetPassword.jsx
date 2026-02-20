import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock, HeartPulse, CheckCircle2, XCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';
import Input from '../common/Input';
import Button from '../common/Button';
import styles from './ResetPassword.module.css';

const resetSchema = z.object({
    password: z.string()
        .min(8, 'Au moins 8 caractères')
        .regex(/[A-Z]/, 'Au moins une majuscule')
        .regex(/[0-9]/, 'Au moins un chiffre'),
    confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
});

const ResetPassword = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const [status, setStatus] = useState('idle'); // idle | submitting | success | error
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        resolver: zodResolver(resetSchema),
        mode: 'onChange',
    });

    const passwordValue = watch('password', '');

    // Token-less or bad token → show error right away
    if (!token) {
        return (
            <div className={styles.page}>
                <div className={styles.card}>
                    <div className={styles.logo}><HeartPulse size={26} /><span>BloodLink</span></div>
                    <div className={`${styles.iconCircle} ${styles.errorIcon}`}><XCircle size={48} /></div>
                    <h1 className={styles.title}>Lien invalide</h1>
                    <p className={styles.description}>Ce lien de réinitialisation est invalide ou a expiré. Veuillez recommencer.</p>
                    <Button fullWidth onClick={() => navigate('/auth/forgot-password')}>Recommencer</Button>
                    <button className={styles.backBtn} onClick={() => navigate('/auth/login')}>Retour à la connexion</button>
                </div>
            </div>
        );
    }

    // ── Strength indicators ──
    const strengthRules = [
        { label: '8 caractères minimum', met: passwordValue.length >= 8 },
        { label: 'Une lettre majuscule', met: /[A-Z]/.test(passwordValue) },
        { label: 'Un chiffre', met: /[0-9]/.test(passwordValue) },
    ];
    const strength = strengthRules.filter(r => r.met).length;

    const onSubmit = async (data) => {
        setStatus('submitting');
        try {
            // Simulate API — replace with real endpoint: POST /api/auth/reset-password { token, password }
            await new Promise(resolve => setTimeout(resolve, 2000));
            setStatus('success');
        } catch {
            setStatus('error');
        }
    };

    if (status === 'success') {
        return (
            <div className={styles.page}>
                <div className={styles.card}>
                    <div className={styles.logo}><HeartPulse size={26} /><span>BloodLink</span></div>
                    <div className={`${styles.iconCircle} ${styles.successIcon}`}><CheckCircle2 size={48} /></div>
                    <h1 className={`${styles.title} ${styles.successTitle}`}>Mot de passe mis à jour !</h1>
                    <p className={styles.description}>
                        Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
                    </p>
                    <Button fullWidth size="lg" onClick={() => navigate('/auth/login')}>
                        Se connecter maintenant
                        <ArrowRight size={18} style={{ marginLeft: 8 }} />
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <div className={styles.card}>
                {/* Logo */}
                <div className={styles.logo}><HeartPulse size={26} /><span>BloodLink</span></div>

                <div className={styles.iconCircle}><Lock size={38} /></div>
                <h1 className={styles.title}>Nouveau mot de passe</h1>
                <p className={styles.description}>Choisissez un mot de passe sécurisé pour votre compte BloodLink.</p>

                <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                    {/* Password field with show/hide toggle */}
                    <div className={styles.inputWrapper}>
                        <Input
                            type={showPassword ? 'text' : 'password'}
                            label="Nouveau mot de passe"
                            icon={Lock}
                            {...register('password')}
                            error={errors.password}
                        />
                        <button
                            type="button"
                            className={styles.eyeBtn}
                            onClick={() => setShowPassword(p => !p)}
                            tabIndex={-1}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    {/* Strength meter */}
                    {passwordValue.length > 0 && (
                        <div className={styles.strength}>
                            <div className={styles.strengthBar}>
                                {[0, 1, 2].map(i => (
                                    <span
                                        key={i}
                                        className={`${styles.strengthSegment} ${i < strength ? styles[`seg${strength}`] : ''}`}
                                    />
                                ))}
                            </div>
                            <p className={styles.strengthLabel}>
                                {strength === 0 && 'Très faible'}
                                {strength === 1 && 'Faible'}
                                {strength === 2 && 'Moyen'}
                                {strength === 3 && 'Fort ✓'}
                            </p>
                            <ul className={styles.rulesList}>
                                {strengthRules.map(rule => (
                                    <li key={rule.label} className={`${styles.rule} ${rule.met ? styles.ruleMet : ''}`}>
                                        <span className={styles.ruleDot} />
                                        {rule.label}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Confirm password */}
                    <div className={styles.inputWrapper}>
                        <Input
                            type={showConfirm ? 'text' : 'password'}
                            label="Confirmer le mot de passe"
                            icon={Lock}
                            {...register('confirmPassword')}
                            error={errors.confirmPassword}
                        />
                        <button
                            type="button"
                            className={styles.eyeBtn}
                            onClick={() => setShowConfirm(p => !p)}
                            tabIndex={-1}
                        >
                            {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    {status === 'error' && (
                        <div className={styles.errorMsg}>
                            <XCircle size={18} />
                            <span>Une erreur est survenue. Veuillez réessayer.</span>
                        </div>
                    )}

                    <Button type="submit" fullWidth size="lg" isLoading={status === 'submitting'}>
                        Réinitialiser le mot de passe
                    </Button>
                </form>

                <button className={styles.backBtn} onClick={() => navigate('/auth/login')}>
                    Retour à la connexion
                </button>
            </div>
        </div>
    );
};

export default ResetPassword;
