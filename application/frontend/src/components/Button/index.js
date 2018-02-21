import React, { Component } from 'react'
import classnames from 'classnames'
import Icon from '../Icon'
import styles from './styles.css'

class Button extends Component {
  render () {
    const classes = classnames(styles.button, {
      // Color modifiers
      [styles.buttonAccent]: this.props.accent,

      // Types
      [styles.buttonSecondary]: this.props.secondary,
      [styles.buttonTertiary]: this.props.tertiary,
      [styles.buttonGray]: this.props.gray,

      // Modifiers
      [styles.buttonActive]: this.props.active,
      [styles.buttonWarning]: this.props.warning,
      [styles.buttonDisabled]: this.props.disabled,
      [styles.buttonNoAction]: !this.props.disabled && !this.props.onClick && !this.props.to && !this.props.href,

      // Icon behaviour
      [styles.buttonOnlyIcon]: this.props.icon && !this.props.children,
      [styles.buttonNoIcon]: !this.props.icon,
      [styles.buttonIconRight]: this.props.iconRight,

      // Sizing
      [styles.buttonFullWidth]: this.props.fullWidth,
      [styles.buttonMarginLeft]: this.props.marginLeft,
      [styles.buttonMarginRight]: this.props.marginRight,
      [styles.buttonMarginTop]: this.props.marginTop,
      [styles.buttonMarginBottom]: this.props.marginBottom,

      // Alignment
      [styles.buttonAlignLeft]: this.props.alignLeft,
      [styles.buttonAlignRight]: this.props.alignRight,

      // Grouping
      [styles.buttonGroupRight]: this.props.groupRight,
      [styles.buttonGroupLeft]: this.props.groupLeft
    }, this.props.className)

    if (this.props.href) {
      return (
        <a href={this.props.href} download={this.props.download} className={classes}>
          {this.props.icon && (<Icon type={this.props.icon} size={24} marginRight />)}
          {this.props.children}
        </a>
      )
    }

    const onClick = this.props.disabled ? () => false : this.props.onClick

    return (
      <button onClick={onClick} className={classes}>
        {this.props.icon && !this.props.iconRight && (
          <Icon type={this.props.icon} size={24} marginRight={!!this.props.children} />
        )}

        {this.props.children}

        {this.props.icon && this.props.iconRight && (
          <Icon type={this.props.icon} size={24} marginLeft={!!this.props.children} />
        )}
      </button>
    )
  }
}

export default Button
