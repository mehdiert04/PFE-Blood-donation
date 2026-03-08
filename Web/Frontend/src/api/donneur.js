import axiosClient from "./axios-client";

export const getDonneurStats = async () => {
    return axiosClient.get("/donneur/stats");
};

export const getAppointments = async () => {
    return axiosClient.get("/donneur/appointments");
};

export const createAppointment = async (payload) => {
    return axiosClient.post("/donneur/appointments", payload);
};

export const cancelAppointment = async (id) => {
    return axiosClient.put(`/donneur/appointments/${id}`);
};

export const getDonneurProfile = async () => {
    return axiosClient.get("/donneur/profile");
};

export const updateDonneurProfile = async (payload) => {
    return axiosClient.put("/donneur/profile", payload);
};
