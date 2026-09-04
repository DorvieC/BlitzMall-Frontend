import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';
import AuthHeader from '../../components/AuthHeader/AuthHeader';
import styles from './RegisterPage.module.css';

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

interface Errors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  agreeTerms?: string;
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState<FormState>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

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

    if (!form.firstName.trim()) errs.firstName = "Вкажіть ім'я";
    if (!form.lastName.trim())  errs.lastName  = 'Вкажіть прізвище';

    if (!form.email.trim()) {
      errs.email = 'Вкажіть email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Невірний формат email';
    }

    if (!form.password) {
      errs.password = 'Вкажіть пароль';
    } else if (form.password.length < 8) {
      errs.password = 'Мінімум 8 символів';
    }

    if (!form.confirmPassword) {
      errs.confirmPassword = 'Підтвердіть пароль';
    } else if (form.password !== form.confirmPassword) {
      errs.confirmPassword = 'Паролі не співпадають';
    }

    if (!form.agreeTerms) errs.agreeTerms = 'Прийміть умови використання';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setServerError('');

    try {
      const response = await authApi.register({
        name: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        password: form.password,
        confirmPassword: form.confirmPassword,
      });
      login(response.token, response.user);
      navigate('/');
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setServerError(e.response?.data?.message || 'Помилка реєстрації. Спробуйте ще раз.');
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
            <h1 className={styles.leftTitle}>Приєднуйтесь до BlitzMall</h1>
            <p className={styles.leftSub}>
              Створіть акаунт і отримайте знижку 5% на перше замовлення та
              доступ до 10 000+ товарів онлайн
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
          <h2 className={styles.formTitle}>Створити акаунт</h2>
          <p className={styles.formSub}>
            Вже маєте акаунт?{' '}
            <Link to="/login">Увійти</Link>
          </p>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.row2}>
              <div className={styles.field}>
                <label className={styles.label}>Ім'я</label>
                <input
                  className={`${styles.input} ${errors.firstName ? styles.error : ''}`}
                  type="text"
                  placeholder="Ваше Ім'я"
                  value={form.firstName}
                  onChange={set('firstName')}
                />
                {errors.firstName && <span className={styles.errorMsg}>{errors.firstName}</span>}
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Прізвище</label>
                <input
                  className={`${styles.input} ${errors.lastName ? styles.error : ''}`}
                  type="text"
                  placeholder="Ваше прізвище"
                  value={form.lastName}
                  onChange={set('lastName')}
                />
                {errors.lastName && <span className={styles.errorMsg}>{errors.lastName}</span>}
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Email</label>
              <input
                className={`${styles.input} ${errors.email ? styles.error : ''}`}
                type="email"
                placeholder="example@mail.com"
                value={form.email}
                onChange={set('email')}
              />
              {errors.email && <span className={styles.errorMsg}>{errors.email}</span>}
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Номер телефону</label>
              <input
                className={styles.input}
                type="tel"
                placeholder="+380 XX XXX XX XX"
                value={form.phone}
                onChange={set('phone')}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Пароль</label>
              <input
                className={`${styles.input} ${errors.password ? styles.error : ''}`}
                type="password"
                placeholder="Мінімум 8 символів"
                value={form.password}
                onChange={set('password')}
              />
              {form.password.length > 0 && (
                <div className={styles.strengthWrap}>
                  {[1,2,3,4].map(i => {
                    const len = form.password.length;
                    const hasUpper = /[A-Z]/.test(form.password);
                    const hasNum = /[0-9]/.test(form.password);
                    const hasSpecial = /[^A-Za-z0-9]/.test(form.password);
                    const score = (len >= 8 ? 1 : 0) + (len >= 12 ? 1 : 0) + (hasUpper && hasNum ? 1 : 0) + (hasSpecial ? 1 : 0);
                    const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e'];
                    return (
                      <div
                        key={i}
                        className={styles.strengthBar}
                        style={{ background: i <= score ? colors[score - 1] : '#e5e7eb' }}
                      />
                    );
                  })}
                  <span className={styles.strengthLabel}>
                    {form.password.length < 8 ? 'Слабкий' :
                     form.password.length < 12 ? 'Середній' :
                     /[^A-Za-z0-9]/.test(form.password) ? 'Дуже сильний' : 'Сильний'}
                  </span>
                </div>
              )}
              {errors.password && <span className={styles.errorMsg}>{errors.password}</span>}
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Підтвердіть пароль</label>
              <input
                className={`${styles.input} ${errors.confirmPassword ? styles.error : ''}`}
                type="password"
                placeholder="Повторіть пароль"
                value={form.confirmPassword}
                onChange={set('confirmPassword')}
              />
              {errors.confirmPassword && <span className={styles.errorMsg}>{errors.confirmPassword}</span>}
            </div>

            <label className={styles.terms}>
              <input type="checkbox" checked={form.agreeTerms} onChange={set('agreeTerms')} />
              <span>
                Я погоджуюсь з{' '}
                <a href="#">умовами користування</a> та{' '}
                <a href="#">політикою конфіденційності</a>
              </span>
            </label>
            {errors.agreeTerms && <span className={styles.errorMsg}>{errors.agreeTerms}</span>}

            {serverError && <div className={styles.serverError}>{serverError}</div>}

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Реєстрація...' : 'Зареєструватися'}
            </button>

            <div className={styles.divider}>або увійти за допомогою</div>

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
