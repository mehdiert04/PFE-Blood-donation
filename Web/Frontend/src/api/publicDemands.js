import axiosClient from "./axios-client";

export const getPublicDemands = (params) => {
    return axiosClient.get("/public-demands", { params });
};

export const getPublicDemandById = (id) => {
    return axiosClient.get(`/public-demands/${id}`);
};
