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
```

```bash
npm start
```
### To start the client

create .env file in the client directory and add the following line

```
REACT_APP_API_URL=http://localhost:5000/api
```

```bash
cd client
npm install
npm start
```
