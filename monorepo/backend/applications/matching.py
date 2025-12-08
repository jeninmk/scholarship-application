# monorepo/backend/applications/matching.py

from scholarships.models import Scholarship

def calculate_match_score(application, scholarship):
    """
    A simple matching algorithm.
    For example, if the application JSON field 'data' contains a 'gpa' and the scholarship has
    a 'required_gpa' field, award 1 point if the applicant's GPA is greater than or equal to required_gpa.
    Similarly, if the application contains a 'major' and the scholarship specifies a 'required_major',
    award another point if they match.
    """
    score = 0
    app_data = application.data
    # Check GPA if available and if scholarship has 'required_gpa'
    if 'gpa' in app_data and hasattr(scholarship, 'required_gpa'):
        try:
            if float(app_data['gpa']) >= float(scholarship.required_gpa):
                score += 1
        except (ValueError, TypeError):
            pass
    # Check major if available and if scholarship has 'required_major'
    if 'major' in app_data and hasattr(scholarship, 'required_major'):
        if scholarship.required_major.lower() in app_data['major'].lower():
            score += 1
    return score

def match_applications_to_scholarships(application, scholarships_queryset):
    """
    For a given application and a queryset of scholarships, calculate the match score for each
    scholarship and return a list of matches (only if score > 0).
    """
    matches = []
    for scholarship in scholarships_queryset:
        score = calculate_match_score(application, scholarship)
        if score > 0:
            matches.append({
                "scholarship_id": scholarship.id,
                "score": score,
            })
    return matches
