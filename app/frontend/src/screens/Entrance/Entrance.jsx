import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import MUIButton from '@material-ui/core/Button';
import {Textfit} from 'react-textfit';
import styled from 'styled-components';

import {updateLogin} from '~/actions/general';
import AuthService from '~/services/auth';

import {Container} from '~/components/common';
import {AnimatePresence, motion} from 'framer-motion';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import {AccountCircle} from '@material-ui/icons';
import {updateCurrentUser} from "~/actions/users";

const EntrancePage = styled(Container)`
  background-color: ${({theme}) => theme.main};
  align-items: center;
  overflow-x: hidden;
`;

const ContentWrapper = styled(Container)`
  width: 100%;
  align-items: center;
  min-height: 520px;
  overflow-x: hidden;
`;

const Moon = styled.div`
  width: 10px;
  height: 10px;
  background-color: white;
  position: absolute;
  bottom: 0;
  transform: translateY(50%);
  border-radius: 50%;
`;

const Ring = styled(motion.div)`
  border: 1px solid white;
  border-radius: 50%;
  opacity: ${({opacity}) => opacity};
  width: ${({size}) => size}px;
  height: ${({size}) => size}px;
  position: absolute;
  display: flex;
  justify-content: center;
  top: -${({size}) => size / 2}px;
  left: -${({size}) => size / 2}px;
`;


const BackGround = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  bottom: 0;
`;

const Wrapper = styled(Container)`
  width: 80%;
  max-width: 600px;
  align-items: center;
  flex: 1;
`;

const ForeGround = styled.div`
  height: 50%;
  width: 100%;
  position: relative;
  align-items: center;
  display: flex;
  flex-direction: column;
`;

const BottomSegment = styled.div`
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

const Content = styled(Container)`
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


const Title = styled(Textfit)`
  width: 100%;
  color: ${({theme}) => theme.main};
  font-weight: 400;
  text-align: center;
  transform: translateY(-50%);
  line-height: 100%;
`;

const Spacer = styled.div`
  flex: ${({enabled = true}) => enabled ? 1 : 0};
  transition: 0.5s flex;
  will-change: flex;
`;

const ConstantSpacer = styled.div`
  flex-shrink: 0;
  height: ${({size}) => size}px;
  will-change: height;
  transition: 0.5s height;
`;

const Controls = styled(Container)`
  width: 100%;
  align-items: center;
  padding: 10px;
  height: 150px;
  justify-content: center;
`;

const Button = styled(MUIButton)`
  color: white;
  background-color: transparent;
  border: 1px solid white;
  border-radius: 10px;
  padding: 10px;
  width: 80%;
`;

const FlatButton = styled(MUIButton)`
  color: white;
  padding: 10px;
  width: 80%;
  background-color: transparent;
  border: 0;
`;

const LoginButton = styled(MUIButton)`
  width: 60px;
  height: 60px;
  background-color: ${({theme, state = 'not-ready'}) => state === 'ready' ? theme.secondary : 'transparent'};
  border: 1px solid ${({theme}) => theme.secondary};
  border-radius: 10px;
  box-sizing: border-box;
`;

const BackButton = styled(FlatButton)`
  color: ${({theme}) => theme.main};
  opacity: 0.5;
`;

const LoginFormWrapper = styled(motion.div)`
  width: 80%;
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: visible;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const BackForm = styled(motion.div)`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;


const INNER_RING_DISTANCE = 75;
const OUTER_RING_DISTANCE = 150;

const Entrance = React.memo(({location, history}) => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.general.login);
  const [size, setSize] = useState(0);
  const containerRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const validInput = useMemo(() => {
    return (
      username.length > 3 &&
      password.length > 3
    );
  }, [username, password]);


  const onSend = useCallback((e) => {
    (async () => {
      await AuthService.login(username, password);
      dispatch(updateLogin(true));
      dispatch(updateCurrentUser(AuthService.getUserId()));
    })();
    e.preventDefault();
  });

  useEffect(() => {
    setSize(containerRef.current.getBoundingClientRect());
    const resizeObserve = new ResizeObserver((entries) => {
      const sizeRect = entries[0].contentRect;
      setSize(Math.min(sizeRect.width, sizeRect.height));
      setInitialized(true);
    });
    resizeObserve.observe(containerRef.current);

    return () => {
      resizeObserve.disconnect();
    };
  }, []);


  useEffect(() => {
    if (isLoggedIn) {
      const {from} = location.state || {from: {pathname: '/'}};
      history.push(from);
    }
  }, [isLoggedIn]);

  return (
    <EntrancePage stretched scrollable>
      <ContentWrapper stretched>
        <Wrapper ref={containerRef}>
          <ForeGround>
            <Spacer enabled={!isOpen}/>
            <Content radius={size} enabled={isOpen} size={size}
              initialized={initialized}>
              <ConstantSpacer size={isOpen ? 50 : 0}/>
              <Title key={size} mode="single" max={42}>Reporter</Title>
              <AnimatePresence>
                {
                  isOpen && (
                    <LoginFormWrapper exit={{opacity: 0}}
                      animate={{opacity: 1}}
                      initial={{opacity: 0}}>
                      <LoginForm id="loginForm" onSubmit={onSend}>
                        <FormControl>
                          <InputLabel
                            htmlFor="username-field">Username</InputLabel>
                          <Input id="username-field"
                            onChange={(event) => setUsername(event.target.value)}
                            endAdornment={
                              <InputAdornment position="end">
                                <AccountCircle/>
                              </InputAdornment>
                            }
                          />
                        </FormControl>
                        <FormControl>
                          <InputLabel
                            htmlFor="password-field">Password</InputLabel>
                          <Input type="password" id="password-field"
                            onChange={(event) => setPassword(event.target.value)}
                            endAdornment={
                              <InputAdornment position="end">
                                <AccountCircle/>
                              </InputAdornment>
                            }
                          />
                        </FormControl>
                      </LoginForm>
                    </LoginFormWrapper>
                  )
                }
              </AnimatePresence>
            </Content>
            <BackGround>
              <Ring size={size + INNER_RING_DISTANCE} opacity={0.3}
                animate={{rotate: 360}}
                transition={{
                  loop: Infinity,
                  ease: 'linear',
                  duration: Math.random() * 5 + 5,
                }}
              >
                <Moon/>
              </Ring>
              <Ring size={size + OUTER_RING_DISTANCE} opacity={0.1}
                animate={{rotate: 360}}
                transition={{
                  loop: Infinity,
                  ease: 'linear',
                  duration: Math.random() * 5 + 5,
                }}
              >
                <Moon/>
              </Ring>
            </BackGround>
          </ForeGround>
          <BottomSegment size={size}>
            <Spacer/>
            <AnimatePresence>
              {
                isOpen && (
                  <BackForm exit={{opacity: 0}} animate={{opacity: 1}}
                    initial={{opacity: 0}}>
                    <BackButton
                      onClick={() => setIsOpen(false)}>back</BackButton>
                  </BackForm>
                )
              }
            </AnimatePresence>
          </BottomSegment>
        </Wrapper>
        <Controls>
          {
            !isOpen ?
              (
                <>
                  <Button onClick={() => setIsOpen(true)}>Sign In</Button>
                  <FlatButton>Sign Up</FlatButton>
                </>
              ) :
              (
                <>
                  <LoginButton
                    disabled={!validInput}
                    type="submit"
                    form="loginForm"
                    state={validInput ? 'ready' : 'not-ready'}
                  >
                    <span>V</span>
                  </LoginButton>
                  <a>Forgot your password?</a>
                </>
              )
          }
        </Controls>
      </ContentWrapper>
    </EntrancePage>
  );
});

export default Entrance;
