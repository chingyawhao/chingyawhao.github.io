import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as ReSub from 'resub'
import {withStyles, Theme, StyleRules, StyleRulesCallback, StyledComponentProps} from '@material-ui/core/styles'
import {pink, red, blue, lightGreen} from '@material-ui/core/colors'
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar'
import ButtonBase from '@material-ui/core/ButtonBase'
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'

import screenStore from '../../store/screen'

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
  },
  gridList: {
    width: '100%'
  },
  buttonBase: {
    width: '100%',
    maxWidth: '246px',
    height: '100%',
    margin: 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '3px',
  },
  materializeBase: {
    color: red[800]
  },
  materialUIBase: {
    color: blue[800]
  },
  aiChanBase: {
    color: lightGreen[800]
  },
  materializeActive: {
    background: red[50]
  },
  materialUIActive: {
    background: blue[50]
  },
  aiChanActive: {
    background: lightGreen[50]
  },
  avatarContainer: {
    position: 'relative'
  },
  avatar: {
    width: '50px',
    height: '50px',
    padding: '16px',
    transition: 'background 300ms ease-in-out'
  },
  avatarBackground: {
    width: '82px',
    height: '82px',
    position: 'absolute',
    borderRadius: '41px',
    transition: ['border-radius 300ms ease-in-out', 'transform 300ms ease-in-out'].join(', ')
  },
  avatarBackgroundActive: {
    borderRadius: '3px',
    transform: 'scale(3)'
  },
  imageAvatar: {
    objectFit: 'contain'
  },
  projectName: {
    position: 'relative',
    marginTop: '8px',
    textAlign: 'center',
    color: 'inherit',
    zIndex: 100
  }
})
@(withStyles as any)(styles)
class AboutSection extends ReSub.ComponentBase<AboutSectionProps, AboutSectionState> {
  protected _buildState(props:{}, initial:boolean):AboutSectionState {
    return {
      screenType: screenStore.type(),
      active: initial? undefined:this.state.active
    }
  }
  hoverProject = (project:string) => {
    this.setState({active:project})
  }
  render() {
    const {classes, goToPage} = this.props
    const {screenType, active} = this.state
    return (
      <div>
        <div className={classes.row}>
          <Typography variant='display1' color='inherit' component='h2'>
            Who Am I
          </Typography>
          <div className={classes.divider}/>
          <Typography variant='body2' gutterBottom>
            I started off as a freelance vector graphic designer that designed logo, banner, banting and flyer to small business owners.
            At that very moment, I already developed some passion in programming during my university.
            Being a graphic designer only compels me more in trying out webpage design.
            So, I went on to learn Ruby on Rails, then introduced to writing Angular.js.
            After that, one of my campus mate keeps asking me to learn React.js, it was quite awhile before I'm finally convinced to learn React.js.
            I'm a full time software developer now, but I still do a little bit of graphics once in awhile...
          </Typography>
        </div>
        <div className={classes.row}>
          <Typography variant='display1' color='inherit' component='h2'>
            My Projects
          </Typography>
          <div className={classes.divider}/>
          <GridList classes={{root:classes.gridList}} cellHeight={180} cols={screenType === 'xs-phone'? 1:3}>
            {[{
              id: 'materialize',
              base: classes.materializeBase,
              link: '/materialize-clockpicker',
              avatar: 'http://materializecss.com/res/materialize.svg',
              activeColor: classes.materializeActive,
              name: 'Materialize Clockpicker'
            }, {
              id: 'material-ui',
              base: classes.materialUIBase,
              link: '/material-ui-pickers',
              avatar: 'https://material-ui-next.com/static/images/material-ui-logo.svg',
              activeColor: classes.materialUIActive,
              name: 'Material UI Datepicker'
            }, {
              id: 'ai-chan',
              base: classes.aiChanBase,
              href: 'https://ai-chan-chatbot.github.io/',
              avatar: 'https://ai-chan-chatbot.github.io/ai-chan.png',
              activeColor: classes.aiChanActive,
              name: 'Ai Chan Chatbot'
            }].map(tile =>
              <GridListTile classes={{root:classes.gridListTile}} key={tile.id}>
                <ButtonBase classes={{root:[classes.buttonBase, tile.base].join(' ')}} focusRipple
                  onClick={tile.link? () => goToPage(tile.link):undefined}
                  href={tile.href? tile.href:undefined}
                  onMouseOver={() => this.hoverProject(tile.id)} onMouseOut={() => this.hoverProject(undefined)}
                  onTouchStart={() => this.hoverProject(tile.id)} onTouchEnd={() => this.hoverProject(undefined)}
                >
                  <div>
                    <div className={[classes.avatarBackground, tile.activeColor, active === tile.id? classes.avatarBackgroundActive:''].join(' ')}/>
                    <Avatar src={tile.avatar} classes={{
                      root: classes.avatar,
                      img: classes.imageAvatar
                    }}/>
                  </div>
                  <Typography classes={{root:classes.projectName}} variant='subheading'>
                    {tile.name}
                  </Typography>
                </ButtonBase>
              </GridListTile>
            )}
          </GridList>
        </div>
      </div>
    )
  } 
}
interface AboutSectionProps extends React.Props<{}>, StyledComponentProps {
  goToPage: (link:string) => void
}
interface AboutSectionState {
  screenType: 'xl-desktop' | 'lg-desktop' | 'md-desktop' | 'sm-tablet' | 'xs-phone'
  active: string
}

export default AboutSection