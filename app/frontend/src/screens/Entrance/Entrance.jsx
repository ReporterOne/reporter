import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import styled from 'styled-components';
import {AnimatePresence, motion} from 'framer-motion';
import {Switch, Route} from 'react-router-dom';

import {useDispatch, useSelector} from 'react-redux';
import {theme} from "~/components/common";
import {Title} from "~/components/Title/Title";
import {Rings} from "~/components/Rings/Rings.jsx";

import {
  BackButton,
  BackForm,
  BottomSegment,
  ConstantSpacer,
  Content,
  ContentWrapper,
  Controls,
  EntrancePage,
  ForeGround,
  Spacer,
  Wrapper
} from "./Entrance.style.jsx";
import {LoginForm, RegisterForm} from "./Forms";
import {
  LoginControls,
  NormalControls,
  RegisterControls
} from "./Controls";
import {LOGIN_ROUTE, MAIN_ROUTE, REGISTER_ROUTE} from "./consts";


const INNER_RING_DISTANCE = 75;
const OUTER_RING_DISTANCE = 150;


const RegisterWrapper = styled.div`
  margin: auto;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const RegisterPage = ({size, history, pathname, setValid}) => {
  return (
    <RegisterWrapper>
      <Title size={size} color={theme.white} spacing="10px"/>
      <RegisterForm history={history} pathname={pathname} setValid={setValid}/>
    </RegisterWrapper>
  );
};

const MainCircle = ({size, setValid, pathname, history}) => {
  const initialized = useMemo(() => size && true, [size]);
  const isOpen = useMemo(() => pathname !== MAIN_ROUTE, [pathname]);
  return (
    <>
      <ForeGround>
        <Spacer enabled={!isOpen}/>
        <Content radius={size} enabled={isOpen} size={size}
                 initialized={initialized}>
          <ConstantSpacer size={isOpen ? 50 : 0}/>
          <Title size={size} color={theme.main}
                 style={{transform: "translateY(-50%)"}}/>
          <AnimatePresence>
            {
              isOpen && (<LoginForm setValid={setValid}/>)
            }
          </AnimatePresence>
        </Content>
        <Rings size={size} innerRingDistance={INNER_RING_DISTANCE}
               outerRingDistance={OUTER_RING_DISTANCE}
               style={{bottom: 0, transform: "translateY(50%)"}}/>
      </ForeGround>
      <BottomSegment size={size}>
        <Spacer/>
        <AnimatePresence>
          {
            isOpen && (
              <BackForm exit={{opacity: 0}} animate={{opacity: 1}}
                        initial={{opacity: 0}}>
                <BackButton
                  color={theme.main}
                  onClick={() => history.push(MAIN_ROUTE)}>back</BackButton>
              </BackForm>
            )
          }
        </AnimatePresence>
      </BottomSegment>
    </>
  )
};


const ContentDiv = styled(motion.div)`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  align-items: center;
`;

const ControlsWrapper = styled(motion.div)`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
`;

const getPoseKey = (location) => {
  if (location === MAIN_ROUTE || location === LOGIN_ROUTE) return 0;
  return 1;
};

const Entrance = React.memo(({location, history}) => {
  const isLoggedIn = useSelector((state) => state.general.login);
  const [size, setSize] = useState(0);
  const containerRef = useRef(null);
  const [validInput, setValidInput] = useState(false);

  useEffect(() => {
    setValidInput(false);
  }, [location.pathname]);


  useEffect(() => {
    setSize(containerRef.current.getBoundingClientRect());
    const resizeObserve = new ResizeObserver((entries) => {
      const sizeRect = entries[0].contentRect;
      setSize(Math.min(sizeRect.width, sizeRect.height));
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
          <AnimatePresence>
            <ContentDiv
              key={getPoseKey(location.pathname)}
              exit={{opacity: 0}}
              animate={{opacity: 1}}
              initial={{opacity: 0}}
              style={{position: 'absolute'}}
            >
              <Switch location={location}>
                <Route path={REGISTER_ROUTE}>
                  <RegisterPage
                    size={size}
                    pathname={location.pathname}
                    setValid={setValidInput}
                    history={history}
                  />
                </Route>
                <Route path={MAIN_ROUTE}>
                  <MainCircle
                    size={size}
                    setValid={setValidInput}
                    pathname={location.pathname}
                    history={history}
                  />
                </Route>
              </Switch>
            </ContentDiv>
          </AnimatePresence>
        </Wrapper>
        <Controls>
          <AnimatePresence>
            <ControlsWrapper
              key={location.pathname}
              exit={{opacity: 0}}
              animate={{opacity: 1}}
              initial={{opacity: 0}}
              style={{position: 'absolute'}}
            >
              <Switch location={location}>
                <Route path={REGISTER_ROUTE}>
                  <RegisterControls validInput={validInput} history={history}/>
                </Route>
                <Route path={LOGIN_ROUTE}>
                  <LoginControls validInput={validInput} history={history}/>
                </Route>
                <Route path={MAIN_ROUTE}>
                  <NormalControls history={history}/>
                </Route>
              </Switch>
            </ControlsWrapper>
          </AnimatePresence>
        </Controls>
      </ContentWrapper>
    </EntrancePage>
  );
});

export default Entrance;
