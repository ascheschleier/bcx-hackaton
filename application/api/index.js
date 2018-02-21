const path = require('path')
const fs = require('fs')
const express = require('express')
const qs = require('querystring')
const util = require('util')
var Promise = require("bluebird");
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const geodist = require('geodist')
const {api} = require('./config')

var _STATUS = []




const APP_CONFIG = require('../app.json')

async function start () {
  console.log(APP_CONFIG.DEVELOPMENT)
  var routes = null
  app.use(cors())
  app.use(bodyParser.json())
  app.use((req, res, next) => {
    req.accessToken = req.query.access_token || req.get('Authorization')
    next()
  })

  async function addPositionToVehicle ({vehicleId, lat, long, timestamp}) {

    // update vehicle position in api

    try {
      _STATUS.push("Save car")
      console.log("Save Car", timestamp, "Id",vehicleId)
      await api.patch({
        uri: `/vehicles/${vehicleId}`,
        body: {timestamp, lat, long}
      })
    } catch (e) {
      console.log('invalid vehicle id')
      return
    }

    const cursor = await routes.find({
      vehicleId,
      completed: false
    })
    const IS_LIVE = ((Date.now() - timestamp) < APP_CONFIG.TIMEOUT_THRESHOLD)
    console.log("IS LIVE", IS_LIVE)
    const uncompletedRoute = await closeCompletedRoutes(cursor, IS_LIVE)
    if (!uncompletedRoute) {
      await createRoute({vehicleId, lat, long, timestamp})
      return
    }

    console.log("ADD TO ROUTE")
    console.log("Add to route")

    await addPositionToRoute(uncompletedRoute, {lat, long, timestamp})
  }

  async function closeCompletedRoutes (cursor, IS_LIVE) {
    const sorted = cursor.sort({endTimestamp: -1})
    const hasNext = await Promise.promisify(sorted.hasNext.bind(sorted))()
    console.log("HAS_NEXT",hasNext)
    if (!hasNext) {
      return undefined
    }

    const route = await Promise.promisify(sorted.next.bind(sorted))()
    // console.log(route)
    // additional check hasNext is necessary because forEach doesn't start at current position of cursor
    if (await Promise.promisify(sorted.hasNext.bind(sorted))()) {
      console.log("ADDITIONAL CLOSE")
      sorted.forEach((route) => {
        routes.update({_id: route._id}, {$set: {completed: true}})
      })
    }
    console.log("TIME",Date.now(), route.endTimestamp, (Date.now() - route.endTimestamp))
    if (IS_LIVE && ((Date.now() - route.endTimestamp) > APP_CONFIG.TIMEOUT_THRESHOLD)) {
      console.log("TIME CLOSE")
      routes.update({_id: route._id}, {$set: {completed: true}})
      return undefined
    }

    return route
  }

  async function createRoute ({vehicleId, lat, long, timestamp}) {
    console.log("CREATE ROUTE", timestamp)

    routes.insert({
      vehicleId,
      saveTimestamp: Date.now(),
      startTimestamp: timestamp,
      endTimestamp: timestamp,
      completed: false,
      distance: 0,
      wayPoints: [
        {lat, long, timestamp}
      ]
    })
  }

  function addPositionToRoute (route, {lat, long, timestamp}) {
    routes.update({_id: route._id}, {
      $set: {
        saveTimestamp: Date.now(),
        endTimestamp: timestamp,
        distance: calculateNewDistance(route, {lat, long})
      },
      $push: {
        wayPoints: {
          lat,
          long,
          timestamp
        }
      }
    })
  }

  function calculateNewDistance (route, {lat, long}) {
    if (route.wayPoints.length === 0) {
      return 0
    }

    const prevPoint = route.wayPoints[route.wayPoints.length - 1]

    return route.distance + geodist(prevPoint, {lat, long}, {unit: 'km', exact: true})
  }

  app.get('/vehicles/:id/routes', async (req, res) => {
    const result = await routes.find({
      vehicleId: {$eq: req.params.id}
    }, {
      _id: true,
      vehicleId: true,
      startTimestamp: true,
      endTimestamp: true,
      distance: true,
      completed: true
    }).toArray()

    res.send(result)
  })
  app.get('status', async (req, res) => {
    res.send(_STATUS)
  })
  app.get('/vehicles/:id/routes/:routeId', async (req, res) => {
    const result = await routes.findOne({
      _id: {$eq: ObjectID(req.params.routeId)}
    })

    res.send(result)
  })

  app.delete('/vehicles/:id/routes/:routeId', async (req, res) => {
    const result = await routes.remove({
      _id: {$eq: ObjectID(req.params.routeId)}
    })

    res.send(result)
  })

  // serve frontend
  app.use([/^\/vehicles\/?.*/, '/map', '/'], (express.static(path.join(__dirname, '../frontend/build'))))

  app.listen(3000)

  // if (!APP_CONFIG.DEVELOPMENT) {
    // const WebSocket = require('ws')

    // const ws = new WebSocket('ws://relay.calponia?mar=1')

    // ws.on('open', () => {
    //   console.log('connected')
    // })

    // ws.on('close', () => {
    //   console.log('disconnected')
    // })

  //   ws.on('message', async (data) => {
  //     console.log("message")
  //     const message = JSON.parse(data)
  //     if (!message._id || message.error) return console.warn('ws', message)
  //     ws.send(JSON.stringify({_id: message._id}))

  //     if (message.method !== 'POST') { // TODO: parse url
  //       console.log('invalid request method', message.method)
  //       return
  //     }

  //     if (typeof message.body !== 'string') {
  //       console.log('invalid message body', message.body)
  //       return
  //     }

  //     let payload

  //     try {
  //       payload = JSON.parse(Buffer.from(message.body, 'base64').toString('ascii'))
  //     } catch (err) {
  //       console.log('invalid message body encoding', Buffer.from(message.body, 'base64').toString('ascii'), message.body)
  //       return
  //     }

  //     // console.log('received message: ', payload)

  //     const lat = parseFloat(payload.lat)
  //     const long = parseFloat(payload.long)
  //     const timestamp = parseFloat(payload.timestamp)

  //     console.log('parsed message:', {lat, long, timestamp})

  //     if (isNaN(lat) || isNaN(long) || isNaN(timestamp)) {
  //       console.log('invalid coordinates or timestamp')
  //       return
  //     }
  //     equipment = await api.get(`/equipment/${message.identifier}`)

  //     if (!equipment.vehicleId) {
  //       console.log('equipment is not connected to vehicle')
  //       return
  //     }

  //     addPositionToVehicle({
  //       lat,
  //       long,
  //       timestamp,
  //       vehicleId: equipment.vehicleId
  //     })
  //     //TODO Add Timeout to close routes automatically after 10 minutes
  //   })
  // }
  console.log('server listen on http://localhost:3000')
}

start()

process.on('unhandledRejection', error => {
  console.log(error)
  process.exit(1)
  throw error
})
