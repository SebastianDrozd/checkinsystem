const {default : axios} = require('axios');

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5080/api/Guest/';

const CreateNewVisitor = async (visitor) => {
    const reponse = await axios.post(`${API_URL}/checkin/visitor`, visitor);
    return reponse.data;
}
const CreateNewContractor = async (contractor) => {
    const reponse = await axios.post(`${API_URL}/checkin/contractor`, contractor);
    return reponse.data;
}
const CreateNewTemp = async (temp) => {
    const reponse = await axios.post(`${API_URL}/checkin/temp`, temp);
    return reponse.data;
}   

const CreateNewDriver = async (driver) => {
    const reponse = await axios.post(`${API_URL}/checkin/driver`, driver);
    return reponse.data;
}

module.exports = {
    CreateNewVisitor,
    CreateNewContractor,
    CreateNewTemp,
    CreateNewDriver
}