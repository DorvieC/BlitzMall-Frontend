import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage/HomePage';
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import { ProductPage } from './pages/ProductPage/ProductPage';
import { CategoryCatalogPage } from './pages/CategoryCatalogPage/CategoryCatalogPage';
import { AllProductsPage } from './pages/AllProductsPage/AllProductsPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/"          element={<HomePage />} />
          <Route path="/login"     element={<LoginPage />} />
          <Route path="/register"  element={<RegisterPage />} />
          <Route path="*"          element={<Navigate to="/" replace />} />
         <Route path="/product/:id" element={<ProductPage />} />
         <Route path="/categories" element={<CategoryCatalogPage />} />
         <Route path="/catalog" element={<AllProductsPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
