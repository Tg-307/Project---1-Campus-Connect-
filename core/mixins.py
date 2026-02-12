class InstituteQuerySetMixin:
    """
    Ensures data isolation per institute (multi-tenant).
    Works for ViewSets.
    """
    def get_institute(self):
        return self.request.user.profile.institute
