import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import HomePage from './pages/HomePage/HomePage';
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import CartPage from './pages/CartPage/CartPage';
import ProductPage from './pages/ProductPage/ProductPage';
import CheckoutPage from './pages/CheckoutPage/CheckoutPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import CatalogPage from './pages/CatalogPage/CatalogPage';
import PasswordRecoveryPage from './pages/PasswordRecoveryPage/PasswordRecoveryPage';
import ConfirmationCodePage from './pages/ConfirmationCodePage/ConfirmationCodePage';
import NewPasswordPage from './pages/NewPasswordPage/NewPasswordPage';
import ConfirmNewPasswordPage from './pages/ConfirmNewPasswordPage/ConfirmNewPasswordPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/"                      element={<HomePage />} />
            <Route path="/login"                 element={<LoginPage />} />
            <Route path="/register"              element={<RegisterPage />} />
            <Route path="/cart"                  element={<CartPage />} />
            <Route path="/checkout"              element={<CheckoutPage />} />
            <Route path="/profile"               element={<ProfilePage />} />
            <Route path="/catalog"               element={<CatalogPage />} />
            <Route path="/product/:id"           element={<ProductPage />} />
            <Route path="/password-recovery"     element={<PasswordRecoveryPage />} />
            <Route path="/confirmation-code"     element={<ConfirmationCodePage />} />
            <Route path="/new-password"          element={<NewPasswordPage />} />
            <Route path="/confirm-new-password"  element={<ConfirmNewPasswordPage />} />
            <Route path="*"                      element={<Navigate to="/" replace />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
