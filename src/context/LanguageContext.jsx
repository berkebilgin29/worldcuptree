import React, { createContext, useState, useContext, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
  en: {
    heroTitle: "WorldCupTree",
    heroSubtitle: "Build your 2026 World Cup bracket. Pick your champion. Share your tree.",
    startBtn: "Start Predicting",
    groupStageTitle: "1. Group Stage Rankings",
    groupStageDesc: "Rank all teams in each group by clicking the arrows. The top 2 from each group will advance automatically, and the 3rd-place teams will compete for the best 8 spots.",
    thirdPlaceTitle: "2. Best 3rd-Placed Teams",
    thirdPlaceDesc: "Select exactly 8 third-place teams to advance to the Round of 32. We will automatically match them to the correct slots using the official tournament rules.",
    bracketTitle: "3. Knockout Bracket",
    bracketDesc: "Predict the winners from the Round of 32 all the way to the Final. Tap on a team to advance them.",
    championText: "2026 WORLD CUP CHAMPION",
    downloadBtn: "Download Bracket Card",
    resetBtn: "Reset All",
    ourPathMode: "Our Path Mode",
    ourPathModeDesc: "Highlight Turkey's path in the bracket!",
    unofficialDisclaimer: "Unofficial fan-made World Cup prediction tool. Not affiliated with FIFA.",
    privacyPolicy: "Privacy Policy",
    contact: "Contact",
    nextStep: "Next Step",
    prevStep: "Previous Step",
    selectedText: "selected",
    chooseExactlyEight: "Please select exactly 8 teams to continue.",
    backToGroups: "Back to Groups",
    shareMessage: "Here is my 2026 World Cup prediction! Created on worldcuptree.com",
    viewTree: "View Full Tree",
    roundOf32: "Round of 32",
    roundOf16: "Round of 16",
    quarterFinals: "Quarterfinals",
    semiFinals: "Semifinals",
    final: "Final",
    winner: "Winner",
    runnerUp: "Runner-up",
    thirdPlace: "3rd Place",
    simulateBtn: "Simulate",
    stopSimBtn: "Stop",
    roadToFinalLive: "ROAD TO GRANDE FINAL LIVE",
    finalDayIsHere: "FINAL DAY IS HERE!",
    days: "DAYS",
    hours: "HOURS",
    minutes: "MINS",
    seconds: "SECS",
    resetConfirm: "All predictions will be reset. Are you sure?",
    rankTwelveGroups: "Rank 12 Groups",
    rankTwelveGroupsDesc: "Move teams up or down to set group standings",
    chooseBestThirds: "Choose Best 3rds",
    chooseBestThirdsDesc: "Select the 8 best third-place wildcards to advance",
    bracketPredictorTitle: "Bracket Predictor",
    bracketPredictorDesc: "Predict bracket matchups from Round of 32 to final",
    downloadCardTitle: "Download Card",
    downloadCardDesc: "Save and share your bracket prediction as a premium PNG",
    stepGroups: "1. Groups",
    stepThirds: "2. Thirds",
    stepBracket: "3. Bracket",
    stepShare: "4. Share",
    advertisement: "ADVERTISEMENT",
    listView: "List View",
    liveStandings: "Live Standings",
    teamCol: "Team",
    playedCol: "P",
    wonCol: "W",
    drawnCol: "D",
    lostCol: "L",
    gdCol: "GD",
    pointsCol: "PTS",
    playedTooltip: "Played",
    wonTooltip: "Won",
    drawnTooltip: "Drawn",
    lostTooltip: "Lost",
    gdTooltip: "Goal Difference",
    pointsTooltip: "Points",
    viewSquadTooltip: "View Squad & Values",
    squadAndMarketValues: "Squad & Market Values",
    leftSide: "Left Side",
    rightSide: "Right Side",
    finalTitle: "Final",
    swipeMessage: "Swipe left/right or use the buttons above to view",
    selectChampionToDownload: "Please select your champion to download your prediction card.",
    chooseStartRound: "From Which Round Should Your Prediction Card Start?",
    roundOf32Full: "32 Teams (Full)",
    roundOf16Short: "16 Teams",
    quarterfinalsShort: "8 Teams",
    cardTitle: "My 2026 World Cup Bracket Predictions",
    bracketTitleR32: "Tournament Bracket (Round of 32 - Final)",
    bracketTitleR16: "Tournament Bracket (Round of 16 - Final)",
    bracketTitleQF: "Tournament Bracket (Quarterfinals - Final)",
    totalValue: "Total Value"
  },
  tr: {
    heroTitle: "WorldCupTree",
    heroSubtitle: "Dünya Kupası tahmin ağacını oluştur, şampiyonunu seç, arkadaşlarınla paylaş.",
    startBtn: "Tahmine Başla",
    groupStageTitle: "1. Grup Aşaması Sıralaması",
    groupStageDesc: "Her gruptaki takımları okları kullanarak sıralayın. Her gruptan ilk 2 takım doğrudan tur atlayacak, 3. sıradaki takımlar ise en iyi 8 yer için yarışacaktır.",
    thirdPlaceTitle: "2. En İyi Üçüncüler",
    thirdPlaceDesc: "Son 32 turuna yükselecek tam 8 adet üçüncü takım seçin. Resmi turnuva kurallarına uygun olarak takımları otomatik yerleştireceğiz.",
    bracketTitle: "3. Eleme Ağacı",
    bracketDesc: "Son 32 turundan finale kadar kazananları tahmin edin. Bir takıma dokunarak bir üst tura taşıyın.",
    championText: "2026 DÜNYA KUPASI ŞAMPİYONU",
    downloadBtn: "Tahmin Kartını İndir",
    resetBtn: "Sıfırla",
    ourPathMode: "Bizim Yol Modu",
    ourPathModeDesc: "Türkiye'nin eleme ağacındaki yolunu vurgulayın!",
    unofficialDisclaimer: "Gayriresmi taraftar yapımı Dünya Kupası tahmin aracı. FIFA ile resmi bir bağı yoktur.",
    privacyPolicy: "Gizlilik Politikası",
    contact: "İletişim",
    nextStep: "Sonraki Adım",
    prevStep: "Önceki Adım",
    selectedText: "seçildi",
    chooseExactlyEight: "Devam etmek için lütfen tam 8 takım seçin.",
    backToGroups: "Gruplara Dön",
    shareMessage: "İşte 2026 Dünya Kupası tahminim! Sen de kendi ağacını oluştur.",
    viewTree: "Tüm Ağacı Gör",
    roundOf32: "Son 32",
    roundOf16: "Son 16",
    quarterFinals: "Çeyrek Final",
    semiFinals: "Yarı Final",
    final: "Final",
    winner: "Lider",
    runnerUp: "İkinci",
    thirdPlace: "Üçüncü",
    simulateBtn: "Simüle Et",
    stopSimBtn: "Durdur",
    roadToFinalLive: "BÜYÜK FİNAL YOLU CANLI",
    finalDayIsHere: "FİNAL GÜNÜ BAŞLADI!",
    days: "GÜN",
    hours: "SAAT",
    minutes: "DAKİKA",
    seconds: "SANİYE",
    resetConfirm: "Tüm tahminleriniz sıfırlanacaktır. Emin misiniz?",
    rankTwelveGroups: "12 Grubu Sırala",
    rankTwelveGroupsDesc: "Takımları oklarla aşağı/yukarı taşıyarak grupları belirle",
    chooseBestThirds: "Üçüncüleri Seç",
    chooseBestThirdsDesc: "Tur atlayacak en iyi 8 üçüncü takımı seçerek elemelere taşı",
    bracketPredictorTitle: "Ağacı Tahmin Et",
    bracketPredictorDesc: "Son 32 turundan finale kadar eleme eşleşmelerini tahmin et",
    downloadCardTitle: "Kartını İndir",
    downloadCardDesc: "Tahmin ağacını şık bir görsel kart olarak indir ve paylaş",
    stepGroups: "1. Gruplar",
    stepThirds: "2. Üçüncüler",
    stepBracket: "3. Elemeler",
    stepShare: "4. İndir",
    advertisement: "SPONSORLU BAĞLANTI",
    listView: "Liste Görünümü",
    liveStandings: "Canlı Puan Durumu",
    teamCol: "Takım",
    playedCol: "O",
    wonCol: "G",
    drawnCol: "B",
    lostCol: "M",
    gdCol: "AV",
    pointsCol: "P",
    playedTooltip: "Oynanan",
    wonTooltip: "Galibiyet",
    drawnTooltip: "Beraberlik",
    lostTooltip: "Mağlubiyet",
    gdTooltip: "Averaj",
    pointsTooltip: "Puan",
    viewSquadTooltip: "Kadro & Değerleri Gör",
    squadAndMarketValues: "Kadro & Piyasa Değerleri",
    leftSide: "Sol Taraf (A)",
    rightSide: "Sağ Taraf (B)",
    finalTitle: "Final & Şampiyon",
    swipeMessage: "Ağacı sağa/sola kaydırabilir veya yukarıdaki butonları kullanabilirsiniz",
    selectChampionToDownload: "Tahmin kartınızı indirmek için lütfen şampiyonunuzu seçin.",
    chooseStartRound: "Tahmin Kartınız Hangi Turdan Başlasın?",
    roundOf32Full: "32 Takım (Tam)",
    roundOf16Short: "16 Takım",
    quarterfinalsShort: "8 Takım",
    cardTitle: "2026 Dünya Kupası Tahmin Ağacım",
    bracketTitleR32: "Turnuva Ağacı (Son 32 - Final)",
    bracketTitleR16: "Turnuva Ağacı (Son 16 - Final)",
    bracketTitleQF: "Turnuva Ağacı (Çeyrek Final - Final)",
    totalValue: "Toplam Değer"
  },
  de: {
    heroTitle: "WorldCupTree",
    heroSubtitle: "Erstelle deinen WM-Turnierbaum 2026. Wähle deinen Champion. Teile deine Prognose.",
    startBtn: "Prognose starten",
    groupStageTitle: "1. Gruppenphase Platzierungen",
    groupStageDesc: "Ordne die Teams in jeder Gruppe mit den Pfeilen. Die besten 2 jeder Gruppe qualifizieren sich automatisch, die Gruppendritten spielen um die besten 8 Plätze.",
    thirdPlaceTitle: "2. Beste Gruppendritte",
    thirdPlaceDesc: "Wähle genau 8 Gruppendritte für das Sechzehntelfinale (Runde der 32). Wir weisen sie automatisch nach den offiziellen Turnierregeln den richtigen Plätzen zu.",
    bracketTitle: "3. K.o.-Runde",
    bracketDesc: "Tippe die Gewinner von der Runde der 32 bis zum Finale. Tippe auf ein Team, um es eine Runde weiterzubringen.",
    championText: "WELTMEISTER 2026",
    downloadBtn: "Turnierbaum-Karte herunterladen",
    resetBtn: "Zurücksetzen",
    ourPathMode: "Unser Weg Modus",
    ourPathModeDesc: "Hebe den Weg der Türkei im Turnierbaum hervor!",
    unofficialDisclaimer: "Inoffiziertes Fan-Prognose-Tool für die Weltmeisterschaft. Nicht mit der FIFA verbunden.",
    privacyPolicy: "Datenschutzerklärung",
    contact: "Kontakt",
    nextStep: "Nächster Schritt",
    prevStep: "Vorheriger Schritt",
    selectedText: "ausgewählt",
    chooseExactlyEight: "Bitte wähle genau 8 Teams aus, um fortzufahren.",
    backToGroups: "Zurück zu den Gruppen",
    shareMessage: "Hier ist meine Prognose für die WM 2026! Erstellt auf worldcuptree.com",
    viewTree: "Ganzen Turnierbaum anzeigen",
    roundOf32: "Runde der 32",
    roundOf16: "Achtelfinale",
    quarterFinals: "Viertelfinale",
    semiFinals: "Halbfinale",
    final: "Finale",
    winner: "Sieger",
    runnerUp: "Zweiter",
    thirdPlace: "Dritter",
    simulateBtn: "Simulieren",
    stopSimBtn: "Stopp",
    roadToFinalLive: "WEG ZUM FINALE LIVE",
    finalDayIsHere: "FINALTAG IST DA!",
    days: "TAGE",
    hours: "STUNDEN",
    minutes: "MIN.",
    seconds: "SEK.",
    resetConfirm: "Alle Prognosen werden zurückgesetzt. Bist du sicher?",
    rankTwelveGroups: "12 Gruppen ordnen",
    rankTwelveGroupsDesc: "Bewege die Teams nach oben oder unten, um den Gruppenstand festzulegen",
    chooseBestThirds: "Beste Dritte wählen",
    chooseBestThirdsDesc: "Wähle die 8 besten Gruppendritten aus, um fortzufahren",
    bracketPredictorTitle: "Turnierbaum tippen",
    bracketPredictorDesc: "Tippe die K.o.-Spiele von der Runde der 32 bis zum Finale",
    downloadCardTitle: "Karte herunterladen",
    downloadCardDesc: "Speichere und teile deine Prognose als hochwertige PNG-Datei",
    stepGroups: "1. Gruppen",
    stepThirds: "2. Dritte",
    stepBracket: "3. K.o.-Runde",
    stepShare: "4. Teilen",
    advertisement: "WERBUNG",
    listView: "Listenansicht",
    liveStandings: "Live-Tabelle",
    teamCol: "Team",
    playedCol: "Sp",
    wonCol: "S",
    drawnCol: "U",
    lostCol: "N",
    gdCol: "TD",
    pointsCol: "PKT",
    playedTooltip: "Spiele",
    wonTooltip: "Siege",
    drawnTooltip: "Unentschieden",
    lostTooltip: "Niederlagen",
    gdTooltip: "Tordifferenz",
    pointsTooltip: "Punkte",
    viewSquadTooltip: "Kader & Marktwerte anzeigen",
    squadAndMarketValues: "Kader & Marktwerte",
    leftSide: "Linke Seite (A)",
    rightSide: "Rechte Seite (B)",
    finalTitle: "Finale & Champion",
    swipeMessage: "Wische nach links/rechts oder nutze die Tasten oben zum Navigieren",
    selectChampionToDownload: "Bitte wähle deinen Weltmeister aus, um deine Turnierbaum-Karte herunterzuladen.",
    chooseStartRound: "Ab welcher Runde soll deine Karte starten?",
    roundOf32Full: "32 Teams (Vollständig)",
    roundOf16Short: "16 Teams",
    quarterfinalsShort: "8 Teams",
    cardTitle: "Meine Prognose für die WM 2026",
    bracketTitleR32: "Turnierbaum (Runde der 32 - Finale)",
    bracketTitleR16: "Turnierbaum (Achtelfinale - Finale)",
    bracketTitleQF: "Turnierbaum (Viertelfinale - Finale)",
    totalValue: "Gesamtmarktwert"
  },
  fr: {
    heroTitle: "WorldCupTree",
    heroSubtitle: "Créez votre tableau de la Coupe du Monde 2026. Choisissez votre champion. Partagez votre arbre.",
    startBtn: "Commencer les pronostics",
    groupStageTitle: "1. Classement de la phase de groupes",
    groupStageDesc: "Classez toutes les équipes de chaque groupe en cliquant sur les flèches. Les 2 premiers de chaque groupe se qualifient automatiquement, et les équipes classées 3èmes s'affrontent pour les 8 meilleures places.",
    thirdPlaceTitle: "2. Meilleurs troisièmes de groupe",
    thirdPlaceDesc: "Sélectionnez exactement 8 équipes classées 3èmes pour accéder aux seizièmes de finale (Ronde des 32). Nous les associerons automatiquement aux bonnes positions selon les règles officielles du tournoi.",
    bracketTitle: "3. Tableau de la phase finale",
    bracketDesc: "Pronostiquez les vainqueurs des seizièmes de finale jusqu'à la finale. Appuyez sur une équipe pour la faire progresser.",
    championText: "CHAMPION DE LA COUPE DU MONDE 2026",
    downloadBtn: "Télécharger votre tableau en image",
    resetBtn: "Réinitialiser",
    ourPathMode: "Mode Notre Route",
    ourPathModeDesc: "Mettez en valeur le parcours de la Turquie dans le tableau !",
    unofficialDisclaimer: "Outil de pronostic non officiel créé par des fans. Non affilié à la FIFA.",
    privacyPolicy: "Politique de confidentialité",
    contact: "Contact",
    nextStep: "Étape suivante",
    prevStep: "Étape précédente",
    selectedText: "sélectionnés",
    chooseExactlyEight: "Veuillez sélectionner exactement 8 équipes pour continuer.",
    backToGroups: "Retour aux groupes",
    shareMessage: "Voici mes pronostics pour la Coupe du Monde 2026 ! Créé sur worldcuptree.com",
    viewTree: "Voir tout le tableau",
    roundOf32: "Seizièmes de finale",
    roundOf16: "Huitièmes de finale",
    quarterFinals: "Quarts de finale",
    semiFinals: "Demi-finales",
    final: "Finale",
    winner: "Vainqueur",
    runnerUp: "Finaliste",
    thirdPlace: "3ème Place",
    simulateBtn: "Simuler",
    stopSimBtn: "Arrêter",
    roadToFinalLive: "ROUTE VERS LA GRANDE FINALE EN DIRECT",
    finalDayIsHere: "LE JOUR DE LA FINALE EST ARRIVÉ !",
    days: "JOURS",
    hours: "HEURES",
    minutes: "MIN",
    seconds: "SEC",
    resetConfirm: "Tous les pronostics seront réinitialisés. Êtes-vous sûr ?",
    rankTwelveGroups: "Classer les 12 groupes",
    rankTwelveGroupsDesc: "Déplacez les équipes vers le haut ou le bas pour établir le classement",
    chooseBestThirds: "Choisir les meilleurs 3èmes",
    chooseBestThirdsDesc: "Sélectionnez les 8 meilleurs troisièmes pour accéder aux seizièmes de finale",
    bracketPredictorTitle: "Pronostics du tableau",
    bracketPredictorDesc: "Pronostiquez les matchs de la phase finale des seizièmes de finale à la finale",
    downloadCardTitle: "Télécharger la carte",
    downloadCardDesc: "Sauvegardez et partagez votre pronostic sous forme d'image premium PNG",
    stepGroups: "1. Groupes",
    stepThirds: "2. Troisièmes",
    stepBracket: "3. Tableau",
    stepShare: "4. Partager",
    advertisement: "PUBLICITÉ",
    listView: "Vue liste",
    liveStandings: "Classement en direct",
    teamCol: "Équipe",
    playedCol: "MJ",
    wonCol: "G",
    drawnCol: "N",
    lostCol: "P",
    gdCol: "DB",
    pointsCol: "PTS",
    playedTooltip: "Matchs Joués",
    wonTooltip: "Gagnés",
    drawnTooltip: "Nuls",
    lostTooltip: "Perdus",
    gdTooltip: "Différence de Buts",
    pointsTooltip: "Points",
    viewSquadTooltip: "Voir l'effectif et les valeurs",
    squadAndMarketValues: "Effectif & Valeurs marchandes",
    leftSide: "Côté gauche (A)",
    rightSide: "Côté droit (B)",
    finalTitle: "Finale & Champion",
    swipeMessage: "Glissez vers la gauche/droite ou utilisez les boutons ci-dessus pour naviguer",
    selectChampionToDownload: "Veuillez sélectionner votre champion pour télécharger votre carte de pronostics.",
    chooseStartRound: "À partir de quel tour votre carte de pronostics doit-elle commencer ?",
    roundOf32Full: "32 Équipes (Complet)",
    roundOf16Short: "16 Équipes",
    quarterfinalsShort: "8 Équipes",
    cardTitle: "Mes pronostics pour la Coupe du Monde 2026",
    bracketTitleR32: "Tableau final (Seizièmes - Finale)",
    bracketTitleR16: "Tableau final (Huitièmes - Finale)",
    bracketTitleQF: "Tableau final (Quarts - Finale)",
    totalValue: "Valeur totale"
  }
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    // 1. Check URL parameters first (crucial for SEO crawlers to access different languages)
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get('lang');
    if (urlLang === 'tr' || urlLang === 'en' || urlLang === 'de' || urlLang === 'fr') {
      return urlLang;
    }
    // 2. Check localStorage
    const saved = localStorage.getItem('worldcup_lang');
    if (saved) return saved;
    // 3. Fallback to browser language
    const browserLang = navigator.language || navigator.userLanguage;
    if (browserLang.startsWith('tr')) return 'tr';
    if (browserLang.startsWith('de')) return 'de';
    if (browserLang.startsWith('fr')) return 'fr';
    return 'en';
  });

  useEffect(() => {
    localStorage.setItem('worldcup_lang', lang);
    
    // Dynamically update document lang attribute for SEO
    document.documentElement.lang = lang;
    
    // Dynamically update page metadata for SEO crawlers
    if (lang === 'tr') {
      document.title = "Dünya Kupası Tahmin Ağacı 2026 - WorldCupTree";
      document.querySelector('meta[name="description"]')?.setAttribute(
        'content', 
        "2026 Dünya Kupası turnuva ağacını oluştur, grupları ve en iyi üçüncüleri seç, eleme maçlarını tahmin et ve şık görsel kart olarak indirip paylaş."
      );
    } else if (lang === 'de') {
      document.title = "WM Turnierbaum Prognose 2026 - WorldCupTree";
      document.querySelector('meta[name="description"]')?.setAttribute(
        'content', 
        "Simuliere deinen WM-Turnierbaum 2026. Gruppen platzieren, beste Dritte wählen, K.o.-Spiele tippen und deine Turnierbaum-Karte teilen."
      );
    } else if (lang === 'fr') {
      document.title = "Simulateur de Tableau Coupe du Monde 2026 - WorldCupTree";
      document.querySelector('meta[name="description"]')?.setAttribute(
        'content', 
        "Créez et simulez votre tableau de la Coupe du Monde de la FIFA 2026. Classez les groupes, sélectionnez les meilleurs troisièmes et pronostiquez le champion."
      );
    } else {
      document.title = "World Cup Bracket Predictor 2026 - WorldCupTree";
      document.querySelector('meta[name="description"]')?.setAttribute(
        'content', 
        "Build and simulate your 2026 FIFA World Cup bracket tree. Rank groups, choose wildcards, predict knockout winners, and download your card."
      );
    }
  }, [lang]);

  const t = (key) => {
    return translations[lang][key] || key;
  };

  const toggleLanguage = () => {
    setLang((prev) => {
      let next;
      if (prev === 'tr') next = 'en';
      else if (prev === 'en') next = 'de';
      else if (prev === 'de') next = 'fr';
      else next = 'tr';
      
      // Sync language change to URL query parameter
      const url = new URL(window.location);
      url.searchParams.set('lang', next);
      window.history.pushState({}, '', url);
      return next;
    });
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
