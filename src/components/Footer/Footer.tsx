import { useState } from 'react';
import styles from './Footer.module.css';

export default function Footer() {
  const [email, setEmail] = useState('');

  return (
    <footer className={styles.footer}>
      <div className={styles.statsBar}>
        <div className={styles.statItem}>
          <div className={styles.statText}>10 000 + товарів онлайн</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statText}>95 % позитивних відгуків</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statText}>24/7 підтримка</div>
        </div>
      </div>

      <div className={styles.newsletter}>
        <div className={styles.newsletterText}>
          Підпишись на розсилку і отримуйте знижку 5%
        </div>
        <div className={styles.newsletterForm}>
          <input
            className={styles.newsletterInput}
            type="email"
            placeholder="Ваш e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className={styles.newsletterBtn}>Підписатися</button>
        </div>
      </div>

      <div className={styles.linksRow}>
        <div className={styles.linkGroup}>
          <h4>Покупцям</h4>
          <ul>
            <li>Доставка і оплата</li>
            <li>Гарантія та повернення</li>
            <li>Питання та відповіді</li>
          </ul>
        </div>
        <div className={styles.linkGroup}>
          <h4>Про нас</h4>
          <ul>
            <li>Про компанію</li>
            <li>Контакти</li>
            <li>Блог</li>
          </ul>
        </div>
        <div className={styles.linkGroup}>
          <h4>Допомога</h4>
          <ul>
            <li>Підтримка 24/7</li>
            <li>Умови користування</li>
            <li>Політика конфіденційності</li>
          </ul>
        </div>
      </div>

      <div className={styles.socialRow}>
        <span className={styles.socialTitle}>Ми в соцмережах</span>
        <div className={styles.socialIcons}>
          <button className={styles.socialBtn} aria-label="Instagram">📷</button>
          <button className={styles.socialBtn} aria-label="Facebook">f</button>
          <button className={styles.socialBtn} aria-label="Telegram">✈️</button>
        </div>
      </div>

      <div className={styles.bottom}>
        <span className={styles.copyright}>© 2026 BlitzMall</span>
      </div>
    </footer>
  );
}
