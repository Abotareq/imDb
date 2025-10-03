/**
 * @swagger
 * tags:
 *   name: Entities
 *   description: API for managing movies and TV shows
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Genre:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the genre
 *           example: "Action"
 *         description:
 *           type: string
 *           description: Brief description of the genre
 *           example: "Features high-energy action sequences and intense combat"
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ID for the genre
 *           example: "66f8b3f4f1234567890abcde"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the genre was created
 *           example: "2025-01-15T10:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the genre was last updated
 *           example: "2025-01-15T10:00:00.000Z"
 *
 *     Episode:
 *       type: object
 *       required:
 *         - title
 *         - episodeNumber
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ID for the episode
 *           example: "66f8b3f4f1234567890abcdf"
 *         title:
 *           type: string
 *           description: Title of the episode
 *           example: "Winter Is Coming"
 *         episodeNumber:
 *           type: number
 *           description: Episode number in the season
 *           example: 1
 *         description:
 *           type: string
 *           description: Brief description of the episode
 *           example: "Ned Stark is introduced as the Warden of the North"
 *         releaseDate:
 *           type: string
 *           format: date
 *           description: Release date of the episode
 *           example: "2011-04-17"
 *         duration:
 *           type: number
 *           description: Duration of the episode in minutes
 *           example: 62
 *         thumbnailUrl:
 *           type: string
 *           description: URL of the episode thumbnail image
 *           example: "https://res.cloudinary.com/example/s1e1-thumb.jpg"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the episode was created
 *           example: "2025-01-15T10:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the episode was last updated
 *           example: "2025-01-15T10:00:00.000Z"
 *
 *     Season:
 *       type: object
 *       required:
 *         - seasonNumber
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ID for the season
 *           example: "66f8b3f4f1234567890abcd0"
 *         seasonNumber:
 *           type: number
 *           description: Season number
 *           example: 1
 *         description:
 *           type: string
 *           description: Brief description of the season
 *           example: "The Starks face political intrigue and threats"
 *         posterUrl:
 *           type: string
 *           description: URL of the season poster image
 *           example: "https://res.cloudinary.com/example/season1-poster.jpg"
 *         coverUrl:
 *           type: string
 *           description: URL of the season cover/banner image
 *           example: "https://res.cloudinary.com/example/season1-cover.jpg"
 *         rating:
 *           type: number
 *           description: Average rating for the season (0-10)
 *           example: 8.8
 *           default: 0
 *         episodes:
 *           type: array
 *           description: List of episodes in the season
 *           items:
 *             $ref: '#/components/schemas/Episode'
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the season was created
 *           example: "2025-01-15T10:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the season was last updated
 *           example: "2025-01-15T10:00:00.000Z"
 *
 *     Entity:
 *       type: object
 *       required:
 *         - title
 *         - type
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ID of the entity
 *           example: "66f8b3f4f1234567890abcd1"
 *         type:
 *           type: string
 *           enum: ["movie", "tv"]
 *           description: Type of entity (movie or TV show)
 *           example: "movie"
 *         title:
 *           type: string
 *           description: Title of the movie or TV show
 *           example: "The Dark Knight"
 *         description:
 *           type: string
 *           description: Brief description of the entity
 *           example: "Batman faces the Joker in a battle for Gotham's soul"
 *         releaseDate:
 *           type: string
 *           format: date
 *           description: Release date of the movie or TV show
 *           example: "2008-07-18"
 *         endDate:
 *           type: string
 *           format: date
 *           description: End date for TV shows (optional for movies)
 *           example: "2013-09-29"
 *         genres:
 *           type: array
 *           description: List of genres associated with the entity
 *           items:
 *             $ref: '#/components/schemas/Genre'
 *         directors:
 *           type: array
 *           description: List of director MongoDB IDs
 *           items:
 *             type: string
 *             example: "66f8b3f4f1234567890abcd2"
 *         cast:
 *           type: array
 *           description: List of cast member MongoDB IDs
 *           items:
 *             type: string
 *             example: "66f8b3f4f1234567890abcd3"
 *         seasons:
 *           type: array
 *           description: List of seasons (applicable for TV shows only)
 *           items:
 *             $ref: '#/components/schemas/Season'
 *         posterUrl:
 *           type: string
 *           description: URL of the poster image
 *           example: "https://res.cloudinary.com/example/dark-knight-poster.jpg"
 *         coverUrl:
 *           type: string
 *           description: URL of the cover/banner image
 *           example: "https://res.cloudinary.com/example/dark-knight-cover.jpg"
 *         rating:
 *           type: number
 *           description: Average rating based on reviews (0-10)
 *           example: 9.0
 *           default: 0
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the entity was created
 *           example: "2025-01-15T10:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the entity was last updated
 *           example: "2025-01-15T10:00:00.000Z"
 *       example:
 *         _id: "66f8b3f4f1234567890abcd1"
 *         type: "movie"
 *         title: "The Dark Knight"
 *         description: "Batman faces the Joker in a battle for Gotham's soul"
 *         releaseDate: "2008-07-18"
 *         genres:
 *           - name: "Action"
 *             description: "High-energy action sequences"
 *             _id: "66f8b3f4f1234567890abcde"
 *           - name: "Crime"
 *             description: "Focuses on criminal activities and justice"
 *             _id: "66f8b3f4f1234567890abcdf"
 *         directors: ["66f8b3f4f1234567890abcd2"]
 *         cast: ["66f8b3f4f1234567890abcd3", "66f8b3f4f1234567890abcd4"]
 *         posterUrl: "https://res.cloudinary.com/example/dark-knight-poster.jpg"
 *         coverUrl: "https://res.cloudinary.com/example/dark-knight-cover.jpg"
 *         rating: 9.0
 *         createdAt: "2025-01-15T10:00:00.000Z"
 *         updatedAt: "2025-01-15T10:00:00.000Z"
 *
 *     CreateMovieRequest:
 *       type: object
 *       required:
 *         - title
 *         - type
 *       properties:
 *         title:
 *           type: string
 *           description: Title of the movie
 *           example: "Inception"
 *         description:
 *           type: string
 *           description: Brief description of the movie
 *           example: "A skilled thief infiltrates dreams to steal secrets"
 *         releaseDate:
 *           type: string
 *           format: date
 *           description: Release date of the movie
 *           example: "2010-07-16"
 *         type:
 *           type: string
 *           enum: ["movie"]
 *           description: Type of entity (must be 'movie')
 *           example: "movie"
 *         genres:
 *           type: string
 *           description: JSON string of genres array
 *           example: '[{"name":"Sci-Fi","description":"Explores futuristic concepts"},{"name":"Thriller","description":"Suspenseful storytelling"}]'
 *         directors:
 *           type: string
 *           description: JSON string of director MongoDB IDs
 *           example: '["66f8b3f4f1234567890abcd2"]'
 *         cast:
 *           type: string
 *           description: JSON string of cast member MongoDB IDs
 *           example: '["66f8b3f4f1234567890abcd3","66f8b3f4f1234567890abcd4"]'
 *         posterUrl:
 *           type: string
 *           format: binary
 *           description: Poster image file (JPG, PNG, WEBP)
 *         coverUrl:
 *           type: string
 *           format: binary
 *           description: Cover/banner image file (JPG, PNG, WEBP)
 *       example:
 *         title: "Inception"
 *         description: "A skilled thief infiltrates dreams to steal secrets"
 *         releaseDate: "2010-07-16"
 *         type: "movie"
 *         genres: '[{"name":"Sci-Fi","description":"Explores futuristic concepts"},{"name":"Thriller","description":"Suspenseful storytelling"}]'
 *         directors: '["66f8b3f4f1234567890abcd2"]'
 *         cast: '["66f8b3f4f1234567890abcd3","66f8b3f4f1234567890abcd4"]'
 *
 *     CreateTVRequest:
 *       type: object
 *       required:
 *         - title
 *         - type
 *       properties:
 *         title:
 *           type: string
 *           description: Title of the TV show
 *           example: "Game of Thrones"
 *         description:
 *           type: string
 *           description: Brief description of the TV show
 *           example: "Noble families fight for control of the Iron Throne"
 *         releaseDate:
 *           type: string
 *           format: date
 *           description: Start date of the TV show
 *           example: "2011-04-17"
 *         endDate:
 *           type: string
 *           format: date
 *           description: End date of the TV show (optional)
 *           example: "2019-05-19"
 *         type:
 *           type: string
 *           enum: ["tv"]
 *           description: Type of entity (must be 'tv')
 *           example: "tv"
 *         genres:
 *           type: string
 *           description: JSON string of genres array
 *           example: '[{"name":"Fantasy","description":"Mythical and magical elements"},{"name":"Drama","description":"Intense character-driven storytelling"}]'
 *         directors:
 *           type: string
 *           description: JSON string of director MongoDB IDs
 *           example: '["66f8b3f4f1234567890abcd2","66f8b3f4f1234567890abcd5"]'
 *         cast:
 *           type: string
 *           description: JSON string of cast member MongoDB IDs
 *           example: '["66f8b3f4f1234567890abcd3","66f8b3f4f1234567890abcd4","66f8b3f4f1234567890abcd6"]'
 *         seasons:
 *           type: string
 *           description: JSON string of seasons array with episodes
 *           example: '[{"seasonNumber":1,"description":"The Starks face political intrigue","posterUrl":"https://res.cloudinary.com/example/season1-poster.jpg","coverUrl":"https://res.cloudinary.com/example/season1-cover.jpg","rating":0,"episodes":[{"title":"Winter Is Coming","episodeNumber":1,"description":"Ned Stark is introduced as the Warden of the North","releaseDate":"2011-04-17","duration":62,"thumbnailUrl":"https://res.cloudinary.com/example/s1e1-thumb.jpg"},{"title":"The Kingsroad","episodeNumber":2,"description":"The Starks travel south to King’s Landing","releaseDate":"2011-04-24","duration":56,"thumbnailUrl":"https://res.cloudinary.com/example/s1e2-thumb.jpg"}]}]'
 *         posterUrl:
 *           type: string
 *           format: binary
 *           description: Series poster image file (JPG, PNG, WEBP)
 *         coverUrl:
 *           type: string
 *           format: binary
 *           description: Series cover/banner image file (JPG, PNG, WEBP)
 *       example:
 *         title: "Game of Thrones"
 *         description: "Noble families fight for control of the Iron Throne"
 *         releaseDate: "2011-04-17"
 *         endDate: "2019-05-19"
 *         type: "tv"
 *         genres: '[{"name":"Fantasy","description":"Mythical and magical elements"},{"name":"Drama","description":"Intense character-driven storytelling"}]'
 *         directors: '["66f8b3f4f1234567890abcd2","66f8b3f4f1234567890abcd5"]'
 *         cast: '["66f8b3f4f1234567890abcd3","66f8b3f4f1234567890abcd4","66f8b3f4f1234567890abcd6"]'
 *         seasons: '[{"seasonNumber":1,"description":"The Starks face political intrigue","posterUrl":"https://res.cloudinary.com/example/season1-poster.jpg","coverUrl":"https://res.cloudinary.com/example/season1-cover.jpg","rating":0,"episodes":[{"title":"Winter Is Coming","episodeNumber":1,"description":"Ned Stark is introduced as the Warden of the North","releaseDate":"2011-04-17","duration":62,"thumbnailUrl":"https://res.cloudinary.com/example/s1e1-thumb.jpg"},{"title":"The Kingsroad","episodeNumber":2,"description":"The Starks travel south to King’s Landing","releaseDate":"2011-04-24","duration":56,"thumbnailUrl":"https://res.cloudinary.com/example/s1e2-thumb.jpg"}]}]'
 *
 *     TVShowComplete:
 *       type: object
 *       description: Complete TV show with all nested data
 *       properties:
 *         _id:
 *           type: string
 *           example: "66f8b3f4f1234567890abcd1"
 *         type:
 *           type: string
 *           example: "tv"
 *         title:
 *           type: string
 *           example: "Game of Thrones"
 *         description:
 *           type: string
 *           example: "Noble families fight for control of the Iron Throne"
 *         releaseDate:
 *           type: string
 *           format: date
 *           example: "2011-04-17"
 *         endDate:
 *           type: string
 *           format: date
 *           example: "2019-05-19"
 *         genres:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Genre'
 *           example:
 *             - name: "Fantasy"
 *               description: "Mythical and magical elements"
 *               _id: "66f8b3f4f1234567890abcde"
 *             - name: "Drama"
 *               description: "Intense character-driven storytelling"
 *               _id: "66f8b3f4f1234567890abcdf"
 *         directors:
 *           type: array
 *           items:
 *             type: string
 *           example: ["66f8b3f4f1234567890abcd2","66f8b3f4f1234567890abcd5"]
 *         cast:
 *           type: array
 *           items:
 *             type: string
 *           example: ["66f8b3f4f1234567890abcd3","66f8b3f4f1234567890abcd4","66f8b3f4f1234567890abcd6"]
 *         seasons:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Season'
 *           example:
 *             - seasonNumber: 1
 *               description: "The Starks face political intrigue"
 *               posterUrl: "https://res.cloudinary.com/example/season1-poster.jpg"
 *               coverUrl: "https://res.cloudinary.com/example/season1-cover.jpg"
 *               rating: 8.8
 *               episodes:
 *                 - title: "Winter Is Coming"
 *                   episodeNumber: 1
 *                   description: "Ned Stark is introduced as the Warden of the North"
 *                   releaseDate: "2011-04-17"
 *                   duration: 62
 *                   thumbnailUrl: "https://res.cloudinary.com/example/s1e1-thumb.jpg"
 *                 - title: "The Kingsroad"
 *                   episodeNumber: 2
 *                   description: "The Starks travel south to King’s Landing"
 *                   releaseDate: "2011-04-24"
 *                   duration: 56
 *                   thumbnailUrl: "https://res.cloudinary.com/example/s1e2-thumb.jpg"
 *         posterUrl:
 *           type: string
 *           example: "https://res.cloudinary.com/example/got-poster.jpg"
 *         coverUrl:
 *           type: string
 *           example: "https://res.cloudinary.com/example/got-cover.jpg"
 *         rating:
 *           type: number
 *           example: 9.3
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-01-15T10:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-01-15T10:00:00.000Z"
 *
 *     UpdateEntityRequest:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: Updated title of the entity
 *           example: "The Dark Knight Rises"
 *         description:
 *           type: string
 *           description: Updated description of the entity
 *           example: "Batman faces Bane in the final chapter of the trilogy"
 *         releaseDate:
 *           type: string
 *           format: date
 *           description: Updated release date
 *           example: "2012-07-20"
 *         endDate:
 *           type: string
 *           format: date
 *           description: Updated end date (for TV shows)
 *           example: "2019-05-19"
 *         genres:
 *           type: string
 *           description: JSON string of updated genres array
 *           example: '[{"name":"Action","description":"High-energy action sequences"},{"name":"Drama","description":"Character-driven storytelling"}]'
 *         directors:
 *           type: string
 *           description: JSON string of updated director MongoDB IDs
 *           example: '["66f8b3f4f1234567890abcd2"]'
 *         cast:
 *           type: string
 *           description: JSON string of updated cast member MongoDB IDs
 *           example: '["66f8b3f4f1234567890abcd3","66f8b3f4f1234567890abcd4"]'
 *         seasons:
 *           type: string
 *           description: JSON string of updated seasons array (for TV shows)
 *           example: '[{"seasonNumber":1,"description":"Updated season description","posterUrl":"https://res.cloudinary.com/example/season1-poster-updated.jpg","coverUrl":"https://res.cloudinary.com/example/season1-cover-updated.jpg","rating":0,"episodes":[{"title":"Winter Is Coming","episodeNumber":1,"description":"Updated episode description","releaseDate":"2011-04-17","duration":62,"thumbnailUrl":"https://res.cloudinary.com/example/s1e1-thumb-updated.jpg"}]}]'
 *         posterUrl:
 *           type: string
 *           format: binary
 *           description: Updated poster image file (JPG, PNG, WEBP)
 *         coverUrl:
 *           type: string
 *           format: binary
 *           description: Updated cover/banner image file (JPG, PNG, WEBP)
 *       example:
 *         title: "The Dark Knight Rises"
 *         description: "Batman faces Bane in the final chapter of the trilogy"
 *         releaseDate: "2012-07-20"
 *         genres: '[{"name":"Action","description":"High-energy action sequences"},{"name":"Drama","description":"Character-driven storytelling"}]'
 *         directors: '["66f8b3f4f1234567890abcd2"]'
 *         cast: '["66f8b3f4f1234567890abcd3","66f8b3f4f1234567890abcd4"]'
 *
 *     Error:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: "Invalid entity ID format"
 *         error:
 *           type: string
 *           example: "The provided ID does not match the MongoDB ObjectId format"
 *
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /api/entities:
 *   get:
 *     summary: Retrieve all entities with pagination and filtering
 *     tags: [Entities]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: ["movie", "tv"]
 *         description: Filter entities by type (movie or TV show)
 *         example: "movie"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of entities per page
 *         example: 10
 *       - in: query
 *         name: genre
 *         schema:
 *           type: string
 *         description: Filter by genre name
 *         example: "Action"
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Filter by release year
 *         example: 2020
 *     responses:
 *       200:
 *         description: Successfully retrieved entities
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 entities:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Entity'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 50
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     pages:
 *                       type: integer
 *                       example: 5
 *             example:
 *               success: true
 *               entities:
 *                 - _id: "66f8b3f4f1234567890abcd1"
 *                   type: "movie"
 *                   title: "The Dark Knight"
 *                   description: "Batman faces the Joker in a battle for Gotham's soul"
 *                   releaseDate: "2008-07-18"
 *                   genres:
 *                     - name: "Action"
 *                       description: "High-energy action sequences"
 *                     - name: "Crime"
 *                       description: "Focuses on criminal activities and justice"
 *                   directors: ["66f8b3f4f1234567890abcd2"]
 *                   cast: ["66f8b3f4f1234567890abcd3", "66f8b3f4f1234567890abcd4"]
 *                   posterUrl: "https://res.cloudinary.com/example/dark-knight-poster.jpg"
 *                   coverUrl: "https://res.cloudinary.com/example/dark-knight-cover.jpg"
 *                   rating: 9.0
 *                   createdAt: "2025-01-15T10:00:00.000Z"
 *                   updatedAt: "2025-01-15T10:00:00.000Z"
 *               pagination:
 *                 total: 50
 *                 page: 1
 *                 limit: 10
 *                 pages: 5
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Server error"
 *               error: "Internal server error occurred while fetching entities"
 */

/**
 * @swagger
 * /api/entities/{id}:
 *   get:
 *     summary: Retrieve an entity by its ID
 *     tags: [Entities]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: MongoDB ObjectId of the entity
 *         example: "66f8b3f4f1234567890abcd1"
 *     responses:
 *       200:
 *         description: Successfully retrieved entity
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 entity:
 *                   $ref: '#/components/schemas/Entity'
 *             example:
 *               success: true
 *               entity:
 *                 _id: "66f8b3f4f1234567890abcd1"
 *                 type: "movie"
 *                 title: "The Dark Knight"
 *                 description: "Batman faces the Joker in a battle for Gotham's soul"
 *                 releaseDate: "2008-07-18"
 *                 genres:
 *                   - name: "Action"
 *                     description: "High-energy action sequences"
 *                   - name: "Crime"
 *                     description: "Focuses on criminal activities and justice"
 *                 directors: ["66f8b3f4f1234567890abcd2"]
 *                 cast: ["66f8b3f4f1234567890abcd3", "66f8b3f4f1234567890abcd4"]
 *                 posterUrl: "https://res.cloudinary.com/example/dark-knight-poster.jpg"
 *                 coverUrl: "https://res.cloudinary.com/example/dark-knight-cover.jpg"
 *                 rating: 9.0
 *                 createdAt: "2025-01-15T10:00:00.000Z"
 *                 updatedAt: "2025-01-15T10:00:00.000Z"
 *       400:
 *         description: Invalid entity ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Invalid entity ID format"
 *               error: "The provided ID does not match the MongoDB ObjectId format"
 *       404:
 *         description: Entity not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Entity not found"
 *               error: "No entity found with the provided ID"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Server error"
 *               error: "Internal server error occurred while fetching entity"
 */

/**
 * @swagger
 * /api/entities/movie:
 *   post:
 *     summary: Create a new movie (Admin only)
 *     tags: [Entities]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/CreateMovieRequest'
 *           example:
 *             title: "Inception"
 *             description: "A skilled thief infiltrates dreams to steal secrets"
 *             releaseDate: "2010-07-16"
 *             type: "movie"
 *             genres: '[{"name":"Sci-Fi","description":"Explores futuristic concepts"},{"name":"Thriller","description":"Suspenseful storytelling"}]'
 *             directors: '["66f8b3f4f1234567890abcd2"]'
 *             cast: '["66f8b3f4f1234567890abcd3","66f8b3f4f1234567890abcd4"]'
 *             posterUrl: binary
 *             coverUrl: binary
 *     responses:
 *       201:
 *         description: Movie created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "movie created successfully"
 *                 entity:
 *                   $ref: '#/components/schemas/Entity'
 *             example:
 *               success: true
 *               message: "movie created successfully"
 *               entity:
 *                 _id: "66f8b3f4f1234567890abcd1"
 *                 type: "movie"
 *                 title: "Inception"
 *                 description: "A skilled thief infiltrates dreams to steal secrets"
 *                 releaseDate: "2010-07-16"
 *                 genres:
 *                   - name: "Sci-Fi"
 *                     description: "Explores futuristic concepts"
 *                   - name: "Thriller"
 *                     description: "Suspenseful storytelling"
 *                 directors: ["66f8b3f4f1234567890abcd2"]
 *                 cast: ["66f8b3f4f1234567890abcd3", "66f8b3f4f1234567890abcd4"]
 *                 posterUrl: "https://res.cloudinary.com/example/inception-poster.jpg"
 *                 coverUrl: "https://res.cloudinary.com/example/inception-cover.jpg"
 *                 rating: 0
 *                 createdAt: "2025-01-15T10:00:00.000Z"
 *                 updatedAt: "2025-01-15T10:00:00.000Z"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Validation error"
 *               error: "Title is required"
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Unauthorized"
 *               error: "No valid JWT token provided"
 *       403:
 *         description: Forbidden - Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Forbidden"
 *               error: "Admin access required"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Server error"
 *               error: "Internal server error occurred while creating movie"
 */

/**
 * @swagger
 * /api/entities/tv:
 *   post:
 *     summary: Create a new TV show with seasons and episodes (Admin only)
 *     tags: [Entities]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/CreateTVRequest'
 *           example:
 *             title: "Game of Thrones"
 *             description: "Noble families fight for control of the Iron Throne"
 *             releaseDate: "2011-04-17"
 *             endDate: "2019-05-19"
 *             type: "tv"
 *             genres: '[{"name":"Fantasy","description":"Mythical and magical elements"},{"name":"Drama","description":"Intense character-driven storytelling"}]'
 *             directors: '["66f8b3f4f1234567890abcd2","66f8b3f4f1234567890abcd5"]'
 *             cast: '["66f8b3f4f1234567890abcd3","66f8b3f4f1234567890abcd4","66f8b3f4f1234567890abcd6"]'
 *             seasons: '[{"seasonNumber":1,"description":"The Starks face political intrigue","posterUrl":"","coverUrl":"","rating":0,"episodes":[{"title":"Winter Is Coming","episodeNumber":1,"description":"Ned Stark is introduced as the Warden of the North","releaseDate":"2011-04-17","duration":62,"thumbnailUrl":""},{"title":"The Kingsroad","episodeNumber":2,"description":"The Starks travel south to King’s Landing","releaseDate":"2011-04-24","duration":56,"thumbnailUrl":""}]}]'
 *             posterUrl: binary
 *             coverUrl: binary
 *             season1_episode1_thumbnail: binary
 *             season1_episode2_thumbnail: binary
 *     responses:
 *       201:
 *         description: TV show created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "tv created successfully"
 *                 entity:
 *                   $ref: '#/components/schemas/TVShowComplete'
 *             example:
 *               success: true
 *               message: "tv created successfully"
 *               entity:
 *                 _id: "66f8b3f4f1234567890abcd1"
 *                 type: "tv"
 *                 title: "Game of Thrones"
 *                 description: "Noble families fight for control of the Iron Throne"
 *                 releaseDate: "2011-04-17"
 *                 endDate: "2019-05-19"
 *                 genres:
 *                   - name: "Fantasy"
 *                     description: "Mythical and magical elements"
 *                     _id: "66f8b3f4f1234567890abcde"
 *                   - name: "Drama"
 *                     description: "Intense character-driven storytelling"
 *                     _id: "66f8b3f4f1234567890abcdf"
 *                 directors: ["66f8b3f4f1234567890abcd2","66f8b3f4f1234567890abcd5"]
 *                 cast: ["66f8b3f4f1234567890abcd3","66f8b3f4f1234567890abcd4","66f8b3f4f1234567890abcd6"]
 *                 seasons:
 *                   - seasonNumber: 1
 *                     description: "The Starks face political intrigue"
 *                     posterUrl: "https://res.cloudinary.com/example/season1-poster.jpg"
 *                     coverUrl: "https://res.cloudinary.com/example/season1-cover.jpg"
 *                     rating: 0
 *                     episodes:
 *                       - title: "Winter Is Coming"
 *                         episodeNumber: 1
 *                         description: "Ned Stark is introduced as the Warden of the North"
 *                         releaseDate: "2011-04-17"
 *                         duration: 62
 *                         thumbnailUrl: "https://res.cloudinary.com/example/s1e1-thumb.jpg"
 *                       - title: "The Kingsroad"
 *                         episodeNumber: 2
 *                         description: "The Starks travel south to King’s Landing"
 *                         releaseDate: "2011-04-24"
 *                         duration: 56
 *                         thumbnailUrl: "https://res.cloudinary.com/example/s1e2-thumb.jpg"
 *                 posterUrl: "https://res.cloudinary.com/example/got-poster.jpg"
 *                 coverUrl: "https://res.cloudinary.com/example/got-cover.jpg"
 *                 rating: 0
 *                 createdAt: "2025-01-15T10:00:00.000Z"
 *                 updatedAt: "2025-01-15T10:00:00.000Z"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Validation error"
 *               error: "Title is required"
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Unauthorized"
 *               error: "No valid JWT token provided"
 *       403:
 *         description: Forbidden - Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Forbidden"
 *               error: "Admin access required"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Server error"
 *               error: "Internal server error occurred while creating TV show"
 */

/**
 * @swagger
 * /api/entities/{id}:
 *   patch:
 *     summary: Update an entity (Admin only)
 *     tags: [Entities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: MongoDB ObjectId of the entity
 *         example: "66f8b3f4f1234567890abcd1"
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/UpdateEntityRequest'
 *           example:
 *             title: "The Dark Knight Rises"
 *             description: "Batman faces Bane in the final chapter of the trilogy"
 *             releaseDate: "2012-07-20"
 *             genres: '[{"name":"Action","description":"High-energy action sequences"},{"name":"Drama","description":"Character-driven storytelling"}]'
 *             directors: '["66f8b3f4f1234567890abcd2"]'
 *             cast: '["66f8b3f4f1234567890abcd3","66f8b3f4f1234567890abcd4"]'
 *             posterUrl: binary
 *             coverUrl: binary
 *     responses:
 *       200:
 *         description: Entity updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Entity updated successfully"
 *                 entity:
 *                   $ref: '#/components/schemas/Entity'
 *             example:
 *               success: true
 *               message: "Entity updated successfully"
 *               entity:
 *                 _id: "66f8b3f4f1234567890abcd1"
 *                 type: "movie"
 *                 title: "The Dark Knight Rises"
 *                 description: "Batman faces Bane in the final chapter of the trilogy"
 *                 releaseDate: "2012-07-20"
 *                 genres:
 *                   - name: "Action"
 *                     description: "High-energy action sequences"
 *                   - name: "Drama"
 *                     description: "Character-driven storytelling"
 *                 directors: ["66f8b3f4f1234567890abcd2"]
 *                 cast: ["66f8b3f4f1234567890abcd3", "66f8b3f4f1234567890abcd4"]
 *                 posterUrl: "https://res.cloudinary.com/example/dark-knight-rises-poster.jpg"
 *                 coverUrl: "https://res.cloudinary.com/example/dark-knight-rises-cover.jpg"
 *                 rating: 8.4
 *                 createdAt: "2025-01-15T10:00:00.000Z"
 *                 updatedAt: "2025-01-15T12:00:00.000Z"
 *       400:
 *         description: Invalid entity ID or validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Invalid entity ID format"
 *               error: "The provided ID does not match the MongoDB ObjectId format"
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Unauthorized"
 *               error: "No valid JWT token provided"
 *       403:
 *         description: Forbidden - Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Forbidden"
 *               error: "Admin access required"
 *       404:
 *         description: Entity not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Entity not found"
 *               error: "No entity found with the provided ID"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Server error"
 *               error: "Internal server error occurred while updating entity"
 */

/**
 * @swagger
 * /api/entities/{id}:
 *   delete:
 *     summary: Delete an entity (Admin only)
 *     tags: [Entities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: MongoDB ObjectId of the entity
 *         example: "66f8b3f4f1234567890abcd1"
 *     responses:
 *       200:
 *         description: Entity deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "movie deleted successfully"
 *                 deletedEntity:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "66f8b3f4f1234567890abcd1"
 *                     title:
 *                       type: string
 *                       example: "The Dark Knight"
 *                     type:
 *                       type: string
 *                       example: "movie"
 *             example:
 *               success: true
 *               message: "movie deleted successfully"
 *               deletedEntity:
 *                 id: "66f8b3f4f1234567890abcd1"
 *                 title: "The Dark Knight"
 *                 type: "movie"
 *       400:
 *         description: Invalid entity ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Invalid entity ID format"
 *               error: "The provided ID does not match the MongoDB ObjectId format"
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Unauthorized"
 *               error: "No valid JWT token provided"
 *       403:
 *         description: Forbidden - Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Forbidden"
 *               error: "Admin access required"
 *       404:
 *         description: Entity not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Entity not found"
 *               error: "No entity found with the provided ID"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Server error"
 *               error: "Internal server error occurred while deleting entity"
 */

/**
 * @swagger
 * /api/entities/{id}/rating:
 *   get:
 *     summary: Retrieve the average rating of an entity
 *     tags: [Entities]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: MongoDB ObjectId of the entity
 *         example: "66f8b3f4f1234567890abcd1"
 *     responses:
 *       200:
 *         description: Rating retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 rating:
 *                   type: number
 *                   description: Average rating (0-10)
 *                   example: 9.0
 *                 entityId:
 *                   type: string
 *                   example: "66f8b3f4f1234567890abcd1"
 *                 entityTitle:
 *                   type: string
 *                   example: "The Dark Knight"
 *             example:
 *               success: true
 *               rating: 9.0
 *               entityId: "66f8b3f4f1234567890abcd1"
 *               entityTitle: "The Dark Knight"
 *       400:
 *         description: Invalid entity ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Invalid entity ID format"
 *               error: "The provided ID does not match the MongoDB ObjectId format"
 *       404:
 *         description: Entity not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Entity not found"
 *               error: "No entity found with the provided ID"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Server error"
 *               error: "Internal server error occurred while fetching rating"
 */

/**
 * @swagger
 * /api/entities/filter:
 *   get:
 *     summary: Filter entities by type, genre, year, or rating
 *     tags: [Entities]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: ["movie", "tv"]
 *         description: Filter by entity type
 *         example: "movie"
 *       - in: query
 *         name: genre
 *         schema:
 *           type: string
 *         description: Filter by genre name
 *         example: "Action"
 *       - in: query
 *         name: startYear
 *         schema:
 *           type: integer
 *         description: Filter by start year of release
 *         example: 2010
 *       - in: query
 *         name: endYear
 *         schema:
 *           type: integer
 *         description: Filter by end year of release
 *         example: 2020
 *       - in: query
 *         name: minRating
 *         schema:
 *           type: number
 *         description: Minimum rating filter
 *         example: 8
 *       - in: query
 *         name: maxRating
 *         schema:
 *           type: number
 *         description: Maximum rating filter
 *         example: 10
 *     responses:
 *       200:
 *         description: Successfully filtered entities
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 10
 *                 entities:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Entity'
 *             example:
 *               success: true
 *               count: 2
 *               entities:
 *                 - _id: "66f8b3f4f1234567890abcd1"
 *                   type: "movie"
 *                   title: "The Dark Knight"
 *                   description: "Batman faces the Joker in a battle for Gotham's soul"
 *                   releaseDate: "2008-07-18"
 *                   genres:
 *                     - name: "Action"
 *                       description: "High-energy action sequences"
 *                     - name: "Crime"
 *                       description: "Focuses on criminal activities and justice"
 *                   directors: ["66f8b3f4f1234567890abcd2"]
 *                   cast: ["66f8b3f4f1234567890abcd3", "66f8b3f4f1234567890abcd4"]
 *                   posterUrl: "https://res.cloudinary.com/example/dark-knight-poster.jpg"
 *                   coverUrl: "https://res.cloudinary.com/example/dark-knight-cover.jpg"
 *                   rating: 9.0
 *                   createdAt: "2025-01-15T10:00:00.000Z"
 *                   updatedAt: "2025-01-15T10:00:00.000Z"
 *                 - _id: "66f8b3f4f1234567890abcd2"
 *                   type: "movie"
 *                   title: "Inception"
 *                   description: "A skilled thief infiltrates dreams to steal secrets"
 *                   releaseDate: "2010-07-16"
 *                   genres:
 *                     - name: "Sci-Fi"
 *                       description: "Explores futuristic concepts"
 *                     - name: "Thriller"
 *                       description: "Suspenseful storytelling"
 *                   directors: ["66f8b3f4f1234567890abcd2"]
 *                   cast: ["66f8b3f4f1234567890abcd3", "66f8b3f4f1234567890abcd4"]
 *                   posterUrl: "https://res.cloudinary.com/example/inception-poster.jpg"
 *                   coverUrl: "https://res.cloudinary.com/example/inception-cover.jpg"
 *                   rating: 8.8
 *                   createdAt: "2025-01-15T10:00:00.000Z"
 *                   updatedAt: "2025-01-15T10:00:00.000Z"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Server error"
 *               error: "Internal server error occurred while filtering entities"
 */

/**
 * @swagger
 * /api/entities/movies/filter:
 *   get:
 *     summary: Filter movies by genre, year, or rating
 *     tags: [Entities]
 *     parameters:
 *       - in: query
 *         name: genre
 *         schema:
 *           type: string
 *         description: Filter by genre name
 *         example: "Action"
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Filter by release year
 *         example: 2010
 *       - in: query
 *         name: minRating
 *         schema:
 *           type: number
 *         description: Minimum rating filter
 *         example: 8
 *       - in: query
 *         name: maxRating
 *         schema:
 *           type: number
 *         description: Maximum rating filter
 *         example: 10
 *     responses:
 *       200:
 *         description: Successfully filtered movies
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 5
 *                 movies:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Entity'
 *             example:
 *               success: true
 *               count: 2
 *               movies:
 *                 - _id: "66f8b3f4f1234567890abcd1"
 *                   type: "movie"
 *                   title: "The Dark Knight"
 *                   description: "Batman faces the Joker in a battle for Gotham's soul"
 *                   releaseDate: "2008-07-18"
 *                   genres:
 *                     - name: "Action"
 *                       description: "High-energy action sequences"
 *                     - name: "Crime"
 *                       description: "Focuses on criminal activities and justice"
 *                   directors: ["66f8b3f4f1234567890abcd2"]
 *                   cast: ["66f8b3f4f1234567890abcd3", "66f8b3f4f1234567890abcd4"]
 *                   posterUrl: "https://res.cloudinary.com/example/dark-knight-poster.jpg"
 *                   coverUrl: "https://res.cloudinary.com/example/dark-knight-cover.jpg"
 *                   rating: 9.0
 *                   createdAt: "2025-01-15T10:00:00.000Z"
 *                   updatedAt: "2025-01-15T10:00:00.000Z"
 *                 - _id: "66f8b3f4f1234567890abcd2"
 *                   type: "movie"
 *                   title: "Inception"
 *                   description: "A skilled thief infiltrates dreams to steal secrets"
 *                   releaseDate: "2010-07-16"
 *                   genres:
 *                     - name: "Sci-Fi"
 *                       description: "Explores futuristic concepts"
 *                     - name: "Thriller"
 *                       description: "Suspenseful storytelling"
 *                   directors: ["66f8b3f4f1234567890abcd2"]
 *                   cast: ["66f8b3f4f1234567890abcd3", "66f8b3f4f1234567890abcd4"]
 *                   posterUrl: "https://res.cloudinary.com/example/inception-poster.jpg"
 *                   coverUrl: "https://res.cloudinary.com/example/inception-cover.jpg"
 *                   rating: 8.8
 *                   createdAt: "2025-01-15T10:00:00.000Z"
 *                   updatedAt: "2025-01-15T10:00:00.000Z"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Server error"
 *               error: "Internal server error occurred while filtering movies"
 */

/**
 * @swagger
 * /api/entities/tv/filter:
 *   get:
 *     summary: Filter TV shows by genre, year, or rating
 *     tags: [Entities]
 *     parameters:
 *       - in: query
 *         name: genre
 *         schema:
 *           type: string
 *         description: Filter by genre name
 *         example: "Fantasy"
 *       - in: query
 *         name: startYear
 *         schema:
 *           type: integer
 *         description: Filter by start year of release
 *         example: 2010
 *       - in: query
 *         name: endYear
 *         schema:
 *           type: integer
 *         description: Filter by end year of release
 *         example: 2020
 *       - in: query
 *         name: minRating
 *         schema:
 *           type: number
 *         description: Minimum rating filter
 *         example: 8
 *       - in: query
 *         name: maxRating
 *         schema:
 *           type: number
 *         description: Maximum rating filter
 *         example: 10
 *     responses:
 *       200:
 *         description: Successfully filtered TV shows
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 3
 *                 tvShows:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TVShowComplete'
 *             example:
 *               success: true
 *               count: 1
 *               tvShows:
 *                 - _id: "66f8b3f4f1234567890abcd1"
 *                   type: "tv"
 *                   title: "Game of Thrones"
 *                   description: "Noble families fight for control of the Iron Throne"
 *                   releaseDate: "2011-04-17"
 *                   endDate: "2019-05-19"
 *                   genres:
 *                     - name: "Fantasy"
 *                       description: "Mythical and magical elements"
 *                     - name: "Drama"
 *                       description: "Intense character-driven storytelling"
 *                   directors: ["66f8b3f4f1234567890abcd2","66f8b3f4f1234567890abcd5"]
 *                   cast: ["66f8b3f4f1234567890abcd3","66f8b3f4f1234567890abcd4","66f8b3f4f1234567890abcd6"]
 *                   seasons:
 *                     - seasonNumber: 1
 *                       description: "The Starks face political intrigue"
 *                       posterUrl: "https://res.cloudinary.com/example/season1-poster.jpg"
 *                       coverUrl: "https://res.cloudinary.com/example/season1-cover.jpg"
 *                       rating: 8.8
 *                       episodes:
 *                         - title: "Winter Is Coming"
 *                           episodeNumber: 1
 *                           description: "Ned Stark is introduced as the Warden of the North"
 *                           releaseDate: "2011-04-17"
 *                           duration: 62
 *                           thumbnailUrl: "https://res.cloudinary.com/example/s1e1-thumb.jpg"
 *                         - title: "The Kingsroad"
 *                           episodeNumber: 2
 *                           description: "The Starks travel south to King’s Landing"
 *                           releaseDate: "2011-04-24"
 *                           duration: 56
 *                           thumbnailUrl: "https://res.cloudinary.com/example/s1e2-thumb.jpg"
 *                   posterUrl: "https://res.cloudinary.com/example/got-poster.jpg"
 *                   coverUrl: "https://res.cloudinary.com/example/got-cover.jpg"
 *                   rating: 9.3
 *                   createdAt: "2025-01-15T10:00:00.000Z"
 *                   updatedAt: "2025-01-15T10:00:00.000Z"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Server error"
 *               error: "Internal server error occurred while filtering TV shows"
 */
import express from "express";
import {
  createEntity,
  getAllEntities,
  getEntityById,
  updateEntity,
  deleteEntity,
  getEntityRating,
  createEntityTv,
} from "../controllers/entity.controller.js";
import validateRequest from "../middlewares/validate.js";
import { entityValidation } from "../validations/entity.validation.js";
import { requireAuth, checkRole } from "../auth/auth.middleware.js";
import {
  filterMovies,
  filterTv,
  filterEntities,
} from "../filters/entity.filter.js";
import upload from "../middlewares/upload.js";
import validateFormData from "../validations/validateFormData .js";

const router = express.Router();

/* ---------------------- FILTERS ---------------------- */
router.get("/filter", filterEntities);
router.get("/movies/filter", filterMovies);
router.get("/tv/filter", filterTv);

/* ---------- CRUD ---------- */
router.post(
  "/movie",
  requireAuth,
  checkRole(["admin"]),
  upload.fields([
    { name: "posterUrl", maxCount: 1 },
    { name: "coverUrl", maxCount: 1 },
  ]),
  validateFormData(entityValidation.createMovie),

  createEntity
);

// Add this simple test route temporarily
/* router.post('/test-upload', upload.any(), (req, res) => {
  console.log('Files received:', req.files);
  console.log('Body received:', req.body);
  
  res.json({
    filesReceived: req.files?.length || 0,
    fileNames: req.files?.map(f => f.fieldname) || [],
   // bodyKeys: Object.keys(req.body)
  });
}); */
// Add this middleware BEFORE upload in your route
/* router.post(
  "/movie",
  requireAuth,
  checkRole(["admin"]),

  // Debug middleware - add this BEFORE upload
  (req, res, next) => {
    console.log("🔍 Raw request check:");
    console.log("Content-Type:", req.headers["content-type"]);

    // This will show ALL form fields being sent
    req.on("data", (chunk) => {
      console.log(
        "📦 Raw data chunk received:",
        chunk.toString().substring(0, 200)
      );
    });

    next();
  },

  upload.fields([
    { name: "posterUrl", maxCount: 1 },
    { name: "coverUrl", maxCount: 1 },
  ]),

  // Debug what multer processed
  (req, res, next) => {
    console.log("✅ After multer:");
    console.log("req.files:", req.files);
    console.log("req.body keys:", Object.keys(req.body));
    next();
  },

  createEntity
); */
router.post(
  "/tv",
  requireAuth,
  checkRole(["admin"]),
  upload.any(),
  validateFormData(entityValidation.createTv),
  createEntityTv
);

router.get("/", getAllEntities);
router.get("/:id", getEntityById);

router.patch(
  "/:id",
  requireAuth,
  checkRole(["admin"]),
  upload.any(), // Use upload.any() to accept dynamic fields for seasons and episodes
  validateFormData(entityValidation.updateEntity),
  updateEntity
);
router.delete("/:id", requireAuth, checkRole(["admin"]), deleteEntity);

/* ---------- RATING ---------- */
router.get("/:id/rating", getEntityRating);

export default router;
