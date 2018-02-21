import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import '!style-loader!css-loader!leaflet/dist/leaflet.css'
import VehicleCard from '../../components/VehicleCard'
import ScrollWrapper from '../../components/ScrollWrapper'
import Checkbox from '../../components/Checkbox'
import Input from '../../components/Input'
import styles from './styles.css'

class VehiclesPage extends Component {
  constructor (props) {
    super(props)

    this.state = {
      onlyShowConnected: false,
      search: ''
    }
  }

  getFilteredVehicles () {
    const {vehicles} = this.props
    const {search, onlyShowConnected} = this.state
    if (!search && !onlyShowConnected) {
      return vehicles
    }

    return vehicles.filter(({licensePlate, identifier, equipment}) => {
      return (
        (!onlyShowConnected || equipment.length > 0) &&
        (!search || licensePlate.indexOf(search) === 0 || identifier.indexOf(search) === 0)
      )
    })
  }

  render () {
    const {search, onlyShowConnected} = this.state
    const vehicles = this.getFilteredVehicles()

    return (
      <div className={styles.wrapper}>
        <div className={styles.filterBar}>

          <Input
            className={styles.search}
            round
            primary
            placeholder='Search for identifier or license plate'
            icon='search'
            value={search}
            onChange={value => this.setState({search: value})}
          />

          <Checkbox
            label='only show vehicles with connectivity unit'
            checked={onlyShowConnected}
            onChange={value => this.setState({onlyShowConnected: value})}
          />
        </div>
        <ScrollWrapper scrollbar>

          <div className={styles.vehiclesList}>
          
            {(!vehicles || vehicles.length === 0) && <div>There are no vehicles</div>}
            {vehicles.map(vehicle => {
              return (
                <VehicleCard
                  inGrid
                  key={vehicle.id} {...vehicle}
                  onClick={() => this.props.history.push(`/vehicles/${vehicle.id}`)}
                />
              )
            })}
          </div>
        </ScrollWrapper>
      </div>
    )
  }
}

export default withRouter(VehiclesPage)
