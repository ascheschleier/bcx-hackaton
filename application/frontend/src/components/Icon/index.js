import React, { PureComponent } from 'react'
import classnames from 'classnames'
import styles from './styles.css'

/*
 !!! Importing SVGs from designers !!!

 When importing SVGs make sure to run https://github.com/queicherius/make-svg-less-stupid
 over the entire "./icons" folder. This optimizes the SVGs (e.g. removes unused ids, data-
 attributes titles, merges paths, etc.), and - importantly - makes sure that the class names
 are not colliding (since AI is always exporting with the same class names) and there
 are no color codes so the SVG reacts to the surrounding environment instead.
 */

const typeMap = {
  files: require('./icons/files_folder_browse.svg'),
  equipment: require('./icons/equipment.svg'),
  vehicles: require('./icons/vehicle.svg'),
  tasks: require('./icons/tasks.svg'),
  resources: require('./icons/resources.svg'),
  apps: require('./icons/apps.svg'),
  information: require('./icons/news.svg'),
  add: require('./icons/plus.svg'),
  edit: require('./icons/edit.svg'),
  delete: require('./icons/delete.svg'),
  my_dashboard: require('./icons/my_dashboard.svg'),
  settings: require('./icons/settings.svg'),
  logout: require('./icons/logout.svg'),
  more: require('./icons/more.svg'),
  add_booking: require('./icons/key.svg'),
  calendar: require('./icons/calendar.svg'),
  files_upload: require('./icons/upload.svg'),
  files_download: require('./icons/download.svg'),
  files_browse: require('./icons/files_folder_browse.svg'),
  add_directory: require('./icons/files_folder_browse.svg'),
  arrow_down: require('./icons/arrow_down.svg'),
  arrow_left: require('./icons/arrow_left.svg'),
  arrow_right: require('./icons/arrow_right.svg'),
  search: require('./icons/search.svg'),
  attach: require('./icons/link.svg'),
  check: require('./icons/check.svg'),
  close: require('./icons/delete.svg'),
  save: require('./icons/save.svg'),
  print: require('./icons/print.svg'),
  grid: require('./icons/grid.svg'),
  list: require('./icons/list.svg')
}

class Icon extends PureComponent {
  parseSvg (svg) {
    svg = svg.replace(/^.*base64,/, '')
    svg = window.atob(svg)
    return svg
  }

  render () {
    const svg = typeMap[this.props.type]

    if (!svg) {
      console.warn(`Used <Icon> with unknown type "${this.props.type}"`)
      return null
    }

    const classes = classnames(styles.wrapper, {
      [styles.marginLeft]: this.props.marginLeft,
      [styles.marginRight]: this.props.marginRight,
      [styles.floatRight]: this.props.floatRight
    }, this.props.className)

    const style = {
      width: `${this.props.size}px`,
      height: `${this.props.size}px`
    }

    return (
      <span
        className={classes}
        style={style}
        dangerouslySetInnerHTML={{__html: this.parseSvg(svg)}}
      />
    )
  }
}

export default Icon
