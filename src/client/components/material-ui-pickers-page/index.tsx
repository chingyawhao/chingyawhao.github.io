import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {RouteComponentProps} from 'react-router'
import * as ReSub from 'resub'
import {withStyles, Theme, StyleRules, StyleRulesCallback, StyledComponentProps} from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import {ArrowBack as ArrowBackIcon} from '@material-ui/icons'
import {DateFormatInput, TimeFormatInput} from 'material-ui-next-pickers'

import screenStore from '../../store/screen'

const styles = (theme:Theme):StyleRules<string> | StyleRulesCallback<string> => ({
  row: {
    position: 'relative',
    width: 'calc(100% - 64px)',
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
    padding: '32px 0'
  },
  inputContainer: {
    padding: '8px 0'
  }
})
@(withStyles as any)(styles)
class MaterialUIPickersPage extends ReSub.ComponentBase<MaterialUIPickersPageProps, MaterialUIPickersPageState> {
  page:Element
  protected _buildState(props:{}, initial:boolean):MaterialUIPickersPageState {
    return {
      screenSize: screenStore.size(),
      screenType: screenStore.type(),
      date: initial? undefined:this.state.date,
      time: initial? undefined:this.state.time
    }
  }
  shouldComponentUpdate(nextProps:MaterialUIPickersPageProps, nextState:MaterialUIPickersPageState) {
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
  onChangeDate = (date:Date) => {
    console.log('Date: ', date)
    this.setState({date})
  }
  onChangeTime = (time:Date) => {
    console.log('Time: ', time)
    this.setState({time})
  }
  goBack = () => {
    this.props.history.push('/')
  }
  render() {
    const {classes} = this.props
    const {screenType, date, time} = this.state
    return (
      <div ref={this.mountPage} className={classes.row}>
        <IconButton onClick={this.goBack} className={classes.backButton}><ArrowBackIcon/></IconButton>
        <Typography className={classes.title} variant='display1' color='inherit' component='h2'>
          Material UI Next Datepicker
        </Typography>
        <div className={classes.divider}/>
        <form className={classes.form}>
          <div className={classes.inputContainer}>
            <DateFormatInput name='date-input' key='date-input' value={date} onChange={this.onChangeDate} dialog={screenType === 'xs-phone'}/>
          </div>
          <div className={classes.inputContainer}>
            <TimeFormatInput name='time-input' key='time-input' value={time} onChange={this.onChangeTime} dialog={screenType === 'xs-phone'}/>
          </div>
        </form>
        <Button href='https://github.com/chingyawhao/material-ui-next-datepicker'>VISIT MY PROJECT</Button>
      </div>
    )
  } 
}
interface MaterialUIPickersPageProps extends React.Props<{}>, StyledComponentProps, RouteComponentProps<{}> {
  changePageHeight: (height:number) => void
}
interface MaterialUIPickersPageState {
  screenSize: number
  screenType: 'xl-desktop' | 'lg-desktop' | 'md-desktop' | 'sm-tablet' | 'xs-phone'
  date: Date
  time: Date
}

export default MaterialUIPickersPage