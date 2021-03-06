import * as React from 'react'
import {RouteComponentProps} from 'react-router'
import * as ReSub from 'resub'
import {withStyles, Theme, StyleRulesCallback, StyledComponentProps} from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

import screenStore from '../../store/screen'

const styles:StyleRulesCallback<Theme, NotFoundPageProps, string> = theme  => ({
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
    return (
      <div className={classes.row}>
        <Typography variant='h4' color='inherit' component='h2'>
          404
        </Typography>
        <div className={classes.divider}/>
        <Typography align='center' variant='body2' gutterBottom>
          Page not found
        </Typography>
      </div>
    )
  } 
}
interface NotFoundPageProps extends React.Props<{}>, StyledComponentProps, RouteComponentProps<{}> {
}
interface NotFoundPageState {
  screenType: 'xl-desktop' | 'lg-desktop' | 'md-desktop' | 'sm-tablet' | 'xs-phone'
}

export default NotFoundPage