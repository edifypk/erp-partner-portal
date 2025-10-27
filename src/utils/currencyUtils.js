// Currency mapping object
const countryToCurrency = {
    // North America
    'US': { code: 'USD', symbol: '$' },
    'CA': { code: 'CAD', symbol: '$' },
    'MX': { code: 'MXN', symbol: '$' },
    
    // Europe
    'GB': { code: 'GBP', symbol: '£' },
    'DE': { code: 'EUR', symbol: '€' },
    'FR': { code: 'EUR', symbol: '€' },
    'IT': { code: 'EUR', symbol: '€' },
    'ES': { code: 'EUR', symbol: '€' },
    'PT': { code: 'EUR', symbol: '€' },
    'NL': { code: 'EUR', symbol: '€' },
    'BE': { code: 'EUR', symbol: '€' },
    'CH': { code: 'CHF', symbol: 'Fr' },
    
    // Asia
    'CN': { code: 'CNY', symbol: '¥' },
    'JP': { code: 'JPY', symbol: '¥' },
    'KR': { code: 'KRW', symbol: '₩' },
    'IN': { code: 'INR', symbol: '₹' },
    'SG': { code: 'SGD', symbol: '$' },
    'MY': { code: 'MYR', symbol: 'RM' },
    'TH': { code: 'THB', symbol: '฿' },
    'ID': { code: 'IDR', symbol: 'Rp' },
    'PH': { code: 'PHP', symbol: '₱' },
    'VN': { code: 'VND', symbol: '₫' },
    
    // Oceania
    'AU': { code: 'AUD', symbol: '$' },
    'NZ': { code: 'NZD', symbol: '$' },
    
    // Middle East
    'AE': { code: 'AED', symbol: 'د.إ' },
    'SA': { code: 'SAR', symbol: '﷼' },
    'QA': { code: 'QAR', symbol: '﷼' },
    'KW': { code: 'KWD', symbol: 'د.ك' },
    
    // Africa
    'ZA': { code: 'ZAR', symbol: 'R' },
    'EG': { code: 'EGP', symbol: 'E£' },
    'NG': { code: 'NGN', symbol: '₦' },
    'KE': { code: 'KES', symbol: 'KSh' },
};


export const getCurrencyByCountry = (countryCode) => {
    if (!countryCode) return null;
    return countryToCurrency[countryCode.toUpperCase()] || null;
};


export const getCurrencyCode = (countryCode) => {
    const currency = getCurrencyByCountry(countryCode);
    return currency ? currency.code : null;
};

export const getCurrencySymbol = (countryCode) => {
    const currency = getCurrencyByCountry(countryCode);
    return currency ? currency.symbol : null;
}; 