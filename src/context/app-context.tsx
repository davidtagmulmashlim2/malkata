
'use client';

import React, { createContext, useContext, useReducer, useEffect, useState, useMemo } from 'react';
import type { AppState, AppContextType, Action, CartItem, Dish, SiteContent, Category, GalleryImage, Testimonial, DesignSettings } from '@/lib/types';
import { DEFAULT_APP_STATE } from '@/lib/data';

const AppContext = createContext<AppContextType | null>(null);

const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'SET_STATE':
      return { ...state, ...action.payload };
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
    SITE_CONTENT: 'malkata_siteContent',
    DISHES: 'malkata_dishes',
    CATEGORIES: 'malkata_categories',
    GALLERY: 'malkata_gallery',
    TESTIMONIALS: 'malkata_testimonials',
    DESIGN: 'malkata_design',
    CART: 'malkata_cart',
    // Image store is managed separately in IndexedDB
};

const ADMIN_PASSWORD = 'admin'; // In a real app, use a more secure method.

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, DEFAULT_APP_STATE);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Effect to load state from localStorage on initial client-side render
  useEffect(() => {
    try {
      const storedSiteContent = localStorage.getItem(LS_KEYS.SITE_CONTENT);
      const storedDishes = localStorage.getItem(LS_KEYS.DISHES);
      const storedCategories = localStorage.getItem(LS_KEYS.CATEGORIES);
      const storedGallery = localStorage.getItem(LS_KEYS.GALLERY);
      const storedTestimonials = localStorage.getItem(LS_KEYS.TESTIMONIALS);
      const storedDesign = localStorage.getItem(LS_KEYS.DESIGN);
      const storedCart = localStorage.getItem(LS_KEYS.CART);
      
      const loadedState: Partial<AppState> = {};
      if (storedSiteContent) loadedState.siteContent = JSON.parse(storedSiteContent);
      if (storedDishes) loadedState.dishes = JSON.parse(storedDishes);
      if (storedCategories) loadedState.categories = JSON.parse(storedCategories);
      if (storedGallery) loadedState.gallery = JSON.parse(storedGallery);
      if (storedTestimonials) loadedState.testimonials = JSON.parse(storedTestimonials);
      if (storedDesign) loadedState.design = JSON.parse(storedDesign);

      if (Object.keys(loadedState).length > 0) {
          dispatch({ type: 'SET_STATE', payload: loadedState });
      }

      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
      
      const storedAuth = sessionStorage.getItem('malkata_auth');
      if (storedAuth === 'true') {
          setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Failed to parse from localStorage", error);
    } finally {
        setIsLoading(false); // Critical: set loading to false after attempting to load
    }
  }, []);

  // Effect to save state to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) { // Only save state after initial load is complete
        try {
            localStorage.setItem(LS_KEYS.SITE_CONTENT, JSON.stringify(state.siteContent));
            localStorage.setItem(LS_KEYS.DISHES, JSON.stringify(state.dishes));
            localStorage.setItem(LS_KEYS.CATEGORIES, JSON.stringify(state.categories));
            localStorage.setItem(LS_KEYS.GALLERY, JSON.stringify(state.gallery));
            localStorage.setItem(LS_KEYS.TESTIMONIALS, JSON.stringify(state.testimonials));
            localStorage.setItem(LS_KEYS.DESIGN, JSON.stringify(state.design));
            localStorage.setItem(LS_KEYS.CART, JSON.stringify(cart));
        } catch (error) {
             console.error("Failed to save state to localStorage", error);
        }
    }
  }, [state, cart, isLoading]);


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
        sessionStorage.setItem('malkata_auth', 'true');
        return true;
    }
    return false;
  }

  const logout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('malkata_auth');
  }

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
    isLoading, // Provide loading state to all consumers
  }), [state, cart, isAuthenticated, isLoading]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
