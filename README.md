# Car Dealer App

A Next.js application that allows users to explore vehicle makes and models by selecting a make and year. The app fetches data from an external API to display available vehicle information dynamically.

## Features

Dynamic routing to display results for selected vehicle makes and years.

Integration with NHTSA Vehicle API for fetching vehicle makes.

Interactive UI with dropdowns for make and year selection.

Fully responsive design.

## Deploy
- https://car-dealer-app-project.vercel.app/

## Prerequisites

Ensure you have the following installed:

- Node.js (v16 or later recommended)

- npm or yarn

### Getting Started

#### 1. Clone the Repository

git clone https://github.com/leticiaanobre/CarDealerApp.git
cd car-dealer-app

#### 2. Install Dependencies

Run the following command to install all required dependencies:

``` npm install ```

or, if you prefer yarn:

``` yarn install ```

#### 3. Set Up Environment Variables

Create a .env.local file in the root directory and add the following variables:

``` NEXT_PUBLIC_API_BASE_URL=https://vpic.nhtsa.dot.gov/api ```

#### 4. Start the Development Server

Run the following command to start the development server:

``` npm run dev ```

or:

``` yarn dev ```

The application will be available at http://localhost:3000.

### Project Structure

.
├── components
│   └── ui                # Reusable UI components
├── pages
│   ├── index.tsx         # Home page
│   └── result            # Dynamic result pages
├── public                # Static assets
├── styles                # Global styles
├── .env.local            # Environment variables
├── package.json          # Project dependencies and scripts
└── README.md             # Project documentation
