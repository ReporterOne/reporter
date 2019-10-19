import React, {Fragment} from 'react';

import Calendar from './components/Calendar/Calendar.jsx';
import styled from 'styled-components';
import GlobalStyle from './components/GlobalStyles.js';

const App = (props) => {
    const MainDiv = styled.div`
    background: red;
    flex: 2;
    display: flex;
    `;

    const Div = styled.div`
    display: flex;
    flex:1;
    flex-grow:1;
    `;
    return (
        <> 
            <GlobalStyle />   
                <Div>
                    <Calendar />
                </Div>
        </>
    );
}

export default App;
