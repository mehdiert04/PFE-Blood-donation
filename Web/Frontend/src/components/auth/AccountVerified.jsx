import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2, HeartPulse, ArrowRight } from 'lucide-react';
import Button from '../common/Button';
import styles from './AccountVerified.module.css';
import { verifyEmail } from '../../api/auth';

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
    const id = searchParams.get('id');
    const hash = searchParams.get('hash');

    const [status, setStatus] = useState(STATUS.LOADING);

    useEffect(() => {
        const verifyToken = async () => {
            // Need at least id and hash from the URL
            if (!id || !hash) {
                setStatus(STATUS.ERROR);
                return;
            }

            try {
                // Construct the backend URL using the parameters captured from the email link
                // The email link should point to this page with id, hash, expires, and signature
                const backendVerifyUrl = `/email/verify/${id}/${hash}?${searchParams.toString()}`;

                const response = await verifyEmail(backendVerifyUrl);

                if (response.data.success) {
                    setStatus(STATUS.SUCCESS);
                } else {
                    setStatus(STATUS.ERROR);
                }
            } catch (err) {
                console.error('Verification error:', err);
                if (err.response?.status === 403) {
                    setStatus(STATUS.EXPIRED);
                } else {
                    setStatus(STATUS.ERROR);
                }
            }
        };

        verifyToken();
    }, [id, hash, searchParams]);

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
