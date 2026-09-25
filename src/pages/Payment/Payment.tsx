import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Payment.module.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import type { PaymentMethod, PaymentFormData, CheckoutPaymentProps, DeliveryNavState } from '../../types'; // <- шлях підстав під свій

const UAH = '₴';
const fmt = (n: number) => n.toLocaleString('uk-UA').replace(/\u00a0/g, ' ');


const defaultPaymentMethods: PaymentMethod[] = [
  { id: 'card', name: 'Банківська карта', description: 'Visa / Mastercard', requiresCard: true },
  { id: 'apple-pay', name: 'Apple Pay', description: 'оплата в один клік' },
  { id: 'google-pay', name: 'Google Pay', description: 'оплата в один дотик' },
  { id: 'cod', name: 'Післяплата', description: 'оплата при отриманні + 20 ₴' },
  { id: 'installment', name: 'Розстрочка / онлайн-кредит', description: 'до 12 платежів' },
  { id: 'wallet', name: 'Внутрішній гаманець', description: 'баланс 0 ₴ + 340 бонусів' },
];

export default function Payment({
  items: itemsProp,
  itemsCount: itemsCountProp,
  goodsTotal: goodsTotalProp,
  deliveryPrice: deliveryPriceProp,
  deliveryLabel: deliveryLabelProp,
  cashback: cashbackProp,
  paymentMethods = defaultPaymentMethods,
  onBack,
  onSubmit,
  onApplyPromo,
}: CheckoutPaymentProps) {
  const [paymentMethodId, setPaymentMethodId] = useState(paymentMethods[0]?.id ?? '');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [promo, setPromo] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Дані, які прийшли з Delivery через navigate('/payment', { state }).
  // Якщо їх немає (наприклад, зайшли на /payment напряму) — падаємо на пропси.
  const fromDelivery = (location.state ?? {}) as DeliveryNavState;

  const items = fromDelivery.items ?? itemsProp ?? [];
  const itemsCount = fromDelivery.itemsCount ?? itemsCountProp ?? 0;
  const goodsTotal = fromDelivery.goodsTotal ?? goodsTotalProp ?? 0;
  const deliveryPrice = fromDelivery.deliveryPrice ?? deliveryPriceProp ?? 0;
  const deliveryLabel = fromDelivery.deliveryLabel ?? deliveryLabelProp ?? '';
  const cashback = fromDelivery.cashback ?? cashbackProp ?? 0;

  const selectedMethod = paymentMethods.find((m) => m.id === paymentMethodId);
  const needsCardFields = !!selectedMethod?.requiresCard;
  const total = goodsTotal + deliveryPrice;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data: PaymentFormData = {
      paymentMethodId,
      ...(needsCardFields ? { cardNumber, cardExpiry, cardCvv } : {}),
    };

    onSubmit?.(data);

    // Переходимо на крок підтвердження, передаючи дані оплати/суми в state,
    // щоб OrderVerification міг їх показати без повторного запиту до бека.
    navigate('/order-verification', {
      state: {
        paymentMethodId,
        paymentMethodName: selectedMethod?.name,
        items,
        itemsCount,
        goodsTotal,
        deliveryPrice,
        deliveryLabel,
        cashback,
        total,
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
          <li className={styles.stepDone}>
            <span className={styles.stepNumber}>✓</span>Доставка
          </li>
          <li className={styles.stepperArrow}>→</li>
          <li className={styles.stepActive}>
            <span className={styles.stepNumber}>2</span>Оплата
          </li>
          <li className={styles.stepperArrow}>→</li>
          <li>
            <span className={styles.stepNumber}>3</span>Підтвердження
          </li>
        </ol>

        <div className={styles.body}>
          <form className={`${styles.card} ${styles.form}`} onSubmit={handleSubmit} noValidate>
            <h1 className={styles.formTitle}>Спосіб оплати</h1>

            <div className={styles.methods} role="radiogroup" aria-label="Спосіб оплати">
              {paymentMethods.map((method) => {
                const selected = method.id === paymentMethodId;
                return (
                  <label
                    key={method.id}
                    className={`${styles.method} ${selected ? styles.methodSelected : ''}`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={selected}
                      onChange={() => setPaymentMethodId(method.id)}
                      style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
                    />
                    <span className={styles.radio} aria-hidden="true" />
                    <span>
                      <div className={styles.methodName}>{method.name}</div>
                      <div className={styles.methodMeta}>{method.description}</div>
                    </span>
                  </label>
                );
              })}
            </div>

            {needsCardFields && (
              <div className={styles.cardFields}>
                <div className={styles.field}>
                  <label htmlFor="cardNumber">Номер картки</label>
                  <input
                    id="cardNumber"
                    type="text"
                    inputMode="numeric"
                    placeholder="0000 0000 0000 0000"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="cardExpiry">Термін дії</label>
                  <input
                    id="cardExpiry"
                    type="text"
                    placeholder="MM / YY"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="cardCvv">CVV</label>
                  <input
                    id="cardCvv"
                    type="password"
                    inputMode="numeric"
                    placeholder="•••"
                    maxLength={4}
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className={styles.actions}>
              <button
                type="button"
                className={styles.back}
                onClick={() => (onBack ? onBack() : navigate('/delivery'))}
              >
                Назад
              </button>
              <button type="submit" className={styles.submit}>
                Далі → перевірка
              </button>
            </div>
          </form>

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
        </div>
      </main>

      <Footer />
    </div>
  );
}