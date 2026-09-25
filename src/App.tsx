import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage/HomePage';
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import { ProductPage } from './pages/ProductPage/ProductPage';
import { CategoryCatalogPage } from './pages/CategoryCatalogPage/CategoryCatalogPage';
import { AllProductsPage } from './pages/AllProductsPage/AllProductsPage';
import Basket from './pages/Basket/Basket';
import Delivery from './pages/Delivery/Delivery';
import Payment from './pages/Payment/Payment';
import { OrderVerification } from './pages/OrderVerification /OrderVerification';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/"          element={<HomePage />} />
          <Route path="/login"     element={<LoginPage />} />
          <Route path="/register"  element={<RegisterPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/categories" element={<CategoryCatalogPage />} />
          <Route path="/catalog" element={<AllProductsPage />} />
          <Route path="/basket" element={<Basket/>}/>
          <Route path="/delivery" element={<Delivery/>}/>
          <Route path="/payment" element={<Payment/>}/>
          <Route path="/order-verification" element={<OrderVerification/>}/>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}