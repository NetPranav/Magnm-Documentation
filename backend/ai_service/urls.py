from django.urls import path
from . import views

urlpatterns = [
    path('generate/', views.GenerateAIView.as_view(), name='generate_ai'),
    path('save/', views.SaveInjectionView.as_view(), name='save_injection'),
    path('load/', views.GetInjectionsView.as_view(), name='load_injections'),
    path('project/save/', views.SaveProjectProgressView.as_view(), name='save_project'),
    path('project/load/', views.GetProjectProgressView.as_view(), name='load_project'),
    path('project/evaluate/', views.ProjectEvaluateView.as_view(), name='evaluate_project'),
    path('project/hint/', views.ProjectHintView.as_view(), name='hint_project'),
    path('project/challenge/', views.ProjectChallengeView.as_view(), name='challenge_project'),
]
