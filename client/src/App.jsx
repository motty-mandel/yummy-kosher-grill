import './App.css';
import { Outlet } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Header from './jsx/Header';
import CartSidebar from './jsx/CartSidebar';

function App() {
  return (
    <CartProvider>
      <Header />
      <CartSidebar />
      <Outlet />
    </CartProvider>
  );
}

export default App;
