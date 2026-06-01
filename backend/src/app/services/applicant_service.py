from sqlalchemy.orm import Session

from app.models.user import User
from app.models.applicant_profile import ApplicantProfile
from app.models.applicant_skill import ApplicantSkill
from app.models.applicant_experience import ApplicantExperience


class ApplicantService:
    def __init__(self, db: Session):
        self.db = db

    def get_or_create_profile(
        self,
        user: User,
    ) -> ApplicantProfile:
        profile = (
            self.db.query(ApplicantProfile)
            .filter(
                ApplicantProfile.user_id == user.id
            )
            .first()
        )

        if profile:
            return profile

        profile = ApplicantProfile(
            user_id=user.id,
        )

        self.db.add(profile)
        self.db.commit()
        self.db.refresh(profile)

        return profile

    def update_profile(
        self,
        profile: ApplicantProfile,
        data,
    ) -> ApplicantProfile:

        update_data = data.model_dump(
            exclude_unset=True
        )

        for key, value in update_data.items():
            setattr(profile, key, value)

        self.db.commit()
        self.db.refresh(profile)

        return profile

    def update_profile_from_resume(
        self,
        profile: ApplicantProfile,
        data: dict,
    ) -> ApplicantProfile:
        for key in (
            "headline",
            "bio",
            "phone",
            "location",
            "linkedin_url",
            "github_url",
            "portfolio_url",
            "years_of_experience",
        ):
            if key in data:
                setattr(profile, key, data[key])

        profile.skills.clear()
        profile.experiences.clear()

        for skill_name in data.get("skills", []):
            if skill_name:
                profile.skills.append(
                    ApplicantSkill(skill_name=skill_name)
                )

        for item in data.get("experiences", []):
            company = item.get("company")
            role = item.get("role")

            if not company or not role:
                continue

            profile.experiences.append(
                ApplicantExperience(
                    company=company,
                    role=role,
                    start_date=item.get("start_date"),
                    end_date=item.get("end_date"),
                    description=item.get("description"),
                )
            )

        self.db.commit()
        self.db.refresh(profile)

        return profile
