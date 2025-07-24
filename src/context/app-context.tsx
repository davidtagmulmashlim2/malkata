
'use client';

import React, { createContext, useContext, useReducer, useEffect, useState, useMemo, useCallback } from 'react';
import type { AppState, AppContextType, Action, CartItem, Dish, SiteContent, Category, GalleryImage, Testimonial, DesignSettings } from '@/lib/types';
import { DEFAULT_APP_STATE } from '@/lib/data';

const AppContext = createContext<AppContextType | null>(null);

const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'SET_STATE':
      return { 
          ...DEFAULT_APP_STATE,
          ...action.payload,
          siteContent: { ...DEFAULT_APP_STATE.siteContent, ...action.payload.siteContent },
          design: { ...DEFAULT_APP_STATE.design, ...action.payload.design },
      };
    case 'UPDATE_CONTENT':
      return { ...state, siteContent: action.payload };
    case 'ADD_DISH':
      return { ...state, dishes: [...state.dishes, action.payload] };
    case 'UPDATE_DISH':
      return { ...state, dishes: state.dishes.map(d => d.id === action.payload.id ? action.payload : d) };
    case 'DELETE_DISH':
      return { ...state, dishes: state.dishes.filter(d => d.id !== action.payload) };
    case 'ADD_CATEGORY':
        return { ...state, categories: [...state.categories, action.payload] };
    case 'UPDATE_CATEGORY':
        return { ...state, categories: state.categories.map(c => c.id === action.payload.id ? action.payload : c) };
    case 'DELETE_CATEGORY':
        return { ...state, categories: state.categories.filter(c => c.id !== action.payload) };
    case 'ADD_GALLERY_IMAGE':
        return { ...state, gallery: [...state.gallery, action.payload] };
    case 'DELETE_GALLERY_IMAGE':
        return { ...state, gallery: state.gallery.filter(img => img.id !== action.payload) };
    case 'UPDATE_DESIGN':
        return { ...state, design: action.payload };
    case 'ADD_TESTIMONIAL':
        return { ...state, testimonials: [...state.testimonials, action.payload] };
    case 'UPDATE_TESTIMONIAL':
        return { ...state, testimonials: state.testimonials.map(t => t.id === action.payload.id ? action.payload : t) };
    case 'DELETE_TESTIMONIAL':
        return { ...state, testimonials: state.testimonials.filter(t => t.id !== action.payload) };
    default:
      return state;
  }
};

const LS_KEYS = {
    APP_STATE: 'malkata_appState',
    CART: 'malkata_cart',
};

const ADMIN_PASSWORD = 'admin';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, DEFAULT_APP_STATE);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedState = localStorage.getItem(LS_KEYS.APP_STATE);
      if (storedState) {
        dispatch({ type: 'SET_STATE', payload: JSON.parse(storedState) });
      } else {
        // If nothing is in storage, we start with the default state.
        dispatch({ type: 'SET_STATE', payload: DEFAULT_APP_STATE });
      }

      const storedCart = localStorage.getItem(LS_KEYS.CART);
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
      
      const storedAuth = sessionStorage.getItem('malkata_auth');
      if (storedAuth === 'true') {
          setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Failed to parse from localStorage, using default state.", error);
      dispatch({ type: 'SET_STATE', payload: DEFAULT_APP_STATE });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoading) {
        try {
            localStorage.setItem(LS_KEYS.APP_STATE, JSON.stringify(state));
            localStorage.setItem(LS_KEYS.CART, JSON.stringify(cart));
        } catch (error) {
             console.error("Failed to save state to localStorage", error);
        }
    }
  }, [state, cart, isLoading]);


  const addToCart = useCallback((dishId: string, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.dishId === dishId);
      if (existingItem) {
        return prevCart.map(item =>
          item.dishId === dishId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevCart, { dishId, quantity }];
    });
  }, []);

  const updateCartQuantity = useCallback((dishId: string, quantity: number) => {
    setCart(prevCart => {
      if (quantity <= 0) {
        return prevCart.filter(item => item.dishId !== dishId);
      } else {
        return prevCart.map(item => (item.dishId === dishId ? { ...item, quantity } : item));
      }
    });
  }, []);

  const removeFromCart = useCallback((dishId: string) => {
    setCart(prevCart => prevCart.filter(item => item.dishId !== dishId));
  }, []);
  
  const clearCart = useCallback(() => setCart([]), []);

  const getDishById = useCallback((dishId: string): Dish | undefined => {
    return state.dishes.find(d => d.id === dishId);
  }, [state.dishes]);

  const login = useCallback((password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
        setIsAuthenticated(true);
        sessionStorage.setItem('malkata_auth', 'true');
        return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('malkata_auth');
  }, []);

  const value = useMemo(() => ({
    state,
    dispatch,
    cart,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    getDishById,
    isAuthenticated,
    login,
    logout,
    isLoading,
  }), [state, cart, isAuthenticated, isLoading, addToCart, updateCartQuantity, removeFromCart, clearCart, getDishById, login, logout]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

    