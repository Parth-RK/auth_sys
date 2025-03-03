# auth_sys

A full-stack authentication system with user login/signup interface.

## To run 

```bash
git clone https://github.com/Parth-RK/auth_sys.git
cd  auth_sys
npm install
```
### To start the server

create .env file in  the root directory and add the following lines

```
JWT_SECRET=your_jwt_secret_here
MONGODB_URI==mongodb+srv://<db_admin>:<db_password>@cluster0.zej6a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
PORT=5000
NODE_ENV=production

FRONTEND_URL=https://example.com

# API Configuration
API_PREFIX=/api
AUTH_ROUTE=/auth
USERS_ROUTE=/users
HEALTH_ROUTE=/health
CORS_TEST_ROUTE=/cors-test
```

```bash
npm start
```
### To start the client

create .env file in the client directory and add the following line

```
# REACT_APP_BACKEND_URL=http://localhost:5000 #for local

REACT_APP_BACKEND_URL=https://auth-sys-backend.onrender.com
```

```bash
cd client
npm install
npm start
```
