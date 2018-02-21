import React, { Component } from 'react'
import styles from './styles.css'
import classnames from 'classnames'

class PageWrapper extends Component {
  render () {
    return (
      <div className={classnames(styles.wrapper, "cal-border-color-grey-300", "cal-border-all")} >
        <div className={styles.page}>
          {this.props.subnavigation && (
            <div className={styles.subnavigation}>
              {this.props.subnavigation}
            </div>
          )}

          <div className={classnames("cal-border","cal-border-color-grey-300",styles.contentWrapper)}>
            {this.props.children}
          </div>
        </div>
      </div>
    )
  }
}

export default PageWrapper
