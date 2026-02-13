import React from 'react';
import Navbar from '../common/Navbar';
import Hero from './Hero';
import ProcessSection from './ProcessSection';
import AdvantagesSection from './AdvantagesSection';
import EligibilitySection from './EligibilitySection';

const HomePage = () => {
    return (
        <>
            <Navbar />
            <Hero />
            <ProcessSection />
            <AdvantagesSection />
            <EligibilitySection />
        </>
    );
};

export default HomePage;
