# Civic Routes – Smart Civic Issue Management System

A polished MERN stack civic issue reporting platform with citizen/admin roles, image-based issue reporting, live status updates, and a modern animated UI.

## Features
- JWT authentication with citizen and admin roles
- Report civic issues with category, location, and image URL
- Track complaints by status: Pending, In Progress, Resolved
- Admin dashboard to manage all issues
- Upvotes, comments, and trending issue analytics
- Real-time updates using Socket.io
- Modern responsive UI with Tailwind CSS and Framer Motion

## Project Structure
- `client` – React app with Tailwind and animations
- `server` – Express API, MongoDB models, authentication, and Socket.io

## Quick Start
1. Install dependencies from the root:
   - `npm install`
2. Create environment files:
   - `server/.env`
   - `client/.env`
3. Run both apps:
   - `npm run dev`

## Environment Variables
### server/.env
- `PORT=5000`
- `MONGO_URI=your_mongodb_connection_string`
- `JWT_SECRET=your_secret_key`
- `ADMIN_CODE=123456`
- `CLIENT_URL=http://localhost:5173`

### client/.env
- `VITE_API_URL=http://localhost:5000/api`

## Demo Flow
1. Register as a citizen.
2. Log in and create civic issues.
3. Create an admin account using the admin code.
4. Update issue statuses from the admin dashboard.

## Notes
- Image upload is implemented as image URL support for fast demo delivery.
- Cloudinary-ready integration points are included and can be added later if needed.
