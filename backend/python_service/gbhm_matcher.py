"""
Graph-Based Hierarchical Matching (GBHM) Algorithm
Core matching logic for student-alumni recommendations
"""

from typing import Dict, List, Tuple

class GBHMMatcher:
    """Graph-Based Hierarchical Matching Algorithm"""
    
    def __init__(self):
        """Initialize the matcher with GBHM weights"""
        
        # Define weights for different connection types
        self.weights = {
            'university': 200,      # Exact match - strongest (Level 0)
            'industry': 160,        # Exact match (Level 0)
            'degree': 100,          # Exact match (Level 0)
            'skill': 90,            # Per skill match (Level 1)
            'interest': 70,         # Per interest match (Level 1)
            'mentoring': 50,        # Per mentoring area match (Level 2)
            'company': 50,          # Company match (Additional)
            'availability': 50      # Alumni is available (Additional)
        }
    
    def calculate_hierarchical_score(self, student: Dict, alumni: Dict) -> Dict:
        """
        Calculate hierarchical match score between student and alumni
        
        GBHM Hierarchy:
        - Level 0: Exact Matches (University, Industry, Degree)
        - Level 1: Skill Bridges (Common Skills, Interests)
        - Level 2: Mentoring Match (Mentoring Areas)
        - Additional: Company, Availability
        
        Args:
            student: Student profile data
            alumni: Alumni profile data
            
        Returns:
            Dictionary with score breakdown
        """
        score_breakdown = {}
        total_score = 0
        
        # ============ LEVEL 0: EXACT MATCHES (0 hops) ============
        
        # University match (strongest connection)
        if str(student.get('university', '')).lower() == str(alumni.get('university', '')).lower():
            score_breakdown['university'] = self.weights['university']
            total_score += score_breakdown['university']
        else:
            score_breakdown['university'] = 0
        
        # Industry match
        if str(student.get('preferred_industry', '')).lower() == str(alumni.get('industry', '')).lower():
            score_breakdown['industry'] = self.weights['industry']
            total_score += score_breakdown['industry']
        else:
            score_breakdown['industry'] = 0
        
        # Degree match
        if str(student.get('degree', '')).lower() == str(alumni.get('degree', '')).lower():
            score_breakdown['degree'] = self.weights['degree']
            total_score += score_breakdown['degree']
        else:
            score_breakdown['degree'] = 0
        
        # ============ LEVEL 1: SKILL BRIDGES (1 hop) ============
        
        # Skills matching
        student_skills = set([s.lower() for s in student.get('skills', [])])
        alumni_skills = set([s.lower() for s in alumni.get('skills', [])])
        common_skills = student_skills & alumni_skills
        
        skill_score = len(common_skills) * self.weights['skill']
        score_breakdown['skills'] = skill_score
        total_score += skill_score
        score_breakdown['common_skills'] = list(common_skills)
        
        # Interests matching
        student_interests = set([i.lower() for i in student.get('interests', [])])
        alumni_interests = set([i.lower() for i in alumni.get('interests', [])])
        common_interests = student_interests & alumni_interests
        
        interest_score = len(common_interests) * self.weights['interest']
        score_breakdown['interests'] = interest_score
        total_score += interest_score
        score_breakdown['common_interests'] = list(common_interests)
        
        # ============ LEVEL 2: MENTORING MATCH (2 hops) ============
        
        student_looking_for = set([n.lower() for n in student.get('looking_for', [])])
        alumni_mentoring = set([m.lower() for m in alumni.get('mentoring_areas', [])])
        matching_areas = student_looking_for & alumni_mentoring
        
        mentoring_score = len(matching_areas) * self.weights['mentoring']
        score_breakdown['mentoring'] = mentoring_score
        total_score += mentoring_score
        score_breakdown['matching_areas'] = list(matching_areas)
        
        # ============ ADDITIONAL FACTORS ============
        
        # Company match (bonus if same company)
        if alumni.get('company'):
            if str(student.get('company', '')).lower() == str(alumni.get('company', '')).lower():
                score_breakdown['company'] = self.weights['company']
                total_score += score_breakdown['company']
            else:
                score_breakdown['company'] = 0
        else:
            score_breakdown['company'] = 0
        
        # Availability bonus
        if alumni.get('availability') == 'Available':
            score_breakdown['availability'] = self.weights['availability']
            total_score += score_breakdown['availability']
        else:
            score_breakdown['availability'] = 0
        
        return {
            'total_score': total_score,
            'breakdown': score_breakdown
        }
    
    def get_recommendations(self, student: Dict, alumni_list: List[Dict], top_n: int = None) -> List[Dict]:
        """
        Get top N alumni recommendations for a student
        
        Args:
            student: Student profile data
            alumni_list: List of alumni profiles
            top_n: Number of recommendations (None = all)
            
        Returns:
            List of recommendations sorted by score
        """
        
        recommendations = []
        
        for alumni in alumni_list:
            score_data = self.calculate_hierarchical_score(student, alumni)
            
            recommendation = {
                'alumni_id': alumni.get('userId'),
                'alumni_name': alumni.get('name'),
                'company': alumni.get('company'),
                'industry': alumni.get('industry'),
                'location': alumni.get('location'),
                'skills': alumni.get('skills', []),
                'interests': alumni.get('interests', []),
                'mentoring_areas': alumni.get('mentoring_areas', []),
                'availability': alumni.get('availability'),
                'total_score': score_data['total_score'],
                'score_breakdown': score_data['breakdown']
            }
            
            recommendations.append(recommendation)
        
        # Sort by total score (descending)
        recommendations.sort(key=lambda x: x['total_score'], reverse=True)
        
        # Return top N
        if top_n:
            return recommendations[:top_n]
        return recommendations
    
    def generate_explanation(self, student: Dict, alumni: Dict) -> str:
        """
        Generate human-readable explanation for a match
        
        Args:
            student: Student profile
            alumni: Alumni profile
            
        Returns:
            Explanation string
        """
        score_data = self.calculate_hierarchical_score(student, alumni)
        breakdown = score_data['breakdown']
        
        reasons = []
        
        # University match
        if breakdown['university'] > 0:
            reasons.append(f"Same university: {alumni.get('university')}")
        
        # Industry match
        if breakdown['industry'] > 0:
            reasons.append(f"Industry match: {alumni.get('industry')}")
        
        # Degree match
        if breakdown['degree'] > 0:
            reasons.append(f"Similar degree background")
        
        # Skills
        common_skills = breakdown.get('common_skills', [])
        if common_skills:
            skills_str = ', '.join(common_skills[:3])
            if len(common_skills) > 3:
                skills_str += f" +{len(common_skills) - 3}"
            reasons.append(f"Shared skills: {skills_str}")
        
        # Interests
        common_interests = breakdown.get('common_interests', [])
        if common_interests:
            interests_str = ', '.join(common_interests[:2])
            reasons.append(f"Common interests: {interests_str}")
        
        # Mentoring
        matching_areas = breakdown.get('matching_areas', [])
        if matching_areas:
            areas_str = ', '.join(matching_areas[:2])
            reasons.append(f"Can help with: {areas_str}")
        
        # Availability
        if breakdown['availability'] > 0:
            reasons.append("Available for mentorship")
        
        return " | ".join(reasons) if reasons else "General profile compatibility"