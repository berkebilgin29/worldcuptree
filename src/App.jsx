import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from './context/LanguageContext';
import teamsData from './data/teams.json';
import Header from './components/Header';
import Footer from './components/Footer';
import GroupStage from './components/GroupStage';
import ThirdPlaceSelector from './components/ThirdPlaceSelector';
import KnockoutBracket from './components/KnockoutBracket';
import ShareCard from './components/ShareCard';
import AdSlot from './components/AdSlot';
import SquadModal from './components/SquadModal';
import { getRoundOf32Matchups } from './utils/matching';
import { getSortedInitialGroups } from './data/realStandings';
import { ArrowRight, ArrowLeft, Cpu, RefreshCw, Loader } from 'lucide-react';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const RATINGS = {
  mexico: 80, south_africa: 71, south_korea: 79, czech_republic: 77,
  canada: 75, bosnia_herzegovina: 78, qatar: 65, switzerland: 84,
  brazil: 95, morocco: 87, haiti: 62, scotland: 73,
  united_states: 83, paraguay: 76, australia: 72, turkey: 85,
  germany: 92, curacao: 60, ivory_coast: 76, ecuador: 78,
  netherlands: 90, japan: 82, sweden: 83, tunisia: 73,
  belgium: 89, egypt: 76, iran: 70, new_zealand: 65,
  spain: 94, cape_verde: 68, saudi_arabia: 67, uruguay: 88,
  france: 96, senegal: 82, bolivia: 68, norway: 78,
  argentina: 95, algeria: 75, austria: 82, jordan: 64,
  portugal: 93, jamaica: 66, uzbekistan: 67, colombia: 86,
  england: 94, croatia: 87, ghana: 74, panama: 66
};

function FinalCountdown() {
  const { lang, t } = useLanguage();
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    // Target Date: July 19, 2026 19:00:00 UTC (Final Match of 2026 World Cup)
    const targetDate = new Date('2026-07-19T19:00:00Z').getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, ended: true });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds, ended: false });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!timeLeft) return null;

  return (
    <div className="final-countdown-container">
      <div className="countdown-badge">
        <span className="badge-glow"></span>
        <span className="badge-text">{t('roadToFinalLive')}</span>
      </div>
      <div className="countdown-timer">
        {timeLeft.ended ? (
          <div className="ended-text">{t('finalDayIsHere')}</div>
        ) : (
          <div className="timer-segments">
            <div className="segment">
              <span className="segment-value">{timeLeft.days}</span>
              <span className="segment-label">{t('days')}</span>
            </div>
            <div className="segment-sep">:</div>
            <div className="segment">
              <span className="segment-value">{String(timeLeft.hours).padStart(2, '0')}</span>
              <span className="segment-label">{t('hours')}</span>
            </div>
            <div className="segment-sep">:</div>
            <div className="segment">
              <span className="segment-value">{String(timeLeft.minutes).padStart(2, '0')}</span>
              <span className="segment-label">{t('minutes')}</span>
            </div>
            <div className="segment-sep">:</div>
            <div className="segment">
              <span className="segment-value">{String(timeLeft.seconds).padStart(2, '0')}</span>
              <span className="segment-label">{t('seconds')}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const { lang, t } = useLanguage();

  // Step state: 0 = Intro, 1 = Groups, 2 = Third Place, 3 = Bracket, 4 = Share Card
  const [step, setStep] = useState(() => {
    const saved = localStorage.getItem('worldcup_step');
    return saved ? parseInt(saved, 10) : 0;
  });

  // Standings state: { A: [team1, team2, team3, team4], ... }
  const [standings, setStandings] = useState(() => {
    const saved = localStorage.getItem('worldcup_standings');
    return saved ? JSON.parse(saved) : getSortedInitialGroups();
  });

  // Selected best 8 third-place groups
  const [selectedThirdPlaces, setSelectedThirdPlaces] = useState(() => {
    const saved = localStorage.getItem('worldcup_third_places');
    return saved ? JSON.parse(saved) : [];
  });

  // Predictions state: { matchId: winnerTeamId }
  const [predictions, setPredictions] = useState(() => {
    const saved = localStorage.getItem('worldcup_predictions');
    return saved ? JSON.parse(saved) : {};
  });

  // Simulation controls
  const [isSimulating, setIsSimulating] = useState(false);
  const isSimulatingRef = useRef(false);
  const [activeTab, setActiveTab] = useState('r32'); // Mobile bracket tab
  const [selectedSquadTeam, setSelectedSquadTeam] = useState(null);
  const [isSquadOpen, setIsSquadOpen] = useState(false);

  // Local storage synchronization
  useEffect(() => {
    if (!isSimulating) {
      localStorage.setItem('worldcup_step', step.toString());
    }
  }, [step, isSimulating]);

  useEffect(() => {
    if (!isSimulating) {
      localStorage.setItem('worldcup_standings', JSON.stringify(standings));
    }
  }, [standings, isSimulating]);

  useEffect(() => {
    if (!isSimulating) {
      localStorage.setItem('worldcup_third_places', JSON.stringify(selectedThirdPlaces));
    }
  }, [selectedThirdPlaces, isSimulating]);

  useEffect(() => {
    if (!isSimulating) {
      localStorage.setItem('worldcup_predictions', JSON.stringify(predictions));
    }
  }, [predictions, isSimulating]);

  const handleReset = () => {
    if (window.confirm(t('resetConfirm'))) {
      isSimulatingRef.current = false;
      setIsSimulating(false);
      setStandings(getSortedInitialGroups());
      setSelectedThirdPlaces([]);
      setPredictions({});
      setStep(0);
    }
  };

  const startSimulation = () => {
    isSimulatingRef.current = true;
    setIsSimulating(true);
    runAiSimulation();
  };

  const cancelSimulation = () => {
    isSimulatingRef.current = false;
    setIsSimulating(false);
  };

  const runAiSimulation = async () => {
    // 1. Reset states before starting
    setStandings(getSortedInitialGroups());
    setSelectedThirdPlaces([]);
    setPredictions({});
    
    setStep(1);
    await sleep(100);

    // 1. GROUP STAGE SIMULATION
    const currentStandings = getSortedInitialGroups();
    const groupLetters = Object.keys(currentStandings);

    for (const group of groupLetters) {
      if (!isSimulatingRef.current) return;
      const teams = [...currentStandings[group]];
      
      // Sort based on team rating + tight random factor (realism preservation)
      const sortedTeams = teams.map(t => ({
        team: t,
        score: (RATINGS[t.id] || 75) + Math.random() * 10
      }))
      .sort((a, b) => b.score - a.score)
      .map(item => item.team);

      currentStandings[group] = sortedTeams;
      setStandings({ ...currentStandings });
      await sleep(15); // fast visual shuffle
    }

    if (!isSimulatingRef.current) return;
    await sleep(100);
    setStep(2);
    await sleep(100);

    // 2. THIRD PLACE SIMULATION
    const thirdPlaces = Object.keys(currentStandings).map(group => ({
      group: group,
      team: currentStandings[group][2],
      score: (RATINGS[currentStandings[group][2].id] || 75) + Math.random() * 8
    }))
    .sort((a, b) => b.score - a.score);

    const best8Groups = thirdPlaces.slice(0, 8).map(item => item.group);
    const selected = [];
    
    for (const group of best8Groups) {
      if (!isSimulatingRef.current) return;
      selected.push(group);
      setSelectedThirdPlaces([...selected]);
      await sleep(15);
    }

    if (!isSimulatingRef.current) return;
    await sleep(100);
    setStep(3);
    setActiveTab('r32');
    await sleep(100);

    // 3. KNOCKOUT SIMULATION
    const simulateMatchWinner = (home, away) => {
      if (!home) return away?.id;
      if (!away) return home?.id;
      const ratingHome = RATINGS[home.id] || 75;
      const ratingAway = RATINGS[away.id] || 75;
      
      const diff = ratingHome - ratingAway;
      // Elo sigmoid probability: stronger teams have mathematically higher chance
      const probHome = 1 / (1 + Math.exp(-diff / 10));
      return Math.random() < probHome ? home.id : away.id;
    };

    const newPredictions = {};

    const getWinner = (matchId, sourceMatches) => {
      const wId = newPredictions[matchId];
      if (!wId) return null;
      const match = sourceMatches.find(m => m.id === matchId);
      if (match?.home?.id === wId) return match.home;
      if (match?.away?.id === wId) return match.away;
      return null;
    };

    // Round of 32 (16 matches)
    const r32Matches = getRoundOf32Matchups(currentStandings, best8Groups);
    for (const match of r32Matches) {
      if (!isSimulatingRef.current) return;
      const wId = simulateMatchWinner(match.home, match.away);
      newPredictions[match.id] = wId;
      setPredictions({ ...newPredictions });
      await sleep(20);
    }

    if (!isSimulatingRef.current) return;
    await sleep(150);
    setActiveTab('r16');
    await sleep(100);

    // Round of 16 (8 matches)
    const r16Matches = [
      { id: 'R16_1', home: getWinner('R32_1', r32Matches), away: getWinner('R32_2', r32Matches) },
      { id: 'R16_2', home: getWinner('R32_3', r32Matches), away: getWinner('R32_4', r32Matches) },
      { id: 'R16_3', home: getWinner('R32_5', r32Matches), away: getWinner('R32_6', r32Matches) },
      { id: 'R16_4', home: getWinner('R32_7', r32Matches), away: getWinner('R32_8', r32Matches) },
      { id: 'R16_5', home: getWinner('R32_9', r32Matches), away: getWinner('R32_10', r32Matches) },
      { id: 'R16_6', home: getWinner('R32_11', r32Matches), away: getWinner('R32_12', r32Matches) },
      { id: 'R16_7', home: getWinner('R32_13', r32Matches), away: getWinner('R32_14', r32Matches) },
      { id: 'R16_8', home: getWinner('R32_15', r32Matches), away: getWinner('R32_16', r32Matches) }
    ];
    for (const match of r16Matches) {
      if (!isSimulatingRef.current) return;
      const wId = simulateMatchWinner(match.home, match.away);
      newPredictions[match.id] = wId;
      setPredictions({ ...newPredictions });
      await sleep(25);
    }

    if (!isSimulatingRef.current) return;
    await sleep(150);
    setActiveTab('qf');
    await sleep(100);

    // Quarterfinals (4 matches)
    const qfMatches = [
      { id: 'QF_1', home: getWinner('R16_1', r16Matches), away: getWinner('R16_2', r16Matches) },
      { id: 'QF_2', home: getWinner('R16_3', r16Matches), away: getWinner('R16_4', r16Matches) },
      { id: 'QF_3', home: getWinner('R16_5', r16Matches), away: getWinner('R16_6', r16Matches) },
      { id: 'QF_4', home: getWinner('R16_7', r16Matches), away: getWinner('R16_8', r16Matches) }
    ];
    for (const match of qfMatches) {
      if (!isSimulatingRef.current) return;
      const wId = simulateMatchWinner(match.home, match.away);
      newPredictions[match.id] = wId;
      setPredictions({ ...newPredictions });
      await sleep(30);
    }

    if (!isSimulatingRef.current) return;
    await sleep(150);
    setActiveTab('sf_f');
    await sleep(100);

    // Semifinals (2 matches)
    const sfMatches = [
      { id: 'SF_1', home: getWinner('QF_1', qfMatches), away: getWinner('QF_2', qfMatches) },
      { id: 'SF_2', home: getWinner('QF_3', qfMatches), away: getWinner('QF_4', qfMatches) }
    ];
    for (const match of sfMatches) {
      if (!isSimulatingRef.current) return;
      const wId = simulateMatchWinner(match.home, match.away);
      newPredictions[match.id] = wId;
      setPredictions({ ...newPredictions });
      await sleep(35);
    }

    if (!isSimulatingRef.current) return;
    await sleep(150);

    // Final Match
    const finalMatch = {
      id: 'F_1',
      home: getWinner('SF_1', sfMatches),
      away: getWinner('SF_2', sfMatches)
    };
    const finalWinnerId = simulateMatchWinner(finalMatch.home, finalMatch.away);
    newPredictions['F_1'] = finalWinnerId;
    setPredictions({ ...newPredictions });

    if (!isSimulatingRef.current) return;
    await sleep(500); // Rhythmic pause to let user see champion
    setStep(4);
    setIsSimulating(false);
    isSimulatingRef.current = false;
  };

  // Navigations
  const nextStep = () => {
    if (step === 2 && selectedThirdPlaces.length !== 8) {
      alert(t('chooseExactlyEight'));
      return;
    }
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
  };

  const jumpToStep = (targetStep) => {
    if (isSimulating) return; // Prevent jump during active simulation
    if (targetStep > 2 && selectedThirdPlaces.length !== 8) {
      alert(t('chooseExactlyEight'));
      return;
    }
    setStep(targetStep);
  };

  const handleOpenSquad = (team) => {
    setSelectedSquadTeam(team);
    setIsSquadOpen(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div className="container" style={{ flex: 1 }}>
        <Header 
          onReset={handleReset} 
          isSimulating={isSimulating}
          onStartSim={startSimulation}
          onCancelSim={cancelSimulation}
        />

        {/* AI Simulating Status Bar */}
        {isSimulating && (
          <div 
            style={{ 
              background: 'rgba(0, 230, 118, 0.1)', 
              border: '1px solid var(--color-primary)', 
              padding: '14px', 
              borderRadius: '12px', 
              textAlign: 'center', 
              margin: '20px 0 10px 0', 
              fontSize: '0.95rem', 
              color: 'var(--color-primary)', 
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }} 
            className="animate-pulse"
          >
            <Cpu size={18} className="animate-spin" style={{ animationDuration: '3s' }} />
            <span>
              {lang === 'tr' 
                ? 'YAPAY ZEKA TAHMİN SİMÜLASYONU ÇALIŞIYOR... LÜTFEN BEKLEYİN.' 
                : (lang === 'de' ? 'KI-PROGNOSE-SIMULATION LÄUFT... BITTE WARTEN.' : 'AI PREDICTION SIMULATION IN PROGRESS... PLEASE WAIT.')}
            </span>
          </div>
        )}

        {/* STEP 0: LANDING INTRO */}
        {step === 0 && (
          <section className="hero-section flex-center" style={{ flexDirection: 'column', padding: '60px 0 80px 0' }}>
            <div className="logo-glow-ring" style={{ marginBottom: '24px', position: 'relative' }}>
              <img src="/logo.png" alt="World Cup 2026 Logo" style={{ height: '220px', width: 'auto', position: 'relative', zIndex: 2 }} />
            </div>
            <h1 className="hero-title">
              <span className="text-white">WORLD CUP</span>{' '}
              <span className="text-gold">2026</span>
            </h1>
            <p className="hero-subtitle">{t('heroSubtitle')}</p>
            
            <FinalCountdown />
            
            <div className="step-cards-grid" style={{ marginBottom: '40px' }}>
              <div className="step-card">
                <div className="step-card-num">1</div>
                <div className="step-card-title">{t('rankTwelveGroups')}</div>
                <div className="step-card-desc">
                  {t('rankTwelveGroupsDesc')}
                </div>
              </div>
              <div className="step-card">
                <div className="step-card-num">2</div>
                <div className="step-card-title">{t('chooseBestThirds')}</div>
                <div className="step-card-desc">
                  {t('chooseBestThirdsDesc')}
                </div>
              </div>
              <div className="step-card">
                <div className="step-card-num">3</div>
                <div className="step-card-title">{t('bracketPredictorTitle')}</div>
                <div className="step-card-desc">
                  {t('bracketPredictorDesc')}
                </div>
              </div>
              <div className="step-card">
                <div className="step-card-num">4</div>
                <div className="step-card-title">{t('downloadCardTitle')}</div>
                <div className="step-card-desc">
                  {t('downloadCardDesc')}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center', width: '100%' }}>
              <button className="btn-primary flex-center" onClick={() => setStep(1)} style={{ padding: '16px 44px', fontSize: '1.1rem', gap: '10px' }}>
                <span>{t('startBtn')}</span>
                <ArrowRight size={20} />
              </button>

              {/* AI Auto Simulate Button on Landing */}
              <button 
                className="btn-secondary flex-center" 
                onClick={startSimulation} 
                style={{ 
                  padding: '16px 44px', 
                  fontSize: '1.1rem', 
                  gap: '10px', 
                  borderColor: 'var(--color-primary)',
                  boxShadow: '0 0 15px var(--color-primary-glow)'
                }}
              >
                <Cpu size={20} />
                <span>{t('simulateBtn')}</span>
              </button>
            </div>

            <AdSlot slot="landing-bottom-ad" style={{ marginTop: '40px' }} />
          </section>
        )}

        {/* STEPS 1-4: PROGRESSIVE prediction stages */}
        {step > 0 && (
          <>
            {/* Step Wizard Header */}
            <div className="step-wizard" style={{ marginTop: '20px' }}>
              <div 
                className={`step-bubble ${step === 1 ? 'active' : ''}`} 
                onClick={() => jumpToStep(1)}
                data-step="1"
              >
                <span>{t('stepGroups')}</span>
              </div>
              <div 
                className={`step-bubble ${step === 2 ? 'active' : ''}`} 
                onClick={() => jumpToStep(2)}
                data-step="2"
              >
                <span>{t('stepThirds')}</span>
              </div>
              <div 
                className={`step-bubble ${step === 3 ? 'active' : ''}`} 
                onClick={() => jumpToStep(3)}
                data-step="3"
              >
                <span>{t('stepBracket')}</span>
              </div>
              <div 
                className={`step-bubble ${step === 4 ? 'active' : ''}`} 
                onClick={() => jumpToStep(4)}
                data-step="4"
              >
                <span>{t('stepShare')}</span>
              </div>
            </div>

            {/* Active Component Render */}
            <main style={{ minHeight: '400px' }}>
              {step === 1 && (
                <GroupStage standings={standings} setStandings={setStandings} onOpenSquad={handleOpenSquad} />
              )}
              {step === 2 && (
                <ThirdPlaceSelector 
                  standings={standings} 
                  selectedThirdPlaces={selectedThirdPlaces} 
                  setSelectedThirdPlaces={setSelectedThirdPlaces} 
                  onOpenSquad={handleOpenSquad}
                />
              )}
              {step === 3 && (
                <KnockoutBracket 
                  standings={standings} 
                  selectedThirdPlaces={selectedThirdPlaces} 
                  predictions={predictions}
                  setPredictions={setPredictions}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  onOpenSquad={handleOpenSquad}
                />
              )}
              {step === 4 && (
                <ShareCard 
                  standings={standings} 
                  selectedThirdPlaces={selectedThirdPlaces} 
                  predictions={predictions}
                />
              )}
            </main>

            <AdSlot slot="wizard-bottom-ad" style={{ margin: '30px auto 10px auto' }} />

            {/* Action Navigation Bar */}
            <div className="action-nav">
              <button 
                className="btn-secondary flex-center" 
                onClick={prevStep} 
                style={{ gap: '8px' }}
                disabled={isSimulating}
              >
                <ArrowLeft size={16} />
                <span>{t('prevStep')}</span>
              </button>
              
              {step < 4 && (
                <button 
                  className="btn-primary flex-center" 
                  onClick={nextStep}
                  style={{ gap: '8px' }}
                  disabled={isSimulating || (step === 2 && selectedThirdPlaces.length !== 8)}
                >
                  <span>{t('nextStep')}</span>
                  <ArrowRight size={16} />
                </button>
              )}
            </div>
          </>
        )}

        <SquadModal 
          isOpen={isSquadOpen} 
          onClose={() => setIsSquadOpen(false)} 
          team={selectedSquadTeam} 
          lang={lang} 
        />
      </div>

      <Footer />
    </div>
  );
}
