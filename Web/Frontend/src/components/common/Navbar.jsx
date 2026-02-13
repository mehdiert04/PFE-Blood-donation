import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, Menu, X, HeartPulse } from 'lucide-react';
import Button from '../common/Button';
import styles from './Navbar.module.css';

const Navbar = () => {
    const { theme, toggleTheme } = useTheme();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 10;
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [scrolled]);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const navLinks = [
        { name: 'Accueil', path: '/' },
        { name: 'Demande de sang', path: '/request-blood' },
        { name: 'Nouvelles campagnes', path: '/campaigns' },
        { name: 'Plus', path: '/more' },
    ];

    return (
        <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''} ${theme === 'dark' ? styles.dark : ''}`}>
            <div className={styles.container}>
                <Link to="/" className={styles.logo}>
                    <HeartPulse className={styles.icon} size={28} />
                    <span>BloodLink</span>
                </Link>

                {/* Desktop Menu */}
                <div className={styles.desktopMenu}>
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.name}
                            to={link.path}
                            className={({ isActive }) =>
                                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                            }
                        >
                            {link.name}
                        </NavLink>
                    ))}
                </div>

                {/* Actions */}
                <div className={styles.actions}>
                    <button onClick={toggleTheme} className={styles.themeToggle} aria-label="Toggle Theme">
                        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                    </button>
                    <div className={styles.loginButtonWrapper}>
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={() => navigate('/auth/login')}
                        >
                            Se connecter
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button className={styles.mobileMenuBtn} onClick={toggleMenu} aria-label="Menu">
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className={styles.mobileMenu}>
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.name}
                            to={link.path}
                            onClick={() => setIsMenuOpen(false)}
                            className={({ isActive }) =>
                                isActive ? `${styles.mobileLink} ${styles.active}` : styles.mobileLink
                            }
                        >
                            {link.name}
                        </NavLink>
                    ))}
                    <div className={styles.mobileActions}>
                        <Button
                            variant="primary"
                            fullWidth
                            onClick={() => {
                                setIsMenuOpen(false);
                                navigate('/auth/login');
                            }}
                        >
                            Se connecter
                        </Button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
