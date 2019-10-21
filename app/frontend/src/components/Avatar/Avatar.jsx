import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { SVGIcon } from '~/components/common';

import {
  Avatar1, Avatar2, Avatar3, Avatar4, Avatar5, Avatar6, Avatar7, Avatar8,
  Av1, Av2, Av3, Av4, Av5, Av6, Av7, Av8, Av9, Av10, Av11, Av12, Av13, Av14,
  Av15, Av16, Av17, Av18, Av19, Av20, Av21, Av22, Av23, Av24, Av25, Av26, Av27,
  Av28, Av29, Av30, Av31, Av32, Av33, Av34, Av35, Av36, Av37,
} from '~/assets/avatars';


const AvatarContainer = styled.div`
  width: ${({ size = 60 }) => size}px;
  height: ${({ size = 60 }) => size}px;
  position: relative;
`;

const AvatarImage = styled(SVGIcon)`
  width: ${({ size = 60 }) => size}px;
  height: ${({ size = 60 }) => size}px;
  position: relative;
  will-change: transform;
  transform: translateY(0);
  &:not(.manual) {
    transition: transform 0.3s;
  }
`;

const Background = styled.div`
  width: ${({ size = 48 }) => size}px;
  height: ${({ size = 48 }) => size}px;
  margin: ${({ spacing = 6 }) => spacing}px;
  border-radius: 50%;
  mask-image: radial-gradient(white, black);
  background-color: ${({ color = 'white' }) => color};
  overflow: hidden;
  position: relative;
  top: 0;
  left: 0;
`;

const AvatarImageTopHalf = styled(AvatarImage)`
  clip-path: polygon(0 0, 100% 0, 100% 50%, 0 50%);
  position: absolute;
  top: 0;
  left: 0;
`;

const AvatarImageBottomHalf = styled(AvatarImage)`
  clip-path: polygon(0 50%, 100% 50%, 100% 100%, 0% 100%);
  position: absolute;
  top: -${({ spacing = 6 }) => spacing}px;
  left: -${({ spacing = 6 }) => spacing}px;
`;


const avatarsAvailable = [
  Avatar1, Avatar2, Avatar3, Avatar4, Avatar5, Avatar6, Avatar7, Avatar8,
  Av1, Av2, Av3, Av4, Av5, Av6, Av7, Av8, Av9, Av10, Av11, Av12, Av13, Av14,
  Av15, Av16, Av17, Av18, Av19, Av20, Av21, Av22, Av23, Av24, Av25, Av26, Av27,
  Av28, Av29, Av30, Av31, Av32, Av33, Av34, Av35, Av36, Av37,
];

const sized = {
  normal: {
    spacing: 6,
    size: 60,
    backgroundSize: 48
  },
  small: {
    spacing: 5,
    size: 50,
    backgroundSize: 40
  },
  smaller: {
    spacing: 4,
    size: 40,
    backgroundSize: 32
  },
  big: {
    spacing: 7,
    size: 70,
    backgroundSize: 56
  },
  bigger: {
    spacing: 8,
    size: 80,
    backgroundSize: 64
  }
};
export const Avatar = ({ type = 'normal', kind = 8, background = 'white', appearing = 50, ...props }) => {
  const style = useMemo(() => sized[type], [type]);

  return (
    <AvatarContainer size={style.size}>
      {
        appearing < 70 ?
          <Background size={style.backgroundSize} spacing={style.spacing} color={background}>
            <AvatarImage src={avatarsAvailable[kind]} size={style.size}
              style={{
                transform: `translateY(${(100 - appearing)}%)`,
                position: 'absolute', 
                top: `-${style.spacing}px`, 
                left: `-${style.spacing}px`
              }} />
          </Background>
          : (
            <>
              <Background size={style.backgroundSize} spacing={style.spacing} color={background}>
                <AvatarImageBottomHalf src={avatarsAvailable[kind]} spacing={style.spacing} size={style.size} style={{ transform: `translateY(${(100 - appearing)}%)` }} />
              </Background>
              <AvatarImageTopHalf src={avatarsAvailable[kind]} size={style.size} style={{ transform: `translateY(${(100 - appearing)}%)` }} />
            </>
          )
      }
    </AvatarContainer>
  );
}

Avatar.propTypes = {
  type: PropTypes.number,
};


export default Avatar;
