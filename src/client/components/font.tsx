import * as React from 'react'
import * as ReactDOM from 'react-dom'

import * as SegoeMonoTTF from '../../asset/font/segoe-mono.ttf'

const getFontType = (link:string) => {
  switch(link.substring(link.lastIndexOf('.') + 1)) {
  case 'ttf':
    return 'truetype'
  }
}
const fontSrc = (...links:string[]) => links.map(link => 'url("' + link + '") format("' + getFontType(link) + '")').join(',')

class FontStyleComponent extends React.Component<FontStyleComponentProps, FontStyleComponentState> {
  render() {
    return ReactDOM.createPortal(
      <style>{[{
        size: 400,
        src: [SegoeMonoTTF]
      }].map(font => `
        @font-face {
          font-family: Segoe Mono;
          font-weight: ${font.size};
          src: ${fontSrc(...font.src)};
        }
      `)}</style>,
      document.querySelector('head')
    )
  }
}
interface FontStyleComponentProps extends React.Props<{}> {
}
interface FontStyleComponentState {
}

export default FontStyleComponent