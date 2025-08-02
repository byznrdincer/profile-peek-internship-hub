from django.core.mail import send_mail
from django.conf import settings

def send_otp_email(email, otp_code):
    subject = "Your LazyIntern OTP Verification Code"
    message = (
        f"Hello,\n\n"
        f"Your One-Time Password (OTP) for verification is: {otp_code}\n\n"
        f"Please do not share this code with anyone.\n\n"
        f"Best regards,\n"
        f"The LazyIntern Team"
    )
    from_email = settings.DEFAULT_FROM_EMAIL
    recipient_list = [email]

    try:
        send_mail(subject, message, from_email, recipient_list, fail_silently=False)
        print(f"OTP {otp_code} sent to {email}")
        return True
    except Exception as e:
        print(f"Email sending failed: {e}")
        return False
