import React, { Component } from 'react'
import classnames from 'classnames'
import styles from './styles_new.css'

class Checkbox extends Component {
  constructor (props) {
    super(props)
    this.state = {checked: !!props.checked}
  }

  componentWillUpdate (nextProps) {
    if (this.state.checked !== nextProps.checked) {
      this.setState({checked: !!nextProps.checked})
    }
  }

  toggle () {
    const toggle = !this.state.checked
    this.setState({checked: toggle})
    this.props.onChange(toggle)
  }

  render () {
    return (
      <div className={classnames(styles.calRadioButton, {[styles.calRadioButton__checked]: this.state.checked})} onClick={() => this.toggle()}>
        <input type={'radio'} />
        <label className={styles.label}>{this.props.label}</label>
      </div>
    )
  }
}

export default Checkbox
