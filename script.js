// --- Navigation Logic (Global) ---
// Defined at the top to ensure availability
window.navigateTo = function(viewId) {
  // Hide all views
  ['home-view', 'quran-view', 'bukhari-view'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  });

  // Show selected view
  const view = document.getElementById(viewId + '-view');
  if (view) {
    view.classList.remove('hidden');
    window.scrollTo(0, 0);
  }
  
  // Specific view reset logic
  if(viewId === 'quran') {
      const resultContainer = document.getElementById('result-container');
      const emptyState = document.getElementById('empty-state');
      if (resultContainer) resultContainer.classList.add('hidden');
      if (emptyState) emptyState.classList.remove('hidden');
  }
  
  // Re-initialize icons just in case they need to re-render
  if (window.lucide) window.lucide.createIcons();
};

window.showVerse = async function() {
  const surahSelect = document.getElementById('surah-select');
  const ayahInput = document.getElementById('ayah-input');
  const resultContainer = document.getElementById('result-container');
  const emptyState = document.getElementById('empty-state');
  const verseTextEl = document.getElementById('verse-text');
  const verseRefEl = document.getElementById('verse-ref');
  const critiqueTextEl = document.getElementById('critique-text');

  if (!surahSelect.value || !ayahInput.value) return;

  // UI State: Loading
  emptyState.classList.add('hidden');
  resultContainer.classList.remove('hidden');
  
  // Mobile: Scroll to results
  if (window.innerWidth < 1024) {
    setTimeout(() => {
      resultContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }

  verseTextEl.innerHTML = '<span class="text-base text-slate-400 animate-pulse flex items-center justify-center gap-2 py-8"><i data-lucide="loader-2" class="animate-spin w-5 h-5"></i> جاري تحميل النص...</span>';
  if (window.lucide) window.lucide.createIcons();

  try {
      const surahNum = surahSelect.value;
      const ayahNum = ayahInput.value;
      const response = await fetch(`https://api.alquran.cloud/v1/ayah/${surahNum}:${ayahNum}`);
      const data = await response.json();
      
      if(data.status === 'OK') {
          verseTextEl.textContent = data.data.text;
          verseRefEl.textContent = `سورة ${data.data.surah.name} • الآية ${data.data.numberInSurah}`;
      } else {
          verseTextEl.textContent = "حدث خطأ في استرجاع النص، يرجى المحاولة مرة أخرى.";
      }

  } catch (error) {
      verseTextEl.textContent = "تعذر الاتصال بالخادم. تأكد من اتصالك بالإنترنت.";
      console.error(error);
  }

  const randomIndex = Math.floor(Math.random() * randomCritiques.length);
  critiqueTextEl.innerHTML = `
    ${randomCritiques[randomIndex]}
    <div class="mt-6 pt-4 border-t border-slate-700/50">
      <span class="text-xs font-mono text-amber-500/70 bg-amber-500/10 px-2 py-1 rounded">ملاحظة: هذا نص تجريبي للمعاينة</span>
    </div>
  `;
};

// --- Tailwind Configuration ---
// Wrap in check to prevent crashing if tailwind isn't loaded yet
if (typeof tailwind !== 'undefined') {
  tailwind.config = {
    theme: {
      extend: {
        fontFamily: {
          sans: ['IBM Plex Sans Arabic', 'sans-serif'],
          serif: ['Amiri', 'serif'],
        },
        colors: {
          primary: {
            50: '#f0f9ff',
            100: '#e0f2fe',
            500: '#6366f1', // Indigo
            600: '#4f46e5',
            700: '#4338ca',
          },
          surface: '#1e293b', // Slate 800
          background: '#0f172a', // Slate 900
        }
      }
    }
  };
}

// --- Data ---
const surahs = [
  { number: 1, name: "الفاتحة", verses: 7 },
  { number: 2, name: "البقرة", verses: 286 },
  { number: 3, name: "آل عمران", verses: 200 },
  { number: 4, name: "النساء", verses: 176 },
  { number: 5, name: "المائدة", verses: 120 },
  { number: 6, name: "الأنعام", verses: 165 },
  { number: 7, name: "الأعراف", verses: 206 },
  { number: 8, name: "الأنفال", verses: 75 },
  { number: 9, name: "التوبة", verses: 129 },
  { number: 10, name: "يونس", verses: 109 },
  { number: 11, name: "هود", verses: 123 },
  { number: 12, name: "يوسف", verses: 111 },
  { number: 13, name: "الرعد", verses: 43 },
  { number: 14, name: "إبراهيم", verses: 52 },
  { number: 15, name: "الحجر", verses: 99 },
  { number: 16, name: "النحل", verses: 128 },
  { number: 17, name: "الإسراء", verses: 111 },
  { number: 18, name: "الكهف", verses: 110 },
  { number: 19, name: "مريم", verses: 98 },
  { number: 20, name: "طه", verses: 135 },
  { number: 21, name: "الأنبياء", verses: 112 },
  { number: 22, name: "الحج", verses: 78 },
  { number: 23, name: "المؤمنون", verses: 118 },
  { number: 24, name: "النور", verses: 64 },
  { number: 25, name: "الفرقان", verses: 77 },
];

if(surahs.length < 114) {
   for(let i=surahs.length+1; i<=114; i++) {
       surahs.push({ number: i, name: `سورة رقم ${i}`, verses: 50 });
   }
}

const randomCritiques = [
  "<p>إحدى الإشكاليات الرئيسية في هذا الموضع تتعلق بالتوافق بين النص والسياق التاريخي الموثق. تشير الدراسات المقارنة إلى أن المفردات المستخدمة هنا كانت تحمل دلالات مختلفة في عصر ما قبل الإسلام، مما يغير المعنى المقصود تماماً عند إعادة قراءته في ضوء اللسانيات الحديثة.</p>",
  "<p>يلاحظ الناقد هنا وجود انقطاع في السياق السردي، وهو ما يفسره بعض الباحثين بكونه نتاجاً لعملية جمع وتدوين لاحقة. هذا الانتقال المفاجئ في الموضوع يثير تساؤلات حول وحدة النص وبنيته الأصلية.</p>",
  "<p>من المنظور الأخلاقي المعاصر، يطرح هذا الحكم إشكاليات عدة، خاصة عند محاولة تطبيقه خارج إطاره الزمني. الجمود على ظاهر النص هنا قد يؤدي إلى تعارض صريح مع مبادئ حقوق الإنسان العالمية المتفق عليها اليوم.</p>",
  "<p>هناك تباين واضح بين التفسير التقليدي وما تظهره الاكتشافات العلمية الحديثة. محاولات التوفيق (الإعجاز العلمي) هنا تبدو متكلفة وتفتقر إلى المنهجية العلمية الرصينة، حيث يتم ليّ عنق النص ليوافق حقيقة مكتشفة حديثاً.</p>"
];

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) window.lucide.createIcons();
  
  const surahSelect = document.getElementById('surah-select');
  const ayahInput = document.getElementById('ayah-input');
  const ayahHint = document.getElementById('ayah-max-hint');

  if (surahSelect && ayahInput && ayahHint) {
    surahs.forEach(surah => {
      const option = document.createElement('option');
      option.value = surah.number;
      option.textContent = `${surah.number}. ${surah.name}`;
      surahSelect.appendChild(option);
    });

    surahSelect.addEventListener('change', () => {
      const surahData = surahs.find(s => s.number == surahSelect.value);
      if(surahData) {
          ayahHint.textContent = `العدد المتاح: ${surahData.verses}`;
          ayahInput.max = surahData.verses;
          if(parseInt(ayahInput.value) > surahData.verses) {
              ayahInput.value = surahData.verses;
          }
      }
    });

    surahSelect.dispatchEvent(new Event('change'));
  }
});