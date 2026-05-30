from rest_framework import serializers
from .models import Compliment


class SendComplimentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Compliment
        fields = ('content', 'category')


class ComplimentSerializer(serializers.ModelSerializer):
    reaction_count = serializers.ReadOnlyField()
    reactions_summary = serializers.SerializerMethodField()

    class Meta:
        model = Compliment
        fields = (
            'id', 'content', 'category', 'is_read',
            'is_flagged', 'reaction_count', 'reactions_summary', 'created_at'
        )

    def get_reactions_summary(self, obj):
        from reactions.models import Reaction
        summary = {}
        for reaction in obj.reactions.all():
            summary[reaction.reaction_type] = summary.get(reaction.reaction_type, 0) + 1
        return summary


class ComplimentDetailSerializer(ComplimentSerializer):
    replies = serializers.SerializerMethodField()

    class Meta(ComplimentSerializer.Meta):
        fields = ComplimentSerializer.Meta.fields + ('replies',)

    def get_replies(self, obj):
        from reactions.serializers import ReplySerializer
        return ReplySerializer(obj.replies.filter(is_deleted=False), many=True).data


class AdminComplimentSerializer(serializers.ModelSerializer):
    recipient_username = serializers.CharField(source='recipient.username', read_only=True)
    reaction_count = serializers.ReadOnlyField()

    class Meta:
        model = Compliment
        fields = (
            'id', 'content', 'category', 'recipient_username',
            'is_flagged', 'is_deleted', 'reaction_count', 'created_at'
        )
