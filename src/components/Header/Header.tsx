import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import styles from './Header.module.css';

import searchIcon   from '../../assets/icons/search.svg';
import deliveryIcon from '../../assets/icons/delivery-truck.svg';
import globeIcon    from '../../assets/icons/globe.svg';
import accountIcon  from '../../assets/icons/account.svg';
import cartIcon     from '../../assets/icons/cart.svg';
import logoImg      from '../../assets/images/logo-full.png';

const CATEGORIES = [
  'Електроніка',
  'Дім і кухня',
  'Одяг і взуття',
  "Краса і здовов'я",
  'Спорт і відпочинок',
  'Дитячі товари',
  'Зоотовари',
];

interface HeaderProps {
  full?: boolean;
}

export default function Header({ full = true }: HeaderProps) {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) navigate(`/?search=${encodeURIComponent(query)}`);
  };

  return (
    <header className={styles.header}>
      <div className={styles.topBar}>
        <Link to="/" className={styles.logo}>
          <img src={logoImg} alt="BlitzMall" className={styles.logoImg} />
        </Link>

        {full && (
          <form className={styles.searchWrap} onSubmit={handleSearch}>
            <input
              className={styles.searchInput}
              type="text"
              placeholder="Шукайте що завгодно"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className={styles.searchBtn}>
              <img src={searchIcon} alt="Пошук" />
            </button>
          </form>
        )}

        <div className={styles.actions}>
          <div className={styles.deliveryGroup}>
            <img src={deliveryIcon} alt="" className={styles.deliveryIcon} />
            <span className={styles.deliveryLabel}>Доставка</span>
          </div>

          <div className={styles.langGroup}>
            <img src={globeIcon} alt="" className={styles.langIcon} />
            <span className={styles.langText}>UA</span>
          </div>

          <span className={styles.currency}>₴</span>

          {isAuthenticated ? (
            <img src={accountIcon} alt="Акаунт" className={styles.accountIcon} onClick={logout} />
          ) : (
            <Link to="/login">
              <img src={accountIcon} alt="Акаунт" className={styles.accountIcon} />
            </Link>
          )}

          <Link to="/cart" className={styles.cartWrap}>
            <img src={cartIcon} alt="Кошик" className={styles.cartIcon} />
            <span className={styles.cartBadge}>0</span>
          </Link>
        </div>
      </div>

      {full && (
        <nav className={styles.catNav}>
          <button className={styles.catAllBtn}>Усі категорії</button>
          <div className={styles.catLinks}>
            {CATEGORIES.map((cat) => (
              <span key={cat} className={styles.catLink}>{cat}</span>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
