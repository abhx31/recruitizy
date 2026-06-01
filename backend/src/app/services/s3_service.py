import boto3
import uuid
from botocore.config import Config
from app.core.config import settings
from mypy_boto3_s3 import S3Client

s3_client: S3Client = boto3.client(
    "s3",
    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
    region_name=settings.AWS_REGION,
    endpoint_url=f"https://s3.{settings.AWS_REGION}.amazonaws.com",
    config=Config(
        signature_version="s3v4",
        s3={"addressing_style": "virtual"},
    ),
)

BUCKET_NAME = settings.AWS_BUCKET_NAME


def ensure_s3_config():
    missing = [
        name
        for name, value in {
            "AWS_BUCKET_NAME": settings.AWS_BUCKET_NAME,
            "AWS_REGION": settings.AWS_REGION,
            "AWS_ACCESS_KEY_ID": settings.AWS_ACCESS_KEY_ID,
            "AWS_SECRET_ACCESS_KEY": settings.AWS_SECRET_ACCESS_KEY,
        }.items()
        if not value
    ]

    if missing:
        raise ValueError(
            f"Missing S3 configuration: {', '.join(missing)}"
        )


def generate_upload_url(filename: str, content_type: str):
    ensure_s3_config()

    unique_filename = f"{uuid.uuid4()}_{filename}"
    key=f"resumes/{unique_filename}"

    try:
        upload_url = s3_client.generate_presigned_url(
            ClientMethod="put_object",
            Params={
                "Bucket": BUCKET_NAME,
                "Key": key,
                "ContentType": content_type
            },
            ExpiresIn=300
        )
        
        return {
            "upload_url": upload_url,
            "key": key
        }
    
    except Exception as e:
        raise Exception(f"S3 upload URL error: {str(e)}")
    
def generate_download_url(key: str):
    ensure_s3_config()

    try:
        download_url = s3_client.generate_presigned_url(
            ClientMethod="get_object",
            Params={
                "Bucket": BUCKET_NAME,
                "Key": key
            },
            ExpiresIn=300
        )
        return download_url
    
    except Exception as e:
        raise Exception(f"S3 download URL error: {str(e)}")


def download_file(key: str, file_path: str):
    ensure_s3_config()

    try:
        s3_client.download_file(
            BUCKET_NAME,
            key,
            file_path,
        )
    except Exception as e:
        raise Exception(f"S3 download error: {str(e)}")


def delete_file(key: str):
    ensure_s3_config()

    try:
        s3_client.delete_object(
            Bucket=BUCKET_NAME,
            Key=key
        )
        
        return {"message": "File deleted successfully"}
    
    except Exception as e:
        raise Exception(f"S3 delete error: {str(e)}")
