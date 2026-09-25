import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import { useAuth } from '../../context/AuthContext';
import { ordersApi } from '../../api/orders';
import type { OrderDto } from '../../types';
import styles from './ProfilePage.module.css';

const STATUS_COLOR: Record<string, string> = {
  'Pending':    '#e65100',
  'Processing': '#1565c0',
  'Shipped':    '#1565c0',
  'Delivered':  '#2e7d32',
  'Cancelled':  '#c62828',
  'Доставлено': '#2e7d32',
  'В дорозі':   '#1565c0',
  'Обробляється': '#e65100',
  'Скасовано':  '#c62828',
};

const STATUS_LABEL: Record<string, string> = {
  'Pending':    'Очікує',
  'Processing': 'Обробляється',
  'Shipped':    'В дорозі',
  'Delivered':  'Доставлено',
  'Cancelled':  'Скасовано',
};

export default function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;
    ordersApi.getMyOrders()
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setOrdersLoading(false));
  }, [isAuthenticated]);

  if (!isAuthenticated || !user) {
    return (
      <div className={styles.page}>
        <Header />
        <div className={styles.center}>
          <h2>Ви не авторизовані</h2>
          <Link to="/login" className={styles.btn}>Увійти</Link>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const initials = user.name
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className={styles.page}>
      <Header />
      <div className={styles.inner}>

        <div className={styles.hero}>
          <div className={styles.avatar}>{initials}</div>
          <div className={styles.heroInfo}>
            <h1 className={styles.name}>{user.name}</h1>
            <span className={styles.email}>{user.email}</span>
            {user.role && <span className={styles.role}>{user.role}</span>}
          </div>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            Вийти
          </button>
        </div>

        <div className={styles.layout}>
          <div className={styles.sidebar}>
            <nav className={styles.nav}>
              <Link to="/profile" className={`${styles.navItem} ${styles.navActive}`}>
                👤 Мій профіль
              </Link>
              <Link to="/cart" className={styles.navItem}>
                🛒 Кошик
              </Link>
              <button className={styles.navItem} onClick={handleLogout}>
                🚪 Вийти
              </button>
            </nav>
          </div>

          <div className={styles.content}>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Особисті дані</h2>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Повне ім'я</span>
                  <span className={styles.infoValue}>{user.name}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Email</span>
                  <span className={styles.infoValue}>{user.email}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Роль</span>
                  <span className={styles.infoValue}>{user.role}</span>
                </div>
                {user.phone && (
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Телефон</span>
                    <span className={styles.infoValue}>{user.phone}</span>
                  </div>
                )}
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Мої замовлення</h2>
              {ordersLoading ? (
                <div className={styles.noOrders}>Завантаження...</div>
              ) : orders.length === 0 ? (
                <div className={styles.noOrders}>
                  <span>У вас ще немає замовлень</span>
                  <Link to="/" className={styles.btn}>Почати покупки</Link>
                </div>
              ) : (
                <div className={styles.orders}>
                  {orders.map(order => (
                    <div key={order.id} className={styles.order}>
                      <div className={styles.orderLeft}>
                        <span className={styles.orderId}>Замовлення #{order.id}</span>
                        <span className={styles.orderDate}>
                          {order.createdDate
                            ? new Date(order.createdDate).toLocaleDateString('uk-UA')
                            : ''}
                        </span>
                      </div>
                      <div className={styles.orderMid}>
                        <span className={styles.orderItems}>{order.items.length} товар(и)</span>
                        <span className={styles.orderAddress}>{order.deliveryAddress}</span>
                      </div>
                      <div className={styles.orderRight}>
                        <span
                          className={styles.orderStatus}
                          style={{ color: STATUS_COLOR[order.orderStatus] ?? '#555' }}
                        >
                          {STATUS_LABEL[order.orderStatus] ?? order.orderStatus}
                        </span>
                        <span className={styles.orderTotal}>
                          {order.totalAmount.toLocaleString('uk-UA')} ₴
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
