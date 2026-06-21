import React, { useRef, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getRoundOf32Matchups } from '../utils/matching';
import { toPng } from 'html-to-image';
import { Download, Loader2 } from 'lucide-react';

const TEAM_CODES = {
  mexico: 'MEX',
  south_africa: 'RSA',
  south_korea: 'KOR',
  czech_republic: 'CZE',
  canada: 'CAN',
  bosnia_herzegovina: 'BIH',
  qatar: 'QAT',
  switzerland: 'SUI',
  brazil: 'BRA',
  morocco: 'MAR',
  haiti: 'HAI',
  scotland: 'SCO',
  united_states: 'USA',
  paraguay: 'PAR',
  australia: 'AUS',
  turkey: 'TUR',
  germany: 'GER',
  curacao: 'CUW',
  ivory_coast: 'CIV',
  ecuador: 'ECU',
  netherlands: 'NED',
  japan: 'JPN',
  ukraine: 'UKR',
  tunisia: 'TUN',
  belgium: 'BEL',
  egypt: 'EGY',
  iran: 'IRN',
  new_zealand: 'NZL',
  spain: 'ESP',
  cape_verde: 'CPV',
  saudi_arabia: 'KSA',
  uruguay: 'URU',
  france: 'FRA',
  senegal: 'SEN',
  bolivia: 'BOL',
  norway: 'NOR',
  argentina: 'ARG',
  algeria: 'ALG',
  austria: 'AUT',
  jordan: 'JOR',
  portugal: 'POR',
  jamaica: 'JAM',
  uzbekistan: 'UZB',
  colombia: 'COL',
  england: 'ENG',
  croatia: 'CRO',
  ghana: 'GHA',
  panama: 'PAN'
};

export default function ShareCard({ standings, selectedThirdPlaces, predictions }) {
  const { lang, t } = useLanguage();
  const cardRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [selectedRound, setSelectedRound] = useState('r32');

  const r32Matches = getRoundOf32Matchups(standings, selectedThirdPlaces);

  const getMatchWinner = (matchId, sourceMatches) => {
    const winnerId = predictions[matchId];
    if (!winnerId) return null;
    const match = sourceMatches.find(m => m.id === matchId);
    if (!match) return null;
    if (match.home && match.home.id === winnerId) return match.home;
    if (match.away && match.away.id === winnerId) return match.away;
    return null;
  };

  const getMatchLoser = (matchId, sourceMatches) => {
    const winnerId = predictions[matchId];
    if (!winnerId) return null;
    const match = sourceMatches.find(m => m.id === matchId);
    if (!match) return null;
    if (match.home && match.home.id === winnerId) return match.away;
    if (match.away && match.away.id === winnerId) return match.home;
    return null;
  };

  // Re-build rounds to trace top teams
  const r16Matches = [
    { id: 'R16_1', home: getMatchWinner('R32_1', r32Matches), away: getMatchWinner('R32_2', r32Matches) },
    { id: 'R16_2', home: getMatchWinner('R32_3', r32Matches), away: getMatchWinner('R32_4', r32Matches) },
    { id: 'R16_3', home: getMatchWinner('R32_5', r32Matches), away: getMatchWinner('R32_6', r32Matches) },
    { id: 'R16_4', home: getMatchWinner('R32_7', r32Matches), away: getMatchWinner('R32_8', r32Matches) },
    { id: 'R16_5', home: getMatchWinner('R32_9', r32Matches), away: getMatchWinner('R32_10', r32Matches) },
    { id: 'R16_6', home: getMatchWinner('R32_11', r32Matches), away: getMatchWinner('R32_12', r32Matches) },
    { id: 'R16_7', home: getMatchWinner('R32_13', r32Matches), away: getMatchWinner('R32_14', r32Matches) },
    { id: 'R16_8', home: getMatchWinner('R32_15', r32Matches), away: getMatchWinner('R32_16', r32Matches) }
  ];

  const qfMatches = [
    { id: 'QF_1', home: getMatchWinner('R16_1', r16Matches), away: getMatchWinner('R16_2', r16Matches) },
    { id: 'QF_2', home: getMatchWinner('R16_3', r16Matches), away: getMatchWinner('R16_4', r16Matches) },
    { id: 'QF_3', home: getMatchWinner('R16_5', r16Matches), away: getMatchWinner('R16_6', r16Matches) },
    { id: 'QF_4', home: getMatchWinner('R16_7', r16Matches), away: getMatchWinner('R16_8', r16Matches) }
  ];

  const sfMatches = [
    { id: 'SF_1', home: getMatchWinner('QF_1', qfMatches), away: getMatchWinner('QF_2', qfMatches) },
    { id: 'SF_2', home: getMatchWinner('QF_3', qfMatches), away: getMatchWinner('QF_4', qfMatches) }
  ];

  const finalMatch = {
    id: 'F_1',
    home: getMatchWinner('SF_1', sfMatches),
    away: getMatchWinner('SF_2', sfMatches)
  };

  const champion = predictions['F_1'] ? (finalMatch.home?.id === predictions['F_1'] ? finalMatch.home : finalMatch.away) : null;
  const runnerUp = predictions['F_1'] ? (finalMatch.home?.id === predictions['F_1'] ? finalMatch.away : finalMatch.home) : null;

  // Semifinal losers
  const semi1Loser = getMatchLoser('SF_1', sfMatches);
  const semi2Loser = getMatchLoser('SF_2', sfMatches);

  const getTeamCode = (team) => {
    if (!team) return 'TBD';
    if (team.isPlaceholder) return team.name[lang];
    return TEAM_CODES[team.id] || team.name[lang].slice(0, 3).toUpperCase();
  };

  const renderTreeMatch = (match, predictionId, side = 'left') => {
    if (!match) return null;
    const winnerId = predictions[predictionId];
    const homeTeam = match.home;
    const awayTeam = match.away;

    const isHomeWinner = homeTeam && winnerId === homeTeam.id;
    const isAwayWinner = awayTeam && winnerId === awayTeam.id;

    const renderTreeTeamRow = (team, isWinner, isLoser) => {
      if (!team) {
        return (
          <div className="tree-team placeholder">
            <span className="tree-team-code">TBD</span>
          </div>
        );
      }

      return (
        <div className={`tree-team ${isWinner ? 'winner' : ''} ${isLoser ? 'loser' : ''}`}>
          <img 
            src={`https://flagcdn.com/w40/${team.flag.toLowerCase()}.png`} 
            alt={team.name[lang]} 
            className="tree-flag"
            crossOrigin="anonymous"
            onError={(e) => {
              if (team.flag === 'gb-eng') e.target.src = 'https://flagcdn.com/w40/gb.png';
              else if (team.flag === 'gb-wls') e.target.src = 'https://flagcdn.com/w40/gb.png';
              else if (team.flag === 'gb-sct') e.target.src = 'https://flagcdn.com/w40/gb.png';
              else e.target.src = 'https://flagcdn.com/w40/un.png';
            }}
          />
          <span className="tree-team-code">{getTeamCode(team)}</span>
        </div>
      );
    };

    const hasPrediction = !!winnerId;

    return (
      <div key={predictionId} className={`tree-match-card ${side} ${hasPrediction ? 'has-pred' : ''}`}>
        {renderTreeTeamRow(homeTeam, isHomeWinner, hasPrediction && !isHomeWinner)}
        {renderTreeTeamRow(awayTeam, isAwayWinner, hasPrediction && !isAwayWinner)}
      </div>
    );
  };

  const downloadCard = () => {
    if (!cardRef.current) return;
    setLoading(true);

    // Give browser brief window to load flags
    setTimeout(() => {
      toPng(cardRef.current, {
        cacheBust: true,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
          margin: '0',
          padding: '30px',
          borderRadius: '0'
        }
      })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'WorldCup2026_Predictions.png';
        link.href = dataUrl;
        link.click();
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to generate image:', err);
        alert('Could not generate prediction image. Please try again.');
        setLoading(false);
      });
    }, 500);
  };

  if (!champion) {
    return (
      <div style={{ textAlign: 'center', padding: '30px', opacity: 0.6 }}>
        <p style={{ color: 'var(--text-muted)' }}>
          {t('selectChampionToDownload')}
        </p>
      </div>
    );
  }

  return (
    <div style={{ margin: '40px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      {/* Round Selection Question Card */}
      <div className="glass-panel" style={{ maxWidth: '600px', width: '100%', marginBottom: '32px', padding: '24px', textAlign: 'center', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <h3 style={{ fontSize: '1.15rem', marginBottom: '16px', fontFamily: 'var(--font-title)', fontWeight: 700, color: 'var(--color-secondary)' }}>
          {t('chooseStartRound')}
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          <button 
            className={`selector-card-btn ${selectedRound === 'r32' ? 'active' : ''}`}
            onClick={() => setSelectedRound('r32')}
          >
            <div className="selector-card-title">{t('roundOf32')}</div>
            <div className="selector-card-desc">{t('roundOf32Full')}</div>
          </button>
          <button 
            className={`selector-card-btn ${selectedRound === 'r16' ? 'active' : ''}`}
            onClick={() => setSelectedRound('r16')}
          >
            <div className="selector-card-title">{t('roundOf16')}</div>
            <div className="selector-card-desc">{t('roundOf16Short')}</div>
          </button>
          <button 
            className={`selector-card-btn ${selectedRound === 'qf' ? 'active' : ''}`}
            onClick={() => setSelectedRound('qf')}
          >
            <div className="selector-card-title">{t('quarterFinals')}</div>
            <div className="selector-card-desc">{t('quarterfinalsShort')}</div>
          </button>
        </div>
      </div>

      {/* SHARABLE PNG CONTAINER */}
      <div className="share-card-outer-scroll">
        <div 
          ref={cardRef} 
          id="prediction-share-card" 
          className="share-card-wrapper"
          style={{
            background: 'linear-gradient(180deg, #0b0f19 0%, #030712 100%)',
            width: selectedRound === 'r32' ? '1080px' : selectedRound === 'r16' ? '780px' : '560px',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8)'
          }}
        >
          <div className="share-card-header">
            <div className="share-card-logo">
              <img src="/logo.png" alt="WorldCupTree Logo" style={{ height: '48px', width: 'auto' }} />
              <span>WorldCupTree 2026</span>
            </div>
            <div className="share-card-tagline">
              {t('cardTitle')}
            </div>
          </div>

          {/* CHAMPION */}
          <div className="share-card-champion-section">
            <div className="share-card-champ-title">
              🏆 {t('championText')} 🏆
            </div>
            <div className="share-card-champ-badge" style={{ background: 'rgba(245, 158, 11, 0.12)', borderColor: '#f59e0b', padding: '14px 28px' }}>
              <img 
                src={`https://flagcdn.com/w40/${champion.flag.toLowerCase()}.png`} 
                alt={champion.name[lang]} 
                className="flag-img"
                crossOrigin="anonymous"
                style={{ width: '32px', height: '22px' }}
                onError={(e) => {
                  if (champion.flag === 'gb-eng') e.target.src = 'https://flagcdn.com/w40/gb.png';
                  else if (champion.flag === 'gb-wls') e.target.src = 'https://flagcdn.com/w40/gb.png';
                  else if (champion.flag === 'gb-sct') e.target.src = 'https://flagcdn.com/w40/gb.png';
                  else e.target.src = 'https://flagcdn.com/w40/un.png';
                }}
              />
              <span className="share-card-champ-name" style={{ fontSize: '1.4rem' }}>
                {champion.name[lang].toUpperCase()}
              </span>
            </div>
          </div>

          {/* RUNNER UP & SEMIFINALISTS */}
          <div className="share-card-runners-grid">
            {runnerUp && (
              <div className="share-card-mini-box">
                <span className="share-card-mini-label">{t('runnerUp')}</span>
                <div className="share-card-mini-team">
                  <img 
                    src={`https://flagcdn.com/w40/${runnerUp.flag.toLowerCase()}.png`} 
                    alt={runnerUp.name[lang]} 
                    className="flag-img"
                    crossOrigin="anonymous"
                    onError={(e) => {
                      if (runnerUp.flag === 'gb-eng') e.target.src = 'https://flagcdn.com/w40/gb.png';
                      else if (runnerUp.flag === 'gb-wls') e.target.src = 'https://flagcdn.com/w40/gb.png';
                      else if (runnerUp.flag === 'gb-sct') e.target.src = 'https://flagcdn.com/w40/gb.png';
                      else e.target.src = 'https://flagcdn.com/w40/un.png';
                    }}
                  />
                  <span className="share-card-mini-name">{runnerUp.name[lang]}</span>
                </div>
              </div>
            )}

            <div className="share-card-mini-box">
              <span className="share-card-mini-label">{t('semiFinals')}</span>
              <div className="share-card-semis-list" style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                {semi1Loser && (
                  <div className="share-card-semi-team" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <img 
                      src={`https://flagcdn.com/w40/${semi1Loser.flag.toLowerCase()}.png`} 
                      alt={semi1Loser.name[lang]} 
                      className="flag-img"
                      crossOrigin="anonymous"
                      style={{ width: '16px', height: '11px' }}
                      onError={(e) => {
                        if (semi1Loser.flag === 'gb-eng') e.target.src = 'https://flagcdn.com/w40/gb.png';
                        else if (semi1Loser.flag === 'gb-wls') e.target.src = 'https://flagcdn.com/w40/gb.png';
                        else if (semi1Loser.flag === 'gb-sct') e.target.src = 'https://flagcdn.com/w40/gb.png';
                        else e.target.src = 'https://flagcdn.com/w40/un.png';
                      }}
                    />
                    <span style={{ fontSize: '0.72rem' }}>{semi1Loser.name[lang]}</span>
                  </div>
                )}
                {semi2Loser && (
                  <div className="share-card-semi-team" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <img 
                      src={`https://flagcdn.com/w40/${semi2Loser.flag.toLowerCase()}.png`} 
                      alt={semi2Loser.name[lang]} 
                      className="flag-img"
                      crossOrigin="anonymous"
                      style={{ width: '16px', height: '11px' }}
                      onError={(e) => {
                        if (semi2Loser.flag === 'gb-eng') e.target.src = 'https://flagcdn.com/w40/gb.png';
                        else if (semi2Loser.flag === 'gb-wls') e.target.src = 'https://flagcdn.com/w40/gb.png';
                        else if (semi2Loser.flag === 'gb-sct') e.target.src = 'https://flagcdn.com/w40/gb.png';
                        else e.target.src = 'https://flagcdn.com/w40/un.png';
                      }}
                    />
                    <span style={{ fontSize: '0.72rem' }}>{semi2Loser.name[lang]}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* TOURNAMENT BRACKET TREE */}
          <div className="share-card-tree-section">
            <div className="share-card-section-title" style={{ marginBottom: '20px' }}>
              {selectedRound === 'r32'
                ? t('bracketTitleR32')
                : selectedRound === 'r16'
                ? t('bracketTitleR16')
                : t('bracketTitleQF')
              }
            </div>
            
            <div 
              className="share-card-tree-container"
              style={{
                height: selectedRound === 'r32' ? '540px' : selectedRound === 'r16' ? '360px' : '260px'
              }}
            >
              {/* COLUMN 1: LEFT R32 (IF SELECTED) */}
              {selectedRound === 'r32' && (
                <div className="tree-column">
                  {r32Matches.slice(0, 8).map((m) => renderTreeMatch(m, m.id, 'left'))}
                </div>
              )}

              {/* COLUMN 2: LEFT R16 (IF NOT QF) */}
              {selectedRound !== 'qf' && (
                <div className="tree-column">
                  {r16Matches.slice(0, 4).map((m) => renderTreeMatch(m, m.id, 'left'))}
                </div>
              )}

              {/* COLUMN 3: LEFT QUARTERFINALS */}
              <div className="tree-column">
                {qfMatches.slice(0, 2).map((m) => renderTreeMatch(m, m.id, 'left'))}
              </div>

              {/* COLUMN 4: LEFT SEMIFINALS */}
              <div className="tree-column">
                {renderTreeMatch(sfMatches[0], 'SF_1', 'left')}
              </div>

              {/* COLUMN 5: CENTER (FINAL & CHAMPION) */}
              <div className="tree-column center-column">
                {champion && (
                  <div className="tree-champ-display">
                    <div className="tree-champ-crown">🏆</div>
                    <div className="tree-champ-box">
                      <img 
                        src={`https://flagcdn.com/w40/${champion.flag.toLowerCase()}.png`} 
                        alt={champion.name[lang]} 
                        className="tree-flag-champ"
                        crossOrigin="anonymous"
                        onError={(e) => {
                          if (champion.flag === 'gb-eng') e.target.src = 'https://flagcdn.com/w40/gb.png';
                          else if (champion.flag === 'gb-wls') e.target.src = 'https://flagcdn.com/w40/gb.png';
                          else if (champion.flag === 'gb-sct') e.target.src = 'https://flagcdn.com/w40/gb.png';
                          else e.target.src = 'https://flagcdn.com/w40/un.png';
                        }}
                      />
                      <span className="tree-champ-code">{getTeamCode(champion)}</span>
                    </div>
                  </div>
                )}

                {renderTreeMatch(finalMatch, 'F_1', 'center')}
              </div>

              {/* COLUMN 6: RIGHT SEMIFINALS */}
              <div className="tree-column">
                {renderTreeMatch(sfMatches[1], 'SF_2', 'right')}
              </div>

              {/* COLUMN 7: RIGHT QUARTERFINALS */}
              <div className="tree-column">
                {qfMatches.slice(2, 4).map((m) => renderTreeMatch(m, m.id, 'right'))}
              </div>

              {/* COLUMN 8: RIGHT R16 (IF NOT QF) */}
              {selectedRound !== 'qf' && (
                <div className="tree-column">
                  {r16Matches.slice(4, 8).map((m) => renderTreeMatch(m, m.id, 'right'))}
                </div>
              )}

              {/* COLUMN 9: RIGHT R32 (IF SELECTED) */}
              {selectedRound === 'r32' && (
                <div className="tree-column">
                  {r32Matches.slice(8, 16).map((m) => renderTreeMatch(m, m.id, 'right'))}
                </div>
              )}
            </div>
          </div>

          {/* FOOTER DISCLAIMER */}
          <div className="share-card-footer">
            <p style={{ fontWeight: '600', color: 'var(--color-primary)' }}>worldcuptree.com</p>
            <p style={{ fontSize: '0.55rem', opacity: 0.5, marginTop: '4px' }}>
              Unofficial fan-made World Cup prediction card.
            </p>
          </div>
        </div>
      </div>

      {/* DOWNLOAD CTA */}
      <div style={{ marginTop: '24px' }}>
        <button 
          className="btn-primary flex-center gap-2" 
          onClick={downloadCard}
          disabled={loading}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 32px' }}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              <span>{lang === 'tr' ? 'Hazırlanıyor...' : 'Generating...'}</span>
            </>
          ) : (
            <>
              <Download size={18} />
              <span>{t('downloadBtn')}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
