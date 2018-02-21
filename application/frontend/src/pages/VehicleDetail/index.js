import React, { Component } from 'react'
import L from 'leaflet'
import { Map, TileLayer, Polyline, Marker, LayerGroup } from 'react-leaflet'
import '!style-loader!css-loader!leaflet/dist/leaflet.css'
import styles from './styles.css'
import Card from '../../components/Card'
import ScrollWrapper from '../../components/ScrollWrapper'
import Button from '../../components/Button'
const ago = require('s-ago')
// import '../../sdk'
const { file,  rest} = window.calponia
const APP_CONFIG = require('../../../../app.json')

const endIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

const startIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})


class VehicleDetailPage extends Component {
  constructor (props) {
    super(props)

    this.state = {
      routes: [],
      selectedRoute: null,
      mapView: { center: [49.0768318, 9.3046689], zoom: 4 }
    }
  }

  componentDidMount () {
    if (this.props.vehicle) {
      console.log("VEHICLE")
      this.loadRoutes()
    }
  }

  async componentDidUpdate (prevProps, prevState) {

    // fetch routes
    if (
      (this.props.vehicle && !prevProps.vehicle) || // ... vehicle has been loaded
      (this.props.vehicle && prevProps.vehicle && (this.props.vehicle.id !== prevProps.vehicle.id)) // ... vehicle changed to different kind
    ) {
      this.loadRoutes()
      return
    }

    // add new waypoint to active route
    if (this.props.vehicle && prevProps.vehicle && this.props.vehicle.timestamp !== prevProps.vehicle.timestamp) {
      if (this.state.selectedRoute && this.state.selectedRoute.completed === false) {
        this.setState({
          selectedRoute: {
            ...this.state.selectedRoute,
            wayPoints: this.state.selectedRoute.wayPoints.concat({
              lat: this.props.vehicle.lat,
              long: this.props.vehicle.long,
              timestamp: this.props.vehicle.timestamp
            })
          }
        })
      }

      this.loadRoutes() // TODO: optimize to not always reload all routes
    }
  }
  async loadRoutes () {
    console.log(this.props.vehicle.id)
    const routes = await getJson(`/vehicles/${this.props.vehicle.id}/routes`)
    console.log(routes)
    if (this.state.selectedRoute && !routes.find(({_id}) => _id === this.state.selectedRoute._id)) {
      this.setState({
        selectedRoute: null
      })
    }

    this.setState({routes})
  }

  async selectRoute (route) {
    const selectedRoute = await getJson(`vehicles/${this.props.vehicle.id}/routes/${route._id}`)
    const wayPoints = selectedRoute.wayPoints.map(({lat, long}) => [lat, long])
    this.setState({
      selectedRoute,
      mapView: selectedRoute.wayPoints.length > 1
        ? {bounds: wayPoints}
        : {center: wayPoints[0], zoom: 12}
    })
  }

  deleteSelectedRoute () {
    if (!window.confirm('Are you sure about that?')) return

    const _id = this.state.selectedRoute._id
    window.fetch(`vehicles/${this.props.vehicle.id}/routes/${_id}`, {method: 'DELETE', credentials: 'same-origin'})
    this.setState({
      selectedRoute: null,
      routes: this.state.routes.filter(_ => _._id !== _id)
    })
  }

  renderSelectedRoute () {
    const {selectedRoute} = this.state

    if (!this.state.selectedRoute) {
      return null
    }

    const start = selectedRoute.wayPoints[0]
    const end = selectedRoute.wayPoints[selectedRoute.wayPoints.length - 1]

    return (
      <LayerGroup>
        <Polyline positions={this.state.selectedRoute.wayPoints.map(({lat, long}) => [lat, long])} />
        <Marker icon={startIcon} position={[start.lat, start.long]} />
        {(start !== end) && <Marker position={[end.lat, end.long]} icon={endIcon} />}
      </LayerGroup>
    )
  }

  renderConnectivityStatus () {
    const { vehicle } = this.props
    const timeDiff = (Date.now() - vehicle.timestamp)

    if (timeDiff < APP_CONFIG.MIN_MESSAGE_INTERVAL) {
      return 'online'
    }

    if (timeDiff < APP_CONFIG.TIMEOUT_THRESHOLD) {
      return `online (${ago(new Date(vehicle.timestamp))})`
    }

    return 'offline'
  }

  render () {
    const {vehicle} = this.props
    const {mapView, selectedRoute} = this.state
    const [activeRoute, completedRoutes] = this.state.routes
      .slice()
      .sort((a, b) => {
        return b.endTimestamp - a.endTimestamp
      })
      .reduce(([activeRoute, completedRoutes], route) => {
        if (!route.completed && ((Date.now() - route.endTimestamp) < APP_CONFIG.TIMEOUT_THRESHOLD)) {
          return [route, completedRoutes]
        }

        return [activeRoute, completedRoutes.concat([route])]
      }, [null, []])

    if (!vehicle) {
      return <div />
    }

    return (
      <div className={styles.row}>
        <div className={styles.sidebar}>
          <div className={styles.image} style={{backgroundImage: `url(${file().url(vehicle.image)})`}} />

          <table className={styles.attributeTable}>
            <tbody>
              <tr>
                <th className={styles.attributeTableHeading}>Name</th>
                <td className={styles.attributeTableContent}>{vehicle.identifier}</td>
              </tr>
              <tr>
                <th className={styles.attributeTableHeading}>License Plate</th>
                <td className={styles.attributeTableContent}>{vehicle.licensePlate}</td>
              </tr>
              <tr>
                <th className={styles.attributeTableHeading}>Manufacturer</th>
                <td className={styles.attributeTableContent}>{vehicle.manufacturer}</td>
              </tr>
              <tr>
                <th className={styles.attributeTableHeading}>Model</th>
                <td className={styles.attributeTableContent}>{vehicle.model}</td>
              </tr>
              <tr>
                <th className={styles.attributeTableHeading}>Model Year</th>
                <td className={styles.attributeTableContent}>{vehicle.modelYear}</td>
              </tr>
              <tr>
                <th className={styles.attributeTableHeading}>Engine</th>
                <td className={styles.attributeTableContent}>{vehicle.engine}</td>
              </tr>
              <tr>
                <th className={styles.attributeTableHeading}>Power</th>
                <td className={styles.attributeTableContent}>{vehicle.power} KW</td>
              </tr>
              <tr>
                <th className={styles.attributeTableHeading}>Responsible</th>
                <td className={styles.attributeTableContent}>{vehicle.responsible}</td>
              </tr>
              <tr>
                <th className={styles.attributeTableHeading}>Status</th>
                <td className={styles.attributeTableContent}>
                  {this.renderConnectivityStatus()}
                </td>
              </tr>
              <tr>
                <th className={styles.attributeTableHeading}>ID</th>
                <td className={styles.attributeTableContent}>{vehicle.id}</td>
              </tr>
            </tbody>
          </table>

        </div>
        <div className={styles.sidebar}>

          {activeRoute && <h3 className={styles.subHeading}>Current route</h3>}
          {activeRoute && (
            <Card
              selected={selectedRoute && (activeRoute._id === selectedRoute._id)}
              heading={new Date(parseInt(activeRoute.startTimestamp)).toLocaleDateString()}
              subheading={`${Math.floor(activeRoute.distance * 100) / 100} km`}
              onClick={() => this.selectRoute(activeRoute)}
            />
          )}

          <h3 className={styles.subHeading}>Previous routes</h3>

          <ScrollWrapper scrollbar>
            {(!completedRoutes || completedRoutes.length === 0) && <div>This vehicle hasn't recorded any routes yet</div>}
            {completedRoutes.map(route => {
              let selected = selectedRoute && (route._id === selectedRoute._id)
              return (
                <Card
                  key={route._id}
                  selected={selected}
                  heading={new Date(parseInt(route.startTimestamp)).toLocaleDateString()}
                  subheading={`${Math.floor(route.distance * 100) / 100} km`}
                  onClick={() => this.selectRoute(route)}
                  sideButtons={selected ? [
                    <Button icon='delete' tertiary onClick={() => this.deleteSelectedRoute()} />
                  ] : null}
                />
              )
            })}
          </ScrollWrapper>

        </div>

        <Map center={mapView.center} zoom={mapView.zoom} bounds={mapView.bounds} className={styles.map}>
          <TileLayer
            attribution='&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors'
            url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
          />
          {this.renderSelectedRoute()}
        </Map>

      </div>
    )
  }
}

async function getJson (url) {
  return window.fetch(`${url}`, {credentials: 'same-origin'})
    .then(res => res.json())
}

export default VehicleDetailPage
