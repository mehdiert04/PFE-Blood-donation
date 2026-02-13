import React, { useState } from 'react';
import { User, Weight, Activity, CalendarDays, Droplet, CheckCircle2 } from 'lucide-react';
import styles from './EligibilitySection.module.css';

const criteria = [
    {
        id: 1,
        icon: User,
        label: "Âge",
        value: "18 à 60 ans",
        desc: "Pour un premier don. Jusqu'à 70 an sur avis médical."
    },
    {
        id: 2,
        icon: Weight,
        label: "Poids",
        value: "+50 kg",
        desc: "Un poids minimum est requis pour assurer la sécurité du donneur."
    },
    {
        id: 3,
        icon: Activity,
        label: "Santé",
        value: "Bonne santé",
        desc: "Pas de maladie chronique grave, ni d’infection en cours (grippe...)."
    },
    {
        id: 4,
        icon: CalendarDays,
        label: "Délai",
        value: "8 semaines",
        desc: "Intervalle minimum entre deux dons de sang total."
    }
];

const contraindications = [
    "Soins dentaires récents (< 24h)",
    "Tatouage ou piercing (< 4 mois)",
    "Voyage récent dans un pays tropical",
    "Grossesse ou accouchement récent (< 6 mois)",
    "Intervention chirurgicale récente",
    "Prise de certains médicaments (antibiotiques...)"
];

const EligibilitySection = () => {
    // Simple state for accordion if we wanted it, but let's do a clean grid + list layout
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.contentWrapper}>
                    {/* Left: Main Criteria */}
                    <div className={styles.mainCriteria}>
                        <h2 className={styles.title}>Puis-je donner ?</h2>
                        <p className={styles.subtitle}>Les conditions principales pour devenir donneur.</p>

                        <div className={styles.criteriaGrid}>
                            {criteria.map((c) => {
                                const Icon = c.icon;
                                return (
                                    <div key={c.id} className={styles.criteriaCard}>
                                        <div className={styles.iconBox}>
                                            <Icon size={24} />
                                        </div>
                                        <div>
                                            <h4 className={styles.label}>{c.label}</h4>
                                            <div className={styles.value}>{c.value}</div>
                                            <p className={styles.desc}>{c.desc}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right: Contraindications Box */}
                    <div className={styles.contraindications}>
                        <div className={styles.contraHeader}>
                            <Droplet size={24} />
                            <h3>Contre-indications temporaires</h3>
                        </div>
                        <ul className={styles.list}>
                            {contraindications.map((item, idx) => (
                                <li key={idx} className={styles.listItem}>
                                    <CheckCircle2 size={18} className={styles.checkIcon} />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                        <div className={styles.note}>
                            * Un médecin vérifiera toujours votre éligibilité sur place.
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default EligibilitySection;
