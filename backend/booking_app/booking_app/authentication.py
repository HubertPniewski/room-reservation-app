from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.urls import resolve

class CookieJWTAuthentication(JWTAuthentication):
    def get_raw_token(self, header):
        return None
    
    def authenticate(self, request):
        current_route = resolve(request.path_info).url_name
        if current_route in ['login', 'token_refresh']:
            return None
        
        raw_token = request.COOKIES.get("access")
        if raw_token is None:
            return super().authenticate(request)
        try:
            validated_token = self.get_validated_token(raw_token)
        except Exception:
            raise AuthenticationFailed('Invalid or expired token')
        return self.get_user(validated_token), validated_token