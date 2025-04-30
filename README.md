# Document Manager App

A modern document management system built with Next.js, React, and TypeScript. This application allows users to upload, view, edit, and delete documents based on their role permissions.

## Features

- **User Authentication**: Secure login and registration system with role-based access control
- **Role-Based Permissions**: Different access levels for admins, editors, and viewers
- **Document Management**: Upload, Create, read, update, and delete documents
- **Responsive Design**: Works on desktop and mobile devices
- **Search Functionality**: Search documents by title, content, or user

## Technology Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Authentication**: JWT token-based authentication

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn

### Installation

1. Clone the repository
```bash
https://github.com/rishabh-sharma1712/doc-manager-app.git
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
│   ├── components/         # React components
│   ├── context/            # Context providers
│   ├── lib/                # Utility functions
│   └── types/              # TypeScript type definitions
├── public/                 # Static assets
├── .next/                  # Next.js build output
└── package.json            # Project configuration
```

## User Roles

- **Admin**: Full access to create, view, edit, and delete all documents
- **Editor**: Can create, view, edit, and delete their own documents
- **Viewer**: Can only view documents

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
