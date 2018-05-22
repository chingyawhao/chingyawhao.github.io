import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {withStyles, Theme, StyleRules, StyleRulesCallback, StyledComponentProps} from '@material-ui/core/styles'
import {blue, lightGreen, grey} from '@material-ui/core/colors'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import {GithubCircle as GithubIcon, Linkedin as LinkedinIcon, Deviantart as DeviantartIcon} from 'mdi-material-ui'

import * as Hao from '../../asset/img/hao.svg'

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
    width: '820px',
    maxWidth: '100%',
    padding: '0 32px',
    [`@media (max-width:${theme.breakpoints.values.sm}px)`]: {
      padding: '0 16px',
    }
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
  componentWillMount() {
    document.querySelector('body').style.background = grey[800]
  }
  render() {
    const {children, classes} = this.props
    return (
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
        <Paper classes={{root:classes.pageContainer}}>
          <Grid container direction='column' alignItems='center'>
            {children}
          </Grid>
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
    )
  } 
}
interface LandingPageProps extends React.Props<{}>, StyledComponentProps {
}
interface LandingPageState {}

export default LandingPage