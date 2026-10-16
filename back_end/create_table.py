from database import Base, engine
import models

Base.metadata.create_all(bind=engine)

print("User_register table created successfully!")