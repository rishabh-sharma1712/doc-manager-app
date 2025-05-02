# Document Manager App

A modern document management system built with Next.js, React, and TypeScript. This application allows users to upload, view, edit, and delete documents based on their role permissions.

## Features

- **User Authentication**: Secure login, register, and logout functionality with role-based access control
- **Role-Based Permissions**: Different access levels for admins, editors, and viewers
- **Document Management**: Create, upload, view, edit, and delete documents
- **Responsive Design**: Works on desktop and mobile devices
- **Search Functionality**: Search documents by title, content, or user

## Technology Stack

- **Framework**: Next.js with App Router
- **UI**: React with TypeScript
- **State Management**: React Context API
- **Authentication**: JWT-based authentication (mocked in this version)
- **Styling**: Tailwind CSS
- **Testing**: Jest and React Testing Library

## Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/rishabh-sharma1712/doc-manager-app.git
cd doc-manager-app
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Run the development server
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application

## Project Structure

```
├── src/
│   ├── app/                # Next.js App Router
│   │   └── documents/         # Tests for document pages
│   ├── components/         # React components
│   │   ├── documents/         # Tests for document components
│   │   └── ui/                # Tests for UI components
│   ├── context/            # Context providers
│   ├── lib/                # Utility functions
│   │   └── mocks/          # Mock API and data
│   ├── styles/             # CSS files
│   └── types/              # TypeScript type definitions
├── public/                 # Static assets
├── .next/                  # Next.js build output
└── package.json            # Project configuration
```

## Routes

- `/`: Home page
- `/auth/login`: Login page
- `/auth/register`: Register page
- `/documents`: Document list page
- `/documents/new`: Create new document page
- `/documents/[id]`: View document details
- `/documents/[id]/edit`: Edit document page

## User Roles

- **Admin**: Can create, view, edit, and delete all documents. Can manage user roles.
- **Editor**: Can create, view, edit, and delete documents.
- **Viewer**: Can only view documents.

## Mock Data

The application uses mock data and simulated API calls for demonstration purposes. You can find the mock data and API implementations in:

- `src/lib/mocks/mock-data.ts`: Sample users and documents
- `src/lib/mocks/mock-api.ts`: Simulated API functions

## Running Tests

The application uses Jest and React Testing Library for testing. To run tests:

```bash
npm test
```

Or to run tests in watch mode:

```bash
npm run test:watch
```

## Current Status

This project is currently in development with mock API responses. Future updates will include:
- Real backend integration
- Advanced search and filtering
- User management dashboard
- Document version history

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
