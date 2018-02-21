import React, { Component } from 'react'
import {NavLink} from 'react-router-dom'
import classnames from 'classnames'
import styles from './styles_new.css'

class NavigationLink extends Component {
  render () {
    const {to} = this.props

    return <NavLink strict to={to} className={styles.calTabs__tab} children={this.props.text || this.props.children} activeClassName={styles.calTabs__tab__active}>{this.props.children}</NavLink>
  }
}

export default NavigationLink
