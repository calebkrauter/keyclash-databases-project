# databases-project



## Seting up Environment

### Prerequisites

- Docker installed on your system. If you dont have docker installed please refer to this documentation. https://docs.docker.com/engine/install/
- Docker Desktop


### Setup Instructions

1. Clone the repository (if you haven't already):

2. In the files there is a shell script called run.sh which will build a docker image locally.

3. In order to run the docker image be sure you are in the directory it is located in

4. Give permission to the script, chmod +x run.sh

5. Run the script, ./run.sh

# Vue.js Frontend File Structure

The following file structure is commonly used in Vue.js projects for its clarity and organization:

<img width="168" alt="image" src="https://github.com/user-attachments/assets/06f19795-391c-4f25-8244-4292bb816728">


### index.html (in project root)

**Purpose:** Serves as the main HTML file for the Single Page Application (SPA).

**Pros:**
- Acts as the entry point for the application
- Contains the root DOM element where the Vue app is mounted
- Can include essential meta tags, external CDN links, and other global HTML elements
- Allows for easy configuration of the base HTML structure
- Vite (and other build tools) use this file to inject built scripts and styles

## Breakdown and Benefits

### 1. components/

**Purpose:** Contains reusable Vue components.

**Pros:**
- Promotes component reusability across the application
- Easier to maintain and test individual components
- Enhances code organization and readability

### 2. views/

**Purpose:** Houses components that represent entire pages or views.

**Pros:**
- Clear separation between page-level components and reusable components
- Aligns well with router configuration
- Makes it easier to understand the overall structure of the application

### 3. router/

**Purpose:** Contains router configuration files.

**Pros:**
- Centralizes all routing logic in one place
- Makes it easier to manage and update routes
- Keeps the main.js file cleaner

### 4. public/

**Purpose:** Stores static assets that don't need processing.

**Pros:**
- Clear location for assets like favicon, robots.txt, etc.
- These files are copied directly to the build output without processing

### 5. styles/

**Purpose:** Contains global styles and variables.

**Pros:**
- Centralizes global styles, making them easier to manage
- Allows for easy implementation of theming and consistent styling across the app
- Keeps component files focused on component-specific styles

### 6. App.vue

**Purpose:** The root component of the application.

**Pros:**
- Serves as the main layout component
- Ideal place for elements that appear on every page (e.g., header, footer)
- Acts as the entry point for the component tree

### 7. main.js

**Purpose:** The main entry point for the application.

**Pros:**
- Centralizes app initialization
- Ideal place to register global components, plugins, and configure the Vue instance
- Keeps the app bootstrapping process clear and organized

## Overall Benefits

1. **Scalability:** This structure scales well as the project grows.
2. **Maintainability:** Clear organization makes it easier to find and update specific parts of the application.
3. **Collaboration:** Team members can easily understand and navigate the project structure.
4. **Best Practices:** Aligns with Vue.js and general frontend development best practices.
5. **Separation of Concerns:** Each directory has a clear, specific purpose, enhancing code organization.

# Project Dependencies Documentation

This document explains the purpose of each package used in our Vue.js project.

## Development Dependencies

### 1. vite (^5.3.4)
- **Purpose:** Next generation frontend tooling.
- **Benefits:**
  - Provides faster and leaner development experience
  - Offers instant server start and lightning-fast HMR (Hot Module Replacement)
  - Optimized build performance

### 2. @vitejs/plugin-vue (^5.0.5)
- **Purpose:** Official Vue 3 plugin for Vite.
- **Benefits:**
  - Enables Vue 3 single-file component support in Vite
  - Provides Vue-specific optimizations and features in the build process

## Scripts

- `dev`: Starts the Vite development server
- `build`: Builds the production-ready application using Vite
- `preview`: Locally previews the production build
- `start`: Starts the Express server (likely for production use)
