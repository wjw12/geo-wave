const axios = require('axios');


const baseApi = 'https://geo-wave.vercel.app/api/';

window.test = () => {
$.getJSON('https://api.ipify.org?format=json', function(data){
    axios.post(baseApi + 'login', {ip: data.ip})
    .then(
        response => {
            console.log(response.data)
        }
    )
    console.log(data.ip);
});
}

window.dumpdb = () => {
    axios.post(baseApi + 'getAll').then(
        response => {
            $('#main-text').text(JSON.stringify(response.data));
            
        }
    )
}