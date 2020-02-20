import requests
from fastapi import HTTPException, APIRouter, Body, Depends
from starlette.status import HTTP_401_UNAUTHORIZED

from db import crud, schemas
from db.database import get_db, Session
from .utils import Token, generate_token
from .consts import FACEBOOK_SECRET, FACEBOOK_APP


router = APIRouter()


def validate_facebook_token(token: str):
    # copy clientId, clientSecret from MY APP Page
    app_link = 'https://graph.facebook.com/oauth/access_token?client_id=' + \
               FACEBOOK_APP + '&client_secret=' + FACEBOOK_SECRET + \
               '&grant_type=client_credentials'
    # From appLink, retrieve the second accessToken: app access_token
    app_token = requests.get(app_link).json()['access_token']
    link = 'https://graph.facebook.com/debug_token?input_token=' + token + \
           '&access_token=' + app_token
    try:
        user_id = requests.get(link).json()['data']['user_id']
    except (ValueError, KeyError, TypeError):
        raise HTTPException(
            status_code=HTTP_401_UNAUTHORIZED,
            detail="invalid token!",
        )
    return user_id


@router.post("/login/facebook", response_model=Token)
async def login_using_facebook(
    body: schemas.FacebookToken = Body(...),
    db: Session = Depends(get_db)
):
    """Login to system using google access token."""
    username = validate_facebook_token(body.facebook_token)
    user = crud.users.get_user_by_facebook_id(db, facebook_id=username)

    if user is None:
        raise HTTPException(status_code=400,
                            detail="User isn't registered yet!")

    return generate_token(user)


@router.post("/register/facebook", response_model=schemas.User)
def register_facebook(
    *,
    body: schemas.FacebookRegister = Body(...),
    db: Session = Depends(get_db)
):
    """Register to application and return the created user."""
    username = validate_facebook_token(body.facebook_token)
    existing_user = crud.users.get_user_by_facebook_id(db,
                                                       facebook_id=username)
    if existing_user:
        raise HTTPException(status_code=400,
                            detail="Username already taken!")

    created_user = crud.users.create_user(db,
                                          username=username,
                                          facebook_id=username,
                                          email=body.email,
                                          icon_path=body.avatar,
                                          english_name=body.name,
                                          account_type='facebook')

    return created_user
