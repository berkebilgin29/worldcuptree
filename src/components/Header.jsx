import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Globe, RefreshCw, Cpu } from 'lucide-react';

export default function Header({ onReset, isSimulating, onStartSim, onCancelSim }) {
  const { lang, toggleLanguage, t } = useLanguage();

  return (
    <header className="header-wrapper">
      <a href="/" className="header-logo">
        <img src="/logo.png" alt="WorldCupTree Logo" style={{ height: '60px', width: 'auto' }} />
        <div className="header-logo-text">
          <span className="text-white">WORLD CUP</span>
          <span className="text-gold">2026</span>
        </div>
      </a>

      <div className="header-controls">
        {/* AI Simulation Toggle Button */}
        <button 
          className="lang-btn flex-center gap-2"
          onClick={isSimulating ? onCancelSim : onStartSim}
          style={{ 
            borderColor: isSimulating ? 'var(--color-danger)' : 'var(--color-primary)',
            color: isSimulating ? 'var(--color-danger)' : 'var(--color-primary)',
            background: isSimulating ? 'rgba(239, 68, 68, 0.1)' : 'rgba(0, 230, 118, 0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
          title={isSimulating ? t('stopSimBtn') : t('simulateBtn')}
        >
          <Cpu size={16} className={isSimulating ? "animate-pulse" : ""} />
          <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>
            {isSimulating ? t('stopSimBtn').toUpperCase() : t('simulateBtn').toUpperCase()}
          </span>
        </button>

        <button className="lang-btn flex-center gap-2" onClick={toggleLanguage}>
          <Globe size={16} style={{ marginRight: '6px' }} />
          <span>{lang === 'en' ? 'TR' : 'EN'}</span>
        </button>

        <button className="lang-btn flex-center gap-2" onClick={onReset} title={t('resetBtn')}>
          <RefreshCw size={16} />
        </button>
      </div>
    </header>
  );
}
