# Project Description

A full-stack web and desktop application for managing companies, buildings, and staff. Users can be staff, organise companies and buildings, upload building models, and invite staff with role-based dashboards.

## Stack

Language: TypeScript (transpiled to JavaScript)

Interpreter: NodeJS v25.2.1

Package manager: NPM v11.6.2

This is a monorepo consisting of three main packages, each using TypeScript, and an additional package at the root level to coordinate everything.

### [Frontend](./frontend/package.json)

This is split into two sections - [electron](./frontend/src/electron/) and [ui](./frontend/src/ui/).

UI - standard web app (components, routing, state, etc).

Electron - wraps the React build (or vite dev server) from the ui and runs it as a desktop app using Electron. It creates a native window and can be made to integrate with the OS.

Dependencies include:

- `vite` - bundler, optimised builds, fast dev server
- `react` - components, state, used by shadcn components
- `tailwind` - fast and consistent UI styling, used by shadcn components
- `lucide-react` - icons
- `react-router-dom` - routes, navigation, mapping paths to components

The frontend is also configured to use [Shadcn](https://ui.shadcn.com/) components - running `npx shadcn@latest add button` in ./frontend will add a Shadcn button [here](./frontend/src/ui/components/ui/).

Tools like [tweakcn](https://tweakcn.com/editor/theme) can be used to easily style the components by altering the [tailwind css variables](./frontend/src/ui/index.css) used in the frontend.

### [Backend](./backend/package.json)

Database - models defined with prisma

REST API - express handles business logic

Dependencies include:

- `bcrypt` - hash passwords and verification codes
- `@prisma/client` - generate database client, query database with TS instead of SQL, type-safe methods based on the prisma schema
- `express-session` - handles server-side session, stores session data (logged in user) and links it to a session ID in cookies. lets you persist state across requests without storing it on the client.

### [Shared](./packages/shared/package.json)

- [schemas](./packages/shared/src/schemas/)
    - zod - validation, types
- [api routes](./packages/shared/src/api-routes/)

### [Root](./package.json)

- concurrently - run scripts in parallel

## Setup Instructions

1.  Clone the repository.

2.  Set up services:
    - Create a MySQL database. This can be as simple as installing the [MySQL Community Server](https://dev.mysql.com/downloads/mysql/8.0.html) locally and ensuring the service is running.

    - Sign up to [Autodesk APS](https://aps.autodesk.com/) and follow the documentation to create a hub and generate a bucket.

    - Sign up to [Resend](https://resend.com/) and follow the documentation to get your API key set it up with your domain (otherwise, emails can only be sent to the email account used to sign up to Resend, which is fine in development)

3.  Duplicate both of the `.env.example` files found in [backend](./backend/.env.example) and [frontend](./frontend/.env.example) in the same directories, and rename the duplicates to `.env`

4.  In the `.env` files, replace the values for each variable with your values:
    - Backend
        - Prisma will create a database with `DATABASE_NAME` if it doesn't exist already
        - Replace `YOUR_SECRET_HASH` with a new randomly generated string for each variale

    - Frontend
        - `VITE_API_BASE_URL` should match the URL of the backend API. This will need to be changed for production, including when building the desktop app.

5.  In a terminal open at the [root directory](./), run `npm i`

6.  This should automatically use the [`install` script](./package.json) to install dependencies in the shared package, build the shared package, then install dependencies in the frontend and backend packages.

    This can also be done by running:

    ```
    npm --prefix packages/shared i
    npm --prefix packages/shared run build
    npm --prefix frontend i
    npm --prefix backend i
    ```

## How to run

### Development

- In a terminal open at the [root directory](./), run `npm run dev`

- In the backend, the [nodemon scripts](./backend/nodemon.prisma.json) should automatically handle regenerating the prisma client and syncing the database with the schema.
    - For development speed, this includes dropping the database if the schema does not match (e.g. changed a field to not null). This can be changed by editing `exec` in [nodemon.env.json](./backend/nodemon.env.json)

- To view the database, you can open a new terminal and run `npm run db:view`, or
    ```
    cd backend
    npx prisma studio
    ```

### Production

We used [Railway](https://railway.com/) for the MySQL database and hosting the API.

- build command: `npm run build` (this builds the backend, as well as the frontend (so that the backend serves it), and the shared package)

- pre-deploy command: `cd backend && npx prisma db push` (to sync the database with the schema)

- start command: `npm run start`

To build the desktop app:

- Set `VITE_API_BASE_URL` in the [frontend `.env`](./frontend/.env) file to the URL of the deployed, e.g.

```
VITE_API_BASE_URL=https://autocoderz.uk
```

- Build the distributable:
    - Windows: `npm run dist:win`

    - Mac: `npm run dist:mac`

    - Linux: `npm run dist:linux`
