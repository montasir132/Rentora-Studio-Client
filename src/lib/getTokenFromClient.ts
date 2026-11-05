// import { authClient } from "./auth-client";

// export const getTokenFromClient = async () => {
//     const { data } = await authClient.token();
//         const token = data?.token;
//         return token;
// }

import { authClient } from "./auth-client";

export const getTokenFromClient = async () => {
    const { data, error } = await authClient.token();

    if (error || !data?.token) {
        console.error("Token Error:", error);
        throw new Error("Unable to retrieve authentication token.");
    }

    return data.token;
};