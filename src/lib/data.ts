
import type { AppState } from './types';

export const DEFAULT_APP_STATE: AppState = {
  siteContent: {
    hero: {
      titleFirstWord: 'מלכתא:',
      titleRest: 'טעמים של בית',
      subtitle: 'אוכל ביתי אותנטי, מוכן באהבה כל יום מחדש.',
      image: 'img-1721294825974-9b5xua4yv',
      titleFirstWordColor: '#FFFFFF',
      titleFirstWordFontSize: '7xl',
      titleFirstWordOpacity: 1,
      titleRestColor: '#FFFFFF',
      titleRestFontSize: '6xl',
      titleRestOpacity: 1,
      subtitleOpacity: 1,
      animationInterval: 5,
      heroImageBrightness: 50,
      verticalAlign: 'center',
      horizontalAlign: 'center',
      textAlign: 'center',
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
    },
    menu: {
      mainImage: 'img-1721294835843-gqvtgpcgo',
    }
  },
  categories: [],
  dishes: [],
  testimonials: [],
  gallery: [],
  design: {
    theme: 'default',
    headlineFont: 'playfair',
    bodyFont: 'pt-sans',
    logoIcon: 'crown',
  },
};

    