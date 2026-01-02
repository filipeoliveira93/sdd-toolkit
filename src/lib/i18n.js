/**
 * Internal i18n Engine
 */
const { TRANSLATIONS } = require('./messages');

let currentLocale = 'en';

function setLocale(locale) {
    // Normalize logic (pt-br -> pt_br) if passed incorrectly, though prompts usually give controlled values
    const normalized = locale.toLowerCase().replace('-', '_');
    
    if (TRANSLATIONS[normalized]) {
        currentLocale = normalized;
    } else {
        // Fallback to en
        currentLocale = 'en';
    }
}

function getLocale() {
    return currentLocale;
}

/**
 * Retrieves a string from the dictionary based on dot notation.
 * e.g. t('INTRO.TITLE')
 */
function t(path, ...args) {
    const keys = path.split('.');
    let value = TRANSLATIONS[currentLocale];

    // Traverse the object for the current locale
    for (const key of keys) {
        if (value && value[key]) {
            value = value[key];
        } else {
            value = undefined;
            break;
        }
    }

    // If not found, Try Fallback to EN
    if (!value) {
        let fallback = TRANSLATIONS['en'];
        for (const k of keys) {
            if (fallback && fallback[k]) fallback = fallback[k];
            else {
                fallback = undefined;
                break;
            }
        }
        value = fallback;
    }

    // If still not found, return the path itself as a debug marker
    if (!value) return path;

    if (typeof value === 'function') {
        return value(...args);
    }

    return value;
}

module.exports = { t, setLocale, getLocale };
