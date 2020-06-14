import { create } from 'apisauce';

const api = create({
    baseURL: "http://127.0.0.1/api_PoliNet/View",
});

api.addResponseTransform(response => {
    if(!response.ok) throw response;
});

export default api;