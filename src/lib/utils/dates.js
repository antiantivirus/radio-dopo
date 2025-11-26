import { format, parseISO } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { enUS, it } from 'date-fns/locale';

/**
 * Get date-fns locale based on language code
 * @param {string} lang - Language code ('en' or 'it')
 * @returns {object} date-fns locale
 */
export function getDateLocale(lang) {
	return lang === 'it' ? it : enUS;
}

/**
 * Format a date string or Date object
 * @param {string|Date} date - Date to format
 * @param {string} formatStr - Format string (default: 'd, MMM yyyy')
 * @param {string} lang - Language code for locale
 * @returns {string} Formatted date
 */
export function formatDate(date, formatStr = 'd, MMM yyyy', lang = 'en') {
	try {
		const dateObj = typeof date === 'string' ? parseISO(date) : date;
		return format(dateObj, formatStr, { locale: getDateLocale(lang) });
	} catch (error) {
		console.error('Error formatting date:', error, date);
		return '';
	}
}

/**
 * Format a date/time in the user's timezone
 * @param {string|Date} date - Date to format
 * @param {string} timeZone - IANA timezone (e.g., 'Europe/Rome')
 * @param {string} formatStr - Format string (default: 'PPp')
 * @param {string} lang - Language code for locale
 * @returns {string} Formatted date/time in timezone
 */
export function formatInUserTimeZone(date, timeZone, formatStr = 'PPp', lang = 'en') {
	try {
		const dateObj = typeof date === 'string' ? parseISO(date) : date;
		return formatInTimeZone(dateObj, timeZone, formatStr, { locale: getDateLocale(lang) });
	} catch (error) {
		console.error('Error formatting date in timezone:', error, date);
		return '';
	}
}

/**
 * Get the user's timezone
 * @returns {string} IANA timezone identifier
 */
export function getUserTimeZone() {
	return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

/**
 * Format time only (HH:mm)
 * @param {string|Date} date - Date to format
 * @param {string} lang - Language code for locale
 * @returns {string} Formatted time
 */
export function formatTime(date, lang = 'en') {
	return formatDate(date, 'HH:mm', lang);
}

/**
 * Format time in user's timezone
 * @param {string|Date} date - Date to format
 * @param {string} timeZone - IANA timezone
 * @param {string} lang - Language code for locale
 * @returns {string} Formatted time in timezone
 */
export function formatTimeInUserTimeZone(date, timeZone, lang = 'en') {
	return formatInUserTimeZone(date, timeZone, 'h:mm a', lang);
}
