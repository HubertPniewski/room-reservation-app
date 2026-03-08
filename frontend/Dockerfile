FROM node:20-slim
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# -- host to make it visible outside of the container
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]