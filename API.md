# API Documentation

**Base URL:** `https://leadmgmt-9rx3.onrender.com/api`

---

## Authentication

All protected routes require a Bearer token in the header:

```
Authorization: Bearer <token>
```

---

## Auth Endpoints

### Register
```
POST /auth/register
```

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456",
  "role": "admin"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGci...",
    "user": {
      "_id": "64f...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "admin"
    }
  }
}
```

---

### Login
```
POST /auth/login
```

**Body:**
```json
{
  "email": "john@example.com",
  "password": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGci...",
    "user": {
      "_id": "64f...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "admin"
    }
  }
}
```

---

## Leads Endpoints

All leads endpoints require authentication.

---

### Get All Leads
```
GET /leads
```

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | Page number (default: 1) |
| status | string | New, Contacted, Qualified, Lost |
| source | string | Website, Instagram, Referral |
| search | string | Search by name or email |
| sort | string | latest or oldest |

**Example:**
```
GET /leads?page=1&status=Qualified&source=Instagram&search=rahul&sort=latest
```

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 47,
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

### Get Single Lead
```
GET /leads/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "64f...",
    "name": "Rahul Sharma",
    "email": "rahul@example.com",
    "status": "Qualified",
    "source": "Instagram",
    "createdAt": "2026-05-17T00:00:00.000Z",
    "createdBy": {
      "_id": "64f...",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

---

### Create Lead
```
POST /leads
```
*Requires: Admin or Sales role*

**Body:**
```json
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "status": "New",
  "source": "Instagram"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Lead created successfully",
  "data": { ...lead }
}
```

---

### Update Lead
```
PUT /leads/:id
```
*Requires: Admin or Sales role (Sales can only update own leads)*

**Body:**
```json
{
  "status": "Qualified"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Lead updated successfully",
  "data": { ...lead }
}
```

---

### Delete Lead
```
DELETE /leads/:id
```
*Requires: Admin role only*

**Response:**
```json
{
  "success": true,
  "message": "Lead deleted successfully"
}
```

---

### Export Leads as CSV
```
GET /leads/export
```
*Requires: Admin role only*

Returns a downloadable `leads.csv` file.

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Error description here"
}
```

| Status Code | Meaning |
|-------------|---------|
| 400 | Bad Request — validation error |
| 401 | Unauthorized — missing or invalid token |
| 403 | Forbidden — insufficient role permissions |
| 404 | Not Found |
| 500 | Internal Server Error |