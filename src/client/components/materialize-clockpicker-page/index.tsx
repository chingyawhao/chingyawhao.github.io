import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {RouteComponentProps} from 'react-router'
import * as ReSub from 'resub'
import {withStyles, Theme, StyleRules, StyleRulesCallback, StyledComponentProps} from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import {ArrowBack as ArrowBackIcon} from '@material-ui/icons'

import * as Hao from '../../../asset/img/hao.svg'
import screenStore from '../../store/screen'
import CommonPage from '../common-page'
import Materialize from './materialize'

const styles = (theme:Theme):StyleRules<string> | StyleRulesCallback<string> => ({
  row: {
    position: 'relative',
    width: 'calc(100% + 64px)',
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
  protected _buildState(props:{}, initial:boolean):MaterializeClockpickerPageState {
    return {
      screenType: screenStore.type()
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
    }
  }
  goBack = () => {
    this.props.history.push('/')
  }
  render() {
    const {classes} = this.props
    const {screenType} = this.state
    return (
      <CommonPage>
        <Materialize onLoad={this.pickATime}/>
        <div className={classes.row}>
          <IconButton onClick={this.goBack} className={classes.backButton}><ArrowBackIcon/></IconButton>
          <Typography className={classes.title} variant='display1' color='inherit' component='h2'>
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
      </CommonPage>
    )
  } 
}
interface MaterializeClockpickerPageProps extends React.Props<{}>, StyledComponentProps, RouteComponentProps<{}> {
}
interface MaterializeClockpickerPageState {
  screenType: 'xl-desktop' | 'lg-desktop' | 'md-desktop' | 'sm-tablet' | 'xs-phone'
}

export default MaterializeClockpickerPage