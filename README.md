# Rentora Studio
### Find Your Space. Create Your Story.

Rentora Studio is a creative studio rental marketplace designed for photographers, filmmakers, podcasters, musicians, and other creative professionals.

The platform connects studio owners with creators who need professional spaces for their projects. Hosts can publish and manage their studio listings, while creators can explore available spaces, view studio details, check pricing, and book studios according to their requirements.

From photography studios and film stages to podcast lounges, music suites, and creative workshops, Rentora Studio makes discovering and booking creative workspaces easier.

**Live Website:** https://rentorastudio.vercel.app

---

## Table of Contents

- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Studio Categories](#studio-categories)
- [Pages and Routes](#pages-and-routes)
- [Technology Stack](#technology-stack)
- [Project Architecture](#project-architecture)
- [Installation and Setup](#installation-and-setup)
- [Environment Variables](#environment-variables)
- [Booking Workflow](#booking-workflow)
- [Deployment](#deployment)
- [Project Repositories](#project-repositories)
- [Future Improvements](#future-improvements)

---

## Project Overview

Rentora Studio follows a peer-to-peer marketplace model where studio owners can showcase their creative spaces and creators can discover and reserve suitable studios.

The platform focuses on:

- Helping creators discover suitable creative spaces.
- Allowing studio owners to manage their listings.
- Providing transparent hourly pricing and security deposit information.
- Simplifying the studio booking process.
- Managing bookings and their statuses through a dedicated dashboard experience.

Whether someone needs a photography studio, a podcast recording room, or a professional music suite, Rentora Studio provides a centralized platform to explore creative workspaces.

## Key Features

### 1. Authentication and User Management

- User registration with name, email, photo URL, and password.
- Email and password authentication.
- Google social authentication.
- Form validation and user-friendly error messages.
- Protected routes for authenticated users.
- User profile information and account navigation.
- Logout functionality.

### 2. Home Page

- Responsive navigation bar with authentication-aware menus.
- Hero section with an interactive banner slider.
- Featured studios displayed dynamically.
- Browse studios by category.
- Four-step booking process:
  1. Discover Spaces
  2. Select Shoot Hours
  3. Book Instantly
  4. Create & Produce
- Host guarantee and creator support information.
- Responsive footer with useful navigation links.

### 3. Explore Studios

- Browse available creative studio listings.
- View studio images, titles, categories, and locations.
- Explore hourly rates and other studio information.
- Search and filter studio listings.
- Access individual studio details.

### 4. Studio Details

- View complete studio information.
- Explore studio images and gallery.
- Check available amenities.
- View host information.
- Explore pricing and security deposit details.
- Review studio information before booking.
- Initiate a booking through the booking interface.

### 5. Studio Management

Studio owners can manage their own listings.

- Add new studio listings.
- Provide studio title, category, location, and description.
- Set hourly rates and security deposits.
- Specify maximum guest capacity.
- Add studio images and amenities.
- View personal studio listings.
- Edit existing studio information.
- Delete listings with a confirmation dialog.

### 6. Booking Management

- Book creative studios.
- Save booking information to the database.
- View personal booking records.
- Check booking dates, time slots, and pricing.
- Track booking statuses:
  - Pending
  - Confirmed
  - Completed
  - Cancelled
- Cancel eligible bookings.

### 7. User Dashboard and Navigation

- Dedicated dashboard entry in the authenticated user menu.
- Quick navigation to studio management and booking pages.
- User-specific access to private sections.

### 8. User Experience

- Responsive layouts for mobile, tablet, and desktop.
- Loading skeletons and loading indicators.
- Custom empty states.
- Custom not-found page.
- Toast notifications for user feedback.
- Confirmation dialogs for important actions.
- Consistent typography, spacing, and reusable UI components.

---

## Studio Categories

Rentora Studio supports creative workspace categories such as:

| Category | Description |
|---|---|
| Photo Studio | Professional photography and photoshoot spaces |
| Film Stage | Spaces for filming and video production |
| Podcast Lounge | Podcast recording and audio production rooms |
| Music Suite | Music recording and production facilities |
| Workshop | Creative workshops and artistic workspaces |

---

## Pages and Routes

| Route | Description | Access |
|---|---|---|
| `/` | Home page | Public |
| `/studios` | Explore all studios | Public |
| `/studios/[id]` | Individual studio details | Public |
| `/how-it-works` | Booking process information | Public |
| `/about` | About Rentora Studio | Public |
| `/login` | User login | Public |
| `/register` | User registration | Public |
| `/dashboard` | User dashboard | Authenticated |
| `/add-studio` | Add a new studio | Private |
| `/my-listings` | Manage personal studio listings | Private |
| `/studios/edit/[id]` | Edit an existing studio | Private |
| `/my-bookings` | Manage personal bookings | Private |

*Note: Route names above describe the intended application routes. If any route uses a different path in the deployed implementation, update the table accordingly.*

---

## Technology Stack

### Frontend

- **Next.js** — React framework using the App Router.
- **React** — Component-based user interface.
- **TypeScript** — Static type checking.
- **Tailwind CSS** — Utility-first styling.
- **Shadcn UI** — Reusable interface components.
- **Lucide React** — Icon library.

### Authentication

- **Better Auth** — Authentication and session management.
- **MongoDB Adapter** — Database integration for authentication.

### Backend

- **Node.js** — JavaScript runtime.
- **Express.js** — Backend API framework.
- **MongoDB** — NoSQL database.

### Development and Deployment

- **Git & GitHub** — Version control and source code management.
- **Vercel** — Frontend deployment.
- **Vercel** — Backend deployment.

---

## Project Architecture

Rentora Studio uses a separate frontend and backend architecture.

```text
                 Rentora Studio
                       |
          +------------+------------+
          |                         |
      Frontend                   Backend
          |                         |
      Next.js                   Node.js
      App Router                Express.js
      TypeScript                    |
          |                         |
      Shadcn UI                 REST APIs
      Tailwind CSS                  |
          |                         |
          +---------- HTTP --------+
                                    |
                                MongoDB
```

The frontend communicates with the Express backend through API requests. Studio listings and booking information are stored and managed through the backend database.

Better Auth handles user authentication and session management.

---

## Installation and Setup

Follow these steps to run the project locally.

### Prerequisites

Make sure you have installed:

- Node.js
- npm
- Git
- MongoDB connection or MongoDB Atlas account

### 1. Clone the Frontend Repository

```bash
git clone YOUR_CLIENT_REPOSITORY_URL
```

Navigate into the project directory:

```bash
cd rentora-studio-client
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the frontend project root.

Add the required environment variables using the names already referenced in the project source code.

See the [Environment Variables](#environment-variables) section below.

### 4. Start the Development Server

```bash
npm run dev
```

Open the application:

```text
http://localhost:3000
```

### 5. Set Up the Backend

Clone the separate backend repository:

```bash
git clone YOUR_SERVER_REPOSITORY_URL
```

Navigate into the backend directory:

```bash
cd rentora-studio-server
```

Install the backend dependencies:

```bash
npm install
```

Configure the backend environment variables and MongoDB connection according to the backend project's configuration.

Start the backend using the appropriate development script defined in its `package.json`.

---

## Environment Variables

The frontend and backend require separate environment configurations.

### Frontend — `.env.local`

The following is an illustrative template. Use the exact variable names referenced by your existing source code.

```env
# Better Auth
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your_better_auth_secret
BETTER_AUTH_DB_URL=your_mongodb_connection_string

# Backend API
NEXT_PUBLIC_STUDIO_API_URL=your_studio_api_url
NEXT_PUBLIC_BOOKING_API_URL=your_booking_api_url
```

Add any other existing `NEXT_PUBLIC_*_API_URL` variables required by the project, including the booking edit and delete API URLs.

### Backend — `.env`

Configure the environment variables required by the Express server, including:

```env
PORT=your_server_port
MONGODB_URI=your_mongodb_connection_string
```

Use the actual environment variable names from the backend source code. Do not commit real secrets, database credentials, or API keys to GitHub.

**Important:** Never expose private authentication secrets or database credentials through `NEXT_PUBLIC_` variables.

---

## Booking Workflow

The main booking process follows these steps:

1. A creator visits the Explore Studios page.
2. The creator selects a suitable studio.
3. The creator views studio details, pricing, and amenities.
4. The creator selects the required booking date and time.
5. The booking request is submitted.
6. Booking information is saved through the backend API.
7. The creator can view the booking from the My Bookings page.
8. The booking status can be tracked as it progresses.

---

## Deployment

The project is deployed using Vercel.

| Application | Deployment URL |
|---|---|
| Frontend | https://rentorastudio.vercel.app |
| Backend | https://rentora-studio-server.vercel.app |

For production deployment:

- Configure all required frontend environment variables in Vercel.
- Configure backend environment variables separately.
- Allow the frontend production origin in the backend CORS configuration.
- Verify the MongoDB connection.
- Check authentication and private-route behavior.
- Test all API requests after deployment.
- Verify that application routes work correctly when refreshed directly.

---

## Project Repositories

| Repository | Link |
|---|---|
| Frontend Repository | [https://github.com/montasir132/Rentora-Studio-Client](YOUR_CLIENT_REPOSITORY_URL) |
| Backend Repository | [https://github.com/montasir132/Rentora-Studio-Server](YOUR_SERVER_REPOSITORY_URL) |

---

## Future Improvements

Potential improvements for future development include:

- Advanced studio availability management.
- Booking conflict and double-booking prevention.
- Enhanced host and creator verification.
- PDF booking invoice generation.
- Saved studios and wishlist functionality.
- Advanced dashboard analytics.
- Improved studio reviews and ratings.
- Additional booking and payment features.

---

## Author

**Rentora Studio**

A creative workspace rental platform built to connect studio owners with creators.

**Live Website:** https://rentorastudio.vercel.app

---

*Find your space. Create your story.*