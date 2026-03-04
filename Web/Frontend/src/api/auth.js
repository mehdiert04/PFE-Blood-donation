import axiosClient from "./axios-client";

// --- Authentication ---
export const login = async (payload) => {
    return axiosClient.post("/login", payload);
};

export const logout = async () => {
    return axiosClient.post("/logout");
};

// --- Registration ---
export const registerDonneur = async (payload) => {
    return axiosClient.post("/register/donneur", payload);
};

export const registerReceveur = async (payload) => {
    return axiosClient.post("/register/receveur", payload);
};

// --- Email Verification ---
// For SPAs, we usually pass the signed URL captured from the email
export const verifyEmail = async (verificationUrl, token) => {
    return axiosClient.get(verificationUrl, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const resendVerificationEmail = async (email) => {
    return axiosClient.post("/email/resend", { email });
};
/*
export const resendVerificationEmail = async (token) => {
    return axiosClient.post("/email/resend", {}, {
        headers: { Authorization: `Bearer ${token}` }
    });
};
*/

// --- Password Recovery ---
export const forgotPassword = async (email) => {
    return axiosClient.post("/forgot-password", { email });
};

export const resetPassword = async (payload) => {
    return axiosClient.post("/reset-password", payload);
};

export const getUser = async () => {
    return axiosClient.get("/users/me");
};