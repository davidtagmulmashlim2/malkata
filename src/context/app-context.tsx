

'use client';

import React, { createContext, useContext, useReducer, useEffect, useState, useMemo, useCallback } from 'react';
import type { AppState, AppContextType, Action, CartItem, Dish, Testimonial, ContactSubmission, Category, GalleryImage, Subscriber, SiteContent, DesignSettings } from '@/lib/types';
import { DEFAULT_APP_STATE } from '@/lib/data';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { deleteImage } from '@/lib/image-store';

// Create the context
const AppContext = createContext<AppContextType | undefined>(undefined);

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
  
  const enhancedDispatch = useCallback(async (action: Action) => {
    let error;

    const insertAndRefresh = async (tableName: string, payload: any, actionType: Action['type']) => {
        const { data, error } = await supabase.from(tableName).insert(payload).select().single();
        if (error) {
            toast({ title: `שגיאה בשמירת ${tableName}`, description: error.message, variant: 'destructive' });
        } else if (data) {
            dispatch({ type: actionType, payload: data });
        }
        return { data, error };
    };
    
     const findItemToDelete = (collection: any[], id: string) => collection.find(item => item.id === id);

    switch(action.type) {
        case 'ADD_DISH':
            const { data: dishData, error: dishError } = await supabase.from('dishes').insert(action.payload).select().single();
            if (!dishError) dispatch({ type: 'ADD_DISH', payload: dishData });
            error = dishError;
            break;
        case 'DELETE_DISH': {
            const dishToDelete = findItemToDelete(state.dishes, action.payload);
            const { error: deleteDishError } = await supabase.from('dishes').delete().eq('id', action.payload);
            if (!deleteDishError) {
                 if (dishToDelete?.main_image) await deleteImage(dishToDelete.main_image);
                 if (dishToDelete?.gallery_images) {
                    for (const img of dishToDelete.gallery_images) {
                        await deleteImage(img);
                    }
                 }
                 dispatch(action); // Update state only on successful deletion
            }
            error = deleteDishError;
            break;
        }
        case 'ADD_CATEGORY':
            const { data: catData, error: catError } = await supabase.from('categories').insert(action.payload).select().single();
            if (!catError) dispatch({ type: 'ADD_CATEGORY', payload: catData });
            error = catError;
            break;
        case 'DELETE_CATEGORY': {
            const categoryToDelete = findItemToDelete(state.categories, action.payload);
            const { error: deleteCatError } = await supabase.from('categories').delete().eq('id', action.payload);
             if (!deleteCatError) {
                if (categoryToDelete?.image) await deleteImage(categoryToDelete.image);
                dispatch(action);
            }
            error = deleteCatError;
            break;
        }
        case 'ADD_GALLERY_IMAGE':
            const { data: galleryData, error: galleryError } = await supabase.from('gallery').insert(action.payload).select().single();
            if (!galleryError) dispatch({ type: 'ADD_GALLERY_IMAGE', payload: galleryData });
            error = galleryError;
            break;
        case 'DELETE_GALLERY_IMAGE': {
            const imageToDelete = findItemToDelete(state.gallery, action.payload);
            const { error: deleteGalleryError } = await supabase.from('gallery').delete().eq('id', action.payload);
            if (!deleteGalleryError) {
                if (imageToDelete?.src) await deleteImage(imageToDelete.src);
                dispatch(action);
            }
            error = deleteGalleryError;
            break;
        }
        case 'ADD_TESTIMONIAL':
            const { data: testimonialData, error: testimonialError } = await supabase.from('testimonials').insert(action.payload).select().single();
            if (!testimonialError) dispatch({ type: 'ADD_TESTIMONIAL', payload: testimonialData });
            error = testimonialError;
            break;
        case 'DELETE_TESTIMONIAL':
            const { error: deleteTestimonialError } = await supabase.from('testimonials').delete().eq('id', action.payload);
             if (!deleteTestimonialError) dispatch(action);
             error = deleteTestimonialError;
            break;
        case 'ADD_SUBSCRIBER':
            const { data: subscriberData, error: subscriberError } = await supabase.from('subscribers').insert(action.payload).select().single();
            if (!subscriberError) dispatch({ type: 'ADD_SUBSCRIBER', payload: subscriberData });
            error = subscriberError;
            break;
        case 'DELETE_SUBSCRIBER':
            const { error: deleteSubscriberError } = await supabase.from('subscribers').delete().eq('id', action.payload);
             if (!deleteSubscriberError) dispatch(action);
             error = deleteSubscriberError;
            break;
        case 'ADD_SUBMISSION':
            const { data: submissionData, error: submissionError } = await supabase.from('submissions').insert(action.payload).select().single();
            if (!submissionError) dispatch({ type: 'ADD_SUBMISSION', payload: submissionData });
            error = submissionError;
            break;
        case 'DELETE_SUBMISSION':
             const { error: deleteSubmissionError } = await supabase.from('submissions').delete().eq('id', action.payload);
             if (!deleteSubmissionError) dispatch(action);
             error = deleteSubmissionError;
            break;
        case 'REMOVE_ITEM_FROM_CART':
             setCart(prevCart => prevCart.filter(item => item.dishId !== action.payload));
             dispatch(action); // Let reducer handle other state changes if needed
             break;
        default:
            // For updates or non-DB actions, dispatch directly for optimistic UI
            dispatch(action);
            break;
    }
    
    if (error) {
        toast({ title: 'שגיאת מסד נתונים', description: error.message, variant: 'destructive' });
    }
  }, [dispatch, state.dishes, state.categories, state.gallery]);


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
