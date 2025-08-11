// utils/dateUtils.ts
import { Offer } from '../../schemas/offerSchema';



export type OfferStatus = 'upcoming' | 'active' | 'expired';
export function formatForDateTimeLocal(isoString?: string) {
  if (!isoString) return '';
  const date = new Date(isoString);
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function toUTCISOString(localDateString?: string) {
  if (!localDateString) return '';
  return new Date(localDateString).toISOString();
}

// utils/productUtils.ts
export function parseProductName(product: string | { name: string } | null | undefined) {
  if (!product) return '';
  try {
    if (typeof product === 'string') {
      const parsed = JSON.parse(product);
      return parsed?.name || '';
    }
    return product?.name || '';
  } catch {
    return '';
  }
}

export function stringifyProductName(name: string) {
  return JSON.stringify({ name: name || '' });
}

export function getOfferStatus(offer: Offer, now: Date = new Date()): OfferStatus {
  const startUTC = new Date(offer.startDateUTC);
  const endUTC = new Date(offer.endDateUTC);

  // 1. Check for expired status based on overall date range
  if (now > endUTC) {
    return 'expired';
  }

  // 2. Check for upcoming status if the offer hasn't started yet
  if (now < startUTC) {
    return 'upcoming';
  }

  // 3. The offer is within its overall date range. Now handle repeating patterns.

  // Get local time components for the current time
  const nowDayOfWeek = now.getDay(); // 0 for Sunday, 6 for Saturday
  const nowMonth = now.getMonth();   // 0 for January, 11 for December
  const nowTimeInMinutes = now.getHours() * 60 + now.getMinutes();

  // Create a Date object for the offer's start time in the local timezone
  // This is the key change to ensure local time comparison
  const offerLocalStartTime = new Date(offer.startDateUTC); 
  const offerLocalEndTime = new Date(offer.endDateUTC);

  const offerStartTimeInMinutes = offerLocalStartTime.getHours() * 60 + offerLocalStartTime.getMinutes();
  const offerEndTimeInMinutes = offerLocalEndTime.getHours() * 60 + offerLocalEndTime.getMinutes();
  
  const isTimeActive = nowTimeInMinutes >= offerStartTimeInMinutes && nowTimeInMinutes <= offerEndTimeInMinutes;
  const repeatDetailsArray = Array.isArray(offer.repeatDetails) ? offer.repeatDetails : [];

  switch (offer.repeatPatterns) {
    case 'none':
      return 'active'; 

    case 'daily':
      return isTimeActive ? 'active' : 'upcoming';

    case 'weekly':
      const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const repeatDaysNumbers = repeatDetailsArray.map((day: string) => daysOfWeek.indexOf(day.toLowerCase()));

      if (repeatDaysNumbers.includes(nowDayOfWeek)) {
        return isTimeActive ? 'active' : 'upcoming';
      } else {
        return 'upcoming';
      }
      
    case 'monthly':
      const monthsOfYear = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
      const repeatMonthsNumbers = repeatDetailsArray.map((month: string) => monthsOfYear.indexOf(month.toLowerCase()));

      if (repeatMonthsNumbers.includes(nowMonth)) {
        return isTimeActive ? 'active' : 'upcoming';
      } else {
        return 'upcoming';
      }
  }

  return 'upcoming';
}

