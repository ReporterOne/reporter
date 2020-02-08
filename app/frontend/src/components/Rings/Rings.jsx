import React from "react";
import styled from "styled-components";
import {motion} from "framer-motion";

export const Moon = styled.div`
  width: ${({size}) => size}px;
  height: ${({size}) => size}px;
  background-color: white;
  position: absolute;
  bottom: 0;
  transform: translateY(50%);
  border-radius: 50%;
`;
export const Ring = styled(motion.div)`
  border: 1px solid white;
  border-radius: 50%;
  opacity: ${({opacity}) => opacity};
  width: ${({size}) => size}px;
  height: ${({size}) => size}px;
  position: absolute;
  display: flex;
  justify-content: center;
`;
export const BackGround = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: ${({hideOver}) => hideOver}px;
  height: ${({hideOver}) => hideOver}px;
  overflow: hidden;
`;

export const Rings = ({size, innerRingDistance, outerRingDistance, style, moonSize=10}) => {
  return (
  <BackGround style={style} hideOver={size + outerRingDistance + moonSize}>
    <Ring size={size + innerRingDistance} opacity={0.3}
          animate={{rotate: 360}}
          transition={{
            loop: Infinity,
            ease: 'linear',
            duration: Math.random() * 5 + 5,
          }}
    >
      <Moon size={moonSize}/>
    </Ring>
    <Ring size={size + outerRingDistance} opacity={0.1}
          animate={{rotate: 360}}
          transition={{
            loop: Infinity,
            ease: 'linear',
            duration: Math.random() * 5 + 5,
          }}
    >
      <Moon size={moonSize}/>
    </Ring>
  </BackGround>
  )
};

export default Rings;