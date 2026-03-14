import axiosClient from "./axios-client";

export const getHospitals = async () => {
    return axiosClient.get("/hospitals");
};

export const getDemandResponses = async () => {
    return axiosClient.get("/hospital/demand-responses");
};

export const approveDemandResponse = async (id, payload) => {
    return axiosClient.post(`/hospital/demand-responses/${id}/approve`, payload);
};
