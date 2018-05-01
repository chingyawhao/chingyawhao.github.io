import * as React from 'react'
import * as ReactDOM from 'react-dom'

import * as PromiseUtil from '../../utility/promise'

class Materialize extends React.Component<MaterializeProps, MaterializeState> {
  scripts = [{
    id: 'jquery',
    ready: 'jQueryReady',
    src: 'https://code.jquery.com/jquery-3.3.1.slim.min.js'
  }, {
    id: 'materialize',
    ready: 'materializeReady',
    src: 'https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.0/js/materialize.min.js'
  }, {
    id: 'materialize-clockpicker',
    ready: 'materializeClockpickerReady',
    src: 'https://cdn.rawgit.com/chingyawhao/materialize-clockpicker/aba27526/dist/js/materialize.clockpicker.js'
  }]
  componentWillMount() {
    const head = document.querySelector('head');
    PromiseUtil.sequencial(this.scripts.map(script => () =>
      new Promise((resolve, reject) => {
        const scriptElement = document.createElement('script')
        scriptElement.id = script.id
        scriptElement.src = script.src
        scriptElement.onload = () => {
          resolve()
        }
        head.appendChild(scriptElement)
      })
    )).then(this.props.onLoad)
  }
  componentWillUnmount() {
    this.scripts.forEach(script => {
      const scriptElement = document.querySelector('#' + script.id)
      if(scriptElement) {
        scriptElement.remove()
      }
    })
  }
  render() {
    return ReactDOM.createPortal([
      <link key='materialize-css' rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.0/css/materialize.min.css'/>,
      <link key='materialize-clockpicker-css' rel='stylesheet' href='https://cdn.rawgit.com/chingyawhao/materialize-clockpicker/aba27526/dist/css/materialize.clockpicker.css'/>
    ], document.querySelector('head'))
  } 
}
interface MaterializeProps extends React.Props<{}> {
  onLoad: () => void
}
interface MaterializeState {}

export default Materialize