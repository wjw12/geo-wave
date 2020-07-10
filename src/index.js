const axios = require('axios');

window.test = () => {
$.getJSON('https://api.ipify.org?format=json', function(data){
    axios.post('https://geo-wave.vercel.app/api/login/' + data.ip)
    .then(
        response => {
            console.log(response.data)
        }
    )
    console.log(data.ip);
});
}