
# TimeLink HR - Frontend Application

This is a comprehensive React-based frontend for TimeLink HR, an employee time tracking and leave management system. It's built with modern web technologies to provide a seamless and aesthetically pleasing user experience.

## Features

- **User Authentication**: Simple ID-based login system.
- **Time Clocking**: Large, easy-to-use buttons for checking in and out.
- **QR Code Integration**: Mockup for QR code scanning via the LINE application.
- **Leave Management**: Full system for requesting and viewing leave history.
- **Approval Workflow**: Dedicated interface for managers and supervisors to approve/reject leave requests.
- **Admin Panel**: User management interface to assign roles.
- **Dashboard**: Insightful dashboard with charts for leave statistics and lists of late employees.

## Tech Stack

- **React 18+**: For building the user interface.
- **TypeScript**: For type safety and better developer experience.
- **Tailwind CSS**: For utility-first styling.
- **React Router (HashRouter)**: For client-side routing.
- **Recharts**: For creating beautiful and responsive charts.
- **Lucide React**: For icons.

## Getting Started

To run this project locally, you need to have Node.js and a package manager like npm or yarn installed.

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd timelink-hr-frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application should now be running on `http://localhost:5173` (or another port if 5173 is in use).

## Connecting to a Node.js & MongoDB Backend

This frontend application is designed to be backend-agnostic but is primarily intended to work with a Node.js (Express) API connected to a MongoDB database. The current version uses mock data located in `src/mockData.ts`.

To connect to a real backend, you would typically replace the mock data calls with API fetch requests.

### Backend Setup Example (Conceptual)

Here's a conceptual guide for a developer setting up the backend.

1.  **Set up your Node.js/Express Server:**
    - Create an Express application.
    - Define API endpoints (e.g., `/api/auth/login`, `/api/users`, `/api/leave-requests`).
    - Use Mongoose as the ODM (Object Data Modeling) library to interact with MongoDB.

2.  **Connect to MongoDB:**
    - You'll need a MongoDB connection string. You can get one from MongoDB Atlas (a cloud-hosted service) or a local MongoDB instance.
    - Store your connection string in a `.env` file for security.
      ```
      # .env file on your backend server
      MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority
      ```
    - In your main server file (`server.js` or `index.js`), use Mongoose to connect:
      ```javascript
      const mongoose = require('mongoose');
      const dotenv = require('dotenv');

      dotenv.config();

      const connectDB = async () => {
          try {
              await mongoose.connect(process.env.MONGO_URI, {
                  useNewUrlParser: true,
                  useUnifiedTopology: true,
              });
              console.log('MongoDB Connected...');
          } catch (err) {
              console.error(err.message);
              // Exit process with failure
              process.exit(1);
          }
      };

      connectDB();
      ```

3.  **Create Mongoose Schemas:**
    - Define schemas that match the TypeScript types in the frontend (`src/types.ts`). For example, a `User` schema:
      ```javascript
      const mongoose = require('mongoose');

      const UserSchema = new mongoose.Schema({
          id: { type: String, required: true, unique: true },
          name: { type: String, required: true },
          nationalId: { type: String, required: true, unique: true },
          professionalId: { type: String, required: true },
          department: { type: String, required: true },
          avatar: { type: String },
          role: { type: String, enum: ['Employee', 'Supervisor', 'Manager', 'Admin'], default: 'Employee' },
          supervisorId: { type: String },
          managerId: { type: String },
      });

      module.exports = mongoose.model('User', UserSchema);
      ```

4.  **Update Frontend to Use the API:**
    - Create a dedicated API service file in the frontend (e.g., `src/services/api.ts`).
    - Replace mock data imports with `fetch` or `axios` calls to your backend endpoints.
    
    **Example: Fetching users in `Admin.tsx`**
    
    **Before (using mock data):**
    ```typescript
    import { users as mockUsers } from '../mockData';
    // ...
    const [users, setUsers] = useState<User[]>(mockUsers);
    ```

    **After (using API):**
    ```typescript
    import React, { useState, useEffect } from 'react';
    // ...
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('/api/users'); // Your backend endpoint
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error("Failed to fetch users:", error);
            }
        };

        fetchUsers();
    }, []);
    ```

By following this pattern, you can progressively replace all mock data interactions with live API calls to your Node.js and MongoDB backend.
