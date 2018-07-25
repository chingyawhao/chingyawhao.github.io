import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles'
import {pink, purple} from '@material-ui/core/colors'

import Favicon from './components/favicon'
import Font from './components/font'
import Route from './components'

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
    <Route/>
  </MuiThemeProvider>
, document.getElementById('root'))