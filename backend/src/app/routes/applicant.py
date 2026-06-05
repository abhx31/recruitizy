from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.core.deps import get_current_verified_applicant
from app.models.user import User
from app.schemas.applicant import (
    ApplicantProfileResponse,
    ApplicantProfileUpdate,
)
from app.services.applicant_service import (
    ApplicantService,
)

router = APIRouter(
    prefix="/api/applicant",
    tags=["Applicant"],
)

def get_applicant_service(
    db: Session = Depends(get_db),
):
    return ApplicantService(db)


@router.get(
    "/profile",
    response_model=ApplicantProfileResponse,
)
def get_profile(
    current_user: User = Depends(
        get_current_verified_applicant
    ),

    applicant_service: ApplicantService = Depends(
        get_applicant_service
    ),
):

    profile = applicant_service.get_or_create_profile(
        current_user
    )

    return profile


@router.put(
    "/profile",
    response_model=ApplicantProfileResponse,
)
def update_profile(
    data: ApplicantProfileUpdate,

    current_user: User = Depends(
        get_current_verified_applicant
    ),

    applicant_service: ApplicantService = Depends(
        get_applicant_service
    ),
):

    profile = applicant_service.get_or_create_profile(
        current_user
    )

    updated_profile = (
        applicant_service.update_profile(
            profile,
            data,
        )
    )

    return updated_profile