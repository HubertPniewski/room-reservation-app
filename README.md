launch django server: python manage.py runserver_plus --cert-file certs/localhost+1.pem --key-file certs/localhost+1-key.pem

# room-reservation-app
A simple room/apartment reservation app, using Django as a Backend and React as a frontend.

## to login to the admin panel use:
email: admin1@admin1.com
password: Admin1


# **API ENDPOINTS**

## Authorization
*'POST auth/token/'* - log in, obtain access and refresh token
*'POST auth/token/refresh/'* - refresh token 

## Users
*'GET users/id/'* - get user public details
*'GET users/id/'* - get user public details + contact (authorization required)
*'POST users/'* - add new user 
*'PUT/PATCH/DELETE users/id/'* - update or delete specific user (authorization required)
*'GET users/me/'* - redirect to users/my-id/

## Listings
*'GET listings/'* - list of all rental objects
*'GET listings/id'* - details of a specific rental object
*'POST listings/'* - add a new rental object (authorization required)
*'GET listings/my-objects/'* - list of all current user's objects (authorization required)
*'PUT/PATCH/DELETE listings/id/edit/'* - edit/delete object (authorization required)

## Reservations
*'GET reservations//id'* - get reservation details (authorization required)
*'PATH/PUT reservations/details/id'* - edit reservation details (authorization required)
*'DELETE reservations/details/id'* - delete reservation details (authorization required)
*'GET reservations/my-reservations/'* - get all my reservations (authorization required)
*'GET reservations/my-clients/'* - get all my objects' reservations (authorization required)
*'POST reservations/'* - add new reservation (authorization required)

## Reviews
