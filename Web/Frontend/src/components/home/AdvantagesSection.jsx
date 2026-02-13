import React from 'react';
import { Heart, Activity, CheckCircle, Smile } from 'lucide-react';
import styles from './AdvantagesSection.module.css';

const AdvantagesSection = () => {
    const advantages = [
        {
            icon: Heart,
            title: "Santé Cardiaque",
            desc: "Donner régulièrement réduit l'épaisseur du sang et diminue le risque d'AVC et d'infarctus.",
            color: "#E53935"
        },
        {
            icon: Activity,
            title: "Renouveau Sanguin",
            desc: "Stimule la production de nouvelles cellules sanguines, améliorant votre circulation et votre énergie.",
            color: "#1E88E5"
        },
        {
            icon: CheckCircle,
            title: "Bilan Gratuit",
            desc: "Chaque don inclut un mini-bilan de santé (tension, hémoglobine, groupe sanguin) et dépistage.",
            color: "#43A047"
        },
        {
            icon: Smile,
            title: "Satisfaction Morale",
            desc: "La sensation unique de savoir que vous avez potentiellement sauvé jusqu'à 3 vies en 1 heure.",
            color: "#FB8C00"
        }
    ];

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.headerTitle}>Pourquoi donner son sang ?</h2>
                    <p className={styles.headerSubtitle}>Au-delà de l'acte solidaire, le don présente de nombreux bienfaits pour le donneur.</p>
                </div>

                <div className={styles.grid}>
                    {advantages.map((adv, idx) => {
                        const Icon = adv.icon;
                        return (
                            <div key={idx} className={styles.card} style={{ '--accent-color': adv.color }}>
                                <div className={styles.cardIconWrapper}>
                                    <Icon size={32} color={adv.color} />
                                </div>
                                <h3 className={styles.cardTitle}>{adv.title}</h3>
                                <p className={styles.cardDesc}>{adv.desc}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default AdvantagesSection;
