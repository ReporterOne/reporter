import {Button, FlatButton, IconButton} from "@/Entrance/Entrance.style";
import React from "react";
import {Rings} from "~/components/Rings/Rings";
import {AnimatePresence, motion} from "framer-motion";
import {SVGIcon, theme} from "~/components/common";
import goodCVIconUrl from "@/Entrance/assets/success_v_round.svg";
import badCVIconUrl from "@/Entrance/assets/no_success_v_round.svg";
import goodVIconUrl from "@/Entrance/assets/success_v_squere.svg";
import badVIconUrl from "@/Entrance/assets/no_success_v_squere.svg";
import styled from "styled-components";
import {LOGIN_ROUTE, REGISTER_ROUTE} from "@/Entrance/consts";

export const LoginControls = ({validInput, size = 100}) => {
  return (
    <>
      <IconButton type="submit" form="loginForm" size={size}
                  disabled={!validInput}>
        <AnimatePresence>
          <motion.div key={validInput}
                      exit={{opacity: 0}}
                      animate={{opacity: 1}}
                      initial={{opacity: 0}}
                      style={{position: 'absolute', top: 0, left: 0}}
          >
            <SVGIcon size={size}
                     src={validInput ? goodVIconUrl : badVIconUrl}
                     color={theme.white}/>
          </motion.div>
        </AnimatePresence>
      </IconButton>
      <a>Forgot your password?</a>
    </>
  );
};
export const NormalControls = ({history}) => {
  return (
    <>
      <Button onClick={() => history.push(LOGIN_ROUTE)}>Sign In</Button>
      <FlatButton onClick={() => history.push(REGISTER_ROUTE)}>Sign Up</FlatButton>
    </>
  )
};
const ControlsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
`;
export const RegisterControls = ({validInput, size = 100, innerRingDistance = 20, outerRingDistance = 55}) => {
  return (
    <ControlsContainer>
      <Rings size={size + 10} innerRingDistance={innerRingDistance}
             outerRingDistance={outerRingDistance}/>
      <IconButton type="submit" form="registerForm" size={size}
                  disabled={!validInput}>
        <AnimatePresence>
          <motion.div key={validInput}
                      exit={{opacity: 0}}
                      animate={{opacity: 1}}
                      initial={{opacity: 0}}
                      style={{position: 'absolute', top: 0, left: 0}}
          >
            <SVGIcon size={size}
                     src={validInput ? goodCVIconUrl : badCVIconUrl}
                     color={theme.white}/>
          </motion.div>
        </AnimatePresence>
      </IconButton>
    </ControlsContainer>
  );
};