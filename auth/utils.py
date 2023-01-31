import datetime
import jwt


def create_jwt(username, secret, authz):
    return jwt.encode(
        {
            "username": username,
            "exp": datetime.datetime.now(tz=datetime.timezone.utc)
            +datetime.timedelta(days=1),
            "iat": datetime.datetime.utcnow(),
            "admin": authz,

        },
        secret,

        "HS256"
    )
