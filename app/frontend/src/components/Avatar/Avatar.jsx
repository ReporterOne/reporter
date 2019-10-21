import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Avatar1 from '~/assets/avatars/avatar1.svg';


const AvatarContainer = styled.div`
  width: ${({size=60}) => size}px;
  height: ${({size=60}) => size}px;
  position: relative;
`;

const AvatarImage = styled.img`
  width: ${({size=60}) => size}px;
  height: ${({size=60}) => size}px;
  position: relative;
`;

const Background = styled.div`
  width: ${({size=48}) => size}px;
  height: ${({size=48}) => size}px;
  margin: ${({spacing=6}) => spacing}px;
  border-radius: 50%;
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
  top: -${({spacing=6}) => spacing}px;
  left: -${({spacing=6}) => spacing}px;
`;


const avatarsAvailable = [
  Avatar1
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
export const Avatar = ({ type = 'normal', kind = 0, ...props }) => {
  const style = useMemo(() => sized[type], [type]);

  return (
    <AvatarContainer size={style.size}>
      <Background size={style.backgroundSize} spacing={style.spacing}>
        <AvatarImageBottomHalf src={avatarsAvailable[kind]} spacing={style.spacing} size={style.size}/>
      </Background>
      <AvatarImageTopHalf src={avatarsAvailable[kind]} size={style.size}/>
    </AvatarContainer>
  );
}

Avatar.propTypes = {
  type: PropTypes.number,
};


export default Avatar;