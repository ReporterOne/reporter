import React, {Fragment} from 'react';

import Calendar from './components/Calendar/Calendar.jsx';
import styled from 'styled-components';
import GlobalStyle from './components/GlobalStyles.js';

const App = (props) => {

    const Div = styled.div`
    display: flex;
    flex:1;
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
