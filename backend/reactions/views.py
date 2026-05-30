from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from messages_app.models import Compliment
from .models import Reaction, Reply
from .serializers import ReactionSerializer, AddReactionSerializer, ReplySerializer, AddReplySerializer


class ReactView(APIView):
    """Add or toggle a reaction on a compliment."""
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, pk):
        compliment = get_object_or_404(Compliment, pk=pk, is_deleted=False)
        serializer = AddReactionSerializer(data=request.data)
        if serializer.is_valid():
            reaction_type = serializer.validated_data['reaction_type']
            reaction, created = Reaction.objects.get_or_create(
                compliment=compliment,
                reactor=request.user,
                reaction_type=reaction_type
            )
            if not created:
                # Toggle off
                reaction.delete()
                return Response({'message': 'Reaction removed.', 'action': 'removed'})
            return Response({
                'message': 'Reaction added!',
                'action': 'added',
                'reaction': ReactionSerializer(reaction).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, pk):
        compliment = get_object_or_404(Compliment, pk=pk, is_deleted=False)
        reactions = compliment.reactions.all()
        summary = {}
        for r in reactions:
            summary[r.reaction_type] = summary.get(r.reaction_type, 0) + 1
        # User's own reactions
        user_reactions = []
        if request.user.is_authenticated:
            user_reactions = list(reactions.filter(reactor=request.user).values_list('reaction_type', flat=True))
        return Response({'summary': summary, 'user_reactions': user_reactions})


class ReplyView(APIView):
    """Add anonymous reply to a compliment."""
    permission_classes = (permissions.AllowAny,)

    def post(self, request, pk):
        compliment = get_object_or_404(Compliment, pk=pk, is_deleted=False)
        serializer = AddReplySerializer(data=request.data)
        if serializer.is_valid():
            is_recipient = (
                request.user.is_authenticated and
                request.user == compliment.recipient
            )
            reply = serializer.save(
                compliment=compliment,
                is_from_recipient=is_recipient
            )
            return Response(
                ReplySerializer(reply).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, pk):
        compliment = get_object_or_404(Compliment, pk=pk, is_deleted=False)
        replies = compliment.replies.filter(is_deleted=False)
        return Response(ReplySerializer(replies, many=True).data)
