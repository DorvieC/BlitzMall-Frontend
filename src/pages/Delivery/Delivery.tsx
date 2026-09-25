import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Delivery.module.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import type { CheckoutDeliveryProps, DeliveryMethod } from '../../types/index';

const UAH = '₴';
const fmt = (n: number) => n.toLocaleString('uk-UA').replace(/\u00a0/g, ' ');

const defaultDeliveryMethods: DeliveryMethod[] = [
  { id: 'nova-poshta', name: 'Нова Пошта', eta: '1-2 дні', price: 70 },
  { id: 'ukrposhta', name: 'Укрпошта', eta: '4-5 дні', price: 45 },
  { id: 'courier', name: "Кур'єр", eta: 'сьогодні до 21.00', price: 95 },
  { id: 'pickup', name: 'Самовивіз', eta: '1-2 дні', price: 0 },
];

export default function Delivery({
  itemsCount = 0,
  goodsTotal = 0,
  cashback = 0,
  deliveryMethods = defaultDeliveryMethods,
  onSubmit,
  onApplyPromo,
}: CheckoutDeliveryProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [deliveryMethodId, setDeliveryMethodId] = useState(deliveryMethods[0]?.id ?? '');
  const [address, setAddress] = useState('');
  const [comment, setComment] = useState('');
  const [promo, setPromo] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // items (список товарів кошика) поки не приходять як пропс сюди —
  // якщо їх передає Basket/контекст через location.state, підхоплюємо звідси
  const items = (location.state as { items?: unknown[] } | null)?.items ?? [];

  const selectedMethod = deliveryMethods.find((m) => m.id === deliveryMethodId);
  const deliveryPrice = selectedMethod?.price ?? 0;
  const total = goodsTotal + deliveryPrice;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.({ firstName, lastName, phone, city, deliveryMethodId, address, comment });

    navigate('/payment', {
      state: {
        items,
        itemsCount,
        goodsTotal,
        cashback,
        deliveryPrice,
        deliveryLabel: selectedMethod
          ? `${selectedMethod.name}${city ? `, ${city}` : ''}`
          : city,
      },
    });
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
          <li className={styles.stepActive}>
            <span className={styles.stepNumber}>1</span>Доставка
          </li>
          <li className={styles.stepperArrow}>→</li>
          <li>
            <span className={styles.stepNumber}>2</span>Оплата
          </li>
          <li className={styles.stepperArrow}>→</li>
          <li>
            <span className={styles.stepNumber}>3</span>Підтвердження
          </li>
        </ol>

        <div className={styles.body}>
          <form className={`${styles.card} ${styles.form}`} onSubmit={handleSubmit} noValidate>
            <h1 className={styles.formTitle}>Дані для доставки</h1>

            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label htmlFor="firstName">Ім'я</label>
                <input
                  id="firstName"
                  type="text"
                  placeholder="Ваше ім'я"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="lastName">Прізвище</label>
                <input
                  id="lastName"
                  type="text"
                  placeholder="Ваше прізвище"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="phone">Номер телефону</label>
              <input
                id="phone"
                type="tel"
                placeholder="+380 XX XXX XX XX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="city">Місто</label>
              <input
                id="city"
                type="text"
                placeholder="Місто"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>

            <p className={styles.methodsLabel}>Спосіб доставки</p>
            <div className={styles.methods} role="radiogroup" aria-label="Спосіб доставки">
              {deliveryMethods.map((method) => {
                const selected = method.id === deliveryMethodId;
                return (
                  <label
                    key={method.id}
                    className={`${styles.method} ${selected ? styles.methodSelected : ''}`}
                  >
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value={method.id}
                      checked={selected}
                      onChange={() => setDeliveryMethodId(method.id)}
                      style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
                    />
                    <span className={styles.radio} aria-hidden="true" />
                    <span>
                      <div className={styles.methodName}>{method.name}</div>
                      <div className={styles.methodMeta}>
                        {method.eta} {method.price > 0 ? `${fmt(method.price)} ${UAH}` : 'безкоштовно'}
                      </div>
                    </span>
                  </label>
                );
              })}
            </div>

            <div className={`${styles.field} ${styles.addressField}`}>
              <label htmlFor="address">Відділення / Адреса</label>
              <input
                id="address"
                type="text"
                placeholder="№1 вул. Хрещатик, 1"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <button type="submit" className={styles.submit}>
              Далі → оплата
            </button>
          </form>

          <div className={styles.rightCol}>
            <aside className={`${styles.card} ${styles.summary}`}>
              <h2>Разом</h2>

              <div className={styles.row}>
                <span>Товари ({itemsCount})</span>
                <span>
                  {fmt(goodsTotal)} {UAH}
                </span>
              </div>
              <div className={styles.row}>
                <span>Доставка</span>
                <span>{deliveryPrice > 0 ? `${fmt(deliveryPrice)} ${UAH}` : 'безкоштовно'}</span>
              </div>
              <div className={`${styles.row} ${styles.rowCashback}`}>
                <span>Кешбек</span>
                <span>+ {cashback} бонусів</span>
              </div>
              <div className={`${styles.row} ${styles.rowTotal}`}>
                <span>До сплати</span>
                <span>
                  {fmt(total)} {UAH}
                </span>
              </div>

              <div className={styles.promo}>
                <input
                  type="text"
                  placeholder="Промокод"
                  value={promo}
                  onChange={(e) => setPromo(e.target.value)}
                />
                <button type="button" onClick={() => onApplyPromo?.(promo)}>
                  Ок
                </button>
              </div>
            </aside>

            <section className={`${styles.card} ${styles.commentCard}`}>
              <h2>Коментар</h2>
              <textarea
                placeholder="Коментар до замовлення (необов'язково)"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}