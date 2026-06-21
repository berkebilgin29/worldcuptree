import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ChevronUp, ChevronDown, List, TableProperties } from 'lucide-react';
import { getTeamLiveStats, getSortedInitialGroups } from '../data/realStandings';
import teamsData from '../data/teams.json';

export default function GroupStage({ standings, setStandings, onOpenSquad }) {
  const { lang, t } = useLanguage();
  const [viewMode, setViewMode] = useState('list'); // 'table' or 'list'

  const isGroupModified = (groupLetter) => {
    const current = standings[groupLetter];
    const initial = getSortedInitialGroups()[groupLetter];
    if (!current || !initial) return false;
    return current.some((team, idx) => team.id !== initial[idx].id);
  };

  const moveTeam = (groupLetter, index, direction) => {
    const groupTeams = [...standings[groupLetter]];
    const targetIndex = index + direction;

    // Boundary check
    if (targetIndex < 0 || targetIndex >= groupTeams.length) return;

    // Swap
    const temp = groupTeams[index];
    groupTeams[index] = groupTeams[targetIndex];
    groupTeams[targetIndex] = temp;

    setStandings({
      ...standings,
      [groupLetter]: groupTeams
    });
  };

  return (
    <div className="group-stage-container">
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 className="step-title" style={{ fontSize: '1.75rem', marginBottom: '8px' }}>
            {t('groupStageTitle')}
          </h2>
          <p className="step-desc" style={{ color: 'var(--text-muted)', lineHeight: '1.5', maxWidth: '600px' }}>
            {t('groupStageDesc')}
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="share-round-selector" style={{ margin: 0, padding: '3px' }}>
          <button 
            className={`selector-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', padding: '6px 14px' }}
          >
            <List size={13} />
            <span>{t('listView')}</span>
          </button>
          <button 
            className={`selector-btn ${viewMode === 'table' ? 'active' : ''}`}
            onClick={() => setViewMode('table')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', padding: '6px 14px' }}
          >
            <TableProperties size={13} />
            <span>{t('liveStandings')}</span>
          </button>
        </div>
      </div>

      <div className="groups-grid">
        {Object.keys(standings).map((groupLetter) => (
          <div key={groupLetter} className="group-card glass-panel">
            <div className="group-header">
              <span className="group-name">GROUP {groupLetter}</span>
              <span className="group-sub" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                {lang === 'tr' ? 'GRUP' : (lang === 'de' ? 'GRUPPE' : 'GROUP')} {groupLetter}
              </span>
            </div>

            {viewMode === 'table' ? (
              /* DETAILED TABLE VIEW */
              <div className="group-team-list">
                <div className="group-table-header">
                  <span className="col-rank">#</span>
                  <span className="col-team">{t('teamCol')}</span>
                  <span className="col-stat" title={t('playedTooltip')}>{t('playedCol')}</span>
                  <span className="col-stat" title={t('wonTooltip')}>{t('wonCol')}</span>
                  <span className="col-stat" title={t('drawnTooltip')}>{t('drawnCol')}</span>
                  <span className="col-stat" title={t('lostTooltip')}>{t('lostCol')}</span>
                  <span className="col-stat" title={t('gdTooltip')}>{t('gdCol')}</span>
                  <span className="col-stat" title={t('pointsTooltip')}>{t('pointsCol')}</span>
                  <span className="col-actions"></span>
                </div>

                {standings[groupLetter].map((team, idx) => {
                  const rankClass = idx === 0 ? 'rank-1' : idx === 1 ? 'rank-2' : idx === 2 ? 'rank-3' : 'rank-4';
                  const stats = getTeamLiveStats(groupLetter, team.id, idx, isGroupModified(groupLetter));
                  return (
                    <div key={team.id} className={`team-row ${rankClass} table-layout`}>
                      <span className="col-rank">{idx + 1}</span>
                      <div 
                        className="col-team team-row-clickable" 
                        onClick={() => onOpenSquad(team)}
                        title={t('viewSquadTooltip')}
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
                        <span className="team-name" style={{ fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{team.name[lang] || team.name.en}</span>
                      </div>
                      <span className="col-stat">{stats.O}</span>
                      <span className="col-stat">{stats.G}</span>
                      <span className="col-stat">{stats.B}</span>
                      <span className="col-stat">{stats.M}</span>
                      <span className="col-stat" style={{ color: stats.AV > 0 ? '#00e676' : stats.AV < 0 ? '#ff1744' : 'var(--text-muted)' }}>
                        {stats.AV > 0 ? `+${stats.AV}` : stats.AV}
                      </span>
                      <span className="col-stat value-glowing" style={{ fontWeight: '700' }}>{stats.P}</span>
                      <div className="col-actions team-controls" style={{ gap: '2px' }}>
                        {idx > 0 && (
                          <button 
                            className="arrow-btn" 
                            onClick={() => moveTeam(groupLetter, idx, -1)}
                            title="Yukarı Taşı"
                            style={{ padding: '2px' }}
                          >
                            <ChevronUp size={13} />
                          </button>
                        )}
                        {idx < 3 && (
                          <button 
                            className="arrow-btn" 
                            onClick={() => moveTeam(groupLetter, idx, 1)}
                            title="Aşağı Taşı"
                            style={{ padding: '2px' }}
                          >
                            <ChevronDown size={13} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* SIMPLE LIST VIEW */
              <div className="group-team-list">
                {standings[groupLetter].map((team, idx) => {
                  const rankClass = idx === 0 ? 'rank-1' : idx === 1 ? 'rank-2' : idx === 2 ? 'rank-3' : 'rank-4';
                  return (
                    <div key={team.id} className={`team-row ${rankClass}`}>
                      <div 
                        className="team-info team-row-clickable" 
                        onClick={() => onOpenSquad(team)}
                        title={t('viewSquadTooltip')}
                      >
                        <span className="team-rank-num">{idx + 1}</span>
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
                        <span className="team-name">{team.name[lang] || team.name.en}</span>
                      </div>

                      <div className="team-controls">
                        {idx > 0 && (
                          <button 
                            className="arrow-btn" 
                            onClick={() => moveTeam(groupLetter, idx, -1)}
                            title="Yukarı Taşı"
                          >
                            <ChevronUp size={16} />
                          </button>
                        )}
                        {idx < 3 && (
                          <button 
                            className="arrow-btn" 
                            onClick={() => moveTeam(groupLetter, idx, 1)}
                            title="Aşağı Taşı"
                          >
                            <ChevronDown size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
