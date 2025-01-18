from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Survey
from .serializers import SurveySerializer
import json



    
    
class SurveyViewSet(viewsets.ModelViewSet):
    queryset = Survey.objects.all()
    serializer_class = SurveySerializer


    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def assigned_to_me(self, request):
        """
        Возвращает список опросов, назначенных текущему пользователю, если его роль — сотрудник.
            """
        user = request.user
        if user.role != 'сотрудник':
            return Response({"detail": "Доступ запрещен."}, status=status.HTTP_403_FORBIDDEN)

        # Получаем все опросы
        surveys = Survey.objects.all()

      
        assigned_surveys = []
        for survey in surveys:
            if any(user_item["id"] == user.id and user_item['is_complete'] == False for user_item in survey.assigned_users):
                assigned_surveys.append(survey)

        # Серилизуем и возвращаем данные
        serializer = self.get_serializer(assigned_surveys, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def hr_surveys(self, request):
        """
        Возвращает список опросов, созданных текущим HR.
        """
        user = request.user
        if user.role != 'HR':
            return Response({"detail": "Доступ запрещен."}, status=status.HTTP_403_FORBIDDEN)
        
        surveys = Survey.objects.filter(created_by=user)
        serializer = self.get_serializer(surveys, many=True)
        return Response(serializer.data)

  

    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def complete(self, request, pk=None):
        """
        Позволяет пользователю завершить опрос.
        """
        survey = self.get_object()
        user = request.user

        # Проверяем, назначен ли опрос пользователю
        for assignment in survey.assigned_users:
            if assignment["id"] == user.id and not assignment["is_complete"]:
                survey.mark_completed(user)
                survey.save_completion(user.age,user.position,request.data.get("answers"))
                return Response({"detail": "Опрос успешно завершен."}, status=status.HTTP_200_OK)

        return Response({"detail": "Опрос не назначен или уже завершен."}, status=status.HTTP_400_BAD_REQUEST)
