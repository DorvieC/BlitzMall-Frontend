import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { useAuth } from '../../context/AuthContext';
import { profileApi, type ProfileDto } from '../../api/profile';
import { ordersApi } from '../../api/orders';
import { productsApi } from '../../api/products';
import type { OrderDto, Product } from '../../types';
import styles from './ProfilePage.module.css';

const FAVORITES_KEY = 'blitzmall_favorites';

function loadFavoriteIds(): number[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? (JSON.parse(raw) as number[]) : [];
  } catch {
    return [];
  }
}

const STATUS_LABEL: Record<string, string> = {
  Pending: 'Очікує',
  Paid: 'Оплачено',
  Processing: 'Обробляється',
  Shipped: 'В дорозі',
  Delivered: 'Доставлено',
  Cancelled: 'Скасовано',
};

type Tab =
  | 'profile'
  | 'orders'
  | 'returns'
  | 'compare'
  | 'reviews'
  | 'subscriptions'
  | 'coupons'
  | 'bonuses'
  | 'addresses'
  | 'cards'
  | 'notifications'
  | 'favorites';

const NAV_ITEMS: { id: Tab; label: string }[] = [
  { id: 'profile', label: 'Профіль' },
  { id: 'orders', label: 'Замовлення' },
  { id: 'returns', label: 'Повернення' },
  { id: 'compare', label: 'Порівняння' },
  { id: 'reviews', label: 'Мої відгуки' },
  { id: 'subscriptions', label: 'Підписки' },
  { id: 'coupons', label: 'Купони' },
  { id: 'bonuses', label: 'Мої бонуси' },
  { id: 'addresses', label: 'Адреси доставки' },
  { id: 'cards', label: 'Мої картки' },
  { id: 'notifications', label: 'Сповіщення' },
];

const NOT_IMPLEMENTED: Record<string, string> = {
  returns: 'У вас ще немає повернень.',
  compare: 'Список товарів для порівняння порожній.',
  reviews: 'Ви ще не залишали відгуків.',
  subscriptions: 'У вас немає активних підписок.',
  coupons: 'Немає доступних купонів.',
  addresses: 'Немає збережених адрес доставки.',
  cards: 'Немає збережених банківських карток.',
  notifications: 'Немає нових сповіщень.',
};

export default function ProfilePage() {
  const { user, isAuthenticated, updateUser } = useAuth();

  const [tab, setTab] = useState<Tab>('profile');
  const [profile, setProfile] = useState<ProfileDto | null>(null);
  const [loading, setLoading] = useState(true);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [saveErr, setSaveErr] = useState('');

  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);

  const loadProfile = useCallback(() => {
    profileApi
      .getMe()
      .then((p) => {
        setProfile(p);
        const parts = p.name.trim().split(' ');
        setFirstName(parts[0] ?? '');
        setLastName(parts.slice(1).join(' '));
        setPhone(p.phone ?? '');
        setBirthDate(p.birthDate ? p.birthDate.slice(0, 10) : '');
      })
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    loadProfile();
    ordersApi
      .getMyOrders()
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setOrdersLoading(false));
  }, [isAuthenticated, loadProfile]);

  useEffect(() => {
    const ids = loadFavoriteIds();
    if (ids.length === 0) {
      setFavoriteProducts([]);
      return;
    }
    Promise.all(ids.map((id) => productsApi.getById(id).catch(() => null))).then((results) => {
      setFavoriteProducts(results.filter((p): p is Product => !!p));
    });
  }, [tab]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveMsg('');
    setSaveErr('');
    try {
      const name = `${firstName.trim()} ${lastName.trim()}`.trim();
      const updated = await profileApi.updateMe({
        name: name || undefined,
        phone: phone || undefined,
        birthDate: birthDate ? new Date(birthDate).toISOString() : undefined,
      });
      setProfile(updated);
      updateUser({ name: updated.name, phone: updated.phone });
      setSaveMsg('Зміни збережено');
    } catch {
      setSaveErr('Не вдалося зберегти зміни. Спробуйте ще раз.');
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <div className={styles.page}>
        <Header />
        <div style={{ maxWidth: 600, margin: '80px auto', textAlign: 'center' }}>
          <h2>Ви не авторизовані</h2>
          <Link to="/login">Увійти</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const initials = (profile?.name ?? user.name)
    .split(' ')
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const activeOrdersCount = orders.filter((o) => o.orderStatus !== 'Cancelled').length;

  return (
    <div className={styles.page}>
      <Header />

      <div className={styles.inner}>
        <div className={styles.crumbs}>
          <Link to="/">Головна</Link>
          <span>/</span>
          <span className={styles.crumbsCurrent}>Особистий кабінет</span>
        </div>

        <div className={styles.panel}>
          <div className={styles.layout}>
            <aside className={styles.sidebar}>
              <h2 className={styles.sidebarTitle}>Особистий кабінет</h2>
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`${styles.navItem} ${tab === item.id ? styles.navActive : ''}`}
                  onClick={() => setTab(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </aside>

            <div className={styles.main}>
              {tab === 'profile' && (
                <>
                  <div className={styles.topRow}>
                    <div className={styles.leftCol}>
                      <div className={styles.identityRow}>
                        <div className={styles.avatar}>{initials || 'ОК'}</div>
                        <div className={styles.identityInfo}>
                          <h1 className={styles.name}>{profile?.name ?? user.name}</h1>
                          <div className={styles.contactRow}>
                            <span className={styles.contactEmail}>{profile?.email ?? user.email}</span>
                            {phone && <span className={styles.contactPhone}>{phone}</span>}
                          </div>
                        </div>
                      </div>

                      <form onSubmit={handleSave}>
                        <div className={styles.fieldsGrid}>
                          <div className={styles.field}>
                            <label className={styles.fieldLabel}>Ім'я</label>
                            <input
                              className={styles.fieldInput}
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                              placeholder="Ваше ім'я"
                            />
                          </div>
                          <div className={styles.field}>
                            <label className={styles.fieldLabel}>Прізвище</label>
                            <input
                              className={styles.fieldInput}
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                              placeholder="Ваше прізвище"
                            />
                          </div>
                          <div className={styles.field}>
                            <label className={styles.fieldLabel}>Телефон</label>
                            <input
                              className={styles.fieldInput}
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              placeholder="+380 XX XXX XX XX"
                            />
                          </div>
                          <div className={styles.field}>
                            <label className={styles.fieldLabel}>Дата народження</label>
                            <input
                              className={styles.fieldInput}
                              type="date"
                              value={birthDate}
                              onChange={(e) => setBirthDate(e.target.value)}
                            />
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 24 }}>
                          <button type="submit" className={styles.saveBtn} disabled={saving}>
                            {saving ? 'Збереження...' : 'Зберегти зміни'}
                          </button>
                          {saveMsg && <span className={styles.saveMsg}>{saveMsg}</span>}
                          {saveErr && <span className={styles.saveErr}>{saveErr}</span>}
                        </div>
                      </form>
                    </div>

                    <div className={styles.loyaltyCard}>
                      <h3 className={styles.loyaltyTitle}>{profile?.level ?? 'Бронзовий'} рівень</h3>
                      <p className={styles.loyaltyBonuses}>{profile?.bonuses ?? 0} бонусів</p>
                      <p className={styles.loyaltyCashback}>Кешбек 2% з кожного замовлення</p>
                      <div className={styles.progressTrack}>
                        <div
                          className={styles.progressFill}
                          style={{ width: `${profile?.levelProgressPercent ?? 0}%` }}
                        />
                      </div>
                      <p className={styles.loyaltyHint}>{profile?.nextLevelHint ?? ''}</p>
                      <button type="button" className={styles.spendBtn} onClick={() => setTab('bonuses')}>
                        Витратити
                      </button>
                    </div>
                  </div>

                  <div className={styles.statsRow}>
                    <button type="button" className={styles.statCard} onClick={() => setTab('orders')}>
                      <span>Замовлення</span>
                      <span className={styles.statValue}>{activeOrdersCount} активних</span>
                    </button>
                    <button type="button" className={styles.statCard} onClick={() => setTab('favorites')}>
                      <span>Обране</span>
                      <span className={styles.statValue}>{favoriteProducts.length} товари</span>
                    </button>
                    <button type="button" className={styles.statCard} onClick={() => setTab('coupons')}>
                      <span>Купони</span>
                      <span className={styles.statValue}>0 доступні</span>
                    </button>
                  </div>
                </>
              )}

              {tab === 'orders' && (
                <div className={styles.ordersList}>
                  {ordersLoading ? (
                    <div className={styles.placeholder}>Завантаження...</div>
                  ) : orders.length === 0 ? (
                    <div className={styles.placeholder}>У вас ще немає замовлень.</div>
                  ) : (
                    orders.map((order) => (
                      <div key={order.id} className={styles.orderRow}>
                        <div className={styles.orderRowLeft}>
                          <span className={styles.orderId}>Замовлення #{order.id}</span>
                          <span className={styles.orderMeta}>
                            {order.createdDate ? new Date(order.createdDate).toLocaleDateString('uk-UA') : ''} ·{' '}
                            {order.items.length} товар(и) · {order.deliveryAddress}
                          </span>
                        </div>
                        <span className={styles.orderStatusBadge}>
                          {STATUS_LABEL[order.orderStatus] ?? order.orderStatus}
                        </span>
                        <span className={styles.orderTotal}>{order.totalAmount.toLocaleString('uk-UA')} ₴</span>
                      </div>
                    ))
                  )}
                </div>
              )}

              {tab === 'favorites' && (
                <div className={styles.favGrid}>
                  {favoriteProducts.length === 0 ? (
                    <div className={styles.placeholder}>У вас ще немає обраних товарів.</div>
                  ) : (
                    favoriteProducts.map((p) => (
                      <Link key={p.id} to={`/product/${p.id}`} className={styles.favCard}>
                        {p.imageUrl && <img src={p.imageUrl} alt={p.name} className={styles.favImg} />}
                        <div className={styles.favBody}>
                          <p className={styles.favName}>{p.name}</p>
                          <p className={styles.favPrice}>{p.price.toLocaleString('uk-UA')} ₴</p>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              )}

              {tab === 'bonuses' && (
                <div className={styles.loyaltyCard} style={{ width: '100%', flex: 'none' }}>
                  <h3 className={styles.loyaltyTitle}>{profile?.level ?? 'Бронзовий'} рівень</h3>
                  <p className={styles.loyaltyBonuses}>{profile?.bonuses ?? 0} бонусів</p>
                  <p className={styles.loyaltyCashback}>
                    Кешбек 2% нараховується з кожного оплаченого замовлення.
                  </p>
                  <div className={styles.progressTrack}>
                    <div
                      className={styles.progressFill}
                      style={{ width: `${profile?.levelProgressPercent ?? 0}%` }}
                    />
                  </div>
                  <p className={styles.loyaltyHint}>{profile?.nextLevelHint ?? ''}</p>
                </div>
              )}

              {loading && tab === 'profile' && <div className={styles.placeholder}>Завантаження профілю...</div>}

              {NOT_IMPLEMENTED[tab] && <div className={styles.placeholder}>{NOT_IMPLEMENTED[tab]}</div>}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
