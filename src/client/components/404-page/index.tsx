import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {RouteComponentProps} from 'react-router'
import * as ReSub from 'resub'
import {withStyles, Theme, StyleRules, StyleRulesCallback, StyledComponentProps} from 'material-ui/styles'
import Typography from 'material-ui/Typography'

import screenStore from '../../store/screen'
import CommonPage from '../common-page'

const styles = (theme:Theme):StyleRules<string> | StyleRulesCallback<string> => ({
  row: {
    display: 'flex',
    flexDirection: 'column',
    padding: '32px',
    alignItems: 'center'
  },
  divider: {
    height: '3px',
    width: '120px',
    maxWidth: 'calc(100% - 64px)',
    margin: '16px 32px',
    background: 'black',
    opacity: 0.8
  }
})
@(withStyles as any)(styles)
class NotFoundPage extends ReSub.ComponentBase<NotFoundPageProps, NotFoundPageState> {
  protected _buildState(props:{}, initial:boolean):NotFoundPageState {
    return {
      screenType: screenStore.type()
    }
  }
  render() {
    const {classes} = this.props
    const {screenType} = this.state
    return (
      <CommonPage>
        <div className={classes.row}>
          <Typography variant='display1' color='inherit' component='h2'>
            404
          </Typography>
          <div className={classes.divider}/>
          <Typography align='center' variant='body2' gutterBottom>
            Page not found
          </Typography>
        </div>
      </CommonPage>
    )
  } 
}
interface NotFoundPageProps extends React.Props<{}>, StyledComponentProps, RouteComponentProps<{}> {
}
interface NotFoundPageState {
  screenType: 'xl-desktop' | 'lg-desktop' | 'md-desktop' | 'sm-tablet' | 'xs-phone'
}

export default NotFoundPage