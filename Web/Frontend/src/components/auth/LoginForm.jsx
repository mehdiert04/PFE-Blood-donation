import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useOutletContext } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { loginSchema } from '../../lib/schemas';
import Button from '../common/Button';
import Input from '../common/Input';
import styles from './AuthForms.module.css';

const LoginForm = () => {
    const { onSwitchToRegister } = useOutletContext();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loginError, setLoginError] = useState(null);

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(loginSchema)
    });

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        setLoginError(null);
        try {
            console.log('Logging in:', data);
            await new Promise(resolve => setTimeout(resolve, 1500));
            // Handle successful login (redirect, context update)
            alert("Connexion réussie (Simulation)");
        } catch (err) {
            setLoginError("Email ou mot de passe incorrect.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.formContainer}>
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
                    <button type="button" className={styles.linkButton}>Mot de passe oublié?</button>
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
