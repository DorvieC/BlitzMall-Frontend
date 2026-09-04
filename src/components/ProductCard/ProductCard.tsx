import StarRating from '../StarRating/StarRating';
import styles from './ProductCard.module.css';
import type { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.imageWrap}>
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className={styles.image} />
        ) : (
          <div className={styles.image} style={{ background: '#e5e7eb' }} />
        )}
        {product.badge && <span className={styles.badge}>{product.badge}</span>}
      </div>

      <div className={styles.body}>
        <div className={styles.name}>{product.name}</div>

        {product.rating !== undefined && (
          <div className={styles.ratingRow}>
            <StarRating value={product.rating} size={20} />
          </div>
        )}

        <div className={styles.priceRow}>
          <div>
            <span className={styles.price}>{product.price.toLocaleString('uk-UA')} ₴</span>
            {product.oldPrice && (
              <span className={styles.oldPrice}>{product.oldPrice.toLocaleString('uk-UA')} ₴</span>
            )}
          </div>
          <button
            className={styles.addToCart}
            onClick={(e) => { e.stopPropagation(); onAddToCart?.(product); }}
            aria-label="Додати в кошик"
          >
            🛒
          </button>
        </div>
      </div>
    </div>
  );
}
