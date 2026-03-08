import axiosClient from "./axios-client";

export const getCampaigns = () => {
    return axiosClient.get("/campaigns");
};

export const getCampaignById = (id) => {
    return axiosClient.get(`/campaigns/${id}`);
};
