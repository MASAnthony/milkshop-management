import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export interface Product {
  id: string;
  name: { en: string; ta: string };
  price: number;
  description: { en: string; ta: string };
  imageUrl?: string;
  unit: string; // e.g., '500ml', '1L'
  stockStatus: 'In Stock' | 'Out of Stock';
}

export interface Subscription {
  id: string;
  customerId: string;
  productId: string;
  quantity: number;
  frequency: 'Daily' | 'Alternate Days' | 'Weekly';
  startDate: string;
  status: 'Active' | 'Paused' | 'Cancelled';
}

export interface Order {
  id: string;
  productId: string;
  customerId: string;
  deliveryBoyId?: string;
  quantity: number;
  totalAmount: number;
  deliveryAddress: string;
  date: string;
  status: 'Pending' | 'Out for Delivery' | 'Delivered' | 'Failed' | 'Cancelled';
  paymentMethod: 'Cash' | 'Online';
  paymentStatus: 'Pending' | 'Paid';
}

export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  deliveryAddress?: string;
  password?: string; // Stored securely in a real app
  role: 'super_admin' | 'admin' | 'delivery_boy' | 'customer';
  profilePhoto?: string; // base64 string
  assignedRoute?: string; // For delivery boys
}

interface StoreContextType {
  products: Product[];
  orders: Order[];
  subscriptions: Subscription[];
  users: User[];
  currentUser: User | null;
  placeOrder: (orderData: Omit<Order, 'id' | 'status' | 'date'>) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  addSubscription: (subData: Omit<Subscription, 'id' | 'status' | 'startDate'>) => void;
  updateSubscriptionStatus: (subId: string, status: Subscription['status']) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  login: (user: User) => void;
  logout: () => void;
  registerUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: string, userData: Partial<Omit<User, 'id'>>) => void;
  updateUserRole: (id: string, role: User['role']) => void;
  deleteUser: (id: string) => void;
  assignOrder: (orderId: string, deliveryBoyId: string) => void;
}

const defaultProducts: Product[] = [
  { 
    id: "1", 
    name: { en: "Native Cow Milk", ta: "நாட்டு மாட்டு பால்" },
    price: 40,
    description: { en: "Fresh A2 cow milk directly from farm.", ta: "பண்ணையிலிருந்து நேரடியாக புதிய A2 பசும்பால்." },
    imageUrl: "https://images.unsplash.com/photo-1563636619-e9143da7973b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    unit: "500ml",
    stockStatus: "In Stock"
  },
  { 
    id: "2", 
    name: { en: "Jersey Cow Milk", ta: "ஜெர்சி பசு பால்" },
    price: 35,
    description: { en: "Rich and creamy Jersey cow milk.", ta: "சுவையான மற்றும் தடிமனான ஜெர்சி பசும்பால்." },
    imageUrl: "https://images.unsplash.com/photo-1550583724-b2692b85b150?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    unit: "500ml",
    stockStatus: "In Stock"
  }
];

const defaultUsers: User[] = [
  { id: "u1", name: "Admin", email: "admin@example.com", password: "Test@123", role: 'super_admin' },
  { id: "u2", name: "Delivery Partner", email: "delivery@example.com", password: "Test@123", role: 'delivery_boy', assignedRoute: "North Zone" },
  { id: "u3", name: "Customer", email: "user@example.com", password: "Test@123", role: 'customer', phoneNumber: "9876543210", deliveryAddress: "123 Main St, City" }
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

  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => {
    const saved = localStorage.getItem('app_subscriptions');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => localStorage.setItem('app_orders', JSON.stringify(orders)), [orders]);
  useEffect(() => localStorage.setItem('app_subscriptions', JSON.stringify(subscriptions)), [subscriptions]);
  useEffect(() => localStorage.setItem('app_products', JSON.stringify(products)), [products]);
  useEffect(() => localStorage.setItem('app_users', JSON.stringify(users)), [users]);
  useEffect(() => {
    if (currentUser) {
      sessionStorage.setItem('app_current_user', JSON.stringify(currentUser));
    } else {
      sessionStorage.removeItem('app_current_user');
    }
  }, [currentUser]);

  const placeOrder = (orderData: Omit<Order, 'id' | 'status' | 'date'>) => {
    const newOrder: Order = {
      ...orderData,
      id: Math.random().toString(36).substring(7),
      date: new Date().toISOString(),
      status: 'Pending'
    };
    setOrders(prev => [...prev, newOrder]);
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const addSubscription = (subData: Omit<Subscription, 'id' | 'status' | 'startDate'>) => {
    const newSub: Subscription = {
      ...subData,
      id: Math.random().toString(36).substring(7),
      startDate: new Date().toISOString(),
      status: 'Active'
    };
    setSubscriptions(prev => [...prev, newSub]);
  };

  const updateSubscriptionStatus = (subId: string, status: Subscription['status']) => {
    setSubscriptions(prev => prev.map(s => s.id === subId ? { ...s, status } : s));
  };

  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...productData,
      id: Math.random().toString(36).substring(7)
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id: string, productUpdate: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...productUpdate } : p));
  };

  const login = (user: User) => setCurrentUser(user);
  const logout = () => setCurrentUser(null);

  const registerUser = (userData: Omit<User, 'id'>) => {
    const newUser: User = { ...userData, id: Math.random().toString(36).substring(7) };
    setUsers(prev => [...prev, newUser]);
  };

  const updateUser = (id: string, userData: Partial<Omit<User, 'id'>>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...userData } : u));
    if (currentUser && currentUser.id === id) {
      setCurrentUser(prev => prev ? { ...prev, ...userData } : null);
    }
  };

  const updateUserRole = (id: string, role: User['role']) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u));
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(user => user.id !== id));
    setOrders(prev => prev.map(order => order.deliveryBoyId === id ? { ...order, deliveryBoyId: undefined } : order));
  };

  const assignOrder = (orderId: string, deliveryBoyId: string) => {
    setOrders(prev => prev.map(order => order.id === orderId ? { ...order, deliveryBoyId } : order));
  };

  return (
    <StoreContext.Provider value={{
      products, orders, subscriptions, users, currentUser,
      placeOrder, updateOrderStatus, addSubscription, updateSubscriptionStatus,
      addProduct, updateProduct, login, logout, registerUser, updateUser,
      updateUserRole, deleteUser, assignOrder
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
