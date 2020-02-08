import React, {useCallback, useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import AuthService from "~/services/auth";
import {updateLogin} from "~/actions/general";
import {updateCurrentUser} from "~/actions/users";
import GoogleLogin from "react-google-login";
import {SVGIcon, theme} from "~/components/common";
import FacebookLogin
  from "react-facebook-login/dist/facebook-login-render-props";
import styled from "styled-components";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import InputAdornment from "@material-ui/core/InputAdornment";

import {
  BackButton,
  ExternalLogin,
  IconButton,
  StyledForm,
  StyledIcon
} from "./Entrance.style";

import userIconUrl from "./assets/user_icon.svg";
import emailIconUrl from "./assets/email_icon.svg";
import passwordIconUrl from "./assets/password_icon.svg";
import googleFullIconUrl from "./assets/google_full.svg";
import facebookFullIconUrl from "./assets/facebook_full.svg";
import googleIconUrl from "./assets/google_not_full.svg";
import facebookIconUrl from "./assets/facebook_not_full.svg";
import {LOGIN_ROUTE, MAIN_ROUTE} from "@/Entrance/consts";
import Avatar, {avatarsAvailable} from "~/components/Avatar/Avatar";

const GOOGLE_CLIENT_ID = '623244279739-lrqk7n917mpnuqbmnkgbv8l4o73tjiek.apps.googleusercontent.com';
const FACEBOOK_APP_ID = "861853434255614";


const StyledFormControl = styled(({overrideColor, ...props}) =>
  <FormControl {...props}/>)`
  margin: 5px;
  
  @-webkit-keyframes autofill {
    0%,100% {
        color: #666;
        background: transparent;
    }
}

  && label.MuiInputLabel-root {
    color: ${({labelColor}) => labelColor};
  }
  && label.MuiInputLabel-root {
    color: ${({overrideColor}) => overrideColor};
  }
  && .MuiInput-underline:after, && .MuiInput-underline:before {
    border-bottom-color: ${({overrideColor}) => overrideColor};
  }
  && .MuiInputBase-input {
    color: ${({overrideColor}) => overrideColor};
  }
`;
const InputField = ({label, field, setField, icon, color = "primary", blurColor = "grey", overrideColor = undefined, ...props}) => {
  const [_blurColor, setBlurColor] = useState(blurColor);

  const onFocus = () => {
    setBlurColor(color);
  };

  const onBlur = () => {
    setBlurColor(blurColor);
  };

  return (
    <StyledFormControl color={color} overrideColor={overrideColor}>
      <InputLabel htmlFor={`${label}-field`}>{label}</InputLabel>
      <Input id={`${label}-field`}
             value={field}
             onChange={(event) => setField(event.target.value)}
             onFocus={onFocus} onBlur={onBlur}
             endAdornment={
               <InputAdornment position="end">
                 <StyledIcon src={icon} color={theme[_blurColor]}
                             isCentered={false}/>
               </InputAdornment>
             } {...props}
      />
    </StyledFormControl>
  )
};


const RegisterStageOneForm = ({username, password, setUsername, setPassword, googleSuccess, googleFailed, facebookSuccess, facebookFailed}) => {
  return (
    <>
      <InputField label="Username" icon={userIconUrl}
                  color="secondary"
                  overrideColor="white"
                  blurColor="white"
                  field={username}
                  setField={setUsername}/>
      <InputField label="Password" type="password" icon={passwordIconUrl}
                  color="secondary"
                  overrideColor="white"
                  blurColor="white"
                  field={password}
                  setField={setPassword}/>
      <ExternalLogin>
        <GoogleLogin
          clientId={GOOGLE_CLIENT_ID}
          render={(renderProps) => (
            <IconButton onClick={renderProps.onClick} spacing="5px">
              <SVGIcon size={60} src={googleFullIconUrl}
                       color={theme.white}/>
            </IconButton>
          )}
          buttonText="Login"
          onSuccess={googleSuccess}
          onFailure={googleFailed}
          cookiePolicy={'single_host_origin'}
        />
        <FacebookLogin
          appId={FACEBOOK_APP_ID}
          fields="name,email,picture"
          redirectUri={window.location.href.split('?')[0]}
          render={renderProps => (
            <IconButton onClick={renderProps.onClick} spacing="5px">
              <SVGIcon size={60} src={facebookFullIconUrl}
                       color={theme.white}/>
            </IconButton>
          )}
          callback={facebookSuccess}
        />
      </ExternalLogin>
    </>

  );
};


const RegisterStageTwoForm = ({name, email, setName, setEmail}) => {
  return (
    <>
      <InputField label="Display Name" icon={userIconUrl}
                  color="secondary"
                  overrideColor="white"
                  blurColor="white"
                  field={name}
                  setField={setName}/>
      <InputField label="Email Address" icon={emailIconUrl}
                  color="secondary"
                  overrideColor="white"
                  blurColor="white"
                  field={email}
                  setField={setEmail}/>
    </>
  );
};

const AvatarChoose = styled.div`
  flex: 1;
  overflow: scroll;
  display: grid; 
  width: 100%;
  grid-template-columns: repeat(auto-fill, 60px); 
  justify-content: space-between; 
`;

const RegisterStageThreeForm = ({avatar, setAvatar}) => {
  return (
    <AvatarChoose>
      {
        avatarsAvailable.map((_, index) =>
          <Avatar onClick={() => setAvatar(String(index))}
                  opacity={parseInt(avatar) === index ? 1 : 0.5}
                  key={index} kind={index} jumping={true}/>)
      }
    </AvatarChoose>
  )
};


const StyledStepper = styled(Stepper)`
  &&.MuiPaper-root {
    background-color: transparent !important;
  }
  && .MuiStepIcon-active {
    color: ${({theme}) => theme.lightgray};
  }
  && .MuiStepLabel-labelContainer {
    display: none;
  }
  && .MuiStepConnector-root {
    width: 10px;
    left: -5px;
    right: 0;
  }
  && .MuiStepIcon-completed {
    color: ${({theme}) => theme.secondary};
  }
  && .MuiStepIcon-text {
    fill: ${({theme}) => theme.main};
  }
`;

export const RegisterForm = React.memo(({history, setValid}) => {
  const dispatch = useDispatch();
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [type, setType] = useState("local");
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const updatePassword = (value) => {
    setPassword(value)
  };

  const updateUsername = (value) => {
    setUsername(value);
  };

  const onSend = useCallback((e) => {
    if (step === 2) {
      // send all details to server
      (async () => {
        // await AuthService.facebookLogin(id_token);
        switch (type) {
          case 'facebook':
            await AuthService.facebookRegister(token, email, name, avatar);
            break;
          case 'google':
            await AuthService.googleRegister(token, email, name, avatar);
            break;
          default:
            await AuthService.register(username, password, email, name, avatar);
            break;
        }
        history.push(LOGIN_ROUTE);
      })()
    } else {
      setStep(step + 1);
    }
    e.preventDefault();
  });

  const goBack = useCallback(() => {
    if (step === 0) history.push(MAIN_ROUTE);
    setStep(step - 1);
  });

  useEffect(() => {
    if (step === 0) {
      setValid(username.length > 3 && password.length > 3);
    } else if (step === 1) {
      setValid(email.length > 3 && name.length > 3);
    } else if (step === 2) {
      setValid(avatar !== null);
    }
  }, [step, username, password, email, avatar, name]);

  const facebookResponse = useCallback((response) => {
    const id_token = response.accessToken;
    setToken(id_token);
    (async () => {
      // await AuthService.facebookLogin(id_token);
      await AuthService.isFree(id_token, 'facebook');
      setType("facebook");
      setEmail(response.email);
      setName(response.name);
      setStep(step + 1);
    })();
  });
  const googleResponse = useCallback((response) => {
    console.log("GOOGLE 2RESPONSE");
    console.log(response);
  });

  const googleRegister = useCallback((response) => {
    const id_token = response.tokenObj.id_token;
    setToken(id_token);
    (async () => {
      // await AuthService.googleLogin(id_token);
      await AuthService.isFree(id_token, 'google');
      setType("google");
      setEmail(response.profileObj.email);
      setName(response.profileObj.name);
      setStep(step + 1);
    })();
  });

  return (
    <StyledForm id="registerForm" onSubmit={onSend}>
      <StyledStepper activeStep={step} alternativeLabel>
          <Step>
             <StepLabel>Stage 1</StepLabel>
          </Step>
          <Step>
             <StepLabel>Stage 2</StepLabel>
          </Step>
        <Step>
          <StepLabel>Stage 3</StepLabel>
        </Step>
      </StyledStepper>
      {
        (() => {
          switch (step) {
            case 1:
              return (
                <RegisterStageTwoForm name={name} setName={setName} email={email} setEmail={setEmail}/>
              );
            case 2:
              return (
                <RegisterStageThreeForm avatar={avatar} setAvatar={setAvatar}/>
              );

            default:
              return (
                <RegisterStageOneForm username={username} password={password} setUsername={updateUsername} setPassword={updatePassword}
                                      googleSuccess={googleRegister} facebookSuccess={facebookResponse} googleFailed={googleResponse}/>
              );
          }
        })()
      }
      <BackButton
        color={theme.white}
        onClick={goBack}>back</BackButton>
    </StyledForm>
  )
});

export const LoginForm = React.memo(({setValid}) => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    setValid(username.length > 3 && password.length > 3)
  }, [username, password]);

  const onSend = useCallback((e) => {
    (async () => {
      console.log(username, password)
      await AuthService.login(username, password);
      dispatch(updateLogin(true));
      dispatch(updateCurrentUser(AuthService.getUserId()));
    })();
    e.preventDefault();
  });

  const facebookResponse = useCallback((response) => {
    const id_token = response.accessToken;
    (async () => {
      await AuthService.facebookLogin(id_token);
      dispatch(updateLogin(true));
      dispatch(updateCurrentUser(AuthService.getUserId()));
    })();
  });
  const googleResponse = useCallback((response) => {
    console.log("GOOGLE 2RESPONSE");
    console.log(response);
  });

  const googleLogin = useCallback((response) => {
    const id_token = response.tokenObj.id_token;
    (async () => {
      await AuthService.googleLogin(id_token);
      dispatch(updateLogin(true));
      dispatch(updateCurrentUser(AuthService.getUserId()));
    })();
  });

  return (
    <StyledForm id="loginForm" onSubmit={onSend}
                exit={{opacity: 0}}
                animate={{opacity: 1}}
                initial={{opacity: 0}}
    >
      <InputField label="Username" icon={userIconUrl}
                  field={username}
                  setField={setUsername}/>
      <InputField label="Password" type="password" icon={passwordIconUrl}
                  field={password}
                  setField={setPassword}/>
      <ExternalLogin>
        <GoogleLogin
          clientId={GOOGLE_CLIENT_ID}
          render={(renderProps) => (
            <IconButton onClick={renderProps.onClick} spacing="5px">
              <SVGIcon size={60} src={googleIconUrl} color={theme.main}/>
            </IconButton>
          )}
          buttonText="Login"
          onSuccess={googleLogin}
          onFailure={googleResponse}
          cookiePolicy={'single_host_origin'}
        />
        <FacebookLogin
          appId={FACEBOOK_APP_ID}
          fields="name,email,picture"
          redirectUri={window.location.href.split('?')[0]}
          render={renderProps => (
            <IconButton onClick={renderProps.onClick} spacing="5px">
              <SVGIcon size={60} src={facebookIconUrl} color={theme.main}/>
            </IconButton>
          )}
          callback={facebookResponse}/>
      </ExternalLogin>
    </StyledForm>
  )
});