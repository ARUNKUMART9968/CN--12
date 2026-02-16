"""
Pydantic models for request/response validation
Data structures for FastAPI
"""

from pydantic import BaseModel
from typing import List, Dict, Optional

class StudentProfileData(BaseModel):
    """Student profile data for matching"""
    id: str
    userId: str
    name: str
    university: str
    degree: str
    preferred_industry: Optional[str] = None
    skills: List[str] = []
    interests: List[str] = []
    looking_for: List[str] = []
    location: Optional[str] = None

class AlumniProfileData(BaseModel):
    """Alumni profile data for matching"""
    id: str
    userId: str
    name: str
    university: str
    degree: str
    industry: str
    skills: List[str] = []
    interests: List[str] = []
    mentoring_areas: List[str] = []
    company: str
    availability: str = "Available"
    hiring_stack: List[str] = []
    location: Optional[str] = None

class ScoreBreakdown(BaseModel):
    """Score breakdown structure"""
    university: float = 0
    industry: float = 0
    degree: float = 0
    skills: float = 0
    interests: float = 0
    mentoring: float = 0
    company: float = 0
    availability: float = 0
    common_skills: List[str] = []
    common_interests: List[str] = []
    matching_areas: List[str] = []

class MatchResponse(BaseModel):
    """Single match result"""
    alumni_id: str
    alumni_name: str
    total_score: float
    score_breakdown: Dict
    common_skills: List[str]
    common_interests: List[str]
    matching_areas: List[str]

class MatchingResult(BaseModel):
    """Final matching result"""
    success: bool
    message: str
    matches: List[MatchResponse]
    timestamp: str
    total_alumni: int
    processing_time_ms: float

class MatchRequest(BaseModel):
    """Request model for matching"""
    student: StudentProfileData
    alumni_list: List[AlumniProfileData]

class HealthResponse(BaseModel):
    """Health check response"""
    status: str
    service: str
    timestamp: str