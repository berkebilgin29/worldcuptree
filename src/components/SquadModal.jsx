import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { getSquadForTeam } from '../data/squads';

export default function SquadModal({ isOpen, onClose, team, lang }) {
  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !team) return null;

  const squad = getSquadForTeam(team.id, team.name);

  // Position translators
  const posLabels = {
    tr: { GK: 'KL', DF: 'DF', MF: 'OS', FW: 'FV' },
    en: { GK: 'GK', DF: 'DF', MF: 'MF', FW: 'FW' },
    fr: { GK: 'GB', DF: 'DF', MF: 'ML', FW: 'AT' },
    de: { GK: 'TW', DF: 'AB', MF: 'MF', FW: 'ANG' }
  };

  const getPositionBadge = (pos) => {
    const label = posLabels[lang]?.[pos] || pos;
    let colorClass = '';
    
    switch (pos) {
      case 'GK':
        colorClass = 'pos-gk';
        break;
      case 'DF':
        colorClass = 'pos-df';
        break;
      case 'MF':
        colorClass = 'pos-mf';
        break;
      case 'FW':
        colorClass = 'pos-fw';
        break;
      default:
        colorClass = '';
    }

    return <span className={`pos-badge ${colorClass}`}>{label}</span>;
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container glass-panel" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-team-title">
            <img 
              src={`https://flagcdn.com/w80/${team.flag.toLowerCase()}.png`} 
              alt={team.name[lang] || team.name.en} 
              className="modal-flag"
              onError={(e) => {
                if (team.flag === 'gb-eng') e.target.src = 'https://flagcdn.com/w80/gb.png';
                else if (team.flag === 'gb-wls') e.target.src = 'https://flagcdn.com/w80/gb.png';
                else if (team.flag === 'gb-sct') e.target.src = 'https://flagcdn.com/w80/gb.png';
                else e.target.src = 'https://flagcdn.com/w80/un.png';
              }}
            />
            <div>
              <h3 className="modal-team-name">{team.name[lang] || team.name.en}</h3>
              <p className="modal-squad-value">
                {lang === 'tr' ? 'Toplam Değer: ' : (lang === 'de' ? 'Gesamtmarktwert: ' : (lang === 'fr' ? 'Valeur Totale : ' : 'Total Value: '))}
                <span className="value-glowing">€{squad.totalValue}M</span>
              </p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="modal-body">
          <div className="squad-list-header">
            <span>{lang === 'tr' ? 'Oyuncu / Kulüp' : (lang === 'de' ? 'Spieler / Verein' : (lang === 'fr' ? 'Joueur / Club' : 'Player / Club'))}</span>
            <span>{lang === 'tr' ? 'Değer' : (lang === 'de' ? 'Wert' : (lang === 'fr' ? 'Valeur' : 'Value'))}</span>
          </div>

          <div className="squad-list-scroll">
            {squad.players.map((player, idx) => (
              <div key={idx} className="squad-player-row">
                <div className="player-meta">
                  {getPositionBadge(player.pos)}
                  <div className="player-details">
                    <span className="player-name">{player.name}</span>
                    <span className="player-club">{player.club}</span>
                  </div>
                </div>
                <div className="player-value">
                  <span className="value-badge">€{player.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            * {lang === 'tr' ? 'Piyasa değerleri Transfermarkt verileri esas alınarak hazırlanmıştır.' : (lang === 'de' ? 'Die Marktwerte basieren auf Transfermarkt-Daten.' : (lang === 'fr' ? 'Les valeurs marchandes sont basées sur les données de Transfermarkt.' : 'Market values are based on Transfermarkt data.'))}
          </span>
        </div>
      </div>
    </div>
  );
}
