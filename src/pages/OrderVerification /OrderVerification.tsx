import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './OrderVerification.module.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import type { PaymentNavState } from '../../types/index';


const UAH = '₴';
const fmt = (n: number) => n.toLocaleString('uk-UA').replace(/\u00a0/g, ' ');

export function OrderVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state ?? {}) as PaymentNavState;

  const [promo, setPromo] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const {
    paymentMethodName = 'Банківська карта',
    items = [],
    itemsCount = 0,
    goodsTotal = 0,
    deliveryPrice = 0,
    deliveryLabel = '—',
    cashback = 0,
    total = 0,
  } = state;

  const handleBack = () => navigate('/payment');

  const handleConfirm = () => {
    setSubmitting(true);
    // TODO: викликати API підтвердження/оплати замовлення
    navigate('/order-success');
  };

  const handleApplyPromo = () => {
    // TODO: викликати API перевірки промокоду
    console.log('promo code:', promo);
  };

  return (
    <div className={styles.pageWrapper}>
      <Header />

      <main className={styles.checkoutPage}>
        <nav className={styles.crumbs} aria-label="Навігація">
          <a href="/">Головна</a>
          <span>/</span>
          <a href="/cart">Кошик</a>
          <span>/</span>
          <span>Оформлення замовлення</span>
        </nav>

        <ol className={styles.stepper}>
          <li className={styles.stepDone}>
            <span className={styles.stepNumber}>✓</span>Доставка
          </li>
          <li className={styles.stepperArrow}>→</li>
          <li className={styles.stepDone}>
            <span className={styles.stepNumber}>✓</span>Оплата
          </li>
          <li className={styles.stepperArrow}>→</li>
          <li className={styles.stepActive}>
            <span className={styles.stepNumber}>3</span>Підтвердження
          </li>
        </ol>

        <div className={styles.body}>
          <section className={`${styles.card} ${styles.form}`}>
            <h1 className={styles.formTitle}>Перевірте замовлення</h1>

            {items.map((item) => (
              <div className={styles.productRow} key={item.id}>
                <img src={item.image} alt={item.name} />
                <div>
                  <div className={styles.productName}>{item.name}</div>
                  <div className={styles.productMeta}>
                    {item.variant} · {item.qty} шт · {item.brand}
                  </div>
                </div>
                <div className={styles.productPrice}>
                  {fmt(item.price)} {UAH}
                </div>
              </div>
            ))}

            <dl className={styles.detailsGrid}>
              <dt>Доставка</dt>
              <dd>{deliveryLabel}</dd>
              <dt>Оплата</dt>
              <dd>{paymentMethodName}</dd>
            </dl>

            <div className={styles.actions}>
              <button type="button" className={styles.back} onClick={handleBack}>
                Назад
              </button>
              <button
                type="button"
                className={styles.submit}
                disabled={submitting}
                onClick={handleConfirm}
              >
                {submitting ? 'Обробка…' : `Підтвердити та оплатити  ${fmt(total ?? 0)} ${UAH}`}
              </button>
            </div>
          </section>

          <aside className={`${styles.card} ${styles.summary}`}>
            <h2>Разом</h2>

            <div className={styles.row}>
              <span>Товари ({itemsCount})</span>
              <span>
                {fmt(goodsTotal ?? 0)} {UAH}
              </span>
            </div>
            <div className={styles.row}>
              <span>Доставка</span>
              <span>{deliveryPrice && deliveryPrice > 0 ? `${fmt(deliveryPrice)} ${UAH}` : 'безкоштовно'}</span>
            </div>
            <div className={`${styles.row} ${styles.rowCashback}`}>
              <span>Кешбек</span>
              <span>+ {cashback ?? 0} бонусів</span>
            </div>
            <div className={`${styles.row} ${styles.rowTotal}`}>
              <span>До сплати</span>
              <span>
                {fmt(total ?? 0)} {UAH}
              </span>
            </div>

            <div className={styles.promo}>
              <input
                type="text"
                placeholder="Промокод"
                value={promo}
                onChange={(e) => setPromo(e.target.value)}
              />
              <button type="button" onClick={handleApplyPromo}>
                Ок
              </button>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}