import React, {useCallback, useMemo, useState} from 'react';
import styled from 'styled-components';
import {Icon, theme} from '~/components/common';

import {
  // Avatar1, Avatar2, Avatar3, Avatar4, Avatar5, Avatar6, Avatar7, Avatar8,
  Av1, Av2, Av3, Av4, Av5, Av6, Av7, Av8, Av9, Av10, Av11, Av12, Av13, Av14,
  Av15, Av16, Av17, Av18, Av19, Av20, Av21, Av22, Av23, Av24, Av25, Av26, Av27,
  Av28, Av29, Av30, Av31, Av32, Av33, Av34, Av35, Av36, Av37,
} from '~/assets/avatars';


const AvatarContainer = styled.div`
  position: relative;
  display: inline-block;
  opacity: ${({opacity}) => opacity};
`;

const AvatarImage = styled(Icon)`
  width: ${({size = 60}) => size}px;
  height: ${({size = 60}) => size}px;
  position: absolute;
  transform: translateY(0);
  bottom: 0;
  left: -${({size, backgroundSize}) => (backgroundSize > size) ? 0 : Math.round((size - backgroundSize) / 2)}px;
  margin: auto;

  will-change: transform;
  &:not(.avatarManual) {
    transition: transform ${(props) => props.theme.avatarSpeed}s cubic-bezier(0.4, 0, 0.2, 1);
  }
`;

const Background = styled.div`
  width: ${({size = 48}) => size}px;
  height: ${({size = 48}) => size}px;
  margin: ${({size = 48, avatarSize = 50}) => Math.round((avatarSize - size) / 2)}px;
  /* border-radius: 50%; */
  mask-image: radial-gradient(white, black);
  overflow: hidden;
  position: relative;
  top: 0;
  left: 0;
`;

const BackgroundTopHalf = styled(Background)`
  background-color: ${({color = 'white'}) => color};
  border-top-left-radius: 50%;
  border-top-right-radius: 50%;
  bottom: 0;
  left: 0;
  margin: 0;
`;
const BackgroundBottomHalf = styled(Background)`
  /* clip-path: polygon(0 50%, 100% 50%, 100% 100%, 0% 100%); */
  border-bottom-left-radius: 50%;
  border-bottom-right-radius: ${({squared}) => squared ? 0 : '50%'};
  padding-top: ${({size = 48, avatarSize = 50}) => Math.round((avatarSize - size))}px;
`;


const statusColors = {
  here: '#22b573',
  not_here: '#f15a24',
  not_answered: '#a0a0a0',
};


const Status = styled.div`
  position: absolute;
  bottom: 0;
  right: ${({offset = 0}) => offset}px;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background-color: ${({status}) => status ? statusColors[status] : 'transperant'};
`;


export const avatarsAvailable = [
  // Avatar1, Avatar2, Avatar3, Avatar4, Avatar5, Avatar6, Avatar7, Avatar8,
  Av1, Av2, Av3, Av4, Av5, Av6, Av7, Av8, Av9, Av10, Av11, Av12, Av13, Av14,
  Av15, Av16, Av17, Av18, Av19, Av20, Av21, Av22, Av23, Av24, Av25, Av26, Av27,
  Av28, Av29, Av30, Av31, Av32, Av33, Av34, Av35, Av36, Av37,
];

const sized = {
  normal: {
    avatarSize: 52,
    backgroundSize: 48,
    statusOffset: 0,
  },
  small: {
    avatarSize: 42,
    backgroundSize: 38,
    statusOffset: 0,
  },
  smaller: {
    avatarSize: 32,
    backgroundSize: 28,
    statusOffset: 0,
  },
  big: {
    avatarSize: 62,
    backgroundSize: 58,
    statusOffset: 5,
  },
  bigger: {
    avatarSize: 72,
    backgroundSize: 68,
    statusOffset: 7,
  },
};

const JUMPING_AMOUNT = 10;

export const Avatar = (
    {
      type = 'normal', kind = 8, background = 'white', appearing = 100, manual = false,
      opacity = 1, onClick = undefined, innerRef = undefined, status = undefined, jumping = false,
      squared = false, ...props
    },
) => {
  const style = useMemo(() => sized[type], [type]);
  const [isJumping, setIsJumping] = useState(false);

  const handleClick = useCallback(() => {
    if (jumping) {
      setIsJumping(true);
      setTimeout(() => {
        setIsJumping(false);
      }, theme.animationsSpeed * 1000);
    }
  }, [jumping, isJumping, setIsJumping]);

  return (
    <AvatarContainer onClick={onClick} opacity={opacity} {...props}>
      <BackgroundBottomHalf avatarSize={style.avatarSize}
        size={style.backgroundSize} squared={squared}>
        <BackgroundTopHalf size={style.backgroundSize}
          color={background} avatarSize={style.avatarSize}/>
        <AvatarImage src={avatarsAvailable[parseInt(kind ?? 0)]} size={style.avatarSize}
          ref={innerRef}
          backgroundSize={style.backgroundSize}
          className={manual ? 'avatarManual' : 'avatarAutomatic'}
          onClick={handleClick}
          style={{
            transform: `translateY(${isJumping ? (100 - appearing) + JUMPING_AMOUNT : (100 - appearing)}%)`,
          }}/>
      </BackgroundBottomHalf>
      <Status status={status} offset={style.statusOffset}/>
    </AvatarContainer>
  );
};


export default Avatar;
