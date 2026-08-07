# Job Market Analytics

Job Market Analytics is a MERN application for collecting, normalizing, storing, and presenting junior, entry-level, and internship software engineering vacancies in the United States.

The backend combines job data from aggregators, public GitHub lists, and applicant tracking systems (ATS). All accepted records are converted to a shared job format and stored in MongoDB. The frontend provides a dashboard, searchable job and company tables, job detail pages, and location maps.

## Features

- Google Sign-In with backend ID token verification
- Dashboard with job totals, source distribution, job-level distribution, and a 14-day ingestion timeline
- Job list with server-side pagination, keyword search, internship filtering, and remote filtering
- Company list with server-side pagination and keyword search
- Individual job pages with sanitized descriptions and external application links
- Job location maps based on OpenStreetMap and Nominatim
- On-demand geocoding with MongoDB caching
- Unified normalization for all job sources
- Deduplication by source and source-specific job ID
- Scheduled imports with `node-cron`
- ATS company discovery and scheduled harvesting for Greenhouse, Lever, and Ashby

## Technology Stack

### Frontend

- React 19
- TypeScript
- Vite
- React Router
- CSS Modules
- Recharts
- React Leaflet
- Leaflet and OpenStreetMap
- DOMPurify
- Google OAuth React

### Backend

- Node.js
- Express 5
- TypeScript
- MongoDB
- Mongoose
- Axios
- Cheerio
- csv-parse
- node-cron
- google-auth-library

## Data Sources

The application collects vacancy data from the following sources:

| Source                          | Purpose                                                          |
| ------------------------------- | ---------------------------------------------------------------- |
| Adzuna                          | Junior, entry-level, new graduate, and internship search results |
| Jooble                          | Junior, entry-level, and new graduate search results             |
| The Muse                        | Entry-level and internship software engineering positions        |
| SimplifyJobs Summer Internships | Internship listings parsed from a GitHub README table            |
| SimplifyJobs New Grad Positions | New graduate listings parsed from a GitHub README table          |
| Greenhouse                      | Public company job boards accessed by ATS slug                   |
| Lever                           | Public company job boards accessed by ATS slug                   |
| Ashby                           | Public company job boards accessed by ATS slug                   |
| kalil0321/ats-scrapers          | Company names, ATS types, slugs, and career page URLs            |
| Nominatim                       | On-demand conversion of job location text into map coordinates   |

## Data Processing

### Aggregator pipeline

The aggregator pipeline requests data from Adzuna, Jooble, The Muse, and the two SimplifyJobs GitHub repositories. Raw API responses are normalized into a shared job structure before they are written to MongoDB.

The normalization layer:

- normalizes company names;
- converts source dates into JavaScript `Date` values;
- identifies internship, junior, and entry-level roles from job titles;
- rejects titles containing senior-level keywords;
- detects remote positions;
- maps source-specific fields to the common `Job` schema.

GitHub job tables are parsed with Cheerio. Duplicate results from the same request cycle are removed with `Map` collections.

### ATS pipeline

The Kalil import reads CSV files containing known Greenhouse, Lever, and Ashby companies. Each company is stored with its ATS type and slug.

The ATS harvester:

1. Selects up to 100 active companies ordered by `last_scraped_at`.
2. Requests the public job board for each company.
3. Filters the response to US software roles at junior, entry-level, or internship level.
4. Normalizes accepted records into the shared job format.
5. Upserts jobs into MongoDB.
6. Updates the company `last_scraped_at` value.

An error from one company does not stop the remaining companies in the batch.

### Deduplication

Jobs use a unique compound index:

```text
source + source_job_id
```

Companies use a unique compound index:

```text
ats_type + ats_slug
```

MongoDB bulk upserts update existing records and insert only records that are not already stored.

## Database Collections

### Jobs

Stores normalized vacancies from all aggregators, GitHub lists, and ATS providers. Important fields include:

- source-specific job ID;
- title and company name;
- normalized company name;
- location and country;
- application URL;
- source and job level;
- description and posting date;
- remote status;
- active or closed status;
- creation, update, and last-seen timestamps.

### Companies

Stores companies with known ATS information:

- company name and normalized name;
- ATS type;
- ATS slug and career page URL;
- seed source;
- active status;
- last ATS harvest time.

### JobLocations

Caches geocoding results for individual jobs. A job can have one resolved coordinate record or a `not_found` result. Caching prevents repeated Nominatim requests when the same job page is opened again.

### Users

Stores users verified through Google Sign-In:

- Google account ID;
- email;
- display name;
- profile picture;
- creation and update timestamps.

## API Endpoints

The default backend URL is `http://localhost:3000`.

| Method | Endpoint       | Description                                                 |
| ------ | -------------- | ----------------------------------------------------------- |
| `GET`  | `/`            | Return dashboard totals and chart data                      |
| `GET`  | `/jobs`        | Return a paginated list of active jobs                      |
| `GET`  | `/jobs/:id`    | Return one job and its cached or newly resolved coordinates |
| `GET`  | `/companies`   | Return a paginated list of ATS companies                    |
| `POST` | `/auth/google` | Verify a Google ID token and create or update the user      |

### Job query parameters

`GET /jobs` accepts:

| Parameter | Example      | Description                                                              |
| --------- | ------------ | ------------------------------------------------------------------------ |
| `page`    | `2`          | Requested page; each page contains up to 50 jobs                         |
| `search`  | `frontend`   | Case-insensitive search across title, company, location, and description |
| `level`   | `internship` | Filter by job level                                                      |
| `remote`  | `true`       | Return only positions marked as remote                                   |

Example:

```text
GET /jobs?page=1&search=software&level=internship&remote=true
```

### Company query parameters

`GET /companies` accepts:

| Parameter | Example  | Description                                            |
| --------- | -------- | ------------------------------------------------------ |
| `page`    | `2`      | Requested page; each page contains up to 50 companies  |
| `search`  | `openai` | Search by name, normalized name, ATS type, or ATS slug |

Example:

```text
GET /companies?page=1&search=greenhouse
```

## Scheduled Tasks

The backend registers the following jobs after the database connection succeeds and the Express server starts:

| Schedule                          | Task                                                                     |
| --------------------------------- | ------------------------------------------------------------------------ |
| Every Sunday at 03:00             | Import jobs from Adzuna, Jooble, The Muse, and SimplifyJobs GitHub lists |
| First day of every month at 02:00 | Refresh the ATS company catalog from `kalil0321/ats-scrapers`            |
| Every two hours                   | Process the next batch of 100 Greenhouse, Lever, and Ashby companies     |

Cron schedules use the timezone of the backend host.

## Project Structure

- `backend/`
  - `src/config/` â€” MongoDB connection
  - `src/controllers/` â€” dashboard, job, company, and authentication controllers
  - `src/models/` â€” Mongoose schemas
  - `src/routes/` â€” Express routers
  - `src/services/api/` â€” external API clients
  - `src/services/parsers/` â€” GitHub table parser
  - `src/services/seeds/` â€” ATS company import
  - `src/services/` â€” aggregator, Kalil, and ATS runners
  - `src/types/` â€” API, model, service, and utility types
  - `src/utils/` â€” normalization, filtering, date, location, and type guard utilities
- `frontend/`
  - `src/api/` â€” backend request functions
  - `src/components/` â€” tables, filters, pagination, charts, map, loader, and navigation
  - `src/context/` â€” authentication and loading contexts
  - `src/data/` â€” reusable job and company table column definitions
  - `src/pages/` â€” dashboard, jobs, job details, companies, and login pages
  - `src/types/` â€” frontend response, component, and context types

## Environment Variables

Create `backend/.env`:

```env
PORT=3000
MONGO_URI=mongodb_connection_string

ADZUNA_APP_ID=adzuna_application_id
ADZUNA_APP_KEY=adzuna_application_key
JOOBLE_API_KEY=jooble_api_key

GOOGLE_CLIENT_ID=google_oauth_client_id
CONTACT_EMAIL=contact_email_for_nominatim_user_agent
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:3000
VITE_GOOGLE_CLIENT_ID=google_oauth_client_id
```

The frontend and backend must use the same Google OAuth client ID.

Do not commit `.env` files or real credentials to the repository.

## Local Installation

Clone the repository:

```bash
git clone https://github.com/omukhov/Per-Scholas-Capstone.git
cd Per-Scholas-Capstone
```

Install and start the backend:

```bash
cd backend
npm install
npm run dev
```

In a second terminal, install and start the frontend:

```bash
cd frontend
npm install
npm run dev
```

The frontend development server runs at `http://localhost:5173` by default. The backend currently allows CORS requests from this origin.

## Production Builds

Build and start the backend:

```bash
cd backend
npm install
npm run build
npm start
```

Build the frontend:

```bash
cd frontend
npm install
npm run build
```

The frontend build output is created in `frontend/dist`.

For deployment, update the backend CORS origin to the deployed frontend URL and set all environment variables in the hosting provider.

## Authentication

The frontend receives a Google ID token from Google Sign-In and sends it to `POST /auth/google`. The backend verifies the token signature, expiration, issuer, and audience with `google-auth-library`. A verified user is then created or updated in MongoDB using the permanent Google account ID.

The current frontend stores the returned user profile in `localStorage`. The implementation provides a basic application login gate, but it does not issue an application session or JWT and does not protect backend endpoints. Protected user-specific features would require server-side session or token authorization.

## Geocoding and Maps

When a job detail page is requested, the backend checks `JobLocations` for cached coordinates. If no record exists, it sends the job location to Nominatim and stores either the returned coordinates or a `not_found` result.

Remote jobs are not geocoded because they do not have an exact location. The frontend uses React Leaflet and OpenStreetMap tiles to display resolved coordinates.

## Current Limitations

- Job classification is keyword-based and can produce false positives or false negatives.
- US location detection is based on common location strings and state abbreviations.
- ATS company lists can contain inactive or outdated public job boards.
- Source APIs can impose request limits or change their response formats.
- Nominatim results depend on the quality of the source location text.
- The backend CORS origin is currently configured for the local Vite development server.
- Google Sign-In does not currently create a protected application session.
- Data import runners are scheduled internally and are not exposed as public administration endpoints.
- Jobs that disappear from an external source are not automatically changed to `closed`.

## Repository

Source code: https://github.com/omukhov/Per-Scholas-Capstone

## Link
