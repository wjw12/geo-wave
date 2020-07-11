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

const w = window.innerWidth;
const h = window.innerHeight;


axios.post(baseApi + 'getAll').then(
    response => {
        response.data.forEach(element => {
            const [y, x] = element.location.coordinates;
            const times = element.times;
            const size = Math.log2(times.length + 1) * 200;
            const x_rel = Math.floor((x + 180) / 360 * w - size/2);
            const y_rel = Math.floor((90 - y) / 180 * h - size/2);
            const radial = 1.0 / times.length * 100;
            const el = $('<div></div>')
            .css('position', 'fixed')
            .css('left', x_rel + 'px')
            .css('top', y_rel + 'px')
            .css('width', size + 'px')
            .css('height', size + 'px')
            .css('background', 'repeating-radial-gradient(circle, black, white ' + radial +'%')
            .css('mix-blend-mode', 'difference');
            
            $('#content').append(el);

        });
    }
)

window.test();
setTimeout(() => {location.reload();}, 1000 + 1000 * Math.random());