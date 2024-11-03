# Budget Tracker App [(Budget Inu)](https://budgetinu.vercel.app/)

## Overview

Budget Inu is your go-to budget tracker app that helps you manage your daily and monthly expenses. This application features a Shiba Inu-inspired color theme and is optimized for mobile use. It was built using React for the frontend and Ruby on Rails for the backend (API only).

## Deployment

This project is currently deployed on Vercel for the frontend and Render for the backend (API).

- [Budget Inu](https://budgetinu.vercel.app/)
- [API](https://budget-tracker-budget-inu-api.onrender.com)

## Features

Budget Inu includes a range of features to assist users in tracking their expenses:

- **Authentication**: Includes Sign Up and Login functionality.
- **User Dashboard**: Each user has their own dashboard that displays:
  - Total cash and liabilities.
  - An "Add Entry" button to add new entries.
  - A date bar displaying current entries for the month, with arrows to navigate between months.
  - An entries table listing all entries created by the user, sorted by date.
  - The ability to edit or delete each entry by clicking on it.
  - A total income and expense bar that sums up the total income/expenses for the month.
  
- **Add Entry**: 
  - Four entry types are available: Income, Expense, Liability, and Settlement.
  - Each entry type affects cash and liabilities displayed on the dashboard, either positively or negatively.
  - Entry types have categories that display based on the selected category.

## Get Started

### Pre-requisites

For deployment in a local environment, ensure you have the following installed:

- Ruby on Rails version: 7.2.1
- Ruby: 3.2.0
- React version: 18.3.1
- PostgreSQL

### Clone the Repository:

```
git clone https://github.com/Micokoko/budget-tracker-app.git
```

## Setup Backend (API) First

### Navigate to the Project Directory:

```
cd backend
```

Navigate to the project directory and run `bundle install` to install all necessary dependencies

create a .env file first for your Postgres credentials.


```
DATABASE_USERNAME=[your username]
DATABASE_PASSWORD=[password]
```

Start the API server by running `rails server` The API will be available at http://localhost:3000.


## Setup Frontend


### In the root directory, proceed to this route below:

```
cd frontend
```


### Once in the correct directory proceed to `src/services/api.js` and change the API_URL as seen below to connect to the local API setup by your local enviroment.

```
export const API_URL = 'http://127.0.0.1:3000';

```

Run this command below to start the web app.

```
npm start
```

Runs the app in the development mode.\
Open [http://localhost:3001](http://localhost:3001) to view it in your browser.

The page will reload when you make changes.
