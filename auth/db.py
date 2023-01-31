from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
migrate = Migrate()

# we need to import models after defining SQLALchamy() so that migrator can find models.
# also if we put this code in server.py we will get circular dependency after importing app1,
# so to avoid that we put these lines in different file
