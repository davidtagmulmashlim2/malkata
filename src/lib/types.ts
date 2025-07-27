

export interface Dish {
  id: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  priceSubtitle?: string;
  mainImage: string; // This will be an image URL
  galleryImages?: string[]; // This will be an array of image URLs
  categoryIds: string[];
  isAvailable: boolean;
  tags: ('vegan' | 'spicy' | 'new' | 'piquant' | 'kids-favorite')[];
  isRecommended?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string; // This will be an image URL
  titleColor?: string;
  titleFontSize?: string;
  titleFont?: string;
  titleOpacity?: number;
  imageBrightness?: number;
  showDescription?: boolean;
  showDescriptionBelowBanner?: boolean;
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
   features: {
    feature1: Feature;
    feature2: Feature;
    feature3: Feature;
    feature4: OptionalFeature;
  };
  footer: {
    tagline?: string;
    contactTitle?: string;
    hoursTitle?: string;
    copyright?: string;
    hoursContent?: string;
  };
  cart: {
    deliveryMethodTitle: string;
    pickupLabel: string;
    deliveryLabel: string;
    freeDeliveryThreshold: number;
    freeDeliveryText: string;
    orderNotesPlaceholder: string;
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

    
