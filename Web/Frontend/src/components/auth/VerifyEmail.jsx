import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, RefreshCw, ArrowLeft, CheckCircle2, HeartPulse } from 'lucide-react';
import Button from '../common/Button';
import styles from './VerifyEmail.module.css';

const VerifyEmail = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Email can be passed via navigation state after register
    const email = location.state?.email || 'votre adresse email';

    const [resendStatus, setResendStatus] = useState(null); // null | 'loading' | 'sent'
    const [countdown, setCountdown] = useState(0);

    const handleResend = async () => {
        setResendStatus('loading');
        // Simulate API call to resend verification email
        await new Promise(resolve => setTimeout(resolve, 1500));
        setResendStatus('sent');

        // Countdown 60s before allowing another resend
        let secs = 60;
        setCountdown(secs);
        const timer = setInterval(() => {
            secs -= 1;
            setCountdown(secs);
            if (secs <= 0) {
                clearInterval(timer);
                setResendStatus(null);
            }
        }, 1000);
    };

    return (
        <div className={styles.page}>
            <div className={styles.card}>
                {/* Logo */}
                <div className={styles.logo}>
                    <HeartPulse size={28} />
                    <span>BloodLink</span>
                </div>

                {/* Mail Illustration */}
                <div className={styles.illustration}>
                    <div className={styles.mailCircle}>
                        <Mail size={52} />
                        <span className={styles.badge}>
                            <CheckCircle2 size={22} />
                        </span>
                    </div>
                </div>

                {/* Text content */}
                <h1 className={styles.title}>Vérifiez votre email</h1>
                <p className={styles.description}>
                    Nous avons envoyé un lien de confirmation à&nbsp;
                    <span className={styles.emailHighlight}>{email}</span>
                </p>
                <p className={styles.hint}>
                    Cliquez sur le lien dans l'email pour activer votre compte BloodLink.
                    Vérifiez aussi votre dossier <strong>courrier indésirable</strong> si vous ne le trouvez pas.
                </p>

                {/* Steps */}
                <div className={styles.steps}>
                    <div className={styles.step}>
                        <span className={styles.stepNum}>1</span>
                        <span>Ouvrez votre boîte de réception</span>
                    </div>
                    <div className={styles.stepArrow}>→</div>
                    <div className={styles.step}>
                        <span className={styles.stepNum}>2</span>
                        <span>Trouvez l'email de BloodLink</span>
                    </div>
                    <div className={styles.stepArrow}>→</div>
                    <div className={styles.step}>
                        <span className={styles.stepNum}>3</span>
                        <span>Cliquez sur « Confirmer mon compte »</span>
                    </div>
                </div>

                {/* Resend section */}
                <div className={styles.resendBox}>
                    {resendStatus === 'sent' ? (
                        <p className={styles.sentMsg}>
                            <CheckCircle2 size={16} />
                            Email renvoyé ! Vérifiez votre boîte.
                            {countdown > 0 && <span className={styles.countdown}> ({countdown}s)</span>}
                        </p>
                    ) : (
                        <p className={styles.resendText}>
                            Vous n'avez pas reçu l'email ?
                            <button
                                className={styles.resendBtn}
                                onClick={handleResend}
                                disabled={resendStatus === 'loading'}
                            >
                                {resendStatus === 'loading' ? (
                                    <><RefreshCw size={14} className={styles.spin} /> Envoi en cours...</>
                                ) : (
                                    'Renvoyer l\'email'
                                )}
                            </button>
                        </p>
                    )}
                </div>

                {/* Back to Login */}
                <button
                    className={styles.backBtn}
                    onClick={() => navigate('/auth/login')}
                >
                    <ArrowLeft size={16} />
                    Retour à la connexion
                </button>
            </div>
        </div>
    );
};

export default VerifyEmail;
