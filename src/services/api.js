import { create } from 'apisauce';

const api = create({
    baseURL: "http://10.0.0.101/api_PoliNet/View",
});

api.addResponseTransform(response => {
    if(!response.ok) throw response;
});

export default api;