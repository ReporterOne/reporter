import os

# TODO: remember in production to generate new hash using:
#       openssl rand -hex 32
SECRET_KEY = os.environ.get(
    "ONE_REPORT_SECRET",
    "a10519645263a665b3a10068a29b9e6171f32bad184d82a8aef0d790fe09d49a")

if "ONE_REPORT_FACEBOOK" not in os.environ:
    raise RuntimeError("ONE_REPORT_FACEBOOK must be set for this application")

FACEBOOK_SECRET = os.environ["ONE_REPORT_FACEBOOK"]
# public
FACEBOOK_APP = "861853434255614"

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 500
# public
CLIENT_ID = "623244279739-lrqk7n917mpnuqbmnkgbv8l4o73tjiek.apps.googleusercontent.com"