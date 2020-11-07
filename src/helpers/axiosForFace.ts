import axios from 'axios';

//custom axios instance for face-api
const axiosForFace = axios.create({
    baseURL: process.env.FACE_API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': process.env.FACE_API_KEY,
    },
    // validateStatus: () => false,
});

export default axiosForFace;
