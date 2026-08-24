'use client';

import React, { useEffect, useState } from 'react';
import { Globe, Check } from 'lucide-react';

declare global {
  interface Window {
    google?: any;
    googleTranslateElementInit?: () => void;
  }
}

export const GoogleTranslator: React.FC = () => {
  const [currentLang, setCurrentLang] = useState<'vi' | 'en'>('vi');
  const [isOpen, setIsOpen] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    // Đọc cookie ngôn ngữ hiện tại
    const getCookieLang = () => {
      const match = document.cookie.match(/googtrans=\/vi\/([a-z]{2})/);
      if (match && (match[1] === 'en' || match[1] === 'vi')) {
        return match[1] as 'vi' | 'en';
      }
      return 'vi';
    };

    setCurrentLang(getCookieLang());

    // ── Patch Node.removeChild to survive Google Translate DOM moves ──────
    // Google Translate wraps text nodes in <font> tags and moves them, so
    // React's removeChild call fails with "node is not a child". We swallow
    // that specific error so it never reaches the Error Overlay.
    const originalRemoveChild = Node.prototype.removeChild;
    // @ts-ignore
    Node.prototype.removeChild = function <T extends Node>(child: T): T {
      if (child.parentNode !== this) {
        // Node was moved by Google Translate — silently ignore
        return child;
      }
      return originalRemoveChild.call(this, child) as T;
    };

    const originalInsertBefore = Node.prototype.insertBefore;
    // @ts-ignore
    Node.prototype.insertBefore = function <T extends Node>(newNode: T, refNode: Node | null): T {
      if (refNode && refNode.parentNode !== this) {
        return newNode;
      }
      return originalInsertBefore.call(this, newNode, refNode) as T;
    };

    // Khởi tạo MutationObserver để ngăn Google Translate đẩy layout xuống (top: 40px)
    const observer = new MutationObserver(() => {
      if (document.body.style.top && document.body.style.top !== '0px') {
        document.body.style.top = '0px';
      }
      if (document.body.style.position && document.body.style.position !== 'static') {
        document.body.style.position = 'static';
      }
    });

    observer.observe(document.body, { attributes: true, attributeFilter: ['style', 'class'] });

    // Khởi tạo hàm callback cho Google Translate
    window.googleTranslateElementInit = () => {
      if (window.google?.translate?.TranslateElement) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'vi',
            includedLanguages: 'vi,en',
            autoDisplay: false,
          },
          'google_translate_element'
        );
      }
    };

    // Nạp script Google Translate
    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      script.onload = () => setScriptLoaded(true);
      document.body.appendChild(script);
    } else {
      setScriptLoaded(true);
    }

    return () => {
      observer.disconnect();
      // Restore originals on cleanup
      Node.prototype.removeChild = originalRemoveChild;
      Node.prototype.insertBefore = originalInsertBefore;
    };
  }, []);

  const changeLanguage = (lang: 'vi' | 'en') => {
    if (lang === currentLang) {
      setIsOpen(false);
      return;
    }

    setCurrentLang(lang);
    setIsOpen(false);

    const domain = window.location.hostname;
    // Set cookie cho Google Translate
    if (lang === 'vi') {
      document.cookie = `googtrans=/vi/vi; path=/; domain=${domain}`;
      document.cookie = `googtrans=/vi/vi; path=/;`;
    } else {
      document.cookie = `googtrans=/vi/en; path=/; domain=${domain}`;
      document.cookie = `googtrans=/vi/en; path=/;`;
    }

    // Kích hoạt thay đổi trong select element của Google
    const select = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
    if (select) {
      select.value = lang;
      select.dispatchEvent(new Event('change'));
    } else {
      // Reload nhẹ để áp dụng toàn bộ DOM nếu select chưa sẵn sàng
      window.location.reload();
    }
  };

  return (
    <div className="relative">
      {/* Phần tử ngầm để Google Translate mount */}
      <div id="google_translate_element" className="hidden" />

      {/* Nút chuyển ngôn ngữ chính */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-amber-400 hover:border-amber-500/40 hover:bg-slate-800 transition cursor-pointer"
        title="Chuyển đổi ngôn ngữ / Switch language"
        aria-label="Language Selector"
      >
        <span className="text-sm">{currentLang === 'vi' ? '🇻🇳' : '🇬🇧'}</span>
        <span className="font-mono text-[11px] uppercase tracking-wider text-slate-200">
          {currentLang === 'vi' ? 'VI' : 'EN'}
        </span>
      </button>

      {/* Dropdown Menu chọn ngôn ngữ */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-44 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 mb-1">
              Ngôn Ngữ / Language
            </div>

            <button
              onClick={() => changeLanguage('vi')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                currentLang === 'vi'
                  ? 'bg-amber-500/15 text-amber-400 font-bold'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-base">🇻🇳</span>
                <span>Tiếng Việt</span>
              </div>
              {currentLang === 'vi' && <Check className="w-3.5 h-3.5 text-amber-400" />}
            </button>

            <button
              onClick={() => changeLanguage('en')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                currentLang === 'en'
                  ? 'bg-amber-500/15 text-amber-400 font-bold'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-base">🇬🇧</span>
                <span>English</span>
              </div>
              {currentLang === 'en' && <Check className="w-3.5 h-3.5 text-amber-400" />}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default GoogleTranslator;
