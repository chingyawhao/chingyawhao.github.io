import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {RouteComponentProps} from 'react-router'
import {BrowserRouter, Switch, Route} from 'react-router-dom'
import {TransitionGroup, CSSTransition} from 'react-transition-group'
import {withStyles, Theme, StyleRules, StyleRulesCallback, StyledComponentProps} from '@material-ui/core/styles'
import {grey} from '@material-ui/core/colors'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import {GithubCircle as GithubIcon, Linkedin as LinkedinIcon, Deviantart as DeviantartIcon} from 'mdi-material-ui'

import * as Hao from '../../asset/img/hao.svg'
import AsyncComponent from './async-component'

const landingPage = () => import(/* webpackChunkName:'landing' */ './landing-page')
const materializeClockpickerPage = () => import(/* webpackChunkName:'materialize-clockpicker' */ './materialize-clockpicker-page')
const materialUIPickersPage = () => import(/* webpackChunkName:'material-ui-pickers' */ './material-ui-pickers-page')
const notFoundPage = () => import(/* webpackChunkName:'404-page' */ './404-page')

const blinkerID = Math.ceil(Math.random() * 10000)
const styles = (theme:Theme):StyleRules<string> | StyleRulesCallback<string> => ({
  container: {
    width: '100vw',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerContainer: {
    width: '100vw',
    display: 'flex',
    padding: '32px 0',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    overflow: 'hidden'
  },
  pageContainer: {
    position: 'relative',
    width: '820px',
    maxWidth: 'calc(100% - 64px)',
    padding: '0 32px',
    overflow: 'hidden',
    transition: 'height 300ms ease-in-out',
    [`@media (max-width:${theme.breakpoints.values.sm}px)`]: {
      maxWidth: 'calc(100% - 32px)',
      padding: '0 16px',
    }
  },
  pageSlideEnterLeft: {
    position: 'absolute',
    top: 0,
    left: '100%'
  },
  pageSlideEnterLeftActive: {
    position: 'absolute',
    top: 0,
    left: 0,
    transition: 'left 300ms ease-in-out',
  },
  pageSlideExitLeft: {
    position: 'absolute',
    top: 0,
    left: 0
  },
  pageSlideExitLeftActive: {
    position: 'absolute',
    top: 0,
    left: '-100%',
    transition: 'left 300ms ease-in-out',
  },
  pageSlideEnterRight: {
    position: 'absolute',
    top: 0,
    left: '-100%'
  },
  pageSlideEnterRightActive: {
    position: 'absolute',
    top: 0,
    left: 0,
    transition: 'left 300ms ease-in-out',
  },
  pageSlideExitRight: {
    position: 'absolute',
    top: 0,
    left: 0
  },
  pageSlideExitRightActive: {
    position: 'absolute',
    top: 0,
    left: '100%',
    transition: 'left 300ms ease-in-out',
  },
  headerBrand: {
    display: 'flex',
    justifyContent: 'center',
    [`@media (max-width:${theme.breakpoints.values.sm}px)`]: {
      flexDirection: 'column'
    }
  },
  headerBrandLogo: {
    height: '180px'
  },
  headerText: {
    color: 'white',
    lineHeight: '1em',
    fontFamily: 'Segoe Mono',
    textAlign: 'center',
    whiteSpace: 'pre'
  },
  [`@keyframes blink-${blinkerID}`]: {
    from: {opacity:1},
    to: {opacity:0}
  },
  headerBlinkingCursor: {
    animation: `blink-${blinkerID} 0.8s linear infinite alternate`
  },
  headerDivider: {
    height: '3px',
    width: '180px',
    maxWidth: 'calc(100% - 64px)',
    margin: '16px 32px',
    background: 'white',
    opacity: 0.8
  },
  link: {
    color: 'inherit',
    textDecoration: 'none'
  },
  footer: {
    width: '100vw',
    padding: '16px 0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  button: {
    margin: '8px',
    color: 'white',
  }
})
@(withStyles as any)(styles)
class LandingPage extends React.Component<LandingPageProps, LandingPageState> {
  constructor(props:LandingPageProps) {
    super(props)
    this.state = {
      height: 500
    }
  }
  componentWillMount() {
    document.querySelector('body').style.background = grey[800]
  }
  changePageHeight = (height:number) => {
    this.setState({height})
  }
  render() {
    const {classes} = this.props
    const {height} = this.state
    return (
      <BrowserRouter>
        <Route render={({location}) => (
          <div className={classes.container}>
            <div className={classes.headerContainer}>
              <div className={classes.headerBrand}>
                <img src={Hao} className={classes.headerBrandLogo}/>
                <Typography variant='display3' classes={{root:classes.headerText}}>
                  {'CHING\n'}
                  {'YAW  \n'}
                  {'HAO'}
                  <span className={classes.headerBlinkingCursor}>_</span>
                  {' '}
                </Typography>
              </div>
              <div className={classes.headerDivider}/>
              <Typography variant='body1' classes={{root:classes.headerText}}>
                DEVELOPER • DESIGNER
              </Typography>
            </div>
            <Paper classes={{root:classes.pageContainer}} style={{height}}>
              <TransitionGroup>
                <CSSTransition key={location.key} classNames={{
                  enter: location.pathname === '/'? classes.pageSlideEnterRight:classes.pageSlideEnterLeft,
                  enterActive: location.pathname === '/'? classes.pageSlideEnterRightActive:classes.pageSlideEnterLeftActive,
                  enterDone: location.pathname === '/'? classes.pageSlideEnterRightActive:classes.pageSlideEnterLeftActive,
                  exit: location.pathname === '/'? classes.pageSlideExitLeft:classes.pageSlideExitRight,
                  exitActive: location.pathname === '/'? classes.pageSlideExitLeftActive:classes.pageSlideExitRightActive,
                  exitDone: location.pathname === '/'? classes.pageSlideExitLeftActive:classes.pageSlideExitRightActive
                }} timeout={300}>
                  <Switch>
                    <Route exact path={`/`} render={(routeComponentProps:RouteComponentProps<any>) =>
                      <AsyncComponent module={landingPage} props={{...routeComponentProps, changePageHeight:this.changePageHeight}}/>
                    }/>
                    <Route exact path={`/materialize-clockpicker`} render={(routeComponentProps:RouteComponentProps<any>) =>
                      <AsyncComponent module={materializeClockpickerPage} props={{...routeComponentProps, changePageHeight:this.changePageHeight}}/>
                    }/>
                    <Route exact path={`/material-ui-pickers`} render={(routeComponentProps:RouteComponentProps<any>) =>
                      <AsyncComponent module={materialUIPickersPage} props={{...routeComponentProps, changePageHeight:this.changePageHeight}}/>
                    }/>
                    <Route path='*' render={(routeComponentProps:RouteComponentProps<any>) =>
                      <AsyncComponent module={notFoundPage} props={routeComponentProps}/>
                    }/>
                  </Switch>
                </CSSTransition>
              </TransitionGroup>
            </Paper>
            <div className={classes.footer}>
              <Grid container justify='center' alignItems='center' classes={{container:classes.pageContainer} as any}>
                <IconButton href='https://github.com/chingyawhao' classes={{root:classes.button}}>
                  <GithubIcon/>
                </IconButton>
                <IconButton href='https://my.linkedin.com/in/chingyawhao' classes={{root:classes.button}}>
                  <LinkedinIcon/>
                </IconButton>
                <IconButton href='https://chingyawhao.deviantart.com/' classes={{root:classes.button}}>
                  <DeviantartIcon/>
                </IconButton>
              </Grid>
            </div>
          </div>
        )}/>
      </BrowserRouter>
    )
  } 
}
interface LandingPageProps extends React.Props<{}>, StyledComponentProps {
}
interface LandingPageState {
  height: number
}

export default LandingPage