import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {RouteComponentProps} from 'react-router'
import * as ReSub from 'resub'
import {withStyles, Theme, StyleRules, StyleRulesCallback, StyledComponentProps} from 'material-ui/styles'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'
import IconButton from 'material-ui/IconButton'
import {ArrowBack as ArrowBackIcon} from '@material-ui/icons'
import DateFormatInput from 'material-ui-next-datepicker'

import screenStore from '../../store/screen'
import CommonPage from '../common-page'

const styles = (theme:Theme):StyleRules<string> | StyleRulesCallback<string> => ({
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
    padding: '32px 0'
  }
})
@(withStyles as any)(styles)
class MaterialUIDatepickerPage extends ReSub.ComponentBase<MaterialUIDatepickerPageProps, MaterialUIDatepickerPageState> {
  protected _buildState(props:{}, initial:boolean):MaterialUIDatepickerPageState {
    return {
      screenType: screenStore.type(),
      date: initial? undefined:this.state.date
    }
  }
  onChange = (date:Date) => {
    console.log(date)
    this.setState({date})
  }
  goBack = () => {
    this.props.history.push('/')
  }
  render() {
    const {classes} = this.props
    const {screenType, date} = this.state
    return (
      <CommonPage>
        <div className={classes.row}>
          <IconButton onClick={this.goBack} className={classes.backButton}><ArrowBackIcon/></IconButton>
          <Typography className={classes.title} variant='display1' color='inherit' component='h2'>
            Material UI Next Datepicker
          </Typography>
          <div className={classes.divider}/>
          <form className={classes.form}>
            <DateFormatInput name='date-input' value={date} onChange={this.onChange} dialog={screenType === 'xs-phone'}/>
          </form>
          <Button href='https://github.com/chingyawhao/material-ui-next-datepicker'>VISIT MY PROJECT</Button>
        </div>
      </CommonPage>
    )
  } 
}
interface MaterialUIDatepickerPageProps extends React.Props<{}>, StyledComponentProps, RouteComponentProps<{}> {
}
interface MaterialUIDatepickerPageState {
  screenType: 'xl-desktop' | 'lg-desktop' | 'md-desktop' | 'sm-tablet' | 'xs-phone'
  date: Date
}

export default MaterialUIDatepickerPage