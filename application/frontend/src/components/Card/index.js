import React, { Component } from 'react'
import classnames from 'classnames'
import styles from './styles.css'

class Card extends Component {
  renderContent () {
    return (
      <div>
        {this.props.heading && <div className={styles.heading}>{this.props.heading}</div>}
        {this.props.text && <div className={styles.text}>{this.props.text}</div>}
        {this.props.subheading && <div className={styles.subheading}>{this.props.subheading}</div>}
        {this.props.date && <div className={styles.date}>{this.props.date}</div>}
        {this.props.sideButtons && <div className={styles.sideButtons}>{this.props.sideButtons}</div>}
      </div>
    )
  }

  render () {
    const classes = classnames(styles.card, {
      [styles.cardClickable]: this.props.onClick || this.props.to,
      [styles.cardSelected]: this.props.selected
    }, this.props.className)

    switch (true) {
      case !!this.props.onClick:
        return <div onClick={this.props.onClick} className={classes}>{this.renderContent()}</div>
      default:
        return <div className={classes}>{this.renderContent()}</div>
    }
  }
}

export default Card
