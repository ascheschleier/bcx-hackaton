import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import L from 'leaflet'
import { Map, TileLayer, Marker } from 'react-leaflet'
import VehicleCard from '../../components/VehicleCard'
import Button from '../../components/Button'
import ScrollWrapper from '../../components/ScrollWrapper'
import '!style-loader!css-loader!leaflet/dist/leaflet.css'
import styles from './styles.css'
const APP_CONFIG = require('../../../../app.json')

const normalIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

const selectedIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

class MapPage extends Component {
  constructor (props) {
    super(props)

    this.state = {
      selectedVehicleId: null,
      mapView: {center: [49.0768318, 9.3046689], zoom: 4}
    }
  }

  componentDidMount () {
    if (this.props.vehicle) {
      this.loadRoutes()
    }

    this.updateMapView()
  }

  componentDidUpdate (prevProps) {
    const onlineVehicles = this.getOnlineVehicles()
    const prevOnlineVehicles = this.getOnlineVehicles(prevProps.vehicles)

    // refocus map if there have been previously no connected vehicle and now some have connected
    if (prevOnlineVehicles.length === 0 && onlineVehicles.length > 0) {
      this.updateMapView()
    }
  }

  updateMapView () {
    // don't override mapView if selectedVehicle is focused
    if (this.state.selectedVehicleId) {
      vehicle = this.props.vehicles.find(({id})=>id == this.state.selectedVehicleId)
      this.setState({
        mapView: {center: [vehicle.lat, vehicle.long], zoom: 15}
      })
      return
    }

    const onlineVehicles = this.getOnlineVehicles()

    if (onlineVehicles.length === 0) {
      return
    }

    // center on single connected vehicle
    if (onlineVehicles.length === 1) {
      const vehicle = onlineVehicles[0]

      this.setState({
        mapView: {center: [vehicle.lat, vehicle.long], zoom: 15}
      })
      return
    }

    // otherwise set bounds to all connected vehicles
    this.setState({
      mapView: {bounds: onlineVehicles.map(({lat, long}) => [lat, long])}
    })
  }

  selectVehicle (vehicle, zoom = true) {
    this.setState({
      selectedVehicleId: vehicle.id,
      mapView: zoom ? {center: [vehicle.lat, vehicle.long], zoom: 30} : this.state.mapView
    })
  }

  getOnlineVehicles (vehicles = this.props.vehicles) {
    // return vehicles.filter(({lat}) => lat && long)
    return vehicles.filter(({timestamp}) => {
      const date = new Date(timestamp)
      return timestamp && (Date.now() - date.getTime() < APP_CONFIG.TIMEOUT_THRESHOLD)
    })
  }

  render () {
    const onlineVehicles = this.getOnlineVehicles()
    console.log(onlineVehicles, "ONLINE")
    
    return (
      <div className={styles.row}>
        <div className={styles.sidebar}>
          <h3 className={styles.subHeading}>connected vehicles</h3>

          <ScrollWrapper scrollbar>
            {(!onlineVehicles || onlineVehicles.length === 0) && <div>There are no vehicles connected right now</div>}
            {onlineVehicles.map(vehicle => (
              <VehicleCard
                key={vehicle.id} {...vehicle}
                isSelected={this.state.selectedVehicleId === vehicle.id}
                onClick={() => this.selectVehicle(vehicle)}
              >
                <Button fullWidth tertiary onClick={() => this.props.history.push(`/vehicles/${vehicle.id}`)}>
                  View Routes
                </Button>

              </VehicleCard>
            ))}
          </ScrollWrapper>
        </div>

        <Map center={this.state.mapView.center} zoom={this.state.mapView.zoom} bounds={this.state.mapView.bounds} className={styles.map}>
          <TileLayer
            attribution='&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors'
            url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
          />

          {onlineVehicles.map(vehicle => (
            <Marker
              key={vehicle.id}
              icon={this.state.selectedVehicleId === vehicle.id ? selectedIcon : normalIcon}
              position={[vehicle.lat, vehicle.long]}
              onClick={() => this.selectVehicle(vehicle, false)}
            />
          ))}
        </Map>
      </div>
    )
  }
}

export default withRouter(MapPage)
