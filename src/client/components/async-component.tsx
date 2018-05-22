import * as React from 'react'
import {withStyles, Theme, StyledComponentProps} from '@material-ui/core/styles'
import {grey} from '@material-ui/core/colors'
import CircularProgress from '@material-ui/core/CircularProgress'

const styles = (theme:Theme):Record<string, React.CSSProperties> => ({
  loading: {
    minHeight: '100vh',
    minWidth: '100vw',
    backgroundColor: grey[800],
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
})
@(withStyles as any)(styles)
class AsyncComponent extends React.Component<AsyncComponentProps, AsyncComponentState> {
  constructor(props) {
    super(props)
    this.state = {
      Component: undefined
    }
  }
  componentWillMount() {
    document.querySelector('body').style.background = grey[800]
    if(this.state.Component === undefined) {
      this.props.module().then((page) => this.setState({Component:page.default}))
    }
  }
  render() {
    const {props, classes} = this.props
    const {Component} = this.state
    return (
      <div>
        {Component? <Component {...props}/>:<div className={classes.loading}>
          <CircularProgress/>
        </div>}
      </div>
    )
  }
}
interface AsyncComponentProps extends React.Props<{}>, StyledComponentProps {
  module: () => Promise<{default:React.ComponentClass}>
  props
}
interface AsyncComponentState {
  Component: React.ComponentClass
}

export default AsyncComponent