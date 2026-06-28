from django.urls import path
from . import views

urlpatterns = [
    path('generate/', views.GenerateAIView.as_view(), name='generate_ai'),
    path('save/', views.SaveInjectionView.as_view(), name='save_injection'),
    path('load/', views.GetInjectionsView.as_view(), name='load_injections'),
]
