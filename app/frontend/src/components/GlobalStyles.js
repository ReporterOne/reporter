import { createGlobalStyle } from 'styled-components';
import Rubik from '../assets/fonts/Rubik/Rubik-Black.ttf';

const GlobalStyle = createGlobalStyle`
    @font-face {
      font-family: 'Rubik', sans-serif;
      src: url('../assets/fonts/Rubik/Rubik-Black.ttf') format("opentype");
      font-weight: normal;
      font-style: normal;
    }
    html,body {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        font-family: 'Open Sans', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
    }
    #root {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
    }

    
`;
export default GlobalStyle;