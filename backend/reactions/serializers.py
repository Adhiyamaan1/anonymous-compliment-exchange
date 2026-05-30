from rest_framework import serializers
from .models import Reaction, Reply


class ReactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reaction
        fields = ('id', 'reaction_type', 'created_at')


class AddReactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reaction
        fields = ('reaction_type',)


class ReplySerializer(serializers.ModelSerializer):
    class Meta:
        model = Reply
        fields = ('id', 'content', 'is_from_recipient', 'created_at')


class AddReplySerializer(serializers.ModelSerializer):
    class Meta:
        model = Reply
        fields = ('content',)
