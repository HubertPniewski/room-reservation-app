# room-reservation-app
A simple room/apartment reservation app, using Django as a Backend and React as a frontent.

## to login to the admin panel use:
email: admin1@admin1.com
password: Admin1


# **API ENDPOINTS**

## Authorization
*'POST auth/token/'* - log in, obtain access and refresh token
*'POST auth/token/refresh/'* - refresh token 

## Users
*'GET users/id/'* - get user details
*'POST users/'* - add new user 

## Listings
*'GET listings/'* - list of all rental objects
*'GET listings/id'* - details of a specific rental object
*'POST listings/'* - add a new rental object (authorization required)
*'GET listings/my-objects/'* - list of all current user's objects (authorization required)

## Reservations


## Reviews
