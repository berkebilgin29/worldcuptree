import React, { useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

const SLOT_MAPPING = {
  'landing-bottom-ad': import.meta.env.VITE_ADSENSE_SLOT_LANDING || '1234567890',
  'wizard-bottom-ad': import.meta.env.VITE_ADSENSE_SLOT_WIZARD || '0987654321',
};

export default function AdSlot({ slot = '1234567890', format = 'auto', responsive = 'true', style = {} }) {
  const { lang } = useLanguage();
  
  const clientID = import.meta.env.VITE_ADSENSE_CLIENT || 'ca-pub-8383331067880574';
  const resolvedSlot = SLOT_MAPPING[slot] || slot;

  useEffect(() => {
    try {
      // Safely invoke Google Ads script
      if (typeof window !== 'undefined') {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      console.warn("AdSense script load warning:", e);
    }
  }, [resolvedSlot]);

  return (
    <div className="ad-wrapper-container" style={style}>
      <div className="ad-label">
        {lang === 'tr' ? 'SPONSORLU BAĞLANTI' : 'ADVERTISEMENT'}
      </div>
      <div className="ad-box">
        {/* Placeholder/Live Google AdSense ins tag */}
        <ins 
          className="adsbygoogle"
          style={{ display: 'block', minHeight: '90px' }}
          data-ad-client={clientID}
          data-ad-slot={resolvedSlot}
          data-ad-format={format}
          data-full-width-responsive={responsive}
        />
      </div>
    </div>
  );
}
