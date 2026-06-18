import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="footer-wrapper">
      <div className="container">
        <p className="disclaimer-text">{t('unofficialDisclaimer')}</p>
        <p className="copyright-text" style={{ marginTop: '8px', opacity: 0.6 }}>
          &copy; {new Date().getFullYear()} WorldCupTree. All rights reserved.
        </p>
        <div className="footer-links">
          <a href="#" className="footer-link" onClick={(e) => { e.preventDefault(); alert("Privacy Policy: We do not collect personal data. All predictions are stored locally on your device."); }}>
            {t('privacyPolicy')}
          </a>
          <span style={{ opacity: 0.3 }}>&bull;</span>
          <a href="mailto:info@worldcuptree.com" className="footer-link">
            {t('contact')}
          </a>
        </div>
      </div>
    </footer>
  );
}
