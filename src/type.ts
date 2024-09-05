export type PayloadJWT = {
    iss: string;  // Issuer of the token
    sub: string;  // Subject (usually the user identifier, like email)
    exp: number;  // Expiration time (Unix timestamp)
    iat: number;  // Issued at time (Unix timestamp)
    jti: string;  // JWT ID (unique identifier for the token)
    scope: string;  // Scope or role associated with the token (e.g., "ROLE_ADMIN")
};

export const ADMIN_ROLE = 'ADMIN';
export const USER_ROLE = 'USER';