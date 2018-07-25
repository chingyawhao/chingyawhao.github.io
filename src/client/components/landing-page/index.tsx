import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {RouteComponentProps} from 'react-router'
import * as ReSub from 'resub'
import {withStyles, Theme, StyleRules, StyleRulesCallback, StyledComponentProps} from '@material-ui/core/styles'

import screenStore from '../../store/screen'
import AboutSection from './about-section'

const styles = (theme:Theme):StyleRules<string> | StyleRulesCallback<string> => ({
})
@(withStyles as any)(styles)
class LandingPage extends ReSub.ComponentBase<LandingPageProps, LandingPageState> {
  page:Element
  protected _buildState(props:{}, initial:boolean):LandingPageState {
    return {
      screenSize: screenStore.size(),
      screenType: screenStore.type()
    }
  }
  shouldComponentUpdate(nextProps:LandingPageProps, nextState:LandingPageState) {
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
  goToPage = (link:string) => {
    this.props.history.push(link)
  }
  render() {
    const {classes} = this.props
    const {screenType} = this.state
    return (
      <AboutSection ref={this.mountPage} goToPage={this.goToPage}/>
    )
  } 
}
interface LandingPageProps extends React.Props<{}>, StyledComponentProps, RouteComponentProps<{}> {
  changePageHeight: (height:number) => void
}
interface LandingPageState {
  screenSize: number
  screenType: 'xl-desktop' | 'lg-desktop' | 'md-desktop' | 'sm-tablet' | 'xs-phone'
}

export default LandingPage