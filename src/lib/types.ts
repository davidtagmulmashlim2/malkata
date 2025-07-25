
export interface Dish {
  id: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  mainImage: string; // This will be an image URL
  galleryImages?: string[]; // This will be an array of image URLs
  categoryId: string;
  isAvailable: boolean;
  tags: ('vegan' | 'spicy')[];
  isRecommended?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string; // This will be an image URL
}

export interface GalleryImage {
  id: string;
  src: string; // This will be an image URL
  alt: string;
}

export interface Testimonial {
    id: string;
    name: string;
    quote: string;
}

export interface Subscriber {
    id: string;
    name: string;
    phone: string;
    date: string;
}

export interface SiteContent {
  hero: {
    titleFirstWord: string;
    titleRest: string;
    subtitle: string;
    image: string; // This will be an image URL
    titleFirstWordColor: string;
    titleFirstWordFontSize: string;
    titleFirstWordOpacity: number;
    titleRestColor: string;
    titleRestFontSize: string;
    titleRestOpacity: number;
    subtitleOpacity: number;
    animationInterval: number;
    heroImageBrightness: number;
    verticalAlign: 'top' | 'center' | 'bottom';
    horizontalAlign: 'left' | 'center' | 'right';
    textAlign: 'left' | 'center' | 'right';
  };
  about: {
    short: string;
    long: string;
    image: string; // This will be an image URL
  };
  contact: {
    address: string;
    phone: string;
    whatsapp: string;
    email: string;
    hours: string;
    instagram?: string;
  };
  menu: {
    mainImage: string; // This will be an image URL
  };
  newsletter: {
    headline: string;
    subheadline: string;
  };
  testimonials: {
    headline: string;
  };
  footer: {
    tagline?: string;
    contactTitle?: string;
    hoursTitle?: string;
    copyright?: string;
    hoursContent?: string;
  };
}

export interface DesignSettings {
  theme: string;
  headlineFont: string;
  bodyFont: string;
  logoIcon: string;
  logoColor?: string;
  featuredCategoryId?: string | undefined;
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
  | { type: 'SET_STATE'; payload: Partial<AppState> }
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
  | { type: 'UPDATE_DESIGN'; payload: DesignSettings }
  | { type: 'REMOVE_ITEM_FROM_CART', payload: string };
