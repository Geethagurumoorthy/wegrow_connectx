    
from sqlalchemy import Column, Integer, String
from database import Base


class User(Base):
    __tablename__ = "user_register"


    id = Column(Integer, primary_key=True, index=True)
    fullname = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    role = Column(String(50))
    emp_id = Column(String(50))
    job_title = Column(String(100))
    department = Column(String(100))
    team_name = Column(String(100))
