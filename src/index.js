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

let ipList = [];

axios.post(baseApi + 'getIPList').then(
    response => {
        ipList = response.data;

        if (ipList) {
            // const waveElements = [];
            const textElements = [];

            Promise.all(
                ipList.map(async (ip) => {
                    const resp = await axios.post(baseApi + 'getInfoFromIP', {ip: ip});
                    const data = resp.data;
                    const [y, x] = data.location.coordinates;
                    const x_center = Math.floor((x + 180) / 360 * w);
                    const y_center = Math.floor((90 - y) / 180 * h);
                    const times = data.times;
                    const size = times.length * 200;
                    const x_rel = Math.floor((x + 180) / 360 * w - size/2);
                    const y_rel = Math.floor((90 - y) / 180 * h - size/2);
                    const radial = 1.0 / Math.log2(times.length + 1);

                    const textbox = $('<div><p>' + ip + '</p></div>')
                    .css('position', 'fixed')
                    .css('left', x_center + 'px')
                    .css('top', y_center + 'px');

                    $('#content').append(textbox);
                    textElements.push(textbox);

                    const el = $('<div></div>')
                    .css('position', 'fixed')
                    .css('left', x_rel + 'px')
                    .css('top', y_rel + 'px')
                    .css('width', size + 'px')
                    .css('height', size + 'px')
                    .css('background', 'repeating-radial-gradient(circle, black, grey ' + radial +'%')
                    .css('mask-image', 'radial-gradient(circle at center, white, black)')
                    .css('mix-blend-mode', 'difference')

                    $('#content').append(el);
                })
            )
            .then(() => {
                textElements.forEach((element) => {
                    element.css('visibility', 'hidden');
                })
            })
        }
    }
)
.catch(e => {
    console.log(e);
});


// axios.post(baseApi + 'getAll').then(
//     response => {
//         response.data.forEach(element => {
//             const [y, x] = element.location.coordinates;
//             const times = element.times;
//             const size = times.length * 200;
//             const x_rel = Math.floor((x + 180) / 360 * w - size/2);
//             const y_rel = Math.floor((90 - y) / 180 * h - size/2);
//             const radial = 1.0 / Math.log2(times.length + 1);
//             const el = $('<div></div>')
//             .css('position', 'fixed')
//             .css('left', x_rel + 'px')
//             .css('top', y_rel + 'px')
//             .css('width', size + 'px')
//             .css('height', size + 'px')
//             .css('background', 'repeating-radial-gradient(circle, black, grey ' + radial +'%')
//             .css('mask-image', 'radial-gradient(circle at center, white, black)')
//             .css('mix-blend-mode', 'difference');
            
//             $('#content').append(el);

//         });
//     }
// )

window.test();
setTimeout(() => {location.reload();}, 2000 + 500 * Math.random());