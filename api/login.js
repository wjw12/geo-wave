const url = require('url')
const MongoClient = require('mongodb').MongoClient
const axios = require('axios');

let cachedDb = null

async function connectToDatabase(uri) {
  if (cachedDb) {
    return cachedDb
  }
  const client = await MongoClient.connect(uri, { useNewUrlParser: true })

  const db = await client.db(url.parse(uri).pathname.substr(1))

  cachedDb = db
  return db
}

module.exports = async (req, res) => {
  // handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }
  const {body} = req;
  if (!body) return;
  const db = await connectToDatabase(process.env.MONGODB_URI)
  const collection = await db.collection('datasource')

  if (body.ip) {
      // https://www.twilio.com/blog/2017/08/http-requests-in-node-js.html
      axios.get('http://ip-api.com/json/' + body.ip)
        .then(async response => {
            if (response.data && response.data.status == 'success') {
                const [lat, lon] = [response.data.lat, response.data.lon];
                const query = {
                    location: {
                        type: 'Point',
                        coordinates: [lat, lon]
                    }
                };
                const result = await collection.findOne(query);
                console.log(result);
                if (result) {
                    const timeList = result.times;
                    timeList.push(Date.now())
                    await collection.update(query, {
                        times: timeList,
                        location: {
                            type: 'Point',
                            coordinates: [lat, lon]
                        }
                    })
                }
                else {
                    await collection.insert({
                        times: [Date.now()],
                        location: {
                            type: 'Point',
                            coordinates: [lat, lon]
                        }
                    })
                }

            }
            res.status(200).send(response.data)
        })
        .catch(error => {
            res.status(400).send(error)
        });
  }
  else {
      res.status(400).send("")
  }

  //db.close();
}