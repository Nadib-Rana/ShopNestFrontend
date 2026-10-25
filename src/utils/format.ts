/**
 * ShopNest Formatting Utilities
 */

/**
 * Format a numeric amount to Bangladeshi Taka currency format (৳)
 */
export const money = (value: number): string => `৳${value.toLocaleString()}`

/**
 * Format number with commas
 */
export const formatNumber = (value: number): string => value.toLocaleString()

/**
 * Slugify a string for URLs
 */
export const slugify = (text: string): string =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
