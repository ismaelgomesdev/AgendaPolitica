import { create } from 'apisauce';

const api = create({
    baseURL: "http://agenda.invest153.com.br/View/",
});

api.addResponseTransform(response => {
    if(!response.ok) throw response;
});

export default api;