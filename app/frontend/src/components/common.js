import styled from 'styled-components';
import { createGlobalStyle } from 'styled-components';
import Rubik from '~/assets/fonts/Rubik/Rubik-Black.ttf';
import IconButton from '@material-ui/core/IconButton';


const theme = {
  main: "#4725a5",
  cards: "white"
}

const GlobalStyle = createGlobalStyle`
    @font-face {
      font-family: 'Rubik', sans-serif;
      src: url(${Rubik}) format("truetype");
      font-weight: normal;
      font-style: normal;
    }
    @import url('https://fonts.googleapis.com/css?family=Assistant&display=swap');
    html, body, #root {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        display: flex;
        flex: 1;
        font-family: 'Assistant', sans-serif;
        overflow-x: hidden;
    }
`;

const Icon = styled.img`
  width: 25px;
  height: 25px;
`;

const Container = styled.div`
  position: relative;
  display: ${props => (props.block ? 'block' : 'flex')};
  flex: ${props => (props.flex || (props.stretched ? 1 : 0))};
  flex-direction: ${props => (props.row ? 'row' : 'column')};
  background-color: ${props => props.background || 'transparent'};
`;

const shadows = [
  undefined,
  "0 0px 3px rgba(0,0,0,0.12), 0 0px 2px rgba(0,0,0,0.24)",
  "0 0px 6px rgba(0,0,0,0.16), 0 0px 6px rgba(0,0,0,0.23)",
  "0 0px 20px rgba(0,0,0,0.19), 0 0px 6px rgba(0,0,0,0.23)",
  "0 0px 28px rgba(0,0,0,0.25), 0 0px 10px rgba(0,0,0,0.22)",
  "0 0px 38px rgba(0,0,0,0.30), 0 0px 12px rgba(0,0,0,0.22)"
];

const DEFAULT_RADIUS = 30;

const RoundedContainer = styled(Container)`
  border-top-left-radius: ${props => props.radius || DEFAULT_RADIUS}px;
  border-top-right-radius: ${props => props.radius || DEFAULT_RADIUS}px;
  padding: ${props => props.padding || '20px 15px'};
  box-shadow: ${props => { const i = props.shadow || 1; return shadows[i]; }}  
`;


export {GlobalStyle, Container, RoundedContainer, theme, Icon, shadows};
