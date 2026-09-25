import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productsApi } from '../../api/products';
import type { Product } from '../../types';
import styles from './ProductPage.module.css';
import logo from '../../assets/logo.png';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=470&h=420&fit=crop';

export function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (!id) {
      setError('Товар не знайдено');
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    productsApi
      .getById(Number(id))
      .then((data) => {
        if (!cancelled) {
          setProduct(data);
          setQty(1);
        }
      })
      .catch(() => {
        if (!cancelled) setError('Не вдалося завантажити товар');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className={styles.page}>
        <HeaderBlock />
        <div className={styles.stateMsg}>Завантаження...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className={styles.page}>
        <HeaderBlock />
        <div className={styles.stateMsg}>
          {error ?? 'Товар не знайдено'}
          <div>
            <Link to="/" className={styles.backLink}>← Повернутися на головну</Link>
          </div>
        </div>
      </div>
    );
  }

  const savedAmount = product.oldPrice ? product.oldPrice - product.price : 0;
  const discountPercent = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0;
  const maxQty = product.quantity ?? 99;

  const characteristics = [
    product.brandName && { label: 'Бренд', value: product.brandName },
    product.categoryName && { label: 'Категорія', value: product.categoryName },
    product.rating != null && { label: 'Рейтинг', value: `${product.rating} / 5` },
    product.reviewCount != null && { label: 'Відгуки', value: `${product.reviewCount}` },
    product.quantity != null && { label: 'В наявності', value: `${product.quantity} шт.` },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <div className={styles.page}>
      <HeaderBlock />

      <div className={styles.breadcrumbs}>
        <span className={styles.backArrow}>←</span>
        Головна {product.categoryName ? `/ ${product.categoryName}` : ''} / {product.name}
      </div>

      <div className={styles.card}>
        <div className={styles.left}>
          <h1 className={styles.title}>{product.name}</h1>

          <div className={styles.imageWrap}>
            {discountPercent > 0 && (
              <span className={styles.discountBadge}>-{discountPercent}%</span>
            )}
            <img
              src={product.imageUrl || FALLBACK_IMAGE}
              alt={product.name}
              className={styles.image}
            />
          </div>

          {savedAmount > 0 && (
            <div className={styles.savedBadge}>Економія {savedAmount} ₴</div>
          )}

          {characteristics.length > 0 && (
            <div className={styles.specs}>
              <h3>ХАРАКТЕРИСТИКИ</h3>
              {characteristics.map((c) => (
                <div key={c.label} className={styles.specRow}>
                  <span className={styles.specLabel}>{c.label}</span>
                  <span className={styles.specValue}>{c.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.right}>
          {product.description && (
            <p className={styles.description}>{product.description}</p>
          )}

          <div className={styles.priceRow}>
            <span className={styles.price}>{product.price.toLocaleString('uk-UA')} ₴</span>
            {product.oldPrice && (
              <span className={styles.oldPrice}>{product.oldPrice.toLocaleString('uk-UA')} ₴</span>
            )}
          </div>

          {product.badge && (
            <div className={styles.badges}>
              <span className={styles.badge}>{product.badge}</span>
            </div>
          )}

          <div className={styles.actions}>
            <div className={styles.qtyControl}>
              <button onClick={() => setQty((q) => Math.max(1, q - 1))}>-</button>
              <span>{qty}</span>
              <button onClick={() => setQty((q) => Math.min(maxQty, q + 1))}>+</button>
            </div>
            <button
              className={styles.addToCart}
              disabled={maxQty === 0}
              onClick={() => {
                // тут вызов cartApi.addItem({ productId: product.id, quantity: qty })
              }}
            >
              {maxQty === 0 ? 'Немає в наявності' : 'Додати в кошик 🛒'}
            </button>
            <button className={styles.favBtn}>♡</button>
          </div>

          <div className={styles.delivery}>
            <div>🚚 Доставка 1-3 дні по всій Україні</div>
            <div>↩️ Повернення товару протягом 14 днів</div>
            <div>🛡️ Гарантія 12 місяців</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HeaderBlock() {
  return (
    <header className={styles.header}>
      <Link to="/">
        <img src={logo} alt="BlitzMall — You can buy all" className={styles.logo} />
      </Link>
      <div className={styles.langSwitch}>
        <span className={styles.globeIcon}>🌐</span>
        <span>UA</span>
      </div>
    </header>
  );
}