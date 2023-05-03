import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';

export const generateAccessToken = (payload: any) => {
    const token = jwt.sign(payload, JWT_SECRET, {expiresIn: 3600})
    return token
}
