from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsIssueOwnerOrReadOnly(BasePermission):
    """
    Students:
    - can read all issues in their institute
    - can modify ONLY issues they created
    """

    def has_object_permission(self, request, view, obj):
        # Read-only requests are always allowed
        if request.method in SAFE_METHODS:
            return True

        # Write permissions only for owner
        return obj.created_by == request.user


class IsFacultyOrStaff(BasePermission):
    """
    Allow only FACULTY or STAFF roles
    """

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.profile.role in ["FACULTY", "STAFF"]
        )
