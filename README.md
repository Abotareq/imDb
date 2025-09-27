IMDB Clone API
A comprehensive movie and TV show database API built with Node.js, Express, and MongoDB. This RESTful API provides features similar to IMDB including entity management, user reviews, ratings, character information, articles, awards, and more. It now includes personalized recommendations based on user preferences and interactions.
📋 Table of Contents

Features
Tech Stack
Project Structure
Installation
Environment Variables
API Documentation
Database Models
Authentication & Authorization
File Upload
Usage Examples
Contributing
License

✨ Features
Core Features

Entity Management - Movies and TV shows with detailed information
User System - Registration, authentication, profiles with roles
Review System - User reviews with ratings (1-10) and comments
Character Database - Characters linked to actors and entities
Articles - User-generated content about movies/shows
Awards System - Award management for entities and people
Person Management - Actors, directors, writers database

Advanced Features

File Upload - Image uploads via Cloudinary integration
Search & Filtering - Advanced search across all entities
Rating System - Automatic rating calculations
Pagination - Efficient data loading
Role-based Access - User, Admin, and Verified user permissions
Data Validation - Comprehensive input validation
Error Handling - Structured error responses
Personalized Recommendations - Tailored content suggestions based on user reviews and preferences

🛠 Tech Stack

Backend: Node.js, Express.js
Database: MongoDB with Mongoose ODM
Authentication: JWT (JSON Web Tokens)
Validation: Joi
File Upload: Multer + Cloudinary
Documentation: Swagger/OpenAPI 3.0
Security: bcrypt, helmet, express-rate-limit

📁 Project Structure
imdb-clone/
├── controllers/ # Request handlers
│ ├── auth.controller.js
│ ├── user.controller.js
│ ├── entity.controller.js
│ ├── person.controller.js
│ ├── character.controller.js
│ ├── article.controller.js
│ ├── award.controller.js
│ ├── review.controller.js
│ └── recommendation.controller.js # New controller for recommendations
├── models/ # Database schemas
│ ├── user.model.js
│ ├── entity.model.js
│ ├── person.model.js
│ ├── character.model.js
│ ├── article.model.js
│ ├── award.model.js
│ └── review.model.js
├── routes/ # API routes
│ ├── auth.routes.js
│ ├── user.routes.js
│ ├── entity.routes.js
│ ├── person.routes.js
│ ├── character.routes.js
│ ├── article.routes.js
│ ├── award.routes.js
│ ├── review.routes.js
│ └── recommendation.routes.js # New route for recommendations
├── validations/ # Input validation schemas
├── middlewares/ # Custom middleware
├── utils/ # Utility functions
├── config/ # Configuration files
└── app.js # Application entry point

🚀 Installation

Clone the repository

git clone https://github.com/abootareq/imdb-clone.git
cd imdb-clone

Install dependencies

npm install

Set up environment variables

cp .env.example .env

# Edit .env with your configuration

Start the server

# Development mode

npm run dev

# Production mode

npm start

🔧 Environment Variables
Create a .env file in the root directory:

# Server Configuration

PORT=5000
NODE_ENV=development

# Database

MONGO_URI=mongodb://localhost:27017/imdb-clone

# JWT Configuration

JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d

# Cloudinary Configuration (for file uploads)

CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email Configuration (optional)

EMAIL_FROM=noreply@imdb-clone.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

📚 API Documentation
The API is fully documented using Swagger/OpenAPI 3.0. Once the server is running, visit:
http://localhost:5000/api-docs

Main Endpoints

Resource
Base URL
Description

Authentication
/api/auth
Login, register, password reset

Users
/api/users
User management

Entities
/api/entities
Movies and TV shows

People
/api/people
Actors, directors, writers

Characters
/api/characters
Character database

Articles
/api/articles
User articles

Awards
/api/awards
Award management

Reviews
/api/reviews
User reviews and ratings

Recommendations
/api/recommendations
Personalized content suggestions (requires authentication)

🗃 Database Models
Entity (Movies/TV Shows)

Title, description, release dates
Genres, directors, cast
Seasons and episodes (for TV shows)
Poster and cover images
Automatic rating calculation

Person (Actors/Directors/Writers)

Name, biography, date of birth
Photo, roles (actor/director/writer)
Linked to entities and characters

Review

User rating (1-10) and comment
One review per user per entity
Automatic entity rating updates

User

Authentication and profile management
Role-based permissions (user/admin)
Email verification system
Watchlist for tracking entities
Preferences for personalized recommendations

Character

Character name and description
Links actor to specific entity
Prevents duplicate character-actor combinations

Article

User-generated content about entities
Only verified users can create
Admins can moderate content

Award

Award name, category, year
Links to entities and/or people
Comprehensive award database

🔐 Authentication & Authorization
User Roles

User: Basic access, can create reviews
Verified User: Can create articles
Admin: Full access, moderation capabilities

Protected Routes

JWT-based authentication
Role-based access control
Middleware for route protection

Example Usage
// Public access
GET /api/entities

// Authenticated users only
POST /api/reviews
Authorization: Bearer <your-jwt-token>

// Admin only
DELETE /api/users/:id
Authorization: Bearer <admin-jwt-token>

📤 File Upload
Integrated Cloudinary for image uploads:

Entity images: Poster and cover images
Person photos: Profile pictures
Supported formats: JPG, PNG, WEBP
File size limit: 10MB per file
Automatic optimization: Cloudinary handles image processing

Upload Example
// Form-data request
POST /api/entities/movie
Content-Type: multipart/form-data

{
"title": "Movie Title",
"description": "Movie description",
"posterUrl": <image-file>,
"coverUrl": <image-file>
}

💡 Usage Examples
Create a Movie
curl -X POST http://localhost:5000/api/entities/movie \
 -H "Authorization: Bearer YOUR_JWT_TOKEN" \
 -F "title=Inception" \
 -F "description=A thief who enters dreams" \
 -F "type=movie" \
 -F 'genres=[{"name":"Sci-Fi","description":"Science Fiction"}]' \
 -F 'directors=["DIRECTOR_OBJECT_ID"]' \
 -F "posterUrl=@poster.jpg"

Create a Review
curl -X POST http://localhost:5000/api/reviews \
 -H "Authorization: Bearer YOUR_JWT_TOKEN" \
 -H "Content-Type: application/json" \
 -d '{
"entity": "ENTITY_OBJECT_ID",
"rating": 9,
"comment": "Amazing movie with great plot!"
}'

Get Recommendations
curl -X GET http://localhost:5000/api/recommendations \
 -H "Authorization: Bearer YOUR_JWT_TOKEN"

Search Entities
curl "http://localhost:5000/api/entities?search=batman&type=movie&page=1&limit=10"

🤝 Contributing

Fork the repository
Create your feature branch (git checkout -b feature/amazing-feature)
Commit your changes (git commit -m 'Add some amazing feature')
Push to the branch (git push origin feature/amazing-feature)
Open a Pull Request

Development Guidelines

Follow the existing code style
Add tests for new features
Update documentation for API changes
Ensure all tests pass before submitting

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
🙏 Acknowledgments

Inspired by IMDB's comprehensive movie database
Built with modern Node.js best practices
Community-driven development approach

Note: This is a learning project and not affiliated with IMDB. All data should be used for educational purposes only.
