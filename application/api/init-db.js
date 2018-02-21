const geodist = require('geodist')
const {api} = require('./config')

const FORCE_INIT = true

module.exports = async (db) => {
  const routes = await db.collection('routes')
  // db.collection("routes").remove()
  if (!FORCE_INIT && (await routes.findOne())) {
    console.log('skip init')
    return
  }

  try {
    await routes.drop()
  } catch (e) {
    console.log('skip drop')
  }

  const vehicles = await getVehicles()
  console.log(vehicles)

  vehicles.forEach(vehicle => {
    const n = 5 + Math.random() * 10

    console.log(`add ${Math.floor(n)} routes for ${vehicle.id}`)

    for (let i = 0; i < n; i++) {
      routes.insert(getRandomRoute(vehicle.id))
    }
  })
}

const origins = [
  [40.4251, 74.0021],
  [55.751244, 37.618423],
  [51.508530, -0.076132],
  [48.7823200, 9.1770200]
]

function getRandomRoute (vehicleId) {
  const start = Math.round(Date.now() - Math.random() * 1000 * 60 * 60 * 200)
  const end = Math.round(start + Math.random() * 1000 * 60 * 60 * 10)

  let t = start

  const wayPoints = []
  const origin = Math.floor(Math.random() * origins.length)
  const position = {
    lat: origins[origin][0] + (Math.random() - 0.5),
    long: origins[origin][1] + (Math.random() - 0.5)
  }

  let speedX = (Math.random() - 0.5) / 100
  let speedY = (Math.random() - 0.5) / 100
  let distance = 0

  while (t < end) {
    t += 10000

    wayPoints.push({
      lat: position.lat,
      long: position.long,
      timestamp: t
    }) 

    if (wayPoints[wayPoints.length - 2]) {
      distance += geodist(wayPoints[wayPoints.length - 2], wayPoints[wayPoints.length - 1], {unit: 'km', exact: true})
    }

    position.lat += speedX
    position.long += speedY

    if (Math.random() < 0.05) {
      speedX = (Math.random() - 0.5) / 100
      speedY = (Math.random() - 0.5) / 100
    }
  }

  return {
    startTimestamp: start,
    endTimestamp: end,
    vehicleId: vehicleId.toString(),
    wayPoints,
    distance,
    completed: true
  }
}

async function getVehicles () {

  // const accessToken = (await api.post({
  //   uri: `/users/login`,

  //   body: {
  //     email: 'admin@example.com',
  //     password: 'test'
  //   }
  // })).data
  // const accessToken =  {userId: "4b0cdc1e-f600-11e7-8e40-c7772bcbc155", id: "raxAkM2sY8THKRGhfnylLSL6r9hwprKQWQAE5ecFi9uVQnUk5sl6kRSixJilt1Oa"}
  const project = {id:"04d57488-1629-11e8-af7d-eb5bbde244de"}

  // const whatever = await api.get({url:`/projects/${PROJECT_ID}/vehicles`, 
  //   qs: {
  //     // filter: JSON.stringify({include: 'projects'}),
  //     access_token: accessToken.id
  //   }})
  // console.log(whatever)
  // console.log(accessToken.userId, accessToken.id)
  // const {projects} = (await api.get(`/users/${accessToken.userId}`, {
  //   params: {
  //     // filter: JSON.stringify({include: 'projects'}),
  //     access_token: accessToken.id
  //   }
  // }
  // )).data

  // const project = projects.find(({name}) => name.toLowerCase() === 'porsche')

  // console.log('accessToken:', accessToken.id)
  // console.log('project:', project.id)
  var fs = require('fs'),
      path = require('path');   
  var vehicles = [];

  function readFile(filePath){
    return new Promise((resolve,reject)=>{
      fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
        if (!err) {
          resolve(JSON.parse(data))
        } else {
          reject(err);
        }
      })
    })
  };
  vehicles = await readFile(path.join(__dirname, './../Test-vehicles.json'))
  // const vehicles = await api.get({url: `/projects/${project.id}/vehicles/`
    // qs: {
    //   access_token: accessToken.id
    // }
  // })

  return vehicles
}
