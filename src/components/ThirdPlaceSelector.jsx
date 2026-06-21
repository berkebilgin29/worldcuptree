import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Check, Info } from 'lucide-react';
import { getTeamLiveStats, getSortedInitialGroups } from '../data/realStandings';
import teamsData from '../data/teams.json';

export default function ThirdPlaceSelector({ standings, selectedThirdPlaces, setSelectedThirdPlaces, onOpenSquad }) {
  const { lang, t } = useLanguage();

  const isGroupModified = (groupLetter) => {
    const current = standings[groupLetter];
    const initial = getSortedInitialGroups()[groupLetter];
    if (!current || !initial) return false;
    return current.some((team, idx) => team.id !== initial[idx].id);
  };

  // Get the 12 third-placed teams from standings with their live stats
  const thirdPlaceTeams = Object.keys(standings).map((groupLetter) => {
    // 3rd place is index 2
    const team = standings[groupLetter][2];
    const stats = getTeamLiveStats(groupLetter, team.id, 2, isGroupModified(groupLetter));
    return {
      group: groupLetter,
      team: team,
      stats: stats
    };
  });

  // Sort third-place teams based on stats (P desc, AV desc, AG desc)
  const sortedThirdPlaces = [...thirdPlaceTeams].sort((a, b) => {
    if (b.stats.P !== a.stats.P) return b.stats.P - a.stats.P;
    if (b.stats.AV !== a.stats.AV) return b.stats.AV - a.stats.AV;
    return b.stats.AG - a.stats.AG;
  });

  const toggleSelect = (groupLetter) => {
    if (selectedThirdPlaces.includes(groupLetter)) {
      setSelectedThirdPlaces(selectedThirdPlaces.filter((g) => g !== groupLetter));
    } else {
      if (selectedThirdPlaces.length < 8) {
        setSelectedThirdPlaces([...selectedThirdPlaces, groupLetter]);
      } else {
        // Option: if already 8, remove the first one and add new one
        setSelectedThirdPlaces([...selectedThirdPlaces.slice(1), groupLetter]);
      }
    }
  };

  return (
    <div className="third-place-container glass-panel">
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <h2 className="step-title" style={{ fontSize: '1.75rem', marginBottom: '8px' }}>
          {t('thirdPlaceTitle')}
        </h2>
        <p className="step-desc" style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '600px', margin: '0 auto 16px auto', lineHeight: '1.5' }}>
          {t('thirdPlaceDesc')}
        </p>
        
        {/* Progress Tracker */}
        <div style={{ display: 'inline-block', padding: '8px 20px', borderRadius: '20px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-card)', marginTop: '8px' }}>
          <span style={{ fontWeight: '800', fontSize: '1.2rem', color: selectedThirdPlaces.length === 8 ? 'var(--color-primary)' : 'var(--color-secondary)' }}>
            {selectedThirdPlaces.length} / 8
          </span>
          <span style={{ marginLeft: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {t('selectedText')}
          </span>
        </div>
      </div>

      <div className="third-place-list">
        {/* Table Header */}
        <div className="group-table-header third-place-table-header" style={{ marginBottom: '8px', padding: '10px 16px' }}>
          <span className="col-rank">#</span>
          <span className="col-group" style={{ fontSize: '0.75rem' }}>{lang === 'tr' ? 'Grup' : (lang === 'de' ? 'Gruppe' : 'Group')}</span>
          <span className="col-team" style={{ fontSize: '0.75rem' }}>{t('teamCol')}</span>
          <span className="col-stat" title={t('playedTooltip')}>{t('playedCol')}</span>
          <span className="col-stat" title={t('wonTooltip')}>{t('wonCol')}</span>
          <span className="col-stat" title={t('drawnTooltip')}>{t('drawnCol')}</span>
          <span className="col-stat" title={t('lostTooltip')}>{t('lostCol')}</span>
          <span className="col-stat" title={t('gdTooltip')}>{t('gdCol')}</span>
          <span className="col-stat" title={t('pointsTooltip')}>{t('pointsCol')}</span>
          <span className="col-select-header" style={{ fontSize: '0.75rem', textAlign: 'center' }}>{lang === 'tr' ? 'Seç' : (lang === 'de' ? 'Wählen' : 'Select')}</span>
        </div>

        {sortedThirdPlaces.map(({ group, team, stats }, idx) => {
          const isSelected = selectedThirdPlaces.includes(group);
          const isQualifiedZone = idx < 8; // Top 8 are in qualified zone
          
          return (
            <div 
              key={group} 
              className={`third-place-item ${isSelected ? 'selected' : ''} ${isQualifiedZone ? 'qualified-row' : 'eliminated-row'} table-layout-row`}
              onClick={() => toggleSelect(group)}
              style={{ padding: '10px 16px' }}
            >
              <span className="col-rank" style={{ color: isQualifiedZone ? 'var(--color-primary)' : 'var(--text-muted)', fontWeight: isQualifiedZone ? '800' : '500' }}>
                {idx + 1}
              </span>
              <span className="col-group" style={{ fontWeight: '700', fontSize: '0.85rem' }}>{group}3</span>
              <div
                className="col-team"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}
              >
                <img 
                  src={`https://flagcdn.com/w40/${team.flag.toLowerCase()}.png`} 
                  alt={team.name[lang] || team.name.en} 
                  className="flag-img"
                  onError={(e) => {
                    if (team.flag === 'gb-eng') e.target.src = 'https://flagcdn.com/w40/gb.png';
                    else if (team.flag === 'gb-wls') e.target.src = 'https://flagcdn.com/w40/gb.png';
                    else if (team.flag === 'gb-sct') e.target.src = 'https://flagcdn.com/w40/gb.png';
                    else e.target.src = 'https://flagcdn.com/w40/un.png';
                  }}
                />
                <span className="team-name" style={{ fontSize: '0.85rem' }}>{team.name[lang] || team.name.en}</span>
                
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
                    flexShrink: 0
                  }}
                >
                  <Info size={11} className="squad-info-icon" />
                </button>
              </div>
              <span className="col-stat">{stats.O}</span>
              <span className="col-stat">{stats.G}</span>
              <span className="col-stat">{stats.B}</span>
              <span className="col-stat">{stats.M}</span>
              <span className="col-stat" style={{ color: stats.AV > 0 ? '#00e676' : stats.AV < 0 ? '#ff1744' : 'var(--text-muted)' }}>
                {stats.AV > 0 ? `+${stats.AV}` : stats.AV}
              </span>
              <span className="col-stat value-glowing" style={{ fontWeight: '700' }}>{stats.P}</span>
              <div className="checkbox-indicator col-select">
                {isSelected && <Check size={12} strokeWidth={3} />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
