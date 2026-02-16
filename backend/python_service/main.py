"""
FastAPI Server for Graph-Based Hierarchical Matching (GBHM) Algorithm
Python-based matching service integrated with Node.js backend
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging
from datetime import datetime
import time

from python_service.gbhm_matcher import GBHMMatcher
from python_service.models import (
    StudentProfileData,
    AlumniProfileData,
    MatchRequest,
    MatchResponse,
    MatchingResult,
    HealthResponse
)
from python_service.utils import (
    print_header,
    print_success,
    print_error,
    print_info,
    get_current_timestamp,
    calculate_processing_time
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize matcher
matcher = GBHMMatcher()

# ============ LIFESPAN EVENTS ============

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager for startup and shutdown events
    """
    # Startup
    logger.info("=" * 60)
    logger.info("GBHM MATCHING SERVICE STARTING")
    logger.info("=" * 60)
    logger.info("✓ FastAPI server initialized")
    logger.info("✓ GBHM matcher initialized")
    logger.info("✓ Ready to accept matching requests")
    logger.info("=" * 60)
    
    yield
    
    # Shutdown
    logger.info("=" * 60)
    logger.info("GBHM Matching Service shutting down")
    logger.info("=" * 60)

# ============ FASTAPI APP INITIALIZATION ============

app = FastAPI(
    title="Career Nexus - GBHM Matching Service",
    description="Graph-Based Hierarchical Matching Algorithm for student-alumni recommendations",
    version="1.0.0",
    lifespan=lifespan
)

# ============ CORS CONFIGURATION ============

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============ API ENDPOINTS ============

@app.get("/health")
async def health_check() -> HealthResponse:
    """
    Health check endpoint
    Returns service status and timestamp
    """
    return HealthResponse(
        status="healthy",
        service="GBHM Matching Service",
        timestamp=get_current_timestamp()
    )

@app.get("/")
async def root():
    """
    Root endpoint with service information
    """
    return {
        "name": "Career Nexus - GBHM Matching Service",
        "version": "1.0.0",
        "description": "Graph-Based Hierarchical Matching Algorithm for student-alumni recommendations",
        "status": "running",
        "endpoints": {
            "health": "/health",
            "match": "/api/match",
            "match_batch": "/api/match/batch",
            "explain": "/api/explain"
        }
    }

@app.post("/api/match", response_model=MatchingResult)
async def run_matching(request: MatchRequest):
    """
    Run matching algorithm for a student against multiple alumni
    
    Request body:
    {
        "student": {
            "id": "student_id",
            "userId": "user_id",
            "name": "Student Name",
            "university": "University Name",
            "degree": "B.Tech",
            "preferred_industry": "Technology",
            "skills": ["Python", "JavaScript"],
            "interests": ["Web Development"],
            "looking_for": ["Mentorship"],
            "location": "City"
        },
        "alumni_list": [
            {
                "id": "alumni_id",
                "userId": "alumni_user_id",
                "name": "Alumni Name",
                "university": "University Name",
                "degree": "B.Tech",
                "industry": "Technology",
                "skills": ["Python", "React"],
                "interests": ["Web Development"],
                "mentoring_areas": ["Mentorship"],
                "company": "Company Name",
                "availability": "Available"
            }
        ]
    }
    """
    
    try:
        start_time = time.time()
        
        logger.info(f"Matching request for student: {request.student.name}")
        logger.info(f"Against {len(request.alumni_list)} alumni profiles")
        
        # Run matching algorithm
        recommendations = matcher.get_recommendations(
            student=request.student.dict(),
            alumni_list=[alumni.dict() for alumni in request.alumni_list]
        )
        
        # Format response
        matches = []
        for rec in recommendations:
            match = MatchResponse(
                alumni_id=rec['alumni_id'],
                alumni_name=rec['alumni_name'],
                total_score=rec['total_score'],
                score_breakdown=rec['score_breakdown'],
                common_skills=rec['score_breakdown'].get('common_skills', []),
                common_interests=rec['score_breakdown'].get('common_interests', []),
                matching_areas=rec['score_breakdown'].get('matching_areas', [])
            )
            matches.append(match)
        
        processing_time = calculate_processing_time(start_time, time.time())
        
        logger.info(f"Matching completed in {processing_time:.2f}ms")
        logger.info(f"Generated {len(matches)} recommendations")
        
        return MatchingResult(
            success=True,
            message="Matching completed successfully",
            matches=matches,
            timestamp=get_current_timestamp(),
            total_alumni=len(request.alumni_list),
            processing_time_ms=processing_time
        )
        
    except Exception as error:
        logger.error(f"Matching error: {str(error)}")
        raise HTTPException(
            status_code=500,
            detail={
                "success": False,
                "message": "Matching algorithm failed",
                "error": str(error)
            }
        )

@app.post("/api/match/batch")
async def batch_matching(requests: list):
    """
    Run matching for multiple students in batch
    
    Returns list of matching results
    """
    
    try:
        results = []
        
        for req in requests:
            # Convert to MatchRequest
            match_req = MatchRequest(
                student=StudentProfileData(**req['student']),
                alumni_list=[AlumniProfileData(**alumni) for alumni in req['alumni_list']]
            )
            
            recommendations = matcher.get_recommendations(
                student=match_req.student.dict(),
                alumni_list=[alumni.dict() for alumni in match_req.alumni_list]
            )
            
            results.append({
                "student_id": match_req.student.userId,
                "student_name": match_req.student.name,
                "matches": recommendations,
                "match_count": len(recommendations)
            })
        
        return {
            "success": True,
            "message": "Batch matching completed",
            "results": results,
            "total_students": len(requests),
            "timestamp": get_current_timestamp()
        }
        
    except Exception as error:
        logger.error(f"Batch matching error: {str(error)}")
        raise HTTPException(
            status_code=500,
            detail={
                "success": False,
                "message": "Batch matching failed",
                "error": str(error)
            }
        )

@app.post("/api/explain")
async def explain_match(student: StudentProfileData, alumni: AlumniProfileData):
    """
    Get explanation for why two profiles match
    """
    
    try:
        explanation = matcher.generate_explanation(
            student=student.dict(),
            alumni=alumni.dict()
        )
        
        score_data = matcher.calculate_hierarchical_score(
            student=student.dict(),
            alumni=alumni.dict()
        )
        
        return {
            "success": True,
            "explanation": explanation,
            "score": score_data['total_score'],
            "breakdown": score_data['breakdown']
        }
        
    except Exception as error:
        logger.error(f"Explanation error: {str(error)}")
        raise HTTPException(
            status_code=500,
            detail="Error generating explanation"
        )

# ============ ERROR HANDLING ============

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """Handle HTTP exceptions"""
    return {
        "success": False,
        "message": str(exc.detail),
        "status_code": exc.status_code
    }

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    """Handle general exceptions"""
    logger.error(f"Unhandled exception: {str(exc)}")
    return {
        "success": False,
        "message": "Internal server error",
        "error": str(exc)
    }

# ============ STARTUP/SHUTDOWN ============

if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "python_service.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )