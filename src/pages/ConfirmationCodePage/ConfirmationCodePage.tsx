import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthHeader from '../../components/AuthHeader/AuthHeader';
import styles from './ConfirmationCodePage.module.css';

export default function ConfirmationCodePage() {
  const navigate = useNavigate();
  const [code, setCode] = useState<string[]>(Array(6).fill(''));
  const [loading, setLoading] = useState(false);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (idx: number, val: string) => {
    const char = val.replace(/\D/g, '').slice(-1);
    const next = [...code];
    next[idx] = char;
    setCode(next);
    if (char && idx < 5) inputs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[idx] && idx > 0) inputs.current[idx - 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const next = Array(6).fill('');
    pasted.split('').forEach((c, i) => { next[i] = c; });
    setCode(next);
    inputs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.join('').length < 6) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); navigate('/new-password'); }, 600);
  };

  const handleResend = () => {
    setCode(Array(6).fill(''));
    inputs.current[0]?.focus();
  };

  return (
    <div className={styles.page}>
      <AuthHeader />

      <div className={styles.pageOuter}>
        <div className={styles.backRow}>
          <button className={styles.backArrow} onClick={() => navigate(-1)} aria-label="Назад">
            <svg width="24" height="16" viewBox="0 0 24 16" fill="none">
              <path d="M23 8H1M1 8L8 1M1 8L8 15" stroke="#323f37" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className={styles.greenArea}>
          <div className={styles.content}>
            <div className={styles.left}>
              <span className={styles.badge}>КОД НАДІСЛАНО</span>
              <div className={styles.titleRow}>
                <h1 className={styles.leftTitle}>Перевірте повідомлення</h1>
                <img
                  src="/illus-confirm-code.png"
                  alt="Перевірте повідомлення"
                  className={styles.illustration}
                />
              </div>

              <p className={styles.leftSub}>
                Ми надіслали 6-значний код підтвердження на вказаний email або
                номер телефону. Введіть його, щоб продовжити
              </p>

              <div className={styles.benefits}>
                <div className={styles.benefit}>
                  <svg className={styles.benefitIcon} viewBox="0 0 24 24" fill="none" stroke="#23753f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                  <span className={styles.benefitText}>Код дійсний протягом 10 хвилин</span>
                </div>
                <div className={styles.benefit}>
                  <svg className={styles.benefitIcon} viewBox="0 0 24 24" fill="none" stroke="#23753f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    <polyline points="9 12 11 14 15 10"/>
                  </svg>
                  <span className={styles.benefitText}>Нікому не повідомляйте цей код</span>
                </div>
                <div className={styles.benefit}>
                  <svg className={styles.benefitIcon} viewBox="0 0 24 24" fill="none" stroke="#23753f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 18v-6a9 9 0 0 1 18 0v6"/>
                    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
                  </svg>
                  <span className={styles.benefitText}>Підтримка 24/7 — ми завжди поруч</span>
                </div>
              </div>
            </div>
            <div className={styles.right}>
              <h2 className={styles.formTitle}>Введіть код підтвердження</h2>

              <form className={styles.form} onSubmit={handleSubmit} noValidate>
                <div className={styles.codeRow}>
                  {code.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => { inputs.current[idx] = el; }}
                      className={styles.codeInput}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      onPaste={idx === 0 ? handlePaste : undefined}
                      autoFocus={idx === 0}
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={loading || code.join('').length < 6}
                >
                  {loading ? 'Перевірка...' : 'Підтвердити'}
                </button>
                <div className={styles.accountLink}>
                  <span className={styles.accountLinkText}>
                    Не отримали код?{' '}
                    <button type="button" className={styles.resendBtn} onClick={handleResend}>
                      Надіслати повторно
                    </button>
                  </span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
