# Room Reservation App
A web application for short-term apartment and room reservations. 
Users can browse listings, make reservations, create their own offers, manage their bookings and listings, post reviews. 

The project was developed as a personal portfolio project using Django and React. 

## Features

### Users
- User registration and authentication
- JWT-based authorization
- Public and private user profiles
- User profile editing

### Listings
- Browse available apartments, rooms, cottages
- View listing details
- Create, edit, delete own listings

### Reservations
- Make reservations for selected dates
- Manage own reservations
- View reservations made by clients 
- Generate reservation details PDFs

### Reviews
- Browse other users' reviews on listings
- Post, edit, delete own reviews

## Screenshots

### Browsing listings on the homepage 
![Home](screenshots/listings.png)

### Listing details
![Listing](screenshots/listing_details.png)

### User registration
![Registration](screenshots/registration.png)

### Reservation making panel
![Reservation](screenshots/calendar.png)

### Reviews
![Reviews](screenshots/reviews.png)

### Admin panel (Django Admin)
![Admin](screenshots/admin.png)

## Tech Stack
- Backend: Django, Django REST Framework
- Frontend: React 
- Database: PostgreSQL
- Authentication: JWT
- API documentation: Swagger / Redoc

## Running the project locally

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python booking_app/manage.py migrate
python booking_app/manage.py runserver_plus --cert-file certs/localhost+1.pem --key-file certs/localhost+1-key.pem
```
Backend will be available at: https://localhost:8000/

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend will be available at: https://localhost:5173/

## Environment variables

The application uses environment variables for sensitive configuration
(e.g. database credentials).

Create a `.env` file in the project root with the following variables:

- DB_NAME
- DB_USER
- DB_PASSWORD
- DB_HOST
- DB_PORT

### Admin
Admin credentials can be created locally using: 
cd backend/booking_app
python manage.py createsuperuser 

Admin panel available at: https://localhost:8000/admin/

## API Documentation

The backend exposes a REST API documented using OpenAPI.

Interactive documentation is available locally at:

- Swagger UI: https://localhost:8000/api/docs/
- Redoc: https://localhost:8000/api/redoc/

## Disclaimer

All user data, addresses, and reservations shown in the screenshots are fictional
and used for demonstration purposes only


## What I learned

- Designing REST APIs with Django REST Framework
- Implementing JWT-based authentication and authorization
- Working with relational databases (PostgreSQL)
- Managing environment variables and sensitive configuration
- Structuring a full-stack application (Django + React)
- Using Git with regular commits during development

The project was developed iteratively over several months with regular commits.
