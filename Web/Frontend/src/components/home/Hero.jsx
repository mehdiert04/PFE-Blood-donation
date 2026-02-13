import React, { useState, useEffect } from 'react';
import { ArrowRight, CircleDot } from 'lucide-react';
import Button from '../common/Button';
import styles from './Hero.module.css';

const slides = [
    {
        id: 1,
        image: 'https://images.unsplash.com/photo-1615461168478-f62f3f9f9d7c?q=80&w=2674&auto=format&fit=crop',
        alt: 'Don de sang - Sauver des vies'
    },
    {
        id: 2,
        image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=2670&auto=format&fit=crop',
        alt: 'Laboratoire et Recherche'
    },
    {
        id: 3,
        image: 'https://images.unsplash.com/photo-1524721696987-b9527df9e312?q=80&w=2669&auto=format&fit=crop',
        alt: 'Communauté de donneurs'
    }
];

const Hero = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Auto-advance slides every 3 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <section className={styles.hero}>
            <div className={styles.container}>
                {/* Content */}
                <div className={styles.content}>
                    <div className={styles.badge}>
                        <CircleDot size={12} className={styles.badgeIcon} />
                        <span>Campagne Nationale 2026</span>
                    </div>
                    <h1 className={styles.title}>
                        Donner son sang, <br />
                        <span className={styles.highlight}>c'est sauver des vies.</span>
                    </h1>
                    <p className={styles.description}>
                        Au Maroc, chaque jour, des centaines de patients dépendent de votre générosité.
                        Rejoignez le mouvement solidaire et devenez un héros du quotidien.
                        Votre don est précieux et irremplaçable.
                    </p>
                    <div className={styles.ctaGroup}>
                        <Button size="lg" variant="primary">
                            Faire un don maintenant
                            <ArrowRight size={20} style={{ marginLeft: '12px' }} />
                        </Button>
                        <Button size="lg" variant="outline">
                            En savoir plus
                        </Button>
                    </div>
                    {/* Stats */}
                    <div className={styles.stats}>
                        <div className={styles.statItem}>
                            <span className={styles.statValue}>3</span>
                            <span className={styles.statLabel}>Vies sauvées<br />par don</span>
                        </div>
                        <div className={styles.divider}></div>
                        <div className={styles.statItem}>
                            <span className={styles.statValue}>45</span>
                            <span className={styles.statLabel}>Minutes<br />pour donner</span>
                        </div>
                    </div>
                </div>

                {/* Carousel */}
                <div className={styles.carouselContainer}>
                    <div className={styles.carouselWrapper}>
                        {slides.map((slide, index) => (
                            <div
                                key={slide.id}
                                className={`${styles.slide} ${index === currentSlide ? styles.activeSlide : ''}`}
                            >
                                <img src={slide.image} alt={slide.alt} className={styles.slideImage} />
                                <div className={styles.overlay}></div>
                            </div>
                        ))}
                    </div>
                    {/* Dots */}
                    <div className={styles.dots}>
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`${styles.dot} ${index === currentSlide ? styles.activeDot : ''}`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
