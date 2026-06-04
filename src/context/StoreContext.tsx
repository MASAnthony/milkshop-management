import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export interface Product {
  id: string;
  name: { en: string; ta: string };
}

export interface Order {
  id: string;
  productId: string;
  customerId: string;
  deliveryBoyId?: string;
  date: string;
  status: 'Pending' | 'Delivered' | 'Cancelled';
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Stored securely in a real app
  role: 'super_admin' | 'admin' | 'delivery_boy' | 'customer';
  profilePhoto?: string; // base64 string
}

interface StoreContextType {
  products: Product[];
  orders: Order[];
  users: User[];
  currentUser: User | null;
  placeOrder: (productId: string, customerId: string) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  addProduct: (nameEn: string, nameTa: string) => void;
  updateProduct: (id: string, nameEn: string, nameTa: string) => void;
  login: (user: User) => void;
  logout: () => void;
  registerUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: string, userData: Partial<Omit<User, 'id'>>) => void;
  updateUserRole: (id: string, role: User['role']) => void;
  deleteUser: (id: string) => void;
  assignOrder: (orderId: string, deliveryBoyId: string) => void;
}

const defaultProducts: Product[] = [
  { id: "1", name: { en: "Native Cow Milk", ta: "நாட்டு மாட்டு பால்" } },
  { id: "2", name: { en: "Jersey Cow Milk", ta: "ஜெர்சி பசு பால்" } }
];

const defaultUsers: User[] = [
  { id: "u1", name: "Admin", email: "admin@example.com", password: "Test@123", role: 'super_admin' },
  { id: "u2", name: "User", email: "user@example.com", password: "Test@123", role: 'customer' }
];

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('app_products');
    return saved ? JSON.parse(saved) : defaultProducts;
  });
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('app_users');
    return saved ? JSON.parse(saved) : defaultUsers;
  });
  
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = sessionStorage.getItem('app_current_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('app_orders');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('app_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('app_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('app_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      sessionStorage.setItem('app_current_user', JSON.stringify(currentUser));
    } else {
      sessionStorage.removeItem('app_current_user');
    }
  }, [currentUser]);

  const placeOrder = (productId: string, customerId: string) => {
    const newOrder: Order = {
      id: Math.random().toString(36).substring(7),
      productId,
      customerId,
      date: new Date().toISOString(),
      status: 'Pending'
    };
    setOrders(prev => [...prev, newOrder]);
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const addProduct = (en: string, ta: string) => {
    const newProduct: Product = {
      id: Math.random().toString(36).substring(7),
      name: { en, ta }
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id: string, en: string, ta: string) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, name: { en, ta } } : p));
  };

  const login = (user: User) => {
    setCurrentUser(user);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const registerUser = (userData: Omit<User, 'id'>) => {
    const newUser: User = {
      ...userData,
      id: Math.random().toString(36).substring(7)
    };
    setUsers(prev => [...prev, newUser]);
  };

  const updateUser = (id: string, userData: Partial<Omit<User, 'id'>>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...userData } : u));
    
    // Also update currentUser if the logged-in user is being updated
    if (currentUser && currentUser.id === id) {
      setCurrentUser(prev => prev ? { ...prev, ...userData } : null);
    }
  };

  const updateUserRole = (id: string, role: User['role']) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u));
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(user => user.id !== id));
    // If a delivery boy is deleted, unassign their orders
    setOrders(prev => prev.map(order => 
      order.deliveryBoyId === id ? { ...order, deliveryBoyId: undefined } : order
    ));
  };

  const assignOrder = (orderId: string, deliveryBoyId: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, deliveryBoyId } : order
    ));
  };

  return (
    <StoreContext.Provider value={{
      products,
      orders,
      users,
      currentUser,
      placeOrder,
      updateOrderStatus,
      addProduct,
      updateProduct,
      login,
      logout,
      registerUser,
      updateUser,
      updateUserRole,
      deleteUser,
      assignOrder
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
