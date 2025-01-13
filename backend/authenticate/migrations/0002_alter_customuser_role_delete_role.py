# Generated by Django 5.1.2 on 2025-01-08 18:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authenticate', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='role',
            field=models.CharField(choices=[('HR', 'HR'), ('сотрудник', 'Сотрудник')], default='сотрудник', max_length=100, verbose_name='Роль'),
        ),
        migrations.DeleteModel(
            name='Role',
        ),
    ]
