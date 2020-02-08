import React from "react";
import styled from "styled-components";
import {motion} from "framer-motion";
import {Container, SVGIcon, Spacer} from "~/components/common";
import {Textfit} from "react-textfit";
import MUIButton from "@material-ui/core/Button";

export const BackForm = styled(motion.div)`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
export const EntrancePage = styled(Container)`
  background-color: ${({theme}) => theme.main};
  align-items: center;
  overflow-x: hidden;
`;
export const ContentWrapper = styled(Container)`
  width: 100%;
  align-items: center;
  min-height: 520px;
  overflow: hidden;
`;
export const Wrapper = styled(Container)`
  width: 80%;
  max-width: 600px;
  align-items: center;
  flex: 1;
`;
export const ForeGround = styled.div`
  height: 50%;
  width: 100%;
  position: relative;
  align-items: center;
  display: flex;
  flex-direction: column;
`;
export const BottomSegment = styled.div`
  display: flex;
  flex-direction: column;
  width: ${({size}) => size}px;
  height: ${({size}) => size / 2}px;
  background-color: white;
  transform: translateY(-1px);
  border-bottom-left-radius: ${({size}) => size}px;
  border-bottom-right-radius: ${({size}) => size}px;
  align-items: center;
  overflow: hidden;
`;
export const Content = styled(Container)`
  background-color: white;
  width: ${({size}) => size}px;
  z-index: 1;
  align-items: center;
  padding-top: ${({size, enabled}) => enabled ? 0 : size * 0.5}px;
  border-top-left-radius: ${({radius, enabled}) => enabled ? 0 : radius}px;
  border-top-right-radius: ${({radius, enabled}) => enabled ? 0 : radius}px;
  will-change: border-top-right-radius, border-top-left-radius, flex, padding-top, min-height;
  transition: ${
  ({initialized}) => initialized ?
    '0.5s border-top-right-radius, 0.5s border-top-left-radius, 0.5s flex, 0.5s padding-top, 0.5s min-height' :
    'none'
};
  flex: ${({enabled}) => enabled ? 1 : 0};
`;
export const ConstantSpacer = styled.div`
  flex-shrink: 0;
  height: ${({size}) => size}px;
  will-change: height;
  transition: 0.5s height;
`;
export const Controls = styled(Container)`
  width: 100%;
  align-items: center;
  padding: 10px;
  height: 150px;
  justify-content: center;
`;
export const Button = styled(MUIButton)`
  color: white;
  background-color: transparent;
  border: 1px solid white;
  border-radius: 10px;
  padding: 10px;
  width: 80%;
`;
export const IconButton = styled(({size, spacing, ...props}) => <MUIButton {...props}/>)`
  width: ${({size}) => size}px;
  height: ${({size}) => size}px;
  padding: 0;
  min-height: 0;
  min-width: 0;
  margin: ${({spacing}) => spacing};
`;
export const FlatButton = styled(MUIButton)`
  color: white;
  padding: 10px;
  width: 80%;
  background-color: transparent;
  border: 0;
`;
export const LoginButton = styled(MUIButton)`
  width: 60px;
  height: 60px;
  background-color: ${({theme, state = 'not-ready'}) => state === 'ready' ? theme.secondary : 'transparent'};
  border: 1px solid ${({theme}) => theme.secondary};
  border-radius: 10px;
  box-sizing: border-box;
`;
export const BackButton = styled(({color, ...props}) => <FlatButton {...props}/>)`
  color: ${({color}) => color};
  font-weight: bold;
  //opacity: 0.5;
`;
export const FormWrapper = styled(motion.div)`
  width: 80%;
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: visible;
`;
export const StyledForm = styled(motion.form)`
  width: 80%;
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: visible;
  //display: flex;
  //flex-direction: column;
  align-items: center;
  min-height: 0;
`;

export const StyledIcon = styled(SVGIcon)`
  width: 20px;
  height: 20px;
`;

export const ExternalLogin = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
`;