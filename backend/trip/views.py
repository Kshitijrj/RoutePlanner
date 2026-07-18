from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .serializers import TripSerializer
from services.trip_service import TripService


class PlanTripView(APIView):

    def post(self, request):

        serializer = TripSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        try:
            response = TripService.plan_trip(
                serializer.validated_data
            )

            return Response(response)

        except Exception as e:

            return Response(
                {
                    "error": str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )