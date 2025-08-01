
'use client';

import React, { createContext, useContext, useReducer, useEffect, useState, useMemo, useCallback } from 'react';
import type { AppState, AppContextType, Action, CartItem, Dish, Testimonial, ContactSubmission, Category, GalleryImage, Subscriber, SiteContent, DesignSettings } from '@/lib/types';
import { DEFAULT_APP_STATE } from '@/lib/data';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

const AppContext = createContext<AppContextType | null>(null);

// Debounce function
const debounce = <F extends (...args: any[]) => any>(func: F, waitFor: number) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<F>): Promise<ReturnType<F>> => {
    return new Promise(resolve => {
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => resolve(func(...args)), waitFor);
    });
  };
};

const debouncedUpdate = debounce(async (table: string, idField: string, id: any, data: any) => {
    const { error } = await supabase.from(table).update(data).eq(idField, id);
    if (error) {
        toast({ title: `שגיאה בעדכון ${table}`, description: error.message, variant: 'destructive' });
    }
}, 1000);

const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'SET_STATE':
        // This action hydrates the state from Supabase.
        return action.payload;
    case 'UPDATE_CONTENT':
      debouncedUpdate('site_content', 'id', 1, { content: action.payload });
      return { ...state, siteContent: action.payload };
    case 'ADD_DISH':
      return { ...state, dishes: [...state.dishes, action.payload] };
    case 'UPDATE_DISH':
      debouncedUpdate('dishes', 'id', action.payload.id, action.payload);
      return { ...state, dishes: state.dishes.map(d => d.id === action.payload.id ? action.payload : d) };
    case 'DELETE_DISH':
      return { ...state, dishes: state.dishes.filter(d => d.id !== action.payload) };
    case 'ADD_CATEGORY':
        return { ...state, categories: [...state.categories, action.payload] };
    case 'UPDATE_CATEGORY':
        debouncedUpdate('categories', 'id', action.payload.id, action.payload);
        return { ...state, categories: state.categories.map(c => c.id === action.payload.id ? action.payload : c) };
    case 'DELETE_CATEGORY':
        return { ...state, categories: state.categories.filter(c => c.id !== action.payload) };
    case 'ADD_GALLERY_IMAGE':
        return { ...state, gallery: [...state.gallery, action.payload] };
    case 'DELETE_GALLERY_IMAGE':
        return { ...state, gallery: state.gallery.filter(img => img.id !== action.payload) };
    case 'ADD_TESTIMONIAL':
        return { ...state, testimonials: [...state.testimonials, action.payload] };
    case 'UPDATE_TESTIMONIAL':
        debouncedUpdate('testimonials', 'id', action.payload.id, action.payload);
        return { ...state, testimonials: state.testimonials.map(t => t.id === action.payload.id ? action.payload : t) };
    case 'DELETE_TESTIMONIAL':
        return { ...state, testimonials: state.testimonials.filter(t => t.id !== action.payload) };
    case 'ADD_SUBSCRIBER':
        return { ...state, subscribers: [action.payload, ...state.subscribers] };
    case 'DELETE_SUBSCRIBER':
        return { ...state, subscribers: state.subscribers.filter(s => s.id !== action.payload) };
    case 'ADD_SUBMISSION':
        return { ...state, submissions: [action.payload, ...state.submissions] };
    case 'UPDATE_SUBMISSION_STATUS':
        debouncedUpdate('submissions', 'id', action.payload.id, { is_read: action.payload.is_read });
        return { ...state, submissions: state.submissions.map(s => s.id === action.payload.id ? { ...s, is_read: action.payload.is_read } : s) };
    case 'DELETE_SUBMISSION':
        return { ...state, submissions: state.submissions.filter(s => s.id !== action.payload) };
    case 'UPDATE_DESIGN':
        debouncedUpdate('design', 'id', 1, { settings: action.payload });
        return { ...state, design: action.payload };
    
    case 'REMOVE_ITEM_FROM_CART': {
        return state;
    }
    default:
      return state;
  }
};


const LS_CART_KEY = 'malkata_cart';
const ADMIN_PASSWORD = 'admin';

export const AppProvider: React.FC<{ children: React.ReactNode, initialAppState: AppState }> = ({ children, initialAppState }) => {
  const [state, dispatch] = useReducer(appReducer, initialAppState);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // This effect runs ONLY on the client, after the initial render.
  useEffect(() => {
    // We now fetch all data from the client side.
    const fetchInitialData = async () => {
        try {
            const [
                siteContentRes,
                designRes,
                dishesRes,
                categoriesRes,
                galleryRes,
                testimonialsRes,
                subscribersRes,
                submissionsRes
            ] = await Promise.all([
                supabase.from('site_content').select('content').limit(1).single(),
                supabase.from('design').select('settings').limit(1).single(),
                supabase.from('dishes').select('*'),
                supabase.from('categories').select('*'),
                supabase.from('gallery').select('*').order('created_at', { ascending: false }),
                supabase.from('testimonials').select('*').order('created_at', { ascending: false }),
                supabase.from('subscribers').select('*').order('date', { ascending: false }),
                supabase.from('submissions').select('*').order('date', { ascending: false })
            ]);

            const loadedState: AppState = {
                siteContent: { ...DEFAULT_APP_STATE.siteContent, ...(siteContentRes.data?.content || {}) },
                design: { ...DEFAULT_APP_STATE.design, ...(designRes.data?.settings || {}) },
                dishes: dishesRes.data || [],
                categories: categoriesRes.data || [],
                gallery: galleryRes.data || [],
                testimonials: testimonialsRes.data || [],
                subscribers: subscribersRes.data || [],
                submissions: submissionsRes.data || [],
            };
            dispatch({ type: 'SET_STATE', payload: loadedState });

        } catch (error) {
            console.error("Failed to fetch initial state from Supabase, using default.", error);
            // In case of error, the state is already the default state.
        } finally {
            setIsLoading(false);
        }
    }

    fetchInitialData();
    
    const storedCart = localStorage.getItem(LS_CART_KEY);
    if (storedCart) {
        setCart(JSON.parse(storedCart));
    }
    
    const storedAuth = sessionStorage.getItem('malkata_auth');
    if (storedAuth === 'true') {
        setIsAuthenticated(true);
    }
    
  }, []);

  // This effect runs ONLY on the client, and saves the cart state whenever it changes.
  useEffect(() => {
    if (!isLoading) {
        try {
            localStorage.setItem(LS_CART_KEY, JSON.stringify(cart));
        } catch (error) {
             console.error("Failed to save cart to localStorage", error);
        }
    }
  }, [cart, isLoading]);
  
  const handleDbAction = async (action: Action) => {
    let error;
    switch(action.type) {
        case 'ADD_DISH':
            ({ error } = await supabase.from('dishes').insert([action.payload]));
            break;
        case 'DELETE_DISH':
            ({ error } = await supabase.from('dishes').delete().eq('id', action.payload));
            break;
        case 'ADD_CATEGORY':
            ({ error } = await supabase.from('categories').insert([action.payload]));
            break;
        case 'DELETE_CATEGORY':
            ({ error } = await supabase.from('categories').delete().eq('id', action.payload));
            break;
        case 'ADD_GALLERY_IMAGE':
            ({ error } = await supabase.from('gallery').insert([action.payload]));
            break;
        case 'DELETE_GALLERY_IMAGE':
            ({ error } = await supabase.from('gallery').delete().eq('id', action.payload));
            break;
        case 'ADD_TESTIMONIAL':
            ({ error } = await supabase.from('testimonials').insert([action.payload]));
            break;
        case 'DELETE_TESTIMONIAL':
            ({ error } = await supabase.from('testimonials').delete().eq('id', action.payload));
            break;
        case 'ADD_SUBSCRIBER':
            ({ error } = await supabase.from('subscribers').insert([action.payload]));
            break;
        case 'DELETE_SUBSCRIBER':
            ({ error } = await supabase.from('subscribers').delete().eq('id', action.payload));
            break;
        case 'ADD_SUBMISSION':
            ({ error } = await supabase.from('submissions').insert([action.payload]));
            break;
        case 'DELETE_SUBMISSION':
             ({ error } = await supabase.from('submissions').delete().eq('id', action.payload));
            break;
    }
    
    if (error) {
        toast({ title: 'שגיאת מסד נתונים', description: error.message, variant: 'destructive' });
        // Optionally, revert the optimistic UI update
        // This would require a more complex state management approach
    } else {
        // Run original dispatch for optimistic UI update
        dispatch(action);
    }
  };

  const enhancedDispatch = useCallback((action: Action) => {
    // For actions that write to DB, we first update UI optimistically, then send to DB.
    const writeActions: Action['type'][] = [
        'ADD_DISH', 'DELETE_DISH', 'ADD_CATEGORY', 'DELETE_CATEGORY', 'ADD_GALLERY_IMAGE',
        'DELETE_GALLERY_IMAGE', 'ADD_TESTIMONIAL', 'DELETE_TESTIMONIAL', 'ADD_SUBSCRIBER', 
        'DELETE_SUBSCRIBER', 'ADD_SUBMISSION', 'DELETE_SUBMISSION'
    ];
    
    const isWriteAction = writeActions.includes(action.type);
    
    if (isWriteAction) {
        handleDbAction(action);
    }

    if (action.type === 'REMOVE_ITEM_FROM_CART') {
      setCart(prevCart => prevCart.filter(item => item.dishId !== action.payload));
    }
    
    // Always dispatch for UI updates (including debounced ones)
    dispatch(action);
  }, [dispatch]);


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
    dispatch: enhancedDispatch,
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
  }), [state, cart, isAuthenticated, isLoading, addToCart, updateCartQuantity, removeFromCart, clearCart, getDishById, login, logout, enhancedDispatch]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
