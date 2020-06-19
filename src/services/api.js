import { create } from 'apisauce';

const api = create({
    baseURL: "http://192.168.0.132/api_PoliNet/View",
});

api.addResponseTransform(response => {
    if(!response.ok) throw response;
});

export default api;