# Notes Collaboration App - Frontend

**Live App**: [Notes Collaboration App](https://eclectic-gaufre-6ce38f.netlify.app/)

## Overview
The **Notes Collaboration App** is a real-time collaborative note-taking application. This repository contains the frontend code, built using **React** and **Vite**, and designed to provide a seamless and intuitive user experience for creating, editing, and collaborating on notes in real time.

---

## Features

### Core Features
- **User Authentication**:
  - Sign up, login, and logout functionalities.
  - Integration with secure authentication providers.
  - Tokenization is used for secure API calls and login sessions.
  - Sessions automatically expire after a set time for enhanced security.

- **Notes Management**:
  - Create, edit, and delete notes.
  - Categorize notes with easy-to-use tags.
  - Display a list of user-specific notes.
  - AI-powered auto-categorization of notes based on their content.

- **Real-Time Collaboration**:
  - Edit notes simultaneously with other users who are on the collaboration list created by the note's owner.
  - Real-time updates implemented using **Server-Sent Events (SSE)**.
  - View the list of online users in real time.

- **Email Integration**:
  - Send collaboration invites via email directly from the app.

- **Optimistic UI Updates**:
  - Instant feedback on user actions for a smoother experience.

- **Theme Switcher**:
  - Switch between light and dark modes for better user customization.

- **Responsive Design**:
  - Fully responsive design to support various devices and screen sizes.

---

## Tech Stack

### Frontend
- **Framework**: React with Vite for a blazing-fast development experience.
- **Styling**: ShadCN UI for a clean and minimalistic design inspired by Notion.
- **State Management**: Using local state management with React hooks.
- **Real-Time Functionality**: Server-Sent Events (SSE) to enable live collaboration.

### Deployment
- Hosted on **Netlify** for fast and secure continuous deployment.

---

## Getting Started

### Prerequisites
Ensure you have the following installed:
- Node.js (version 14 or above)
- npm or yarn package manager

###Testing and Error Handling

Key Strategies

Route Protection:

Users cannot access any routes except Sign In and Sign Up if they do not have a valid token.

Unauthorized users are automatically redirected to the Sign In page.

Session Expiry Handling:

When a session expires, an Axios interceptor detects the issue and logs the user out.

The user is required to log in again to regain access.

Restricted Access for Authenticated Users:

Logged-in users cannot access Sign In or Sign Up routes unless they log out first.

This ensures seamless navigation and prevents unnecessary route conflicts.

### Setup Instructions

#### Generating GitHub Key for Netlify
To set up the app properly, you need to generate a GitHub key for API integration and add it as an environment variable in Netlify. Follow these steps:

1. **Generate a GitHub Key**:
   - Go to the (https://github.com/marketplace/models/azure-openai/gpt-4o/playground/code).
   - Click on **"Generate new token (classic)"**.
   - Add a note (e.g., "Netlify API Key") for reference.
   - Select the necessary scopes:
     - `repo` (for repository access, if required).
     - Other scopes depending on your use case.
   - Click **Generate Token** and copy the generated key.

2. **Add the Key to Netlify**:
   - Log in to your Netlify dashboard.
   - Navigate to **Site Settings > Environment Variables**.
   - Add a new variable:
     - **Key**: `VITE_GITHUB_KEY`
     - **Value**: Paste the GitHub token you generated.
   - Save the changes.

3. **Redeploy the App**:
   - Trigger a new deployment by pushing changes to your GitHub repository or redeploying via the Netlify dashboard.

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/vansh180198/notesmakingapp-frontend.git
   cd notesmakingapp-frontend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Environment Variables**:
   Create a `.env` file in the root directory and add the required environment variables. Example:
   ```env
   VITE_API_URL=https://your-backend-api-url.com
   VITE_GITHUB_KEY=your_github_key
   ```

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.

5. **Build for Production**:
   ```bash
   npm run build
   ```
   The production-ready files will be available in the `dist` directory.

---

## Deployment

The app is hosted on Netlify. To deploy:

1. Connect your GitHub repository to Netlify.
2. Set the environment variables in Netlify under **Site Settings > Environment Variables**.
3. Trigger a deployment by pushing changes to the `main` branch.

---

## Folder Structure
```
notesmakingapp-frontend/
├── dist/                # Build output directory
├── node_modules/        # Project dependencies
├── src/                 # Source files
│   ├── component/       # Main reusable components
│   │   ├── CustomModal.jsx
│   │   ├── EditNoteForm.jsx
│   │   ├── FilterBar.jsx
│   │   ├── FormInput.jsx
│   │   ├── Navbar.jsx
│   │   ├── NoteCard.jsx
│   │   ├── NotesGrid.jsx
│   │   ├── NotesList.jsx
│   │   ├── OnlineUsers.jsx
│   │   ├── SignIn.jsx
│   │   └── SignUp.jsx
│   ├── components/ui/   # UI-specific components
│   │   ├── button.jsx
│   │   ├── card.jsx
│   │   ├── dialog.jsx
│   │   ├── dropdown-menu.jsx
│   │   ├── input.jsx
│   │   └── textarea.jsx
│   ├── config/          # Configuration files
│   ├── lib/             # Utility libraries
│   ├── App.css          # Global styles
│   ├── App.jsx          # Main application file
│   ├── index.css        # Base CSS styles
│   └── main.jsx         # Application entry point
├── .env                 # Environment variables
├── .gitignore           # Git ignore file
├── components.json      # Component metadata
├── eslint.config.js     # ESLint configuration
├── index.html           # Main HTML template
├── jsconfig.json        # JavaScript configuration
├── netlify.toml         # Netlify deployment configuration
├── package-lock.json    # Lock file for npm
├── package.json         # Project metadata and dependencies
├── postcss.config.js    # PostCSS configuration
├── README.md            # Project documentation
├── tailwind.config.js   # Tailwind CSS configuration
└── vite.config.js       # Vite configuration

```

---

## Contributing

Contributions are welcome! Follow these steps:
1. Fork the repository.
2. Create a new branch for your feature/bugfix.
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes and push them to your fork.
4. Create a pull request to the main repository.


---

## Contact
For any questions or feedback, feel free to contact:
- **Name**: Vansh Bhatia
- **Email**: vanshbhatia53@yahoo.com
- **GitHub**: [vansh180198](https://github.com/vansh180198)

---

Happy Collaborating!

