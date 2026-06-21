import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getRoundOf32Matchups } from '../utils/matching';
import { Trophy, Star, Info } from 'lucide-react';

export default function KnockoutBracket({ 
  standings, 
  selectedThirdPlaces, 
  predictions, 
  setPredictions,
  activeTab: externalActiveTab,
  setActiveTab: externalSetActiveTab,
  onOpenSquad
}) {
  const { lang, t } = useLanguage();
  const [localActiveTab, setLocalActiveTab] = useState('r32'); // For mobile view fallback
  const activeTab = externalActiveTab !== undefined ? externalActiveTab : localActiveTab;
  const setActiveTab = externalSetActiveTab !== undefined ? externalSetActiveTab : setLocalActiveTab;
  const [highlightTeamId, setHighlightTeamId] = useState(null);

  const r32Matches = getRoundOf32Matchups(standings, selectedThirdPlaces);

  // Helper to get team from match winner
  const getMatchWinner = (matchId, sourceMatches) => {
    const winnerId = predictions[matchId];
    if (!winnerId) return null;

    // Find the team in the source matches
    const match = sourceMatches.find(m => m.id === matchId);
    if (!match) return null;

    if (match.home && match.home.id === winnerId) return match.home;
    if (match.away && match.away.id === winnerId) return match.away;
    return null;
  };

  // Build the matches dynamically for subsequent rounds
  const getR16Matches = () => {
    return [
      { id: 'R16_1', home: getMatchWinner('R32_1', r32Matches), away: getMatchWinner('R32_2', r32Matches), labelEn: 'Match 17', labelTr: 'Maç 17', labelDe: 'Spiel 17' },
      { id: 'R16_2', home: getMatchWinner('R32_3', r32Matches), away: getMatchWinner('R32_4', r32Matches), labelEn: 'Match 18', labelTr: 'Maç 18', labelDe: 'Spiel 18' },
      { id: 'R16_3', home: getMatchWinner('R32_5', r32Matches), away: getMatchWinner('R32_6', r32Matches), labelEn: 'Match 19', labelTr: 'Maç 19', labelDe: 'Spiel 19' },
      { id: 'R16_4', home: getMatchWinner('R32_7', r32Matches), away: getMatchWinner('R32_8', r32Matches), labelEn: 'Match 20', labelTr: 'Maç 20', labelDe: 'Spiel 20' },
      { id: 'R16_5', home: getMatchWinner('R32_9', r32Matches), away: getMatchWinner('R32_10', r32Matches), labelEn: 'Match 21', labelTr: 'Maç 21', labelDe: 'Spiel 21' },
      { id: 'R16_6', home: getMatchWinner('R32_11', r32Matches), away: getMatchWinner('R32_12', r32Matches), labelEn: 'Match 22', labelTr: 'Maç 22', labelDe: 'Spiel 22' },
      { id: 'R16_7', home: getMatchWinner('R32_13', r32Matches), away: getMatchWinner('R32_14', r32Matches), labelEn: 'Match 23', labelTr: 'Maç 23', labelDe: 'Spiel 23' },
      { id: 'R16_8', home: getMatchWinner('R32_15', r32Matches), away: getMatchWinner('R32_16', r32Matches), labelEn: 'Match 24', labelTr: 'Maç 24', labelDe: 'Spiel 24' }
    ];
  };
 
  const r16Matches = getR16Matches();
 
  const getQFMatches = () => {
    return [
      { id: 'QF_1', home: getMatchWinner('R16_1', r16Matches), away: getMatchWinner('R16_2', r16Matches), labelEn: 'Quarterfinal 1', labelTr: 'Çeyrek Final 1', labelDe: 'Viertelfinale 1' },
      { id: 'QF_2', home: getMatchWinner('R16_3', r16Matches), away: getMatchWinner('R16_4', r16Matches), labelEn: 'Quarterfinal 2', labelTr: 'Çeyrek Final 2', labelDe: 'Viertelfinale 2' },
      { id: 'QF_3', home: getMatchWinner('R16_5', r16Matches), away: getMatchWinner('R16_6', r16Matches), labelEn: 'Quarterfinal 3', labelTr: 'Çeyrek Final 3', labelDe: 'Viertelfinale 3' },
      { id: 'QF_4', home: getMatchWinner('R16_7', r16Matches), away: getMatchWinner('R16_8', r16Matches), labelEn: 'Quarterfinal 4', labelTr: 'Çeyrek Final 4', labelDe: 'Viertelfinale 4' }
    ];
  };
 
  const qfMatches = getQFMatches();
 
  const getSFMatches = () => {
    return [
      { id: 'SF_1', home: getMatchWinner('QF_1', qfMatches), away: getMatchWinner('QF_2', qfMatches), labelEn: 'Semifinal 1', labelTr: 'Yarı Final 1', labelDe: 'Halbfinale 1' },
      { id: 'SF_2', home: getMatchWinner('QF_3', qfMatches), away: getMatchWinner('QF_4', qfMatches), labelEn: 'Semifinal 2', labelTr: 'Yarı Final 2', labelDe: 'Halbfinale 2' }
    ];
  };
 
  const sfMatches = getSFMatches();
 
  const getFinalMatch = () => {
    return {
      id: 'F_1',
      home: getMatchWinner('SF_1', sfMatches),
      away: getMatchWinner('SF_2', sfMatches),
      labelEn: 'Final',
      labelTr: 'Final',
      labelDe: 'Finale'
    };
  };

  const finalMatch = getFinalMatch();
  const champion = predictions['F_1'] ? (finalMatch.home?.id === predictions['F_1'] ? finalMatch.home : finalMatch.away) : null;

  // Clean up predictions when a team changes in a lower round
  useEffect(() => {
    const allMatches = [...r32Matches, ...r16Matches, ...qfMatches, ...sfMatches, finalMatch];
    const newPredictions = { ...predictions };
    let changed = false;

    // Check if the winner of any match is still valid (must be home or away team)
    Object.keys(newPredictions).forEach(matchId => {
      const match = allMatches.find(m => m.id === matchId);
      if (match) {
        const winnerId = newPredictions[matchId];
        const homeId = match.home?.id;
        const awayId = match.away?.id;

        if (winnerId && winnerId !== homeId && winnerId !== awayId) {
          delete newPredictions[matchId];
          changed = true;
        }
      }
    });

    if (changed) {
      setPredictions(newPredictions);
    }
  }, [standings, selectedThirdPlaces, predictions]);

  const containerRef = React.useRef(null);
  const [svgPaths, setSvgPaths] = useState([]);

  const scrollToSection = (section) => {
    const container = containerRef.current;
    if (!container) return;
    
    if (section === 'left') {
      container.scrollTo({ left: 0, behavior: 'smooth' });
    } else if (section === 'center') {
      const centerScroll = (container.scrollWidth - container.clientWidth) / 2;
      container.scrollTo({ left: centerScroll, behavior: 'smooth' });
    } else if (section === 'right') {
      container.scrollTo({ left: container.scrollWidth - container.clientWidth, behavior: 'smooth' });
    }
  };

  const selectWinner = (matchId, team) => {
    if (!team || team.isPlaceholder) return;
    
    setPredictions({
      ...predictions,
      [matchId]: team.id
    });
    
    // Highlight this team's path
    setHighlightTeamId(team.id);
  };

  useEffect(() => {
    const calculatePaths = () => {
      const container = containerRef.current;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const newPaths = [];

      const leftWing = [
        { sources: ['R32_1', 'R32_2'], target: 'R16_1' },
        { sources: ['R32_3', 'R32_4'], target: 'R16_2' },
        { sources: ['R32_5', 'R32_6'], target: 'R16_3' },
        { sources: ['R32_7', 'R32_8'], target: 'R16_4' },
        { sources: ['R16_1', 'R16_2'], target: 'QF_1' },
        { sources: ['R16_3', 'R16_4'], target: 'QF_2' },
        { sources: ['QF_1', 'QF_2'], target: 'SF_1' },
      ];

      const rightWing = [
        { sources: ['R32_9', 'R32_10'], target: 'R16_5' },
        { sources: ['R32_11', 'R32_12'], target: 'R16_6' },
        { sources: ['R32_13', 'R32_14'], target: 'R16_7' },
        { sources: ['R32_15', 'R32_16'], target: 'R16_8' },
        { sources: ['R16_5', 'R16_6'], target: 'QF_3' },
        { sources: ['R16_7', 'R16_8'], target: 'QF_4' },
        { sources: ['QF_3', 'QF_4'], target: 'SF_2' },
      ];

      const finalConns = [
        { source: 'SF_1', target: 'F_1', side: 'left' },
        { source: 'SF_2', target: 'F_1', side: 'right' },
      ];

      const getCardConnectionPoint = (id, side) => {
        const el = document.getElementById(`match-card-${id}`);
        if (!el) return null;
        const rect = el.getBoundingClientRect();
        const y = rect.top + rect.height / 2 - containerRect.top;
        const x = side === 'left' 
          ? rect.left - containerRect.left 
          : rect.right - containerRect.left;
        return { x, y };
      };

      // Process left wing
      leftWing.forEach(({ sources, target }) => {
        const targetPt = getCardConnectionPoint(target, 'left');
        if (!targetPt) return;

        sources.forEach(source => {
          const sourcePt = getCardConnectionPoint(source, 'right');
          if (!sourcePt) return;

          const xm = sourcePt.x + (targetPt.x - sourcePt.x) * 0.5;
          const d = `M ${sourcePt.x} ${sourcePt.y} H ${xm} V ${targetPt.y} H ${targetPt.x}`;

          newPaths.push({
            id: `${source}-${target}`,
            d,
            source,
            target,
            wing: 'left'
          });
        });
      });

      // Process right wing
      rightWing.forEach(({ sources, target }) => {
        const targetPt = getCardConnectionPoint(target, 'right');
        if (!targetPt) return;

        sources.forEach(source => {
          const sourcePt = getCardConnectionPoint(source, 'left');
          if (!sourcePt) return;

          const xm = sourcePt.x - (sourcePt.x - targetPt.x) * 0.5;
          const d = `M ${sourcePt.x} ${sourcePt.y} H ${xm} V ${targetPt.y} H ${targetPt.x}`;

          newPaths.push({
            id: `${source}-${target}`,
            d,
            source,
            target,
            wing: 'right'
          });
        });
      });

      // Process final connections
      finalConns.forEach(({ source, target, side }) => {
        const sourcePt = getCardConnectionPoint(source, side === 'left' ? 'right' : 'left');
        const targetPt = getCardConnectionPoint(target, side === 'left' ? 'left' : 'right');
        if (sourcePt && targetPt) {
          const xm = side === 'left'
            ? sourcePt.x + (targetPt.x - sourcePt.x) * 0.5
            : sourcePt.x - (sourcePt.x - targetPt.x) * 0.5;
          const d = `M ${sourcePt.x} ${sourcePt.y} H ${xm} V ${targetPt.y} H ${targetPt.x}`;

          newPaths.push({
            id: `${source}-${target}`,
            d,
            source,
            target,
            wing: side
          });
        }
      });

      setSvgPaths(newPaths);
    };

    // Calculate immediately and on multiple timeouts to handle CSS loading / layout settling
    calculatePaths();
    const t1 = setTimeout(calculatePaths, 50);
    const t2 = setTimeout(calculatePaths, 150);
    const t3 = setTimeout(calculatePaths, 500);
    const t4 = setTimeout(calculatePaths, 1000);

    window.addEventListener('resize', calculatePaths);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      window.removeEventListener('resize', calculatePaths);
    };
  }, [predictions, highlightTeamId, standings, selectedThirdPlaces]);

  // Render a match card
  const renderMatch = (match, listName) => {
    const winnerId = predictions[match.id];
    const isHomeSelected = match.home && winnerId === match.home.id;
    const isAwaySelected = match.away && winnerId === match.away.id;
    const isDesktop = !listName.startsWith('mob');
    const cardId = isDesktop ? `match-card-${match.id}` : `match-card-mob-${match.id}`;

    const getTeamClass = (team, isSelected) => {
      if (!team) return '';
      let classes = 'match-team ';
      if (isSelected) classes += 'selected ';
      if (winnerId && !isSelected) classes += 'eliminated ';
      if (highlightTeamId === team.id) classes += 'our-path-highlight ';
      return classes;
    };

    const renderTeamRow = (team, isSelected, role) => {
      if (!team) {
        return (
          <div className="match-team placeholder opacity-50">
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {role === 'home' ? 'TBD' : 'TBD'}
            </span>
          </div>
        );
      }

      return (
        <div 
          className={getTeamClass(team, isSelected)} 
          onClick={() => selectWinner(match.id, team)}
          style={{ cursor: 'pointer' }}
        >
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              flexGrow: 1, 
              minWidth: 0
            }}
          >
            <img 
              src={`https://flagcdn.com/w40/${team.flag.toLowerCase()}.png`} 
              alt={team.name[lang]} 
              className="flag-img"
              onError={(e) => {
                if (team.flag === 'gb-eng') e.target.src = 'https://flagcdn.com/w40/gb.png';
                else if (team.flag === 'gb-wls') e.target.src = 'https://flagcdn.com/w40/gb.png';
                else if (team.flag === 'gb-sct') e.target.src = 'https://flagcdn.com/w40/gb.png';
                else e.target.src = 'https://flagcdn.com/w40/un.png';
              }}
            />
            <span className="match-team-name">{team.name[lang]}</span>
            
            <button
              className="squad-info-trigger-btn"
              onClick={(e) => {
                e.stopPropagation();
                onOpenSquad(team);
              }}
              title={t('squadAndMarketValues')}
              style={{
                background: 'transparent',
                border: 'none',
                padding: '2px 4px',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted)',
                opacity: 0.6,
                transition: 'all 0.2s ease',
                marginLeft: '4px',
                flexShrink: 0
              }}
            >
              <Info size={11} className="squad-info-icon" />
            </button>
          </div>
          {isSelected && <Star size={12} fill="var(--color-primary)" color="var(--color-primary)" style={{ marginLeft: '6px', flexShrink: 0 }} />}
        </div>
      );
    };

    return (
      <div key={match.id} className="match-card" id={cardId}>
        <div className="match-info-label">
          {lang === 'tr' ? match.labelTr : (lang === 'de' ? match.labelDe : match.labelEn)}
        </div>
        {renderTeamRow(match.home, isHomeSelected, 'home')}
        {renderTeamRow(match.away, isAwaySelected, 'away')}
      </div>
    );
  };

  // Divide matches for 2-wing layout on desktop
  const leftR32 = r32Matches.slice(0, 8);
  const rightR32 = r32Matches.slice(8, 16);

  const leftR16 = r16Matches.slice(0, 4);
  const rightR16 = r16Matches.slice(4, 8);

  const leftQF = qfMatches.slice(0, 2);
  const rightQF = qfMatches.slice(2, 4);

  const leftSF = [sfMatches[0]];
  const rightSF = [sfMatches[1]];

  return (
    <div className="knockout-stage-container">
      <div style={{ marginBottom: '24px', textAlign: 'center' }}>
        <h2 className="step-title" style={{ fontSize: '1.75rem', marginBottom: '8px' }}>
          {t('bracketTitle')}
        </h2>
        <p className="step-desc" style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          {t('bracketDesc')}
        </p>

        {/* Local mod: "Bizim Yol" Mode Button */}
        <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
          <button 
            className="lang-btn" 
            style={{ 
              borderColor: highlightTeamId === 'turkey' ? 'var(--color-secondary)' : 'var(--border-card)',
              background: highlightTeamId === 'turkey' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(255,255,255,0.05)'
            }}
            onClick={() => {
              // Toggle Turkey path highlight
              setHighlightTeamId(highlightTeamId === 'turkey' ? null : 'turkey');
            }}
          >
            🇹🇷 {t('ourPathMode')}
          </button>

          {/* Mobile Bracket Navigation Buttons */}
          <div className="mobile-bracket-navigator">
            <button className="mobile-nav-btn" onClick={() => scrollToSection('left')}>
              ⬅️ {t('leftSide')}
            </button>
            <button className="mobile-nav-btn" onClick={() => scrollToSection('center')}>
              🏆 {t('finalTitle')}
            </button>
            <button className="mobile-nav-btn" onClick={() => scrollToSection('right')}>
              {t('rightSide')} ➡️
            </button>
          </div>
        </div>

        {/* Mobile Swipe Info Badge */}
        <div className="mobile-scroll-helper" style={{ marginTop: '16px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-secondary)', display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '30px', background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.2)', fontWeight: '600' }}>
            👉 {t('swipeMessage')} ➔
          </span>
        </div>
      </div>

      {/* DESKTOP BRACKET LAYOUT */}
      <div className="bracket-wrapper" ref={containerRef}>
        <div className="bracket-desktop" style={{ position: 'relative' }}>
          {/* Dynamic SVG Connections Overlay */}
          <svg className="bracket-svg-overlay">
            {svgPaths.map(path => {
              let pathClass = 'bracket-line';
              const sourceWinnerId = predictions[path.source];
              const targetWinnerId = predictions[path.target];
              const sourceMatchObj = [...r32Matches, ...r16Matches, ...qfMatches, ...sfMatches, finalMatch].find(m => m.id === path.source);
              
              const isHighlightPath = highlightTeamId && (
                sourceWinnerId === highlightTeamId ||
                (path.source.startsWith('R32_') && sourceMatchObj && (
                  sourceMatchObj.home?.id === highlightTeamId || 
                  sourceMatchObj.away?.id === highlightTeamId
                ))
              );

              if (isHighlightPath) {
                pathClass += ' our-path';
              } else if (targetWinnerId) {
                if (targetWinnerId === sourceWinnerId) {
                  pathClass += ' active';
                } else {
                  pathClass += ' eliminated';
                }
              } else if (sourceWinnerId) {
                pathClass += ' active';
              }

              return (
                <path 
                  key={path.id} 
                  d={path.d} 
                  className={pathClass} 
                />
              );
            })}
          </svg>

          {/* Left Wing R32 */}
          <div className="bracket-column">
            <div className="column-title">{t('roundOf32')}</div>
            {leftR32.map(m => renderMatch(m, 'leftR32'))}
          </div>

          {/* Left Wing R16 */}
          <div className="bracket-column">
            <div className="column-title">{t('roundOf16')}</div>
            {leftR16.map(m => renderMatch(m, 'leftR16'))}
          </div>

          {/* Left Wing QF */}
          <div className="bracket-column">
            <div className="column-title">{t('quarterFinals')}</div>
            {leftQF.map(m => renderMatch(m, 'leftQF'))}
          </div>

          {/* Left Wing SF */}
          <div className="bracket-column">
            <div className="column-title">{t('semiFinals')}</div>
            {leftSF.map(m => renderMatch(m, 'leftSF'))}
          </div>

          {/* Center: Final and Champion */}
          <div className="bracket-column" style={{ justifyContent: 'center', gap: '30px' }}>
            <div className="column-title">{t('final')}</div>
            
            {/* Final Match Card */}
            <div style={{ maxWidth: '240px', margin: '0 auto', width: '100%' }}>
              {renderMatch(finalMatch, 'final')}
            </div>

            {/* Champion Display Box */}
            {champion && (
              <div className="champion-container">
                <div className="trophy-glow">🏆</div>
                <div className="share-card-champ-title">{t('championText')}</div>
                <div className="champion-display-box">
                  <img 
                    src={`https://flagcdn.com/w40/${champion.flag.toLowerCase()}.png`} 
                    alt={champion.name[lang]} 
                    className="flag-img"
                    style={{ width: '30px', height: '20px' }}
                    onError={(e) => {
                      if (champion.flag === 'gb-eng') e.target.src = 'https://flagcdn.com/w40/gb.png';
                      else if (champion.flag === 'gb-wls') e.target.src = 'https://flagcdn.com/w40/gb.png';
                      else if (champion.flag === 'gb-sct') e.target.src = 'https://flagcdn.com/w40/gb.png';
                      else e.target.src = 'https://flagcdn.com/w40/un.png';
                    }}
                  />
                  <span className="champion-display-name">{champion.name[lang]}</span>
                </div>
              </div>
            )}
          </div>

          {/* Right Wing SF */}
          <div className="bracket-column">
            <div className="column-title">{t('semiFinals')}</div>
            {rightSF.map(m => renderMatch(m, 'rightSF'))}
          </div>

          {/* Right Wing QF */}
          <div className="bracket-column">
            <div className="column-title">{t('quarterFinals')}</div>
            {rightQF.map(m => renderMatch(m, 'rightQF'))}
          </div>

          {/* Right Wing R16 */}
          <div className="bracket-column">
            <div className="column-title">{t('roundOf16')}</div>
            {rightR16.map(m => renderMatch(m, 'rightR16'))}
          </div>

          {/* Right Wing R32 */}
          <div className="bracket-column">
            <div className="column-title">{t('roundOf32')}</div>
            {rightR32.map(m => renderMatch(m, 'rightR32'))}
          </div>
        </div>
      </div>

      {/* MOBILE BRACKET LAYOUT */}
      <div className="mobile-bracket-tabs">
        <button 
          className={`mobile-tab-btn ${activeTab === 'r32' ? 'active' : ''}`}
          onClick={() => setActiveTab('r32')}
        >
          {t('roundOf32')}
        </button>
        <button 
          className={`mobile-tab-btn ${activeTab === 'r16' ? 'active' : ''}`}
          onClick={() => setActiveTab('r16')}
        >
          {t('roundOf16')}
        </button>
        <button 
          className={`mobile-tab-btn ${activeTab === 'qf' ? 'active' : ''}`}
          onClick={() => setActiveTab('qf')}
        >
          {t('quarterFinals')}
        </button>
        <button 
          className={`mobile-tab-btn ${activeTab === 'sf_f' ? 'active' : ''}`}
          onClick={() => setActiveTab('sf_f')}
        >
          {t('final')}
        </button>
      </div>

      <div className="bracket-mobile-list">
        {activeTab === 'r32' && r32Matches.map(m => renderMatch(m, 'mobR32'))}
        {activeTab === 'r16' && r16Matches.map(m => renderMatch(m, 'mobR16'))}
        {activeTab === 'qf' && qfMatches.map(m => renderMatch(m, 'mobQF'))}
        {activeTab === 'sf_f' && (
          <>
            {sfMatches.map(m => renderMatch(m, 'mobSF'))}
            <div style={{ height: '20px' }}></div>
            {renderMatch(finalMatch, 'mobF')}
            {champion && (
              <div className="champion-container" style={{ marginTop: '20px' }}>
                <div className="trophy-glow">🏆</div>
                <div className="share-card-champ-title">{t('championText')}</div>
                <div className="champion-display-box">
                  <img 
                    src={`https://flagcdn.com/w40/${champion.flag.toLowerCase()}.png`} 
                    alt={champion.name[lang]} 
                    className="flag-img"
                    onError={(e) => {
                      if (champion.flag === 'gb-eng') e.target.src = 'https://flagcdn.com/w40/gb.png';
                      else if (champion.flag === 'gb-wls') e.target.src = 'https://flagcdn.com/w40/gb.png';
                      else if (champion.flag === 'gb-sct') e.target.src = 'https://flagcdn.com/w40/gb.png';
                      else e.target.src = 'https://flagcdn.com/w40/un.png';
                    }}
                  />
                  <span className="champion-display-name">{champion.name[lang]}</span>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
