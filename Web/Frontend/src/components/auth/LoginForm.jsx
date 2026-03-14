import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useOutletContext, useNavigate, useLocation } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { loginSchema } from '../../lib/schemas';
import Button from '../common/Button';
import Input from '../common/Input';
import styles from './AuthForms.module.css';
import { login } from '../../api/auth';

const LoginForm = () => {
    const { onSwitchToRegister } = useOutletContext();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || null;
    const infoMessage = location.state?.message || null;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loginError, setLoginError] = useState(null);

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(loginSchema)
    });

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        setLoginError(null);
        try {
            const response = await login(data);
            if (response.data.success) {
                const { access_token, user } = response.data.data;
                localStorage.setItem('ACCESS_TOKEN', access_token);
                localStorage.setItem('USER', JSON.stringify(user));

                // Redirect based on role or to previous page
                if (from) {
                    navigate(from);
                } else if (user.role === 'receveur') {
                    navigate('/receveur/dashboard');
                } else if (user.role === 'donneur') {
                    navigate('/donneur/dashboard');
                } else if (user.role === 'hopital') {
                    navigate('/hopital/dashboard');
                } else {
                    navigate('/dashboard');
                }
            }
        } catch (err) {
            console.error('Login error:', err);
            const message = err.response?.data?.message || "Email ou mot de passe incorrect.";
            setLoginError(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.formContainer}>
            {infoMessage && (
                <div style={{ marginBottom: '1rem', padding: '0.8rem', background: '#f0f7ff', color: '#0056b3', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                    <AlertCircle size={18} />
                    <span>{infoMessage}</span>
                </div>
            )}
            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                <Input
                    type="email"
                    label="Email"
                    {...register('email')}
                    error={errors.email}
                    icon={Mail}
                    placeholder="exemple@email.com"
                />

                <Input
                    type="password"
                    label="Mot de passe"
                    {...register('password')}
                    error={errors.password}
                    icon={Lock}
                    placeholder="Votre mot de passe"
                />

                {loginError && (
                    <div className={styles.errorMessage}>
                        <AlertCircle size={20} />
                        <span>{loginError}</span>
                    </div>
                )}

                <div className={styles.forgotPassword}>
                    <button
                        type="button"
                        className={styles.linkButton}
                        onClick={() => navigate('/auth/forgot-password')}
                    >
                        Mot de passe oublié ?
                    </button>
                </div>

                <Button type="submit" fullWidth isLoading={isSubmitting} size="lg">
                    Se connecter
                </Button>

                <div className={styles.links}>
                    <p>
                        Pas encore de compte?{' '}
                        <button type="button" onClick={onSwitchToRegister} className={styles.linkButton}>
                            S'inscrire
                        </button>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;
