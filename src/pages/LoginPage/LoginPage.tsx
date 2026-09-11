import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';
import AuthHeader from '../../components/AuthHeader/AuthHeader';
import styles from './LoginPage.module.css';

interface FormState {
  email: string;
  password: string;
  remember: boolean;
}

interface Errors {
  email?: string;
  password?: string;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState<FormState>({ email: '', password: '', remember: false });
  const [errors, setErrors] = useState<Errors>({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const errs: Errors = {};
    if (!form.email.trim())    errs.email    = 'Вкажіть email або телефон';
    if (!form.password.trim()) errs.password = 'Вкажіть пароль';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setServerError('');

    try {
      const response = await authApi.login({ email: form.email, password: form.password });
      login(response.token, response.user);
      navigate('/');
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setServerError(e.response?.data?.message || 'Невірний email або пароль');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <AuthHeader />
      <div className={styles.main}>
        <div className={styles.left}>
          <div className={styles.leftTop}>
            <span className={styles.badge}>З ПОВЕРНЕННЯМ</span>
            <h1 className={styles.leftTitle}>Раді бачити вас знову</h1>
            <p className={styles.leftSub}>
              Увійдіть щоб продовжити покупки, стежити за замовленнями та
              користуватися знижками для постійних клієнтів.
            </p>
          </div>

          <div className={styles.benefits}>
            <div className={styles.benefit}>
              <svg className={styles.benefitIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <span className={styles.benefitText}>Гарантія якості на всі товари</span>
            </div>
            <div className={styles.benefit}>
              <svg className={styles.benefitIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 4v6h6M23 20v-6h-6"/>
                <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
              </svg>
              <span className={styles.benefitText}>Повернення товару протягом 14 днів</span>
            </div>
            <div className={styles.benefit}>
              <svg className={styles.benefitIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 18v-6a9 9 0 0 1 18 0v6"/>
                <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
              </svg>
              <span className={styles.benefitText}>Підтримка 24/7 — ми завжди поруч</span>
            </div>
          </div>
        </div>

        <div className={styles.right}>
          <h2 className={styles.formTitle}>Вхід в акаунт</h2>
          <p className={styles.formSub}>
            Немає акаунту?{' '}
            <Link to="/register">Зареєструватися</Link>
          </p>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.field}>
              <label className={styles.label}>Email або телефон</label>
              <input
                className={`${styles.input} ${errors.email ? styles.error : ''}`}
                type="text"
                placeholder="example@mail.com або +380 XX XXX XX XX"
                value={form.email}
                onChange={set('email')}
              />
              {errors.email && <span className={styles.errorMsg}>{errors.email}</span>}
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Пароль</label>
              <input
                className={`${styles.input} ${errors.password ? styles.error : ''}`}
                type="password"
                placeholder="Введіть пароль"
                value={form.password}
                onChange={set('password')}
              />
              {errors.password && <span className={styles.errorMsg}>{errors.password}</span>}
            </div>

            <div className={styles.rememberRow}>
              <label className={styles.rememberLabel}>
                <input type="checkbox" checked={form.remember} onChange={set('remember')} />
                Запам'ятати мене
              </label>
              <span className={styles.forgotLink}>Забули пароль?</span>
            </div>

            {serverError && <div className={styles.serverError}>{serverError}</div>}

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Вхід...' : 'Увійти'}
            </button>

            <div className={styles.divider}>або увійдіть через</div>

            <div className={styles.socialBtns}>
              <button type="button" className={styles.socialBtn}>
                <svg width="20" height="20" viewBox="0 0 48 48">
                  <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34.5 6.5 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 20-8.9 20-20 0-1.2-.1-2.3-.4-3.5z"/>
                  <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34.5 6.5 29.5 4 24 4 16.3 4 9.7 8.4 6.3 14.7z"/>
                  <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5l-6.2-5.2C29.4 35.6 26.8 36 24 36c-5.2 0-9.6-2.9-11.3-7l-6.5 5C9.8 40 16.4 44 24 44z"/>
                  <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.3 5.5l6.2 5.2C41 35.1 44 30 44 24c0-1.2-.1-2.3-.4-3.5z"/>
                </svg>
                Google
              </button>
              <button type="button" className={styles.socialBtn}>
                <svg width="20" height="20" viewBox="0 0 48 48">
                  <path fill="#1877F2" d="M48 24C48 10.7 37.3 0 24 0S0 10.7 0 24c0 12 8.8 21.9 20.3 23.7V30.9h-6.1V24h6.1v-5.3c0-6 3.6-9.4 9.1-9.4 2.6 0 5.4.5 5.4.5v5.9h-3c-3 0-3.9 1.9-3.9 3.8V24h6.7l-1.1 6.9h-5.6v16.8C39.2 45.9 48 36 48 24z"/>
                  <path fill="#fff" d="M33.4 30.9l1.1-6.9h-6.7v-4.5c0-1.9.9-3.8 3.9-3.8h3v-5.9s-2.7-.5-5.4-.5c-5.5 0-9.1 3.3-9.1 9.4V24h-6.1v6.9h6.1v16.8c1.2.2 2.5.3 3.8.3s2.6-.1 3.8-.3V30.9h5.6z"/>
                </svg>
                Facebook
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
