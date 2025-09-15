# BoonBuilder API Documentation

This document provides comprehensive documentation for the BoonBuilder Web API, including all endpoints, request/response formats, authentication, and usage examples.

## Table of Contents
- [Overview](#overview)
- [Authentication](#authentication)
- [Base URL](#base-url)
- [Common Response Format](#common-response-format)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [Endpoints](#endpoints)
- [Data Models](#data-models)
- [Examples](#examples)

## Overview

The BoonBuilder API is a RESTful web service that provides access to Hades II game data and user build management. It supports creating, retrieving, updating, and sharing character builds with comprehensive boon and prerequisite information.

**API Version**: 1.0
**Protocol**: HTTPS
**Format**: JSON
**Architecture**: REST

## Authentication

### Public Endpoints
Most game data endpoints are publicly accessible and do not require authentication:
- Gods and boon information
- Weapon and aspect data
- Boon prerequisite validation
- Build sharing (read-only)

### Protected Endpoints
User-specific operations require JWT authentication:
- Creating and managing personal builds
- User account management
- Private build operations

### Authentication Flow
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "dGVzdC1yZWZyZXNo...",
  "expires": "2025-09-15T12:00:00Z",
  "user": {
    "id": "12345",
    "email": "user@example.com",
    "username": "player1"
  }
}
```

### Using Authentication
Include the JWT token in the Authorization header:
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

## Base URL

**Development**: `http://localhost:5291/api`
**Production**: `https://api.boonbuilder.com/api` (placeholder)

## Common Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Operation completed successfully"
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "totalCount": 156,
    "totalPages": 8,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

## Error Handling

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "INVALID_REQUEST",
    "message": "The request is invalid",
    "details": [
      "Field 'weaponAspectId' is required",
      "Boon ID 999 does not exist"
    ]
  }
}
```

### HTTP Status Codes
- `200 OK`: Request successful
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request parameters
- `401 Unauthorized`: Authentication required or failed
- `403 Forbidden`: Access denied
- `404 Not Found`: Resource not found
- `422 Unprocessable Entity`: Validation failed
- `500 Internal Server Error`: Server error

### Common Error Codes
- `INVALID_REQUEST`: Malformed or invalid request
- `VALIDATION_FAILED`: Request validation errors
- `UNAUTHORIZED`: Authentication required
- `FORBIDDEN`: Access denied
- `NOT_FOUND`: Requested resource not found
- `DUPLICATE_RESOURCE`: Resource already exists
- `PREREQUISITE_NOT_MET`: Boon prerequisites not satisfied

## Rate Limiting

- **Authenticated users**: 1000 requests per hour
- **Anonymous users**: 100 requests per hour
- **Build operations**: 50 creates/updates per hour

Rate limit headers are included in all responses:
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1694764800
```

## Endpoints

### Gods

#### Get All Gods
```http
GET /api/gods
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "godId": 1,
      "name": "Aphrodite",
      "iconUrl": "/images/gods/aphrodite.svg",
      "description": "Goddess of love and beauty",
      "primaryElement": "Air",
      "secondaryElement": null,
      "statusEffect": "Weak"
    }
  ]
}
```

#### Get God by ID
```http
GET /api/gods/{id}
```

#### Get God Boons
```http
GET /api/gods/{id}/boons
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "boonId": 1,
      "name": "Flutter Strike",
      "slot": 1,
      "description": "Your Attacks deal more damage to nearby foes",
      "effect": "Close-up Damage: +80%",
      "iconUrl": "/images/boons/core/flutter_strike.svg",
      "type": "Core",
      "element": "Air",
      "statusEffect": "Weak",
      "god": {
        "godId": 1,
        "name": "Aphrodite"
      }
    }
  ]
}
```

### Boons

#### Get Core Boons (Grouped by God)
```http
GET /api/boons/core
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "godId": 1,
      "godName": "Aphrodite",
      "godIcon": "/images/gods/aphrodite.svg",
      "boons": [
        {
          "boonId": 1,
          "name": "Flutter Strike",
          "slot": 1,
          "description": "Your Attacks deal more damage to nearby foes",
          "effect": "Close-up Damage: +80%",
          "iconUrl": "/images/boons/core/flutter_strike.svg",
          "element": "Air",
          "statusEffect": "Weak"
        }
      ]
    }
  ]
}
```

#### Get Available Boons
```http
POST /api/boons/available
Content-Type: application/json

[1, 6, 31]  // Array of selected boon IDs
```

**Response:**
```json
{
  "success": true,
  "data": {
    "duoBoons": [
      {
        "boonId": 107,
        "name": "Sunny Disposition",
        "iconUrl": "/images/boons/duo/sunny_disposition.webp",
        "description": "+2 bonus Heartthrobs",
        "effect": "+2 Heartthrobs",
        "type": "Duo",
        "isAvailable": true,
        "firstGod": {
          "godId": 1,
          "name": "Aphrodite"
        },
        "secondGod": {
          "godId": 2,
          "name": "Apollo"
        }
      }
    ],
    "legendaryBoons": [
      {
        "boonId": 201,
        "name": "Fire Away",
        "iconUrl": "/images/boons/legendary/fire_away.webp",
        "description": "400 Scorch damage every 3 seconds",
        "effect": "400 Scorch every 3s",
        "type": "Legendary",
        "isAvailable": false,
        "god": {
          "godId": 7,
          "name": "Hestia"
        }
      }
    ]
  }
}
```

#### Get Boon by ID
```http
GET /api/boons/{id}
```

#### Validate Boon Prerequisites
```http
POST /api/boons/{id}/validate
Content-Type: application/json

[1, 6, 31]  // Array of selected boon IDs
```

**Response:**
```json
{
  "success": true,
  "data": {
    "isValid": true,
    "missingPrerequisites": []
  }
}
```

### Weapons

#### Get All Weapons
```http
GET /api/weapons
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "weaponId": 1,
      "name": "Sister Blades",
      "description": "Swift striking melee weapons",
      "iconUrl": "/images/weapons/sister_blades.webp",
      "weaponType": "Melee",
      "aspects": [
        {
          "aspectId": 1,
          "name": "Aspect of Melinoë",
          "description": "The blade's natural form",
          "iconUrl": "/images/aspects/melinoe_blades.webp",
          "isDefault": true
        }
      ]
    }
  ]
}
```

#### Get Weapon by ID
```http
GET /api/weapons/{id}
```

### Builds

#### Get User Builds
```http
GET /api/builds
Authorization: Bearer {token}
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `pageSize` (optional): Items per page (default: 20)
- `search` (optional): Search builds by name
- `sortBy` (optional): Sort field (name, created, updated)
- `sortOrder` (optional): asc or desc (default: desc)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "buildId": "12345",
      "name": "Lightning Fast",
      "description": "High-speed Zeus build with Apollo synergy",
      "userId": "user123",
      "weaponAspectId": 1,
      "weaponAspect": {
        "aspectId": 1,
        "name": "Aspect of Melinoë",
        "weapon": {
          "weaponId": 1,
          "name": "Sister Blades"
        }
      },
      "coreBoons": [
        {
          "boonId": 41,
          "slot": 1,
          "boon": {
            "name": "Heaven Strike",
            "iconUrl": "/images/boons/core/heaven_strike.svg"
          }
        }
      ],
      "duoBoons": [
        {
          "boonId": 110,
          "boon": {
            "name": "Glorious Disaster",
            "iconUrl": "/images/boons/duo/glorious_disaster.webp"
          }
        }
      ],
      "legendaryBoons": [],
      "isPublic": true,
      "createdAt": "2025-09-15T10:00:00Z",
      "updatedAt": "2025-09-15T11:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "totalCount": 5,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPreviousPage": false
  }
}
```

#### Create Build
```http
POST /api/builds
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Lightning Fast",
  "description": "High-speed Zeus build with Apollo synergy",
  "weaponAspectId": 1,
  "coreBoons": [
    {
      "boonId": 41,
      "slot": 1
    },
    {
      "boonId": 7,
      "slot": 2
    }
  ],
  "duoBoons": [110],
  "legendaryBoons": [],
  "isPublic": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "buildId": "new-build-123",
    "name": "Lightning Fast",
    // ... full build object
  }
}
```

#### Get Build by ID
```http
GET /api/builds/{id}
```

#### Update Build
```http
PUT /api/builds/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Updated Build Name",
  // ... other build properties
}
```

#### Delete Build
```http
DELETE /api/builds/{id}
Authorization: Bearer {token}
```

#### Get Public Builds
```http
GET /api/builds/public
```

#### Share Build
```http
POST /api/builds/{id}/share
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "shareUrl": "https://boonbuilder.com/builds/shared/abc123",
    "shareCode": "abc123",
    "expiresAt": "2025-12-15T10:00:00Z"
  }
}
```

### User Management

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "player1",
  "password": "securepassword",
  "confirmPassword": "securepassword"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

#### Refresh Token
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "dGVzdC1yZWZyZXNo..."
}
```

#### Get User Profile
```http
GET /api/user/profile
Authorization: Bearer {token}
```

#### Update User Profile
```http
PUT /api/user/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "username": "newusername",
  "email": "newemail@example.com"
}
```

## Data Models

### Boon Slots
```typescript
enum BoonSlot {
  Attack = 1,
  Special = 2,
  Cast = 3,
  Sprint = 4,
  Magick = 6  // Note: 5 is skipped intentionally
}
```

### Boon Types
```typescript
enum BoonType {
  Core = 0,
  Duo = 1,
  Legendary = 2,
  Infusion = 3
}
```

### Element Types
```typescript
enum ElementType {
  Earth = 1,
  Air = 2,
  Water = 3,
  Fire = 4,
  Aether = 5
}
```

### Build Structure
```typescript
interface Build {
  buildId: string;
  name: string;
  description?: string;
  userId: string;
  weaponAspectId: number;
  coreBoons: CoreBoonSelection[];
  duoBoons: number[];
  legendaryBoons: number[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CoreBoonSelection {
  boonId: number;
  slot: BoonSlot;
}
```

## Examples

### Complete Build Creation Flow

1. **Get available weapons:**
```http
GET /api/weapons
```

2. **Get core boons for selected gods:**
```http
GET /api/boons/core
```

3. **Validate boon selection:**
```http
POST /api/boons/available
[1, 6, 31]  // Selected boon IDs
```

4. **Create the build:**
```http
POST /api/builds
{
  "name": "My Awesome Build",
  "weaponAspectId": 1,
  "coreBoons": [
    { "boonId": 1, "slot": 1 },
    { "boonId": 6, "slot": 1 }
  ],
  "duoBoons": [107],
  "isPublic": true
}
```

### Build Sharing Workflow

1. **Share a build:**
```http
POST /api/builds/12345/share
```

2. **Access shared build:**
```http
GET /api/builds/shared/abc123
```

### Prerequisite Validation

1. **Check if duo boon is available:**
```http
POST /api/boons/107/validate
[1, 6]  // Aphrodite + Apollo boons
```

2. **Get all available duo/legendary boons:**
```http
POST /api/boons/available
[1, 6, 31, 41]  // Multiple god selections
```

## Development Tools

### Postman Collection
A Postman collection with all endpoints and example requests is available in the repository at `docs/postman/BoonBuilder.postman_collection.json`.

### OpenAPI/Swagger
When running in development mode, the API documentation is available at:
```
http://localhost:5291/swagger
```

### REST Client Examples
For VS Code REST Client extension, example requests are in `docs/rest-client/api-examples.http`.

## Changelog

API changes are documented in the main [CHANGELOG.md](CHANGELOG.md) file. Breaking changes to the API will increment the major version number.

## Support

For API questions, bug reports, or feature requests:
- Create an issue in the GitHub repository
- Check existing documentation in the `/docs` folder
- Refer to the [CONTRIBUTING.md](CONTRIBUTING.md) guide for development setup

---

**Last Updated**: September 15, 2025
**API Version**: 1.0