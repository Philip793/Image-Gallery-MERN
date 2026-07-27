# Orbit Gallery

A TypeScript PERN photography gallery with an interactive CSS 3D cylinder, PostgreSQL, Drizzle ORM, Zod validation and integration-tested APIs.

![Orbit Gallery preview](docs/orbit-gallery-preview.svg)

## Tech Stack

- **Client**: React 18, TypeScript, Vite, React Router
- **Server**: Express, TypeScript, Drizzle ORM
- **Database**: PostgreSQL
- **Styling**: Custom CSS with 3D transforms

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

## Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Philip793/Image-Gallery-MERN.git
   cd Image-Gallery-MERN
   ```

2. **Install dependencies**
   ```bash
   npm install
   npm run install:all
   ```

3. **Configure environment variables**

   Copy the example environment file:
   
   On Bash/PowerShell:
   ```bash
   cp server/.env.example server/.env
   ```
   
   On Windows Command Prompt:
   ```cmd
   copy server\.env.example server\.env
   ```
   
   Edit `server/.env` with your configuration:
   ```env
   PORT=5000
   DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/cylinder_gallery
   CLIENT_URL=http://localhost:5173
   NODE_ENV=development
   ```

4. **Set up the database**

### Start PostgreSQL with Docker

```bash
docker run --name cylinder-gallery-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=cylinder_gallery \
  -p 5432:5432 \
  -d postgres:16-alpine
```

On Windows Command Prompt, run the command on one line.

Push the schema and seed data:
```bash
npm run db:setup
```

> Warning: `npm run db:seed` deletes all existing gallery records before
> inserting the sample galleries. Do not run it against production data
> you need to retain.

## Development

Run both client and server in development mode:
```bash
npm run dev
```

This will start:
- Client: http://localhost:5173
- Server: http://localhost:5000

## Available Scripts

### Root
- `npm run install:all` - Install dependencies for both client and server
- `npm run dev` - Start both client and server in development mode
- `npm run db:push` - Push database schema changes (for rapid local iteration)
- `npm run db:migrate` - Run database migrations (for reproducible setup)
- `npm run db:seed` - Seed the database with sample galleries
- `npm run db:setup` - Run migrations and seed data (combined)
- `npm run build` - Build both client and server for production
- `npm run start` - Start the production server
- `npm test` - Run PostgreSQL-backed API integration tests

### Client
- `npm run dev --prefix client` - Start Vite dev server
- `npm run typecheck --prefix client` - Run TypeScript type checking
- `npm run lint --prefix client` - Lint the React client
- `npm run build --prefix client` - Build for production
- `npm run preview --prefix client` - Preview production build
- `npm run test --prefix client` - Run React component and route tests

### Server
- `npm run dev --prefix server` - Start server with tsx watch
- `npm run typecheck --prefix server` - Run TypeScript type checking
- `npm run lint --prefix server` - Lint the Express server
- `npm run build --prefix server` - Compile TypeScript
- `npm run start --prefix server` - Start production server
- `npm run seed --prefix server` - Seed database
- `npm run db:generate --prefix server` - Generate database migration
- `npm run db:migrate --prefix server` - Run database migrations
- `npm run db:push --prefix server` - Push schema to database

## Database Seeding

The seed script populates the database with 6 photography galleries:
- Coastlines
- Forests
- Cities
- Deserts
- Mountains
- Architecture

Each gallery contains 3 images with captions.

## API Endpoints

- `GET /api/health` - Health check with database connection status
- `GET /api/galleries/landing` - Get featured gallery images for landing page
- `GET /api/galleries` - Get all galleries
- `GET /api/galleries/:slug` - Get a specific gallery by slug

## Production Deployment

1. Install dependencies:
   ```bash
   npm ci
   npm ci --prefix client
   npm ci --prefix server
   ```

2. Run database migrations and seed the sample galleries:
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

3. Build the application:
   ```bash
   npm run build
   ```

4. Start the production server:
   ```bash
   NODE_ENV=production npm run start
   ```

   On Windows Command Prompt:
   ```cmd
   set NODE_ENV=production&& npm run start
   ```

The production server serves the client static files and handles API requests.

## Testing

The API integration suite uses PostgreSQL-backed tests. To run them locally, make sure PostgreSQL is running and the migrations and seed data are present:

```bash
npm run db:setup
npm test
```

## TypeScript Migration

This project has been fully migrated from JavaScript to TypeScript:
- All client files use `.tsx` or `.ts` extensions
- All server files use `.ts` extensions
- Type definitions are included for all data structures
- Strict mode is enabled in both tsconfig files

## License

MIT
