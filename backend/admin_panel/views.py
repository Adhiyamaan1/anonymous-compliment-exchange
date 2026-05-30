from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from messages_app.models import Compliment
from messages_app.serializers import AdminComplimentSerializer
from accounts.serializers import UserListSerializer

User = get_user_model()


class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_staff


class AdminComplimentListView(generics.ListAPIView):
    """List all compliments (with filter for flagged)."""
    permission_classes = (IsAdminUser,)
    serializer_class = AdminComplimentSerializer

    def get_queryset(self):
        qs = Compliment.objects.all()
        flagged = self.request.query_params.get('flagged')
        if flagged == 'true':
            qs = qs.filter(is_flagged=True)
        return qs


class AdminFlagComplimentView(APIView):
    """Flag or unflag a compliment."""
    permission_classes = (IsAdminUser,)

    def post(self, request, pk):
        compliment = generics.get_object_or_404(Compliment, pk=pk)
        compliment.is_flagged = not compliment.is_flagged
        compliment.save()
        action = 'flagged' if compliment.is_flagged else 'unflagged'
        return Response({'message': f'Compliment {action}.', 'is_flagged': compliment.is_flagged})


class AdminDeleteComplimentView(APIView):
    """Hard delete a compliment (admin only)."""
    permission_classes = (IsAdminUser,)

    def delete(self, request, pk):
        compliment = generics.get_object_or_404(Compliment, pk=pk)
        compliment.delete()
        return Response({'message': 'Compliment permanently deleted.'}, status=status.HTTP_200_OK)


class AdminUserListView(generics.ListAPIView):
    """List all users with stats."""
    permission_classes = (IsAdminUser,)
    serializer_class = UserListSerializer

    def get_queryset(self):
        return User.objects.all().order_by('-date_joined')


class AdminToggleUserActiveView(APIView):
    """Activate or deactivate a user account."""
    permission_classes = (IsAdminUser,)

    def post(self, request, pk):
        user = generics.get_object_or_404(User, pk=pk)
        if user == request.user:
            return Response({'error': 'Cannot deactivate yourself.'}, status=status.HTTP_400_BAD_REQUEST)
        user.is_active = not user.is_active
        user.save()
        action = 'activated' if user.is_active else 'deactivated'
        return Response({'message': f'User {action}.', 'is_active': user.is_active})


class AdminStatsView(APIView):
    """Overall platform statistics."""
    permission_classes = (IsAdminUser,)

    def get(self, request):
        total_users = User.objects.count()
        active_users = User.objects.filter(is_active=True).count()
        total_compliments = Compliment.objects.count()
        flagged_compliments = Compliment.objects.filter(is_flagged=True).count()
        deleted_compliments = Compliment.objects.filter(is_deleted=True).count()
        return Response({
            'total_users': total_users,
            'active_users': active_users,
            'total_compliments': total_compliments,
            'flagged_compliments': flagged_compliments,
            'deleted_compliments': deleted_compliments,
        })
