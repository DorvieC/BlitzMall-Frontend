import { Link } from 'react-router-dom';
import type { Category } from '../../data/categories';
import styles from './CategoryDropdown.module.css';

interface CategoryDropdownProps {
  category: Category;
}

export function CategoryDropdown({ category }: CategoryDropdownProps) {
  return (
    <div className={styles.dropdown} role="menu" aria-label={category.name}>
      <div className={styles.dropdownCard}>
        {category.subcategories.map((sub) => (
          <Link
            key={sub}
            to={`/catalog?q=${encodeURIComponent(sub)}`}
            className={styles.dropdownLink}
            role="menuitem"
          >
            {sub}
          </Link>
        ))}
      </div>
    </div>
  );
}
