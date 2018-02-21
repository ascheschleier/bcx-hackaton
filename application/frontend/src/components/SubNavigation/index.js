import React, { Component } from 'react'
import styles from './styles_new.css'
import classnames from 'classnames'
class SubNavigation extends Component {
  render () {
	var classes = classnames("cal-border-color-grey-300", "cal-background-color-grey-100", "cal-border-bottom",styles.calTabs);

    return (
      <div className={classes}>
        {this.props.items}
      </div>
    )
  }
}

export default SubNavigation
