# Instagram Clone

This project is a web application that replicates some of the main features of Instagram. It is built with modern web technologies and provides a simple and intuitive user interface.

## Features

*   **User Authentication**: Users can create an account, log in, and log out.
*   **Post Management**: Authenticated users can upload new posts and delete their existing posts.
*   **Image Viewing**: Users can view posts from other users on the main feed.
*   **User Profile**: Each user has a profile page where they can see all the posts they have uploaded.

## Technologies Used

*   **Frontend**:
    *   [React](https://reactjs.org/)
    *   [Vite](https://vitejs.dev/)
    *   [Tailwind CSS](https://tailwindcss.com/)
*   **Backend**:
    *   [Supabase](https://supabase.io/)
*   **Libraries**:
    *   [React Router](https://reactrouter.com/)
    *   [SweetAlert2](https://sweetalert2.github.io/)
    *   [React Toastify](https://fkhadra.github.io/react-toastify/introduction)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   Node.js
*   npm

### Installation

1.  Clone the repo
    ```sh
    git clone https://your-repository-url.com
    ```
2.  Install NPM packages
    ```sh
    npm install
    ```
3.  Create a `.env` file in the root of the project and add your Supabase credentials:
    ```
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

### Running the Application

To run the application in a development environment, use the following command:

```sh
npm run dev
```

This will start the development server, and you can view the application in your browser at `http://localhost:5173` (or another port if 5173 is busy).