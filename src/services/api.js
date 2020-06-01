import { create } from 'apisauce';

const api = create({
    baseURL: "http://localhost/api_PoliNet/View",
});

api.addResponseTransform(response => {
    if(!response.ok) throw response;
});

export default api;