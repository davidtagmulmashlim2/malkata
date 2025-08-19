

import type { AppState } from './types';

// This file now only contains the INITIAL/DEFAULT state for a new user.
// All dynamic data (dishes, categories, etc.) will be managed exclusively
// in localStorage via the AppContext, making it the single source of truth.
// This prevents hydration errors and data conflicts.

export const DEFAULT_APP_STATE: AppState = {
  siteContent: {
    hero: {
      title_first_word: 'מלכתא:',
      title_rest: 'טעמים של בית',
      subtitle: 'אוכל ביתי אותנטי, מוכן באהבה כל יום מחדש.',
      image: 'img-1721294825974-9b5xua4yv',
      title_first_word_color: '#FFFFFF',
      title_first_word_font_size: '7xl',
      title_first_word_opacity: 1,
      title_rest_color: '#FFFFFF',
      title_rest_font_size: '6xl',
      title_rest_opacity: 1,
      subtitle_opacity: 1,
      animation_interval: 5,
      hero_image_brightness: 50,
      hero_height: 80,
      vertical_align: 'center',
      horizontal_align: 'center',
      text_align: 'center',
    },
    about: {
      short: 'בלב העיר, שוכנת "מלכתא", מסעדה שהיא בית. אנו מגישים באהבה את מיטב המאכלים מהמטבח הביתי, עם חומרי גלם טריים ומתכונים שעוברים מדור לדור.',
      long: 'סיפורה של "מלכתא" מתחיל במטבח של סבתא, שם התבשל הקסם. כל מנה שלנו היא מסע בזמן, חזרה לטעמים של פעם, לארוחות שישי ולחגים. אנו מאמינים שאוכל הוא יותר מסתם מזון - הוא זיכרון, הוא חוויה, והוא חיבור. לכן, אנו מקפידים על כל פרט, מהירקות הטריים שאנחנו בוחרים בבוקר ועד לבישול האיטי והסבלני שמוציא את המיטב מכל תבשיל. בואו לחוות איתנו את טעם הבית.',
      image: 'img-1721294833291-l1whr9w0o',
    },
    contact: {
      address: 'רחוב הנביאים 1, תל אביב',
      phone: '03-1234567',
      whatsapp: '972501234567',
      email: 'contact@malkata.co.il',
      hours: 'א׳-ה׳: 11:00 - 22:00 | ו׳: 09:00 - 15:00',
      instagram: 'https://instagram.com/malkata',
      facebook: 'https://facebook.com/malkata',
      show_address: true,
      show_phone: true,
      show_whatsapp: true,
      show_email: true,
      show_instagram: true,
      show_facebook: true,
      show_hours: true,
    },
    menu: {
      main_image: 'img-1721294835843-gqvtgpcgo',
    },
    newsletter: {
      headline: 'הצטרפו למועדון הלקוחות שלנו',
      subheadline: 'הישארו מעודכנים במבצעים, מנות חדשות ואירועים מיוחדים!',
      image: '',
      image_brightness: 50,
    },
    testimonials: {
      headline: "מה אומרים עלינו"
    },
    features: {
        feature1: {
            icon: 'Leaf',
            title: 'ללא חומרים משמרים',
            description: 'בישול ביתי – ללא חומרים משמרים או תוספים תעשייתיים. רק עם חומרי גלם איכותיים וטריים.'
        },
        feature2: {
            icon: 'ChefHat',
            title: 'טעמים בהתאמה אישית',
            description: 'חריף כמו של סבתא? או עדין לילדים? כל בקשה מתקבלת באהבה.'
        },
        feature3: {
            icon: 'Bike',
            title: 'הזמנה מהירה ופשוטה',
            description: 'בוחרים מנות באתר, שולחים לוואטסאפ, ואנחנו מתחילים לבשל. באהבה.'
        },
        feature4: {
            enabled: true,
            icon: 'PartyPopper',
            title: 'קייטרינג ואירועים',
            description: 'חוגגים אירוע? נשמח להביא את הטעמים של מלכתא עד אליכם.'
        }
    },
    footer: {
      tagline: 'אוכל ביתי אותנטי, מוכן באהבה כל יום מחדש.',
      contact_title: 'יצירת קשר',
      hours_title: 'הזמנות לשבת:',
      copyright: 'מלכתא. כל הזכויות שמורות.',
      hours_content: 'הזמנות לשבת יתקבלו עד יום רביעי בשעה 23:00',
      hours_content_color: '#52525b',
      hours_content_font_size: 'sm',
      hours_content_is_bold: false,
    },
    cart: {
      delivery_method_title: "אופן קבלת ההזמנה",
      pickup_label: "איסוף עצמי",
      delivery_label: "משלוח",
      free_delivery_threshold: 200,
      free_delivery_text: "משלוח חינם בהזמנה מעל {amount} ₪",
      order_notes_placeholder: 'למשל: "בלי כוסברה, תודה!"'
    },
    shabbat_notice: {
        enabled: true,
        text: 'הזמנות לשבת יתקבלו עד יום רביעי בשעה 23:00',
        color: '#52525b', // zinc-600
        font_size: 'base',
        is_bold: false,
    },
    seo: {
        title: 'מלכתא - אוכל ביתי',
        description: 'לא רק אוכל, חוויה של שבת.',
        image: '',
    },
    dish_card: {
        quick_view_text: 'הצגה מהירה',
        quick_view_icon: 'Eye',
        quick_view_overlay_opacity: 40,
        quick_view_font: 'default',
        quick_view_color: '#FFFFFF',
    }
  },
  // These arrays are intentionally empty.
  // The app will be populated from localStorage, making it the single source of truth.
  // This prevents hydration mismatches and data conflicts.
  categories: [],
  dishes: [],
  gallery: [],
  testimonials: [],
  subscribers: [],
  submissions: [],
  design: {
    theme: 'default',
    headline_font: 'playfair',
    body_font: 'pt-sans',
    logo_icon: 'crown4',
    logo_color: '#e0a84c',
    logo_image: '',
    logo_image_mobile: '',
    logo_width_desktop: 120,
    logo_width_mobile: 90,
    featured_category_id: '',
    favicon: '',
  },
};

    
