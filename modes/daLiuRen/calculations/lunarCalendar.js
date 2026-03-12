// Lunar calendar conversion for Da Liu Ren
// This module provides solar-to-lunar conversion for the date range 1900-2100

// Chinese New Year dates (solar dates for lunar Jan 1st, 1900-2100)
// Format: [year, month, day]
const NEW_YEAR_DATES = [
  [1900, 1, 31], [1901, 2, 19], [1902, 2, 8], [1903, 1, 29], [1904, 2, 16],
  [1905, 2, 4], [1906, 1, 25], [1907, 2, 13], [1908, 2, 2], [1909, 1, 22],
  [1910, 2, 10], [1911, 1, 30], [1912, 2, 18], [1913, 2, 6], [1914, 1, 26],
  [1915, 2, 14], [1916, 2, 3], [1917, 1, 23], [1918, 2, 11], [1919, 2, 1],
  [1920, 2, 20], [1921, 2, 8], [1922, 1, 28], [1923, 2, 16], [1924, 2, 5],
  [1925, 1, 24], [1926, 2, 13], [1927, 2, 2], [1928, 1, 23], [1929, 2, 10],
  [1930, 1, 30], [1931, 2, 17], [1932, 2, 6], [1933, 1, 26], [1934, 2, 14],
  [1935, 2, 4], [1936, 1, 24], [1937, 2, 11], [1938, 2, 1], [1939, 2, 19],
  [1940, 2, 8], [1941, 1, 27], [1942, 2, 15], [1943, 2, 5], [1944, 1, 25],
  [1945, 2, 13], [1946, 2, 2], [1947, 1, 22], [1948, 2, 10], [1949, 1, 29],
  [1950, 2, 17], [1951, 2, 6], [1952, 1, 27], [1953, 2, 14], [1954, 2, 3],
  [1955, 1, 24], [1956, 2, 12], [1957, 1, 31], [1958, 2, 18], [1959, 2, 8],
  [1960, 1, 28], [1961, 2, 15], [1962, 2, 5], [1963, 1, 25], [1964, 2, 13],
  [1965, 2, 2], [1966, 1, 21], [1967, 2, 9], [1968, 1, 30], [1969, 2, 17],
  [1970, 2, 6], [1971, 1, 27], [1972, 2, 15], [1973, 2, 3], [1974, 1, 23],
  [1975, 2, 11], [1976, 1, 31], [1977, 2, 18], [1978, 2, 7], [1979, 1, 28],
  [1980, 2, 16], [1981, 2, 5], [1982, 1, 25], [1983, 2, 13], [1984, 2, 2],
  [1985, 2, 20], [1986, 2, 9], [1987, 1, 29], [1988, 2, 17], [1989, 2, 6],
  [1990, 1, 27], [1991, 2, 15], [1992, 2, 4], [1993, 1, 23], [1994, 2, 10],
  [1995, 1, 31], [1996, 2, 19], [1997, 2, 7], [1998, 1, 28], [1999, 2, 16],
  [2000, 2, 5], [2001, 1, 24], [2002, 2, 12], [2003, 2, 1], [2004, 1, 22],
  [2005, 2, 9], [2006, 1, 29], [2007, 2, 18], [2008, 2, 7], [2009, 1, 26],
  [2010, 2, 14], [2011, 2, 3], [2012, 1, 23], [2013, 2, 10], [2014, 1, 31],
  [2015, 2, 19], [2016, 2, 8], [2017, 1, 28], [2018, 2, 16], [2019, 2, 5],
  [2020, 1, 25], [2021, 2, 12], [2022, 2, 1], [2023, 1, 22], [2024, 2, 10],
  [2025, 1, 29], [2026, 2, 17], [2027, 2, 6], [2028, 1, 26], [2029, 2, 13],
  [2030, 2, 3], [2031, 1, 23], [2032, 2, 11], [2033, 1, 31], [2034, 2, 19],
  [2035, 2, 8], [2036, 1, 28], [2037, 2, 15], [2038, 2, 4], [2039, 1, 24],
  [2040, 2, 12], [2041, 2, 1], [2042, 1, 22], [2043, 2, 10], [2044, 1, 30],
  [2045, 2, 17], [2046, 2, 6], [2047, 1, 27], [2048, 2, 14], [2049, 2, 2],
  [2050, 1, 23], [2051, 2, 11], [2052, 1, 31], [2053, 2, 18], [2054, 2, 8],
  [2055, 1, 28], [2056, 2, 15], [2057, 2, 4], [2058, 1, 25], [2059, 2, 13],
  [2060, 2, 2], [2061, 1, 22], [2062, 2, 9], [2063, 1, 30], [2064, 2, 18],
  [2065, 2, 7], [2066, 1, 27], [2067, 2, 15], [2068, 2, 5], [2069, 1, 25],
  [2070, 2, 13], [2071, 2, 2], [2072, 1, 23], [2073, 2, 10], [2074, 1, 30],
  [2075, 2, 19], [2076, 2, 8], [2077, 1, 28], [2078, 2, 16], [2079, 2, 5],
  [2080, 1, 26], [2081, 2, 14], [2082, 2, 3], [2083, 1, 24], [2084, 2, 12],
  [2085, 2, 1], [2086, 1, 21], [2087, 2, 9], [2088, 1, 30], [2089, 2, 17],
  [2090, 2, 6], [2091, 1, 26], [2092, 2, 15], [2093, 2, 4], [2094, 1, 24],
  [2095, 2, 12], [2096, 2, 1], [2097, 1, 21], [2098, 2, 9], [2099, 1, 30],
  [2100, 2, 18]
];

// Lunar month lengths (normal months) in days
// Index 0 = 1st lunar month, Index 11 = 12th lunar month
const LUNAR_MONTH_DAYS = [29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30];

// Leap month data for each year
// null = no leap month, 1-7 = which month has the leap
const LEAP_MONTHS = {
  1900: null, 1901: null, 1902: 7, 1903: null, 1904: null,
  1905: null, 1906: 7, 1907: null, 1908: null, 1909: null,
  1910: null, 1911: 6, 1912: null, 1913: null, 1914: null,
  1915: 5, 1916: null, 1917: null, 1918: null, 1919: 7,
  1920: null, 1921: null, 1922: null, 1923: 5, 1924: null,
  1925: 4, 1926: null, 1927: null, 1928: 2, 1929: null,
  1930: 6, 1931: null, 1932: null, 1933: 5, 1934: null,
  1935: null, 1936: 3, 1937: null, 1938: null, 1939: 7,
  1940: null, 1941: 6, 1942: null, 1943: null, 1944: null,
  1945: 2, 1946: null, 1947: null, 1948: null, 1949: 7,
  1950: null, 1951: null, 1952: 5, 1953: null, 1954: null,
  1955: 3, 1956: null, 1957: null, 1958: null, 1959: 7,
  1960: null, 1961: null, 1962: null, 1963: 3, 1964: null,
  1965: null, 1966: 3, 1967: null, 1968: 7, 1969: null,
  1970: null, 1971: 5, 1972: null, 1973: null, 1974: null,
  1975: null, 1976: 8, 1977: null, 1978: null, 1979: 6,
  1980: null, 1981: null, 1982: null, 1983: 4, 1984: null,
  1985: null, 1986: null, 1987: 6, 1988: null, 1989: null,
  1990: null, 1991: null, 1992: 4, 1993: null, 1994: null,
  1995: 8, 1996: null, 1997: null, 1998: 5, 1999: null,
  2000: null, 2001: 4, 2002: null, 2003: null, 2004: 2,
  2005: null, 2006: null, 2007: 7, 2008: null, 2009: null,
  2010: null, 2011: null, 2012: 4, 2013: null, 2014: null,
  2015: null, 2016: 9, 2017: null, 2018: null, 2019: 6,
  2020: null, 2021: null, 2022: null, 2023: 2, 2024: null,
  2025: 6, 2026: null, 2027: null, 2028: null, 2029: 5,
  2030: null, 2031: null, 2032: 6, 2033: null, 2034: null,
  2035: null, 2036: 6, 2037: null, 2038: null, 2039: 6,
  2040: null, 2041: null, 2042: null, 2043: 2, 2044: null,
  2045: 7, 2046: null, 2047: null, 2048: null, 2049: 5,
  2050: null, 2051: null, 2052: 3, 2053: null, 2054: null,
  2055: 6, 2056: null, 2057: null, 2058: null, 2059: 4,
  2060: null, 2061: null, 2062: null, 2063: 8, 2064: null,
  2065: null, 2066: 5, 2067: null, 2068: null, 2069: null,
  2070: 4, 2071: null, 2072: null, 2073: null, 2074: 7,
  2075: null, 2076: null, 2077: null, 2078: 7, 2079: null,
  2080: null, 2081: null, 2082: null, 2083: 6, 2084: null,
  2085: 4, 2086: null, 2087: null, 2088: null, 2089: 5,
  2090: null, 2091: null, 2092: null, 2093: 7, 2094: null,
  2095: null, 2096: 6, 2097: null, 2098: 4, 2099: null,
  2100: null
};

/**
 * Calculate days between two solar dates
 * @private
 */
function daysBetween(date1, date2) {
  const d1 = new Date(date1[0], date1[1] - 1, date1[2]);
  const d2 = new Date(date2[0], date2[1] - 1, date2[2]);
  return Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
}

/**
 * Convert solar date to lunar date
 * @param {number} year - Solar year (Gregorian)
 * @param {number} month - Solar month (1-12)
 * @param {number} day - Solar day (1-31)
 * @returns {Object} - { lunarYear, lunarMonth, lunarDay, isLeapMonth }
 */
export function solarToLunar(year, month, day) {
  // Handle out of range
  if (year < 1900 || year > 2100) {
    throw new Error('Solar year must be between 1900 and 2100');
  }

  const currentDate = [year, month, day];

  // Find the lunar year (find the most recent or current Chinese New Year)
  let lunarYear = year;
  let newYearDate = NEW_YEAR_DATES.find(([y]) => y === year);

  // If current date is before this year's Chinese New Year,
  // use previous year's Chinese New Year
  if (newYearDate && daysBetween(newYearDate, currentDate) < 0) {
    lunarYear = year - 1;
    newYearDate = NEW_YEAR_DATES.find(([y]) => y === lunarYear);
  }

  if (!newYearDate) {
    throw new Error('Could not find Chinese New Year date');
  }

  // Calculate days from Chinese New Year to current date
  const daysFromNewYear = daysBetween(newYearDate, currentDate);

  // Calculate lunar month and day
  let remainingDays = daysFromNewYear;
  let lunarMonth = 1;
  let isLeapMonth = false;

  const leapMonth = LEAP_MONTHS[lunarYear] || null;

  while (lunarMonth <= 12) {
    // Check if we're in a leap month or normal month
    let daysInThisMonth;
    let inLeap = false;

    if (leapMonth && leapMonth === lunarMonth && !isLeapMonth) {
      // This is the leap month
      inLeap = true;
      // Leap months alternate between 29 and 30 days
      // Simplified: leap month usually has opposite length of normal month
      daysInThisMonth = LUNAR_MONTH_DAYS[lunarMonth - 1] === 29 ? 30 : 29;
    } else {
      // Normal month
      daysInThisMonth = LUNAR_MONTH_DAYS[lunarMonth - 1];
    }

    if (remainingDays < daysInThisMonth) {
      // Found the lunar day
      const lunarDay = remainingDays + 1;
      return {
        lunarYear,
        lunarMonth,
        lunarDay,
        isLeapMonth: inLeap
      };
    }

    remainingDays -= daysInThisMonth;

    if (inLeap) {
      isLeapMonth = false;
    } else if (leapMonth && leapMonth === lunarMonth) {
      isLeapMonth = true;
      // Don't increment month yet, check leap month next
    } else {
      lunarMonth++;
    }
  }

  // If we're here, we've passed the 12th lunar month
  lunarYear++;
  return {
    lunarYear,
    lunarMonth: 1,
    lunarDay: remainingDays + 1,
    isLeapMonth: false
  };
}

/**
 * Get the earthly branch for a lunar month
 * Traditional Da Liu Ren uses lunar months with specific branch mappings
 * 正月 = 寅月, 二月 = 卯月, ..., 十二月 = 丑月
 * @param {number} lunarMonth - Lunar month (1-12)
 * @returns {string} - The earthly branch for this lunar month
 */
export function getLunarMonthBranch(lunarMonth) {
  const monthBranches = ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'];
  return monthBranches[lunarMonth - 1];
}

/**
 * Get the index of the lunar month branch in the earthly branches array
 * @param {number} lunarMonth - Lunar month (1-12)
 * @returns {number} - Index in EARTHLY_BRANCHES array (寅=2, 卯=3, ..., 丑=1)
 */
export function getLunarMonthBranchIndex(lunarMonth) {
  // 寅 is index 2 in EARTHLY_BRANCHES
  return (lunarMonth + 1) % 12;
}
