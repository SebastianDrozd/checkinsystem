const {default : axios} = require('axios');

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://sebastian.bobak.local:5080/api/Events';


const getTodaysEvents = async () => {
    const reponse = await axios.get(`${API_URL}`);
    return reponse.data;
}


module.exports = {
    getTodaysEvents
}