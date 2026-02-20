import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2, HeartPulse, ArrowRight } from 'lucide-react';
import Button from '../common/Button';
import styles from './AccountVerified.module.css';

// Possible states
const STATUS = {
    LOADING: 'loading',
    SUCCESS: 'success',
    ERROR: 'error',
    EXPIRED: 'expired',
};

const AccountVerified = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const [status, setStatus] = useState(STATUS.LOADING);

    useEffect(() => {
        const verifyToken = async () => {
            // No token in URL → show error immediately
            if (!token) {
                setStatus(STATUS.ERROR);
                return;
            }

            try {
                // Simulate API call: replace with real endpoint later
                // e.g. await axios.post('/api/auth/verify-email', { token })
                await new Promise(resolve => setTimeout(resolve, 2000));

                // For demo: token 'expired' simulates expiry, otherwise success
                if (token === 'expired') {
                    setStatus(STATUS.EXPIRED);
                } else {
                    setStatus(STATUS.SUCCESS);
                }
            } catch (err) {
                setStatus(STATUS.ERROR);
            }
        };

        verifyToken();
    }, [token]);

    const content = {
        [STATUS.LOADING]: {
            icon: null,
            title: 'Vérification en cours...',
            description: 'Veuillez patienter pendant que nous validons votre compte.',
            color: styles.loading,
        },
        [STATUS.SUCCESS]: {
            icon: <CheckCircle2 size={64} />,
            title: 'Compte activé avec succès !',
            description: 'Votre compte BloodLink a été vérifié et activé. Vous pouvez maintenant vous connecter et commencer à faire la différence.',
            color: styles.success,
        },
        [STATUS.ERROR]: {
            icon: <XCircle size={64} />,
            title: 'Lien invalide',
            description: "Ce lien de vérification est invalide ou a déjà été utilisé. Si vous pensez qu'il s'agit d'une erreur, veuillez vous réinscrire ou contacter le support.",
            color: styles.error,
        },
        [STATUS.EXPIRED]: {
            icon: <XCircle size={64} />,
            title: 'Lien expiré',
            description: 'Ce lien de vérification a expiré (valable 24h). Veuillez vous réinscrire pour recevoir un nouveau lien de confirmation.',
            color: styles.error,
        },
    };

    const current = content[status];

    return (
        <div className={styles.page}>
            <div className={styles.card}>
                {/* Logo */}
                <div className={styles.logo}>
                    <HeartPulse size={26} />
                    <span>BloodLink</span>
                </div>

                {/* Icon / Loader */}
                <div className={`${styles.iconWrapper} ${current.color}`}>
                    {status === STATUS.LOADING ? (
                        <Loader2 size={64} className={styles.spinner} />
                    ) : (
                        current.icon
                    )}
                </div>

                {/* Text */}
                <h1 className={`${styles.title} ${current.color}`}>{current.title}</h1>
                <p className={styles.description}>{current.description}</p>

                {/* Actions */}
                {status === STATUS.SUCCESS && (
                    <div className={styles.actions}>
                        <Button
                            variant="primary"
                            size="lg"
                            onClick={() => navigate('/auth/login')}
                        >
                            Se connecter
                            <ArrowRight size={18} style={{ marginLeft: 8 }} />
                        </Button>
                        <button
                            className={styles.homeLink}
                            onClick={() => navigate('/')}
                        >
                            Retourner à l'accueil
                        </button>
                    </div>
                )}

                {(status === STATUS.ERROR || status === STATUS.EXPIRED) && (
                    <div className={styles.actions}>
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={() => navigate('/auth/register')}
                        >
                            S'inscrire à nouveau
                        </Button>
                        <button
                            className={styles.homeLink}
                            onClick={() => navigate('/auth/login')}
                        >
                            Déjà un compte ? Se connecter
                        </button>
                    </div>
                )}

                {/* Decorative dots */}
                <div className={styles.decorDots}>
                    <span className={styles.dot}></span>
                    <span className={styles.dot}></span>
                    <span className={styles.dot}></span>
                </div>
            </div>
        </div>
    );
};

export default AccountVerified;
