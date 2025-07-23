export interface Dish {
  id: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  images: string[];
  categoryId: string;
  isAvailable: boolean;
  tags: ('vegan' | 'spicy')[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
}

export interface Testimonial {
  id: string;
  name: string;
  quote: string;
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
}

export interface SiteContent {
  hero: {
    titleFirstWord: string;
    titleRest: string;
    subtitle: string;
    image: string;
    titleFirstWordColor: string;
    titleFirstWordFontSize: string;
    titleFirstWordOpacity: number;
    titleRestColor: string;
    titleRestFontSize: string;
    titleRestOpacity: number;
    subtitleOpacity: number;
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
  };
  menu: {
    mainImage: string;
  };
}

export interface DesignSettings {
  theme: string;
  headlineFont: string;
  bodyFont: string;
}

export interface CartItem {
  dishId: string;
  quantity: number;
}

export interface AppState {
  siteContent: SiteContent;
  dishes: Dish[];
  categories: Category[];
  testimonials: Testimonial[];
  gallery: GalleryImage[];
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
  | { type: 'UPDATE_DESIGN'; payload: DesignSettings };
