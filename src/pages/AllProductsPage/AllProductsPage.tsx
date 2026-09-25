import { useState } from 'react';
import { CATEGORIES } from '../../data/categories';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import styles from './AllProductsPage.module.css';

const SORT_OPTIONS = [
  'За популярністю',
  'Спочатку дешевші',
  'Спочатку дорожчі',
  'За рейтингом',
  'Новинки',
];

export function AllProductsPage() {
  const [categoryId, setCategoryId] = useState('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState(SORT_OPTIONS[0]);

  return (
    <>
      <Header />

      <div className={styles.page}>
        <div className={styles.breadcrumbs}>Головна / Каталог / Усі товари</div>

        <div className={styles.layout}>
          <aside className={styles.sidebar}>
            <h2 className={styles.sidebarTitle}>Фільтри</h2>

            <div className={styles.filterBlock}>
              <label className={styles.filterLabel}>Категорія</label>
              <select
                className={styles.select}
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <option value="all">Усі категорії</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.filterBlock}>
              <label className={styles.filterLabel}>Ціна, ₴</label>
              <div className={styles.priceInputs}>
                <input
                  type="number"
                  placeholder="Від"
                  className={styles.priceInput}
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="До"
                  className={styles.priceInput}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
            </div>
          </aside>

          <main className={styles.content}>
            <div className={styles.contentHeader}>
              <div>
                <h1 className={styles.title}>Усі товари</h1>
                <span className={styles.count}>13800 товарів</span>
              </div>

              <div className={styles.sortBlock}>
                <span className={styles.sortLabel}>Сортувати</span>
                <select
                  className={styles.select}
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.placeholder}>...</div>
          </main>
        </div>
      </div>

      <Footer />
    </>
  );
}