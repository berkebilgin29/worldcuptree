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
    shareMessage: "Here is my 2026 World Cup prediction! Created on worldcuplocaltime.com/tree",
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
    stopSimBtn: "Stop"
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
    stopSimBtn: "Durdur"
  }
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    // 1. Check URL parameters first (crucial for SEO crawlers to access different languages)
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get('lang');
    if (urlLang === 'tr' || urlLang === 'en') {
      return urlLang;
    }
    // 2. Check localStorage
    const saved = localStorage.getItem('worldcup_lang');
    if (saved) return saved;
    // 3. Fallback to browser language
    const browserLang = navigator.language || navigator.userLanguage;
    return browserLang.startsWith('tr') ? 'tr' : 'en';
  });

  useEffect(() => {
    localStorage.setItem('worldcup_lang', lang);
    
    // Dynamically update page metadata for SEO crawlers
    if (lang === 'tr') {
      document.title = "Dünya Kupası Tahmin Ağacı 2026 - WorldCupTree";
      document.querySelector('meta[name="description"]')?.setAttribute(
        'content', 
        "2026 Dünya Kupası turnuva ağacını oluştur, grupları ve en iyi üçüncüleri seç, eleme maçlarını tahmin et ve şık görsel kart olarak indirip paylaş."
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
      const next = prev === 'en' ? 'tr' : 'en';
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
