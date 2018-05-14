import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {Router, RouteComponentProps} from 'react-router'
import {BrowserRouter, Switch, Route, Redirect} from 'react-router-dom'
import * as classnames from 'classnames'
import {MuiThemeProvider, createMuiTheme} from 'material-ui/styles'
import {pink, purple, grey} from 'material-ui/colors'

import Favicon from './components/favicon'
import Font from './components/font'
import AsyncComponent from './components/async-component'

const landingPage = () => import(/* webpackChunkName:'landing' */ './components/landing-page')
const materializeClockpickerPage = () => import(/* webpackChunkName:'materialize-clockpicker' */ './components/materialize-clockpicker-page')
const materialUIPickersPage = () => import(/* webpackChunkName:'material-ui-pickers' */ './components/material-ui-pickers-page')
const notFoundPage = () => import(/* webpackChunkName:'404-page' */ './components/404-page')

const theme = createMuiTheme({
  palette: {
    primary: {
      light: pink[300],
      main: pink[500],
      dark: pink[700],
      contrastText: 'white'
    },
    secondary: {
      light: purple[700],
      main: purple[800],
      dark: purple[900],
      contrastText: 'white'
    }
  }
})

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <Favicon/>
    <Font/>
    <BrowserRouter>
      <Switch>
        <Route exact path={`/`} component={(routeComponentProps:RouteComponentProps<any>) =>
          <AsyncComponent module={landingPage} props={routeComponentProps}/>
        }/>
        <Route exact path={`/materialize-clockpicker`} component={(routeComponentProps:RouteComponentProps<any>) =>
          <AsyncComponent module={materializeClockpickerPage} props={routeComponentProps}/>
        }/>
        <Route exact path={`/material-ui-pickers`} component={(routeComponentProps:RouteComponentProps<any>) =>
          <AsyncComponent module={materialUIPickersPage} props={routeComponentProps}/>
        }/>
        <Route path='*' component={(routeComponentProps:RouteComponentProps<any>) =>
          <AsyncComponent module={notFoundPage} props={routeComponentProps}/>
        }/>
      </Switch>
    </BrowserRouter>
  </MuiThemeProvider>
, document.getElementById('root'))