import React, { Component } from 'react'
import { Scrollbars } from 'react-custom-scrollbars'
import classnames from 'classnames'
import Icon from '../Icon'
import styles from './styles.css'

class ScrollWrapper extends Component {
  constructor (props) {
    super(props)
    this.state = {page: 0}
  }

  childrenList () {
    // Return all children (object, arrays, object/array mix) as a single array list of children
    return [].concat(this.props.children).reduce((a, b) => a.concat(b), [])
  }

  changePage (multiplier) {
    let children = this.childrenList().length
    let maxPage = Math.ceil(children / this.props.pageSize) - 1
    let nextPage = this.state.page + multiplier

    if (nextPage > maxPage) {
      nextPage = 0
    }

    if (nextPage < 0) {
      nextPage = maxPage
    }

    this.setState({page: nextPage})
  }

  renderWithArrows () {
    const wrapperClasses = classnames({
      [styles.arrowWrapperHorizontal]: this.props.horizontal,
      [styles.arrowWrapperVertical]: this.props.vertical
    })

    const classes = classnames(styles.arrowView, {
      [styles.flexRow]: this.props.row,
      [styles.flexColumn]: this.props.column
    })

    // Merge together all possible arrays (e.g. mapping over vehicles)
    let elements = this.childrenList()
    let children = []

    // Cut the element list to the elements currently in the page
    if (!this.props.sticky) {
      children = elements.slice(
        this.state.page * this.props.pageSize, // offset = current page based on page size
        this.state.page * this.props.pageSize + this.props.pageSize // offset + page size
      )
    } else {
      // Take the sticky elements and remove them from the elements
      children = elements.slice(0, this.props.sticky)
      elements = elements.slice(this.props.sticky)

      // Add the remaining slots with elements
      let pageSize = this.props.pageSize - this.props.sticky
      children = children.concat(elements.slice(
        this.state.page * pageSize, // offset = current page based on page size
        this.state.page * pageSize + pageSize // offset + page size
      ))
    }

    return (
      <div className={wrapperClasses}>
        <div onClick={() => this.changePage(-1)} className={styles.arrowButton}>
          <Icon size={32} type={this.props.horizontal ? 'arrow_left' : 'arrow_up'} />
        </div>
        <div className={classnames(classes, "cal-border-color-grey-300 cal-border-bottom")}>
          {children}
        </div>
        <div onClick={() => this.changePage(1)} className={styles.arrowButton}>
          <Icon size={32} type={this.props.horizontal ? 'arrow_right' : 'arrow_down'} />
        </div>
      </div>
    )
  }

  renderWithScrollbar () {
    const classes = classnames(styles.view, {
      [styles.flexColumn]: this.props.column,
      [styles.flexRow]: this.props.row
    })

    let children = this.childrenList()
    let sticky = null

    if (this.props.sticky) {
      sticky = children.slice(0, this.props.sticky)
      children = children.slice(this.props.sticky)
    }
    let _divs = []
    for (let i=0;i<10;i++) {
      _divs.push(<div style={{height: "80px"}}></div>)
    }
    return (
      <div className={styles.scrollWrapper}>
        {sticky && (
          <div className={styles.scrollWrapperSticky}>{sticky}</div>
        )}

        <div className={styles.scrollWrapperElements}>
          <Scrollbars
            renderView={props => <div {...props} className={classes} />}
            renderTrackVertical={props => <div {...props} className={styles.track} />}
            renderThumbVertical={props => <div {...props} className={styles.thumb} />}
          >
            {children}
            
          </Scrollbars>
        </div>
      </div>
    )
  }

  render () {
    if (this.props.arrows) {
      return this.renderWithArrows()
    }

    if (this.props.scrollbar) {
      return this.renderWithScrollbar()
    }

    return <div>ERROR: Missing props for "ScrollWrapper" (either scrollbar/arrows)</div>
  }
}

export default ScrollWrapper
