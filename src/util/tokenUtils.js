export const isTokenExpired = (token) => {
    if (!token) return true;
    try {
        // atob decodes the base64 string
        const payload = JSON.parse(atob(token.split('.')[1]));
        // payload.exp is in seconds, Date.now() is in milliseconds
        return payload.exp * 1000 < Date.now();
    }
    catch (e) {
        return true;
    }
};

/**
 * Checks if the user has any valid way to stay logged in
 * Returns: 'valid' | 'needs_refresh' | 'expired'
 */
// export const getAuthStatus = () => {
//     const accessToken = localStorage.getItem('token');
//     const refreshToken = localStorage.getItem('refreshToken');

//     console.log("refreshToken:", refreshToken);
//     console.log("accessToken:", accessToken);

//     // 1️⃣ Guest
//     if (!accessToken && !refreshToken) {
//         return "guest";
//     }

//     // 2️⃣ Access token still valid
//     if (accessToken && !isTokenExpired(accessToken)) {
//         return "valid";
//     }

//     // 3️⃣ Access expired but refresh exists
//     if (refreshToken) {
//         return "needs_refresh";
//     }

//     return "expired";
// };

export const getAuthStatus = () => {
    const accessToken = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refreshToken");

    // console.log("Access Token:", accessToken);
    // console.log("Refresh Token:", refreshToken);

    // No tokens
    if (!accessToken && !refreshToken) {
        return "guest";
    }

    // Access token valid
    if (accessToken && !isTokenExpired(accessToken)) {
        return "valid";
    }

    // Access token expired but refresh exists
    if (refreshToken) {
        return "needs_refresh";
    }

    return "expired";
};