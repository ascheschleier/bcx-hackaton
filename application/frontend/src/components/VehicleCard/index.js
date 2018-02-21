import React, { Component } from 'react'
import classnames from 'classnames'
import styles from './styles.css'
import '../../sdk'
const {file} = window.calponia
const APP_CONFIG = require('../../../../app.json')

class VehicleCard extends Component {
  render () {
    const {isSelected, image, licensePlate, identifier, className, timestamp, inGrid, children, equipment} = this.props

    const classes = classnames(
      styles.card,
      className,
      {
        [styles.selected]: isSelected,
        [styles.listCard]: inGrid
      }
    )

    const lastUpdated = Date.now() - timestamp
    var hasConnectivityUnit = false
    if (!APP_CONFIG.DEVELOPMENT) {
      hasConnectivityUnit = equipment.find(({iotDevice}) => iotDevice)
    }
    const statusClasses = classnames(
      [styles.connectivityStatus],
      {
        [styles.online]: lastUpdated < APP_CONFIG.MIN_MESSAGE_INTERVAL,
        [styles.indeterminate]: lastUpdated > APP_CONFIG.MIN_MESSAGE_INTERVAL && lastUpdated < APP_CONFIG.TIMEOUT_THRESHOLD,
        [styles.offline]: lastUpdated > APP_CONFIG.TIMEOUT_THRESHOLD
      }
    )
    return (
      <div className={classes} onClick={this.props.onClick}>
        <div className={styles.dashboardCardImage} style={{backgroundImage: `url(${file().url(image)})`}} />
        <span className={styles.dashboardCardLabelStrong}>
            {hasConnectivityUnit && <span className={statusClasses} />}{identifier}
        </span>
        <span className={styles.dashboardCardLabel}>{licensePlate}</span>

        {children && <div className={styles.content}>{children}</div>}
      </div>
    )
  }
}

export default VehicleCard
