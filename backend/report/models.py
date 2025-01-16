from django.db import models
from authenticate.models import CustomUser
class Survey(models.Model):
    title = models.CharField(max_length=255, verbose_name="Название опроса")
    
    description = models.TextField(blank=True, verbose_name="Описание")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    total_completions = models.PositiveIntegerField(default=0, verbose_name="Количество прохождений")
    questions = models.JSONField(verbose_name="Вопросы")  # Список вопросов в формате JSON
    completions = models.JSONField(default=list, null=True, blank=True, verbose_name="Прохождения")  # Хранит информацию о прохождениях
    created_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE,null=True, related_name="created_surveys", verbose_name="Создатель")
    assigned_users = models.JSONField(default=list, verbose_name="Назначенные пользователи")  # Список пользователей и их статус
   
    def save_completion(self, age, position, answers):
        """
        Сохраняет информацию о новом прохождении опроса.
        """
        self.completions.append({
            "age": age,
            "position": position,
            "answers": answers,
        })
        self.total_completions += 1
        self.save()


    def mark_completed(self, user):
        """
        Отмечает опрос как пройденный для конкретного пользователя.
        """
        if hasattr(self, 'assigned_users'):
            for assignment in self.assigned_users:
                if assignment["id"] == user.id:
                    assignment["is_complete"] = True
                    self.save()
                    break

    def __str__(self):
        return self.title
