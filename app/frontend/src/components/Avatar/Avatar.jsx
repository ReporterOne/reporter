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
  position: relative;
`;

const AvatarImage = styled(SVGIcon)`
  width: ${({ size = 60 }) => size}px;
  height: ${({ size = 60 }) => size}px;
  position: absolute;
  will-change: transform;
  transform: translateY(0);
  &:not(.manual) {
    transition: transform 0.3s;
  }
  bottom: 0;
  left: -${({size, backgroundSize}) => (backgroundSize > size)?  0 : Math.round((size - backgroundSize) / 2)}px;
  margin: auto;
`;

const Background = styled.div`
  width: ${({ size = 48 }) => size}px;
  height: ${({ size = 48 }) => size}px;
  margin: ${({ size = 48, avatarSize = 50 }) => Math.round((avatarSize - size) / 2)}px;
  /* border-radius: 50%; */
  mask-image: radial-gradient(white, black);
  overflow: hidden;
  position: relative;
  top: 0;
  left: 0;
`;

// const AvatarImageTopHalf = styled(AvatarImage)`
//   clip-path: polygon(0 0, 100% 0, 100% 50%, 0 50%);
//   position: absolute;
//   top: 0;
//   left: 0;
// `;

// const AvatarImageBottomHalf = styled(AvatarImage)`
//   clip-path: polygon(0 50%, 100% 50%, 100% 100%, 0% 100%);
//   position: absolute;
//   top: -${({ size = 48, avatarSize = 50 }) => Math.round((avatarSize - size) / 2)}px;
//   left: -${({ size = 48, avatarSize = 50 }) => Math.round((avatarSize - size) / 2)}px;
// `;

const BackgroundTopHalf = styled(Background)`
  background-color: ${({ color = 'white' }) => color};
  border-top-left-radius: 50%;
  border-top-right-radius: 50%;
  bottom: 0;
  left: 0;
  margin: 0;
`;
const BackgroundBottomHalf = styled(Background)`
  /* clip-path: polygon(0 50%, 100% 50%, 100% 100%, 0% 100%); */
  border-bottom-left-radius: 50%;
  border-bottom-right-radius: 50%;
  padding-top: ${({ size = 48, avatarSize = 50 }) => Math.round((avatarSize - size))}px;
`;



const avatarsAvailable = [
  Avatar1, Avatar2, Avatar3, Avatar4, Avatar5, Avatar6, Avatar7, Avatar8,
  Av1, Av2, Av3, Av4, Av5, Av6, Av7, Av8, Av9, Av10, Av11, Av12, Av13, Av14,
  Av15, Av16, Av17, Av18, Av19, Av20, Av21, Av22, Av23, Av24, Av25, Av26, Av27,
  Av28, Av29, Av30, Av31, Av32, Av33, Av34, Av35, Av36, Av37,
];

const sized = {
  normal: {
    avatarSize: 52, 
    backgroundSize: 48
  },
  small: {
    avatarSize: 52, 
    backgroundSize: 48
  },
  smaller: {
    avatarSize: 52, 
    backgroundSize: 48
  },
  big: {
    avatarSize: 52, 
    backgroundSize: 48
  },
  bigger: {
    avatarSize: 52, 
    backgroundSize: 48
  }
};
export const Avatar = ({ type = 'normal', kind = 8, background = 'white', appearing = 50, ...props }) => {
  const style = useMemo(() => sized[type], [type]);

  return (
    <AvatarContainer>
      <BackgroundBottomHalf avatarSize={style.avatarSize} size={style.backgroundSize}>
        <BackgroundTopHalf size={style.backgroundSize} avatarSize={style.avatarSize}/>
        <AvatarImage src={avatarsAvailable[kind]} size={style.avatarSize}
          backgroundSize={style.backgroundSize}
          style={{
            transform: `translateY(${(100 - appearing)}%)`,
          }} />
      </BackgroundBottomHalf>
    </AvatarContainer>
  );
}

Avatar.propTypes = {
  type: PropTypes.number,
};


export default Avatar;
