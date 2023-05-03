import { config } from 'dotenv'
config()

export const PORT = Number(process.env.PORT) || 3003
export const JWT_SECRET = process.env.JWT_SECRET || '12345'
export const DISABLE_SEARCH_IP = process.env.DISABLE_SEARCH_IP === 'true'
