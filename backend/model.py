from sqlalchemy import Column, Integer, String, Boolean
try:
    from backend.database import Base
except ImportError:
    from database import Base

class ToDo(Base):
    __tablename__ = "Todos"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String, nullable=False)
    done = Column(Boolean, default=False)