import React, { Component } from 'react'
import classnames from 'classnames'
import Icon from '../Icon'
import styles from './styles_new.css'
import styles_icons from './styles_icons_new.css'

class Input extends Component {
  constructor (props) {
    super(props)
    this.state = {focus: false}
  }

  onChange (e) {
    this.props.onChange(e.target.value)
  }

  render () {
    const classes = classnames(styles.wrapper, {
      [styles.primary]: this.props.primary,
      [styles.wrapperRound]: this.props.round,
      [styles.wrapperError]: this.props.error,
      [styles.wrapperFocus]: this.state.focus,
      [styles.filledWrapper]: !!this.props.value,
      [styles.disabledWrapper]: !!this.props.disabled
    }, this.props.className)

    return (
      <div>
        <div className={classes}>
          {this.props.label && <span className={styles.label}>{this.props.label}</span>}

          <input
            {...this.props}
            className={classnames(styles.calInput, this.props.className)}
            onChange={(e) => this.onChange(e)}
            onFocus={() => this.setState({focus: true})}
            onBlur={() => this.setState({focus: false})}
          />

          {this.props.unit && <span className={styles.unit}>{this.props.unit}</span>}
        </div>

        {this.props.error && (
          <div className={styles.errors}>{this.props.error}</div>
        )}
      </div>
    )
  }
}

export default Input
