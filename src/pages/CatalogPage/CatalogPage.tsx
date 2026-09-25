import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import { productsApi } from '../../api/products';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import type { Product } from '../../types';
import styles from './CatalogPage.module.css';

const PAGE_SIZE = 12;

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addedIds, setAddedIds] = useState<Set<number>>(new Set());

  const q = searchParams.get('q') || '';
  const minPriceParam = searchParams.get('minPrice') || '';
  const maxPriceParam = searchParams.get('maxPrice') || '';
  const page = Number(searchParams.get('page') || '1');

  const [localQ, setLocalQ] = useState(q);
  const [localMin, setLocalMin] = useState(minPriceParam);
  const [localMax, setLocalMax] = useState(maxPriceParam);

  useEffect(() => {
    setLocalQ(q);
  }, [q]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await productsApi.search({
        q: q || undefined,
        minPrice: minPriceParam ? Number(minPriceParam) : undefined,
        maxPrice: maxPriceParam ? Number(maxPriceParam) : undefined,
        page,
        pageSize: PAGE_SIZE,
      });
      setProducts(result.items);
      setTotalPages(result.totalPages);
      setTotalCount(result.totalCount);
    } catch {
      setError('Не вдалося завантажити товари');
    } finally {
      setLoading(false);
    }
  }, [q, minPriceParam, maxPriceParam, page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const next = new URLSearchParams(searchParams);
    if (localQ.trim()) next.set('q', localQ.trim()); else next.delete('q');
    if (localMin) next.set('minPrice', localMin); else next.delete('minPrice');
    if (localMax) next.set('maxPrice', localMax); else next.delete('maxPrice');
    next.set('page', '1');
    setSearchParams(next);
  };

  const handlePageChange = (newPage: number) => {
    const next = new URLSearchParams(searchParams);
    next.set('page', String(newPage));
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = async (e: React.MouseEvent, productId: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) { navigate('/login'); return; }
    try {
      await addItem(productId);
      setAddedIds(prev => new Set(prev).add(productId));
      setTimeout(() => {
        setAddedIds(prev => { const next = new Set(prev); next.delete(productId); return next; });
      }, 2000);
    } catch {}
  };

  const handleClearFilters = () => {
    setLocalQ('');
    setLocalMin('');
    setLocalMax('');
    setSearchParams({});
  };

  const hasFilters = q || minPriceParam || maxPriceParam;

  return (
    <div className={styles.page}>
      <Header />
      <div className={styles.inner}>
        <div className={styles.breadcrumbs}>
          <Link to="/" className={styles.breadcrumb}>Головна</Link>
          <span className={styles.breadcrumbSep}>/</span>
          <span>Каталог</span>
          {q && <><span className={styles.breadcrumbSep}>/</span><span>{q}</span></>}
        </div>

        <div className={styles.layout}>
          <aside className={styles.sidebar}>
            <form className={styles.filterForm} onSubmit={handleSearch}>
              <h3 className={styles.filterTitle}>Фільтри</h3>

              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Пошук</label>
                <input
                  className={styles.filterInput}
                  type="text"
                  placeholder="Назва товару..."
                  value={localQ}
                  onChange={e => setLocalQ(e.target.value)}
                />
              </div>

              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Ціна (₴)</label>
                <div className={styles.priceRow}>
                  <input
                    className={styles.filterInput}
                    type="number"
                    placeholder="від"
                    min={0}
                    value={localMin}
                    onChange={e => setLocalMin(e.target.value)}
                  />
                  <span className={styles.priceDash}>—</span>
                  <input
                    className={styles.filterInput}
                    type="number"
                    placeholder="до"
                    min={0}
                    value={localMax}
                    onChange={e => setLocalMax(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className={styles.filterBtn}>Застосувати</button>
              {hasFilters && (
                <button type="button" className={styles.filterClearBtn} onClick={handleClearFilters}>
                  Скинути фільтри
                </button>
              )}
            </form>
          </aside>

          <main className={styles.main}>
            <div className={styles.topBar}>
              <h1 className={styles.pageTitle}>
                {q ? `Результати: «${q}»` : 'Каталог товарів'}
              </h1>
              {!loading && (
                <span className={styles.count}>
                  {totalCount} {totalCount === 1 ? 'товар' : 'товарів'}
                </span>
              )}
            </div>

            {loading && (
              <div className={styles.grid}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className={styles.skeletonCard} />
                ))}
              </div>
            )}

            {!loading && error && (
              <div className={styles.errorMsg}>{error}</div>
            )}

            {!loading && !error && products.length === 0 && (
              <div className={styles.empty}>
                <div className={styles.emptyIcon}>🔍</div>
                <p>Нічого не знайдено</p>
                {hasFilters && (
                  <button className={styles.filterClearBtn} onClick={handleClearFilters}>
                    Скинути фільтри
                  </button>
                )}
              </div>
            )}

            {!loading && !error && products.length > 0 && (
              <div className={styles.grid}>
                {products.map(product => (
                  <Link
                    key={product.id}
                    to={`/product/${product.id}`}
                    className={styles.card}
                  >
                    <div className={styles.imgWrap}>
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className={styles.img} />
                      ) : (
                        <div className={styles.imgPlaceholder}>📦</div>
                      )}
                    </div>
                    <div className={styles.info}>
                      <span className={styles.category}>{product.categoryName}</span>
                      <p className={styles.name}>{product.name}</p>
                      {product.rating != null && (
                        <div className={styles.ratingRow}>
                          <span className={styles.stars}>{'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}</span>
                          <span className={styles.reviewCount}>({product.reviewCount ?? 0})</span>
                        </div>
                      )}
                      <div className={styles.priceRow}>
                        <span className={styles.price}>{product.price.toLocaleString('uk-UA')} ₴</span>
                        {product.oldPrice && (
                          <span className={styles.oldPrice}>{product.oldPrice.toLocaleString('uk-UA')} ₴</span>
                        )}
                      </div>
                    </div>
                    <button
                      className={`${styles.cartBtn} ${addedIds.has(product.id) ? styles.cartBtnAdded : ''}`}
                      onClick={e => handleAddToCart(e, product.id)}
                    >
                      {addedIds.has(product.id) ? '✓ Додано' : 'В кошик'}
                    </button>
                  </Link>
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  className={styles.pageBtn}
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page <= 1}
                >←</button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
                  .reduce<(number | '...')[]>((acc, p, i, arr) => {
                    if (i > 0 && (p as number) - (arr[i - 1] as number) > 1) acc.push('...');
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, i) =>
                    p === '...' ? (
                      <span key={`ellipsis-${i}`} className={styles.pageDots}>…</span>
                    ) : (
                      <button
                        key={p}
                        className={`${styles.pageBtn} ${p === page ? styles.pageBtnActive : ''}`}
                        onClick={() => handlePageChange(p as number)}
                      >
                        {p}
                      </button>
                    )
                  )}

                <button
                  className={styles.pageBtn}
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= totalPages}
                >→</button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
