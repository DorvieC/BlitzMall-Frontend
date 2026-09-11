import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ALL_CATEGORIES, CATEGORIES } from '../../data/categories';
import { CategoryDropdown } from '../CategoryDropdown/CategoryDropdown';
import styles from './Header.module.css';

import searchIcon   from '../../assets/icons/search.svg';
import deliveryIcon from '../../assets/icons/delivery-truck.svg';
import globeIcon    from '../../assets/icons/globe.svg';
import accountIcon  from '../../assets/icons/account.svg';
import cartIcon     from '../../assets/icons/cart.svg';
import logoImg      from '../../assets/images/logo-full.png';

interface HeaderProps {
  full?: boolean;
}

export default function Header({ full = true }: HeaderProps) {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) navigate(`/?search=${encodeURIComponent(query)}`);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setHoveredTab(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
        <nav ref={navRef} className={styles.catNav}>
          <div
            className={styles.catTab}
            onMouseEnter={() => setHoveredTab(ALL_CATEGORIES.id)}
            onMouseLeave={() => setHoveredTab(null)}
          >
            <button type="button" className={styles.catAllBtn}>
              {ALL_CATEGORIES.name}
            </button>
            {hoveredTab === ALL_CATEGORIES.id && (
              <CategoryDropdown category={ALL_CATEGORIES} />
            )}
          </div>

          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              className={styles.catTab}
              onMouseEnter={() => setHoveredTab(cat.id)}
              onMouseLeave={() => setHoveredTab(null)}
            >
              <button type="button" className={styles.catLink}>
                {cat.name}
              </button>
              {hoveredTab === cat.id && <CategoryDropdown category={cat} />}
            </div>
          ))}
        </nav>
      )}
    </header>
  );
}
