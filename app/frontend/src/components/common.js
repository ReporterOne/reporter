import React from 'react';
import styled from 'styled-components';
import {createGlobalStyle, css} from 'styled-components';
import {Rubik} from '~/assets/fonts/';
import IconButton from '@material-ui/core/IconButton';
import SVG from 'react-inlinesvg';

import posed, {PoseGroup} from 'react-pose';

export const GlobalStyle = createGlobalStyle`
    @font-face {
      font-family: 'Rubik', sans-serif;
      src: url(${Rubik}) format("truetype");
      font-weight: normal;
      font-style: normal;
    }
    @import url('https://fonts.googleapis.com/css?family=Assistant:200,300,400,600,700,800&display=swap&subset=hebrew');
    html, body, #root {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        display: flex;
        flex: 1;
        font-family: 'Assistant', sans-serif;
        overflow: hidden;
    }
`;

export const Icon = styled.img`
  width: 30px;
  height: 30px;
`;

export const SVGIcon = styled(SVG)`
  width: ${({size = 30}) => size}px;
  height: ${({size = 30}) => size}px;
  margin: auto;
`;

export const StyledIconButton = styled(IconButton)`
`;

export const Container = styled.div`
  position: relative;
  overflow-y: ${({scrollable}) => scrollable ? 'auto' : 'visible'};
  display: ${(props) => (props.block ? 'block' : 'flex')};
  flex: ${(props) => (props.flex || (props.stretched ? '1 1 0' : '0 0 auto'))};
  flex-direction: ${(props) => (props.row ? 'row' : 'column')};
  background-color: ${(props) => props.background || 'transparent'};
  min-width: 0;
  min-height: 0;
`;

export const CenteredContainer = styled(Container)`
  margin: auto;
`;

export const innerShaddow = [
  undefined,
  css`box-shadow: inset 0 0px 3px rgba(0,0,0,0.12),
                  inset  0 0px 2px rgba(0,0,0,0.24);`,
  css`box-shadow: inset 0 0px 6px rgba(0,0,0,0.16),
                  inset  0 0px 6px rgba(0,0,0,0.23);`,
  css`box-shadow: inset 0 0px 20px rgba(0,0,0,0.19),
                  inset  0 0px 6px rgba(0,0,0,0.23);`,
  css`box-shadow: inset 0 0px 28px rgba(0,0,0,0.25),
                  inset  0 0px 10px rgba(0,0,0,0.22);`,
  css`box-shadow: inset 0 0px 38px rgba(0,0,0,0.30),
                  inset  0 0px 12px rgba(0,0,0,0.22);`,
];


export const shadows = [
  undefined,
  css`box-shadow: 0 0px 3px rgba(0,0,0,0.12), 0 0px 2px rgba(0,0,0,0.24);`,
  css`box-shadow: 0 0px 6px rgba(0,0,0,0.16), 0 0px 6px rgba(0,0,0,0.23);`,
  css`box-shadow: 0 0px 20px rgba(0,0,0,0.19), 0 0px 6px rgba(0,0,0,0.23);`,
  css`box-shadow: 0 0px 28px rgba(0,0,0,0.25), 0 0px 10px rgba(0,0,0,0.22);`,
  css`box-shadow: 0 0px 38px rgba(0,0,0,0.30), 0 0px 12px rgba(0,0,0,0.22);`,
];

export const DEFAULT_RADIUS = 30;

export const RoundedContainer = styled(Container)`
  border-top-left-radius: ${(props) => props.radius || DEFAULT_RADIUS}px;
  border-top-right-radius: ${(props) => props.radius || DEFAULT_RADIUS}px;
  padding: ${(props) => props.padding || '20px 15px'};
  ${(props) => {
    const i = props.shadow || 1;
    return shadows[i];
  }}
`;

const PosedFadedContainer = posed(Container)({
  enter: {opacity: 1, delay: 100, beforeChildren: true},
  exit: {opacity: 0},
});

export const FadeInContainer = ({poseKey, ...props}) => (
  <PoseGroup>
    <PosedFadedContainer key={poseKey} {...props} />
  </PoseGroup>
);


export const theme = {
  cards: 'white',
  palette: {
    primary: {
      main: '#4725a5',
    },
    secondary: {
      main: '#FFF',
    },
  },
  main: '#4725a5',
  secondary: '#FFF',
  outerShadows: shadows,
  innerShadows: innerShaddow,
  buttons: {
    normal: '#888888',
    selected: '#633ad6',
  },
  drawer: '#353535',
  approved: '#22B573',
  notApproved: '#F15A24',
  grey: 'rgb(120, 120, 120)',
  lightgray: 'rgb(200, 200, 200)',
  white: 'rgb(255, 255, 255)',
  black: '#000',
  drawerSpeed: 0.3,
  handleSpeed: 0.3,
  avatarSpeed: 0.3,
  animationsSpeed: 0.4,
};
