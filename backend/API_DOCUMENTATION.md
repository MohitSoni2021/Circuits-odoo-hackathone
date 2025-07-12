# ReWear API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a Firebase ID token in the Authorization header:
```
Authorization: Bearer <firebase-id-token>
```

## Endpoints

### Authentication

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "firebaseUid": "string",
  "email": "string",
  "name": "string",
  "avatar": "string (optional)"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "string",
    "firebaseUid": "string",
    "email": "string",
    "name": "string",
    "role": "user",
    "points": 50,
    "avatar": "string"
  }
}
```

#### Get User Profile
```http
GET /auth/profile/:firebaseUid
Authorization: Bearer <token>
```

**Response:**
```json
{
  "user": {
    "id": "string",
    "firebaseUid": "string",
    "email": "string",
    "name": "string",
    "role": "user|admin",
    "points": 50,
    "avatar": "string"
  }
}
```

#### Update User Profile
```http
PUT /auth/profile/:firebaseUid
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "string (optional)",
  "avatar": "string (optional)"
}
```

#### Update User Points
```http
PUT /auth/points/:firebaseUid
Authorization: Bearer <token>
Content-Type: application/json

{
  "points": 100,
  "operation": "add|subtract"
}
```

### Items

#### Get All Items
```http
GET /items?status=available&category=Tops&approved=true
```

**Query Parameters:**
- `status`: available, pending, swapped
- `category`: Tops, Bottoms, Dresses, Outerwear, Shoes, Accessories
- `approved`: true, false

**Response:**
```json
{
  "items": [
    {
      "_id": "string",
      "title": "string",
      "description": "string",
      "category": "string",
      "type": "string",
      "size": "string",
      "condition": "string",
      "tags": ["string"],
      "images": ["string"],
      "uploaderId": "string",
      "uploaderName": "string",
      "pointsRequired": 50,
      "status": "available",
      "approved": true,
      "createdAt": "date",
      "updatedAt": "date"
    }
  ]
}
```

#### Get Item by ID
```http
GET /items/:id
```

#### Create Item
```http
POST /items
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "string",
  "description": "string",
  "category": "string",
  "type": "string",
  "size": "string",
  "condition": "string",
  "tags": ["string"],
  "images": ["string"],
  "pointsRequired": 50
}
```

#### Update Item
```http
PUT /items/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "string (optional)",
  "description": "string (optional)",
  "category": "string (optional)",
  "type": "string (optional)",
  "size": "string (optional)",
  "condition": "string (optional)",
  "tags": ["string"] (optional),
  "images": ["string"] (optional),
  "pointsRequired": 50 (optional)
}
```

#### Delete Item
```http
DELETE /items/:id
Authorization: Bearer <token>
```

#### Approve Item (Admin Only)
```http
PUT /items/:id/approve
Authorization: Bearer <token>
Content-Type: application/json

{
  "approved": true
}
```

#### Get User Items
```http
GET /items/user/items
Authorization: Bearer <token>
```

### Swaps

#### Get Swap Requests
```http
GET /swaps?status=pending
Authorization: Bearer <token>
```

**Query Parameters:**
- `status`: pending, accepted, rejected

**Response:**
```json
{
  "swapRequests": [
    {
      "_id": "string",
      "fromUserId": {
        "_id": "string",
        "name": "string",
        "email": "string"
      },
      "toUserId": {
        "_id": "string",
        "name": "string",
        "email": "string"
      },
      "itemId": {
        "_id": "string",
        "title": "string",
        "images": ["string"]
      },
      "offerItemId": {
        "_id": "string",
        "title": "string",
        "images": ["string"]
      },
      "pointsOffered": 50,
      "status": "pending",
      "message": "string",
      "createdAt": "date",
      "updatedAt": "date"
    }
  ]
}
```

#### Create Swap Request
```http
POST /swaps
Authorization: Bearer <token>
Content-Type: application/json

{
  "toUserId": "string",
  "itemId": "string",
  "offerItemId": "string (optional)",
  "pointsOffered": 50 (optional),
  "message": "string (optional)"
}
```

#### Update Swap Request
```http
PUT /swaps/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "accepted|rejected"
}
```

#### Delete Swap Request
```http
DELETE /swaps/:id
Authorization: Bearer <token>
```

## Error Responses

### 400 Bad Request
```json
{
  "message": "Missing required fields"
}
```

### 401 Unauthorized
```json
{
  "message": "Access token required"
}
```

### 403 Forbidden
```json
{
  "message": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "message": "Item not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Internal server error"
}
```

## Role-Based Access Control

### User Permissions
- Create, update, delete their own items
- Browse all approved items
- Create swap requests
- Update their own profile
- View their own swap requests

### Admin Permissions
- All user permissions
- Approve/reject items
- Access all data
- Manage user roles (future feature)

## Data Validation

### Item Validation
- Title: required, max 100 characters
- Description: required, max 500 characters
- Category: required, must be one of predefined values
- Size: required, must be one of predefined values
- Condition: required, must be one of predefined values
- Points Required: required, min 0, max 1000
- Images: required, array of strings

### User Validation
- Email: required, unique, valid email format
- Name: required, max 100 characters
- Firebase UID: required, unique

### Swap Request Validation
- Target item must exist and be available
- User cannot swap their own item
- Offer item must belong to requesting user (if provided)
- User must have sufficient points (if offering points) 