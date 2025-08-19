

// All `id` fields are now optional for creation, but will be present when fetched from DB.
export interface Dish {
  id?: string;
  name: string;
  short_description: string;
  full_description: string;
  price: number;
  price_subtitle?: string;
  main_image: string; 
  gallery_images?: string[];
  category_ids: string[];
  is_available: boolean;
  tags: string[]; // Storing font sizes as tags, e.g., "n-fs-xl", "d-fs-sm"
  is_recommended?: boolean;
}

export interface Category {
  id?: string;
  name: string;
  slug: string;
  description: string;
  image: string; // Will store banner image key
  square_image?: string | null; // Will store the new square image key for the homepage
  title_color?: string;
  title_font_size?: string;
  title_font?: string;
  title_opacity?: number;
  image_brightness?: number;
  show_description?: boolean;
  show_description_below_banner?: boolean;
}

export interface GalleryImage {
  id?: string;
  src: string;
  alt?: string;
  created_at?: string;
}

export interface Testimonial {
    id?: string;
    name: string;
    quote: string;
    created_at?: string;
}

export interface Subscriber {
    id?: string;
    name: string;
    phone: string;
    date: string;
}

export interface ContactSubmission {
    id?: string;
    name: string;
    email?: string;
    phone?: string;
    message: string;
    date: string;
    is_read: boolean;
}

export interface Feature {
    icon: string;
    title: string;
    description: string;
}

export interface OptionalFeature extends Feature {
    enabled: boolean;
}

export interface SiteContent {
  hero: {
    title_first_word: string;
    title_rest: string;
    subtitle: string;
    image: string;
    title_first_word_color: string;
    title_first_word_font_size: string;
    title_first_word_opacity: number;
    title_rest_color: string;
    title_rest_font_size: string;
    title_rest_opacity: number;
    subtitle_opacity: number;
    animation_interval: number;
    hero_image_brightness: number;
    hero_height: number;
    vertical_align: 'top' | 'center' | 'bottom';
    horizontal_align: 'left' | 'center' | 'right';
    text_align: 'left' | 'center' | 'right';
  };
  about: {
    short: string;
    long: string;
    image: string;
  };
  contact: {
    address: string;
    phone: string;
    whatsapp: string;
    email: string;
    hours: string;
    instagram?: string;
    facebook?: string;
    show_address?: boolean;
    show_phone?: boolean;
    show_whatsapp?: boolean;
    show_email?: boolean;
    show_instagram?: boolean;
    show_facebook?: boolean;
    show_hours?: boolean;
  };
  menu: {
    main_image: string;
  };
  newsletter: {
    headline: string;
    subheadline: string;
    image?: string;
    image_brightness?: number;
  };
  testimonials: {
    headline: string;
  };
   features: {
    feature1: Feature;
    feature2: Feature;
    feature3: Feature;
    feature4: OptionalFeature;
  };
  footer: {
    tagline?: string;
    contact_title?: string;
    hours_title?: string;
    copyright?: string;
    hours_content?: string;
    hours_content_color?: string;
    hours_content_font_size?: string;
    hours_content_is_bold?: boolean;
  };
  cart: {
    delivery_method_title: string;
    pickup_label: string;
    delivery_label: string;
    free_delivery_threshold: number;
    free_delivery_text: string;
    order_notes_placeholder?: string;
  };
  shabbat_notice?: {
      enabled?: boolean;
      text?: string;
      color?: string;
      font_size?: string;
      is_bold?: boolean;
  };
  seo?: {
    title?: string;
    description?: string;
    image?: string;
  };
  dish_card?: {
    quick_view_text?: string;
    quick_view_icon?: string;
    quick_view_overlay_opacity?: number;
    quick_view_font?: string;
    quick_view_color?: string;
  };
}

export interface DesignSettings {
  theme: string;
  headline_font: string;
  body_font: string;
  logo_icon: string;
  logo_color?: string;
  logo_image?: string;
  logo_image_mobile?: string;
  logo_width_desktop?: number;
  logo_width_mobile?: number;
  featured_category_id?: string | null;
  favicon?: string;
}

export interface CartItem {
  dishId: string;
  quantity: number;
}

export interface AppState {
  siteContent: SiteContent;
  dishes: Dish[];
  categories: Category[];
  gallery: GalleryImage[];
  testimonials: Testimonial[];
  subscribers: Subscriber[];
  submissions: ContactSubmission[];
  design: DesignSettings;
}

export type AppContextType = {
  state: AppState;
  dispatch: React.Dispatch<any>;
  cart: CartItem[];
  addToCart: (dishId: string, quantity?: number) => void;
  updateCartQuantity: (dishId: string, quantity: number) => void;
  removeFromCart: (dishId: string) => void;
  clearCart: () => void;
  getDishById: (dishId: string) => Dish | undefined;
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  isLoading: boolean;
};

export type Action =
  | { type: 'SET_STATE'; payload: AppState }
  | { type: 'UPDATE_CONTENT'; payload: SiteContent }
  | { type: 'ADD_DISH'; payload: Dish }
  | { type: 'UPDATE_DISH'; payload: Dish }
  | { type: 'DELETE_DISH'; payload: string }
  | { type: 'ADD_CATEGORY'; payload: Category }
  | { type: 'UPDATE_CATEGORY'; payload: Category }
  | { type: 'DELETE_CATEGORY'; payload: string }
  | { type: 'ADD_GALLERY_IMAGE'; payload: GalleryImage }
  | { type: 'DELETE_GALLERY_IMAGE'; payload: string }
  | { type: 'ADD_TESTIMONIAL'; payload: Testimonial }
  | { type: 'UPDATE_TESTIMONIAL'; payload: Testimonial }
  | { type: 'DELETE_TESTIMONIAL'; payload: string }
  | { type: 'ADD_SUBSCRIBER', payload: Subscriber }
  | { type: 'DELETE_SUBSCRIBER', payload: string }
  | { type: 'ADD_SUBMISSION', payload: ContactSubmission }
  | { type: 'UPDATE_SUBMISSION_STATUS', payload: { id: string, is_read: boolean } }
  | { type: 'DELETE_SUBMISSION', payload: string }
  | { type: 'UPDATE_DESIGN'; payload: DesignSettings }
  | { type: 'REMOVE_ITEM_FROM_CART', payload: string };
