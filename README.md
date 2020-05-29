# Petify
## Endpoints
### User
```
GET:    /api/user/validate-user
  Validates if user session is still active
  
POST:   /api/user/register
  Create a new user
  
POST:   /api/user/login
  User login
  
GET:    /api/user/:id
  Fetch user data by id
  
PATCH:  /api/user/:id
  Update user information
  
GET     /api/user/:id/mypets
  Fetch all pets posted by a user
```
### Pet
```
GET:    /api/pets/
  Get all pets
  
POST:   /api/pets/
  Post a pet
  
GET:    /api/pets/index
  Get the latest 9 published pets
  
DELETE: /api/pets/:id
  Delete a pet
  
GET:    /api/pets/:id
  Get a pet by id
  
PATCH:  /api/pets/:id
  Update a pet by id
```
