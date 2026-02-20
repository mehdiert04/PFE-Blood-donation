import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, HeartPulse, ArrowLeft, CheckCircle2, RefreshCw, Send } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Input from '../common/Input';
import Button from '../common/Button';
import styles from './ForgotPassword.module.css';

const emailSchema = z.object({
    email: z.string().email('Veuillez entrer un email valide'),
});

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [sent, setSent] = useState(false);
    const [submittedEmail, setSubmittedEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [resendCountdown, setResendCountdown] = useState(0);

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(emailSchema),
    });

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        // Simulate API call — replace with real endpoint
        await new Promise(resolve => setTimeout(resolve, 1800));
        setSubmittedEmail(data.email);
        setSent(true);
        setIsSubmitting(false);
        startCountdown();
    };

    const startCountdown = () => {
        let secs = 60;
        setResendCountdown(secs);
        const timer = setInterval(() => {
            secs -= 1;
            setResendCountdown(secs);
            if (secs <= 0) clearInterval(timer);
        }, 1000);
    };

    const handleResend = async () => {
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        startCountdown();
    };

    return (
        <div className={styles.page}>
            <div className={styles.card}>
                {/* Logo */}
                <div className={styles.logo}>
                    <HeartPulse size={26} />
                    <span>BloodLink</span>
                </div>

                {!sent ? (
                    /* ── Step 1: Enter email ── */
                    <>
                        <div className={styles.iconCircle}>
                            <Mail size={40} />
                        </div>
                        <h1 className={styles.title}>Mot de passe oublié ?</h1>
                        <p className={styles.description}>
                            Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
                        </p>

                        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                            <Input
                                type="email"
                                label="Adresse email"
                                placeholder="exemple@email.com"
                                icon={Mail}
                                {...register('email')}
                                error={errors.email}
                            />
                            <Button type="submit" fullWidth size="lg" isLoading={isSubmitting}>
                                {!isSubmitting && <Send size={18} style={{ marginRight: 8 }} />}
                                Envoyer le lien
                            </Button>
                        </form>

                        <button className={styles.backBtn} onClick={() => navigate('/auth/login')}>
                            <ArrowLeft size={15} />
                            Retour à la connexion
                        </button>
                    </>
                ) : (
                    /* ── Step 2: Email sent confirmation ── */
                    <>
                        <div className={`${styles.iconCircle} ${styles.iconSuccess}`}>
                            <CheckCircle2 size={40} />
                        </div>
                        <h1 className={styles.title}>Email envoyé !</h1>
                        <p className={styles.description}>
                            Nous avons envoyé un lien de réinitialisation à{' '}
                            <span className={styles.emailHighlight}>{submittedEmail}</span>.
                            Vérifiez votre boîte de réception.
                        </p>

                        {/* Steps hint */}
                        <div className={styles.stepsBox}>
                            <div className={styles.stepRow}><span className={styles.stepNum}>1</span> Ouvrez votre boîte de réception</div>
                            <div className={styles.stepRow}><span className={styles.stepNum}>2</span> Cliquez sur «&nbsp;Réinitialiser le mot de passe&nbsp;»</div>
                            <div className={styles.stepRow}><span className={styles.stepNum}>3</span> Choisissez un nouveau mot de passe</div>
                        </div>

                        {/* Resend */}
                        <div className={styles.resendRow}>
                            {resendCountdown > 0 ? (
                                <p className={styles.resendText}>
                                    Renvoyer dans <span className={styles.countdown}>{resendCountdown}s</span>
                                </p>
                            ) : (
                                <button
                                    className={styles.resendBtn}
                                    onClick={handleResend}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting
                                        ? <><RefreshCw size={14} className={styles.spin} /> Envoi...</>
                                        : 'Renvoyer l\'email'}
                                </button>
                            )}
                        </div>

                        <button className={styles.backBtn} onClick={() => navigate('/auth/login')}>
                            <ArrowLeft size={15} />
                            Retour à la connexion
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
