import reports from './reports'

/**
 * @route '/language/{locale}'
 */
export const language = (locale: string): string => `/language/${locale}`

export { reports }
