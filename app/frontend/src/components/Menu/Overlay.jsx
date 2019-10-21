import React from 'react';
import PropTypes from 'prop-types'

import styled from 'styled-components';
import { Container } from '~/components/common';
import { Swipeable } from 'react-swipeable';


const OverlayFiller = styled(Container)`
  position: absolute;
  width: 100vw;
  height: 100vh;
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  opacity: ${props => props.isOpen ? 0.5 : 0};
  transition: visibility ${props => props.theme.drawerSpeed}s, 
              opacity ${props => props.theme.drawerSpeed}s;
  will-change: opacity, visibility;
  z-index: 100;
  background: white;
`;


export const Overlay = ({innerRef, onSwipedLeft, onSwiping, ...props}) => {
  return (
    <Swipeable onSwiping={onSwiping} onSwipedLeft={onSwipedLeft}>
      <OverlayFiller ref={innerRef} {...props} onClick={props.onClick}></OverlayFiller>
    </Swipeable>
  )
}


Overlay.propTypes = {
  isOpen: PropTypes.bool,
  onClick: PropTypes.func,
  onSwiping: PropTypes.func,
  onSwipedLeft: PropTypes.func,
}


export default Overlay;