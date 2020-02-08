import {theme} from "~/components/common";
import React from "react";
import styled from "styled-components";
import {Textfit} from "react-textfit";
import {motion} from "framer-motion";
import SVG from "react-inlinesvg";
import oIconUrl from "./reporters_O.svg";

const StyledTitle = styled(Textfit)`
  width: 100%;
  color: ${({color}) => color};
  font-weight: 400;
  text-align: center;
  line-height: 100%;
  margin: ${({spacing}) => spacing};
`;

const TitleO = styled(motion.div)`
  display: inline-block;
  width: 22px;
  height: 22px;
  position: relative;
`;
export const TitleIcon = styled(SVG)`
  width: 22px;
  height: 22px;
  position: absolute;
  top: 0;
  left: 0;
  fill: ${({color}) => color};
`;


export const Title = ({size, color, style, spacing}) => {
  return (
    <StyledTitle key={size} mode="single" max={42} color={color} style={style} spacing={spacing}>
      Rep
      <TitleO
        animate={{rotate: 360}}
        // style={{ originX: 0.5, originY: 0.5 }}
        transition={{
          loop: Infinity,
          ease: 'linear',
          duration: 20,
        }}
      >
        <TitleIcon src={oIconUrl} color={color}/>
      </TitleO>
      rter
    </StyledTitle>
  )
};

export default Title;