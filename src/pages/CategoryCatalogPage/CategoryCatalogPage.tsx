import { Link } from 'react-router-dom';
import { CATEGORIES } from '../../data/categories';
import styles from './CategoryCatalogPage.module.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import categoryFallback from '../../assets/images/category-fallback.png';

// эмодзи-иконки по id категории — временно, пока нет реальных иконок с бэка
const CATEGORY_ICONS: Record<string, string> = {
  categoryFallback,
  'home-kitchen': '🏠',
  clothing: '👕',
  beauty: '🌷',
  sport: '🏃',
  kids: '🧸',
  pets: '🐾',
};

export function CategoryCatalogPage() {
  return (
    <>
     <Header />
     
    <div className={styles.page}>
         
      <div className={styles.breadcrumbs}>Головна / Усі категорії</div>

      <h1 className={styles.title}>Каталог категорій</h1>

      <div className={styles.grid}>
        {CATEGORIES.map((cat) => (
          <div key={cat.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.icon}>{CATEGORY_ICONS[cat.id] ?? '📦'}</span>
              <span className={styles.catName}>{cat.name}</span>
            </div>

            <ul className={styles.subList}>
              {cat.subcategories.map((sub) => (
                <li key={sub}>
                  <Link to={`/category/${cat.id}?sub=${encodeURIComponent(sub)}`}>
                    {sub}
                  </Link>
                </li>
              ))}
            </ul>

            {/* количество товаров пока не приходит с бэка — раздел скрыт */}
          </div>
        ))}
      </div>
    </div>
    <Footer/>
    </>
  );
}