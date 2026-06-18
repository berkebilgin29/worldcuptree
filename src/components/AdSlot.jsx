import React, { useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function AdSlot({ slot = '1234567890', format = 'auto', responsive = 'true', style = {} }) {
  const { lang } = useLanguage();

  useEffect(() => {
    try {
      // Safely invoke Google Ads script
      if (typeof window !== 'undefined') {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      console.warn("AdSense script load warning:", e);
    }
  }, []);

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
          data-ad-client="ca-pub-1234567890123456" // Replace with your publisher ca-pub ID
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive={responsive}
        />
      </div>
    </div>
  );
}
