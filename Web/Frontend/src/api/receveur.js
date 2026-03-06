import axiosClient from "./axios-client";

export const getReceveurStats = async () => {
    return axiosClient.get("/receveur/stats");
};

export const getBloodDemands = async () => {
    return axiosClient.get("/receveur/demands");
};

export const getBloodDemand = async (id) => {
    return axiosClient.get(`/receveur/demands/${id}`);
};

export const createBloodDemand = async (payload) => {
    return axiosClient.post("/receveur/demands", payload);
};

export const cancelBloodDemand = async (id) => {
    return axiosClient.put(`/receveur/demands/${id}`);
};

export const getReceveurProfile = async () => {
    return axiosClient.get("/receveur/profile");
};

export const updateReceveurProfile = async (payload) => {
    return axiosClient.put("/receveur/profile", payload);
};
