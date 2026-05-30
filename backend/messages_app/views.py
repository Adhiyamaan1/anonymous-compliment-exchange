from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from .models import Compliment
from .serializers import SendComplimentSerializer, ComplimentSerializer, ComplimentDetailSerializer

User = get_user_model()


class SendComplimentView(APIView):
    """Send an anonymous compliment via share_id. No auth required."""
    permission_classes = (permissions.AllowAny,)

    def post(self, request, share_id):
        recipient = generics.get_object_or_404(User, share_id=share_id)

        if not recipient.is_accepting_messages:
            return Response(
                {'error': 'This user is not accepting messages right now.'},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = SendComplimentSerializer(data=request.data)
        if serializer.is_valid():
            compliment = serializer.save(
                recipient=recipient,
                sender=request.user if request.user.is_authenticated else None
            )
            return Response(
                {'message': 'Compliment sent anonymously! 💌', 'id': compliment.id},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class InboxView(generics.ListAPIView):
    """List all compliments received by the logged-in user."""
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = ComplimentSerializer

    def get_queryset(self):
        qs = Compliment.objects.filter(
            recipient=self.request.user,
            is_deleted=False
        )
        category = self.request.query_params.get('category')
        if category:
            qs = qs.filter(category=category)
        unread = self.request.query_params.get('unread')
        if unread == 'true':
            qs = qs.filter(is_read=False)
        return qs

    def list(self, request, *args, **kwargs):
        # Mark as read when fetching
        queryset = self.get_queryset()
        unread_count = queryset.filter(is_read=False).count()
        queryset.filter(is_read=False).update(is_read=True)
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'unread_count': unread_count,
            'results': serializer.data
        })


class ComplimentDetailView(generics.RetrieveDestroyAPIView):
    """View or delete a specific compliment."""
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = ComplimentDetailSerializer

    def get_queryset(self):
        return Compliment.objects.filter(recipient=self.request.user, is_deleted=False)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.is_deleted = True
        instance.save()
        return Response({'message': 'Compliment removed.'}, status=status.HTTP_200_OK)


class InboxStatsView(APIView):
    """Quick stats for the dashboard."""
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        user = request.user
        total = Compliment.objects.filter(recipient=user, is_deleted=False).count()
        unread = Compliment.objects.filter(recipient=user, is_deleted=False, is_read=False).count()
        by_category = {}
        for cat in Compliment.CATEGORY_CHOICES:
            count = Compliment.objects.filter(recipient=user, is_deleted=False, category=cat[0]).count()
            if count > 0:
                by_category[cat[0]] = count
        return Response({
            'total_received': total,
            'unread': unread,
            'by_category': by_category,
        })
