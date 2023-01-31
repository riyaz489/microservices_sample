from flask_swagger_generator.generators import Generator
from flask_swagger_generator.utils import SwaggerVersion



# lib for generating swagger json 'flask-swagger-generator'
# swagger generator function to populate json data at local for swagger gui
generator = Generator.of(SwaggerVersion.VERSION_THREE)
