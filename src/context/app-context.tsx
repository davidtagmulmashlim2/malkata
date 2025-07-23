"use client";

import React, { createContext, useContext, useReducer, useEffect, useState, useMemo } from 'react';
import type { AppState, AppContextType, Action, CartItem, Dish } from '@/lib/types';
import { DEFAULT_APP_STATE } from '@/lib/data';
import { useIsClient } from '@/hooks/use-is-client';

const AppContext = createContext<AppContextType | null>(null);

const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'SET_STATE':
      return action.payload;
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
    default:
      return state;
  }
};

const LS_APP_STATE_KEY = 'malkata_app_state';
const LS_CART_KEY = 'malkata_cart';
const ADMIN_PASSWORD = 'admin'; // In a real app, use a more secure method.

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, DEFAULT_APP_STATE);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const isClient = useIsClient();

  useEffect(() => {
    if (isClient) {
      try {
        const storedState = localStorage.getItem(LS_APP_STATE_KEY);
        if (storedState) {
          dispatch({ type: 'SET_STATE', payload: JSON.parse(storedState) });
        }
        const storedCart = localStorage.getItem(LS_CART_KEY);
        if (storedCart) {
          setCart(JSON.parse(storedCart));
        }
        const storedAuth = sessionStorage.getItem('malkata_auth');
        if (storedAuth === 'true') {
            setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Failed to parse from localStorage", error);
      }
    }
  }, [isClient]);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem(LS_APP_STATE_KEY, JSON.stringify(state));
    }
  }, [state, isClient]);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem(LS_CART_KEY, JSON.stringify(cart));
    }
  }, [cart, isClient]);

  const addToCart = (dishId: string, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.dishId === dishId);
      if (existingItem) {
        return prevCart.map(item =>
          item.dishId === dishId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevCart, { dishId, quantity }];
    });
  };

  const updateCartQuantity = (dishId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(dishId);
    } else {
      setCart(prevCart =>
        prevCart.map(item => (item.dishId === dishId ? { ...item, quantity } : item))
      );
    }
  };

  const removeFromCart = (dishId: string) => {
    setCart(prevCart => prevCart.filter(item => item.dishId !== dishId));
  };
  
  const clearCart = () => setCart([]);

  const getDishById = (dishId: string): Dish | undefined => {
    return state.dishes.find(d => d.id === dishId);
  }

  const login = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
        setIsAuthenticated(true);
        if(isClient) sessionStorage.setItem('malkata_auth', 'true');
        return true;
    }
    return false;
  }

  const logout = () => {
    setIsAuthenticated(false);
    if(isClient) sessionStorage.removeItem('malkata_auth');
  }

  const value = {
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
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
