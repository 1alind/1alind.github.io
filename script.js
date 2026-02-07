// --- Navigation Logic (Global) ---
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
  
  // Re-initialize icons
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

  verseTextEl.innerHTML = '<span class="text-base text-slate-400 animate-pulse flex items-center justify-center gap-2 py-8"><i data-lucide="loader-2" class="animate-spin w-5 h-5"></i> جاري تحميل النص من الملفات المحلية...</span>';
  if (window.lucide) window.lucide.createIcons();

  try {
      const surahNum = surahSelect.value;
      const ayahNum = parseInt(ayahInput.value);
      
      // Fetch from local file: data/quran/1.json
      const response = await fetch(`data/quran/${surahNum}.json`);
      
      if (!response.ok) {
          throw new Error("File not found");
      }

      const data = await response.json();
      
      // Find the specific verse in the JSON array
      const verse = data.verses.find(v => v.numberInSurah === ayahNum);
      
      if(verse) {
          verseTextEl.textContent = verse.text;
          verseRefEl.textContent = `سورة ${data.name} • الآية ${verse.numberInSurah}`;
      } else {
          verseTextEl.textContent = "رقم الآية غير موجود في الملف.";
      }

  } catch (error) {
      console.error(error);
      verseTextEl.innerHTML = `<div class="text-red-400 text-sm leading-relaxed p-4 bg-red-500/10 rounded-lg border border-red-500/20">
        <strong>خطأ: لم يتم العثور على ملف السورة</strong><br/>
        (data/quran/${surahSelect.value}.json)<br/><br/>
        يرجى فتح <a href="download_quran.html" target="_blank" class="text-indigo-400 underline hover:text-indigo-300">أداة التحميل (download_quran.html)</a> لتحميل ملفات البيانات، ثم وضعها في مجلد <code>data/quran/</code>.
      </div>`;
  }

  const randomCritiques = [
    "<p>إحدى الإشكاليات الرئيسية في هذا الموضع تتعلق بالتوافق بين النص والسياق التاريخي الموثق.</p>",
    "<p>يلاحظ الناقد هنا وجود انقطاع في السياق السردي، وهو ما يفسره بعض الباحثين بكونه نتاجاً لعملية جمع وتدوين لاحقة.</p>",
    "<p>من المنظور الأخلاقي المعاصر، يطرح هذا الحكم إشكاليات عدة، خاصة عند محاولة تطبيقه خارج إطاره الزمني.</p>",
    "<p>هناك تباين واضح بين التفسير التقليدي وما تظهره الاكتشافات العلمية الحديثة.</p>"
  ];

  const randomIndex = Math.floor(Math.random() * randomCritiques.length);
  critiqueTextEl.innerHTML = `
    ${randomCritiques[randomIndex]}
    <div class="mt-6 pt-4 border-t border-slate-700/50">
      <span class="text-xs font-mono text-amber-500/70 bg-amber-500/10 px-2 py-1 rounded">ملاحظة: هذا نص تجريبي للمعاينة</span>
    </div>
  `;
};

// --- Tailwind Configuration ---
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
            500: '#6366f1',
            600: '#4f46e5',
            700: '#4338ca',
          },
          surface: '#1e293b',
          background: '#0f172a',
        }
      }
    }
  };
}

// --- Initialization ---
document.addEventListener('DOMContentLoaded', async () => {
  if (window.lucide) window.lucide.createIcons();
  
  const surahSelect = document.getElementById('surah-select');
  const ayahInput = document.getElementById('ayah-input');
  const ayahHint = document.getElementById('ayah-max-hint');

  if (surahSelect && ayahInput && ayahHint) {
    try {
        // Fetch the list of Surahs from the index file
        const response = await fetch('data/surahs.json');
        const surahs = await response.json();
        
        // Save to window for access in change handler
        window.allSurahsData = surahs;

        surahs.forEach(surah => {
          const option = document.createElement('option');
          option.value = surah.number;
          option.textContent = `${surah.number}. ${surah.name}`;
          surahSelect.appendChild(option);
        });

        // Setup Change Listener
        surahSelect.addEventListener('change', () => {
          const surahData = window.allSurahsData.find(s => s.number == surahSelect.value);
          if(surahData) {
              ayahHint.textContent = `العدد المتاح: ${surahData.verses}`;
              ayahInput.max = surahData.verses;
              // Reset input if out of bounds
              if(parseInt(ayahInput.value) > surahData.verses) {
                  ayahInput.value = 1;
              }
          }
        });

        // Trigger initial state
        surahSelect.dispatchEvent(new Event('change'));

    } catch (e) {
        console.error("Failed to load surahs.json", e);
        ayahHint.textContent = "خطأ في تحميل قائمة السور";
    }
  }
});