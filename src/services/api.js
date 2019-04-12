import axios from 'axios';

const api = axios.create({
    baseURL:'https://mybox-backend.herokuapp.com',

});

export default api;