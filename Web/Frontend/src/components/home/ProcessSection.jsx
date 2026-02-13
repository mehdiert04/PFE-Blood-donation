import React from 'react';
import { UserPlus, HeartPulse, Bell, HandHeart } from 'lucide-react';
import styles from './ProcessSection.module.css';

const steps = [
    {
        id: 1,
        icon: UserPlus,
        title: "Créez votre compte",
        description: "Inscrivez-vous en tant que donneur, hôpital ou receveur en quelques clics."
    },
    {
        id: 2,
        icon: HeartPulse,
        title: "Exprimez un besoin",
        description: "Lancez une demande urgente de sang ou signalez votre disponibilité pour donner."
    },
    {
        id: 3,
        icon: Bell,
        title: "Notification instantanée",
        description: "Notre système alerte immédiatement les donneurs compatibles à proximité."
    },
    {
        id: 4,
        icon: HandHeart,
        title: "Sauvez une vie",
        description: "Le donneur répond à l'appel et se rend à l'hôpital pour effectuer le don."
    }
];

const ProcessSection = () => {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Comment ça marche ?</h2>
                    <p className={styles.subtitle}>Un processus simple et rapide pour connecter ceux qui donnent à ceux qui reçoivent.</p>
                </div>

                <div className={styles.stepsWrapper}>
                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        return (
                            <div key={step.id} className={styles.stepCard}>
                                <div className={styles.iconContainer}>
                                    <Icon size={32} />
                                    <div className={styles.stepNumber}>{step.id}</div>
                                </div>
                                <h3 className={styles.stepTitle}>{step.title}</h3>
                                <p className={styles.stepDescription}>{step.description}</p>

                                {/* Connector Line (except for last item) */}
                                {index < steps.length - 1 && <div className={styles.connector}></div>}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default ProcessSection;
