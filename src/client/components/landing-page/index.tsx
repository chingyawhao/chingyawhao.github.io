import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {RouteComponentProps} from 'react-router'
import * as ReSub from 'resub'
import {withStyles, Theme, StyleRules, StyleRulesCallback, StyledComponentProps} from 'material-ui/styles'

import screenStore from '../../store/screen'
import CommonPage from '../common-page'
import AboutSection from './about-section'

const styles = (theme:Theme):StyleRules<string> | StyleRulesCallback<string> => ({
})
@(withStyles as any)(styles)
class LandingPage extends ReSub.ComponentBase<LandingPageProps, LandingPageState> {
  protected _buildState(props:{}, initial:boolean):LandingPageState {
    return {
      screenType: screenStore.type()
    }
  }
  goToPage = (link:string) => {
    this.props.history.push(link)
  }
  render() {
    const {classes} = this.props
    const {screenType} = this.state
    return (
      <CommonPage>
        <AboutSection goToPage={this.goToPage}/>
      </CommonPage>
    )
  } 
}
interface LandingPageProps extends React.Props<{}>, StyledComponentProps, RouteComponentProps<{}> {
}
interface LandingPageState {
  screenType: 'xl-desktop' | 'lg-desktop' | 'md-desktop' | 'sm-tablet' | 'xs-phone'
}

export default LandingPage