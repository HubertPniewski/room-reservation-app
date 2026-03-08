#!/bin/bash

# 1. Create a virtual envinronment
python3 -m venv venv
source venv/bin/activate

# 2. Install libaries
python3 -m pip install -r requirements.txt

# 3. Automatic preraration of example .env from .env.example
if [ ! -f .env ]; then
	if [ -f .env.example ]; then
		cp .env.example .env
		echo "Created .env file based on .env.example"
		echo "Use this file for local tests and development ONLY!"
	else 
		echo "SECRET_KEY=" > .env
		echo "DEBUG=True" >> .env
		echo "'.env.example' not found! Create empty .env"
	fi
fi

# 4. New secret key generation
# generate a random string to replace default SECRET_KEY from .env.example
NEW_KEY=$(python3 -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())')
sed -i "s|SECRET_KEY=.*|SECRET_KEY='$NEW_KEY'|" .env
echo "Generated a new unique SECRET_KEY in .env file."

# 5. Database migration
python3 booking_app/manage.py migrate
