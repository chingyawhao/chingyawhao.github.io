import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {RouteComponentProps} from 'react-router'
import * as ReSub from 'resub'
import {withStyles, Theme, StyleRulesCallback, StyledComponentProps} from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import {ArrowBack as ArrowBackIcon} from '@material-ui/icons'

import screenStore from '../../store/screen'
import Materialize from './materialize'

const styles:StyleRulesCallback<Theme, MaterializeClockpickerPageProps, string> = theme => ({
  row: {
    position: 'relative',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: '32px',
    alignItems: 'center'
  },
  backButton: {
    position: 'absolute',
    left: '32px',
    top: '28px',
  },
  title: {
    textAlign: 'center',
    padding: '0 48px'
  },
  divider: {
    height: '3px',
    width: '120px',
    maxWidth: 'calc(100% - 64px)',
    margin: '16px 32px',
    background: 'black',
    opacity: 0.8
  },
  form: {
    width: '230px'
  },
  button: {
    fontWeight: 400
  }
})
@(withStyles as any)(styles)
class MaterializeClockpickerPage extends ReSub.ComponentBase<MaterializeClockpickerPageProps, MaterializeClockpickerPageState> {
  page: Element
  protected _buildState(props:{}, initial:boolean):MaterializeClockpickerPageState {
    return {
      screenSize: screenStore.size(),
      screenType: screenStore.type()
    }
  }
  shouldComponentUpdate(nextProps:MaterializeClockpickerPageProps, nextState:MaterializeClockpickerPageState) {
    if(this.page && this.state.screenSize !== nextState.screenSize) {
      this.props.changePageHeight(this.page.clientHeight)
      return false
    } else {
      return true
    }
  }
  mountPage = (page) => {
    this.page = ReactDOM.findDOMNode(page) as Element
    if(this.page) {
      this.props.changePageHeight(this.page.clientHeight)
    }
  }
  pickATime = () => {
    const $ = window['$']
    if($('#timepicker').pickatime) {
      $('#timepicker').pickatime({
        placement: 'bottom',
        align: 'left',
        twelvehour: true,
        darktheme: true,
        container: $('body')
      })
      if(this.page) {
        this.props.changePageHeight(this.page.clientHeight)
      }
    }
  }
  goBack = () => {
    this.props.history.push('/')
  }
  render() {
    const {classes} = this.props
    const {screenType} = this.state
    return ([
      <Materialize key='materialize' onLoad={this.pickATime}/>,
      <div key='content' ref={this.mountPage} className={classes.row}>
        <IconButton onClick={this.goBack} className={classes.backButton}><ArrowBackIcon/></IconButton>
        <Typography className={classes.title} variant='h4' color='inherit' component='h2'>
          Materialize Clockpicker
        </Typography>
        <div className={classes.divider}/>
        <form className={['row', classes.form].join(' ')}>
          <div className='input-field col s12'>
            <label htmlFor='timepicker'>Pick your time</label>
            <input id='timepicker' className='timepicker' type='time'/>
          </div>
        </form>
        <Button classes={{label:classes.button}} href='https://github.com/chingyawhao/materialize-clockpicker'>VISIT MY PROJECT</Button>
      </div>
    ])
  } 
}
interface MaterializeClockpickerPageProps extends React.Props<{}>, StyledComponentProps, RouteComponentProps<{}> {
  changePageHeight: (height:number) => void
}
interface MaterializeClockpickerPageState {
  screenSize: number
  screenType: 'xl-desktop' | 'lg-desktop' | 'md-desktop' | 'sm-tablet' | 'xs-phone'
}

export default MaterializeClockpickerPage