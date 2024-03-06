
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers'

/**
 * TODO
 * -[ ] getting the right cookie from the backend
 * -[ ] check if the cookie is valid
 * -[ ] set the right login state depending on the cookie validity
 */

export function GetToken() {
    const cookieStore = cookies()
    const token: any = cookieStore.get('token') ?? '';
    
    const isTokenValid = isValidCookie(token?.value);
    // console.log("all cookies: ", token, isTokenValid); // xx
    return isTokenValid;
}

function isValidCookie(cookie: string): boolean {
    try {
        jwt.verify(cookie, 'secret');
        return true;
    } catch (error: any) {
        // console.log("error: ", error.message);
        return false;
    }
}
