# ModelFlow - Machine Learning Dashboard

<h1 align="center">Welcome to ModelFlow 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-0.1.0-blue.svg?cacheSeconds=2592000" />
  <a href="https://twitter.com/MinhajTapader" target="_blank">
    <img alt="Twitter: MinhajTapader" src="https://img.shields.io/twitter/follow/MinhajTapader.svg?style=social" />
  </a>
</p>

> ModelFlow is a professional full-stack machine learning dashboard that provides multiple ML models for different datasets with individual prediction forms, batch CSV uploads, model comparisons, and comprehensive prediction history tracking.

### ✨ [Live Demo](https://model-flow-frontend.vercel.app/)

## 🚀 Features

### 🎯 Multiple ML Models

- **Titanic Survival Prediction** - Logistic Regression, Random Forest Classifier, Decision Tree Classifier, Naive Bayse
- **Movie Rating Prediction** - Linear Regression, Decision Tree, Random Forest, KNN, SVR
- **Car Price Prediction** - Linear Regression, Decision Tree, Random Forest, KNN, SVR

### 📊 Dashboard Capabilities

- **Home Dashboard** - View recent predictions across all datasets
- **Individual Prediction Forms** - Input data manually with pre-filled test values
- **CSV Batch Upload** - Upload CSV files for bulk predictions with validation
- **Model Comparison** - Compare performance of different models on the same dataset
- **Prediction History** - View all past predictions grouped by dataset

### 🔐 Security & Authentication

- NextAuth integration with bearer token authentication
- Secure API calls with authorization headers
- Session management for user-specific data

### 🎨 Design

- Clean white background with black-to-blue color scheme
- Fully responsive grid layouts that scale with content
- Professional table-based data display
- Real-time form validation with React Hook Form

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4
- **Forms**: React Hook Form
- **Authentication**: NextAuth.js
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Language**: TypeScript

### Backend

- **Framework**: FastAPI (Python)
- **ML Models**: Scikit-learn (Logistic Regression, Decision Trees, Random Forest, KNN, SVR)
- **Server**: Uvicorn
- **Port**: https://fast-api-model-backend.onrender.com

## 📁 Project Structure

```
📦app
 ┣ 📂api
 ┃ ┗ 📂auth
 ┃ ┃ ┗ 📂[...nextauth]
 ┃ ┃ ┃ ┗ 📜route.ts              # NextAuth API routes
 ┣ 📂dashboard
 ┃ ┣ 📂(car-price)               # Car price prediction models
 ┃ ┃ ┣ 📂decission-tree-car-price
 ┃ ┃ ┃ ┗ 📜page.tsx              # Decision Tree for car prices
 ┃ ┃ ┣ 📂linear-regression-car-price
 ┃ ┃ ┃ ┗ 📜page.tsx              # Linear Regression for car prices
 ┃ ┃ ┣ 📂neighbour-car-price
 ┃ ┃ ┃ ┗ 📜page.tsx              # KNN for car prices
 ┃ ┃ ┣ 📂random-forest-rating-car-price
 ┃ ┃ ┃ ┗ 📜page.tsx              # Random Forest for car prices
 ┃ ┃ ┗ 📂svr-car-price
 ┃ ┃ ┃ ┗ 📜page.tsx              # SVR for car prices
 ┃ ┣ 📂(classifiers)             # General classification models
 ┃ ┃ ┣ 📂logistic-regression
 ┃ ┃ ┃ ┗ 📜page.tsx              # Logistic Regression classifier
 ┃ ┃ ┣ 📂naive-bayse
 ┃ ┃ ┃ ┗ 📜page.tsx              # Naive Bayes classifier
 ┃ ┃ ┣ 📂neighbour
 ┃ ┃ ┃ ┗ 📜page.tsx              # KNN classifier
 ┃ ┃ ┣ 📂random-forest
 ┃ ┃ ┃ ┗ 📜page.tsx              # Random Forest classifier
 ┃ ┃ ┗ 📂support-vector-classifier
 ┃ ┃ ┃ ┗ 📜page.tsx              # SVC classifier
 ┃ ┣ 📂(regressors)              # General regression models
 ┃ ┃ ┣ 📂decission-tree
 ┃ ┃ ┃ ┗ 📜page.tsx              # Decision Tree regressor
 ┃ ┃ ┣ 📂linear-regression
 ┃ ┃ ┃ ┗ 📜page.tsx              # Linear Regression
 ┃ ┃ ┣ 📂neighbour-rating
 ┃ ┃ ┃ ┗ 📜page.tsx              # KNN regressor
 ┃ ┃ ┣ 📂random-forest-rating
 ┃ ┃ ┃ ┗ 📜page.tsx              # Random Forest regressor
 ┃ ┃ ┗ 📂svr-rating
 ┃ ┃ ┃ ┗ 📜page.tsx              # Support Vector Regressor
 ┃ ┣ 📂all-predictions
 ┃ ┃ ┗ 📜page.tsx                # View all user predictions
 ┃ ┣ 📂compare
 ┃ ┃ ┗ 📜page.tsx                # Model comparison dashboard
 ┃ ┣ 📂csv-upload
 ┃ ┃ ┣ 📜page.tsx                # Batch CSV upload interface
 ┃ ┃ ┗ 📜test.csv                # Sample CSV for testing
 ┃ ┗ 📜page.tsx                  # Main dashboard page
 ┣ 📂login
 ┃ ┗ 📜page.tsx                  # Login page
 ┣ 📂quote
 ┃ ┣ 📜page.tsx                  # API quote/test page
 ┃ ┗ 📜test.txt                  # Test file for quotes
 ┣ 📜auth.ts                     # Authentication configuration
 ┣ 📜favicon.ico                 # Site favicon
 ┣ 📜globals.css                 # Global CSS styles
 ┣ 📜layout.tsx                  # Root layout component
 ┣ 📜page.tsx                    # Home page
 ┣ 📜preloader.css               # Loading animation styles
 ┣ 📜robots.ts                   # SEO robots configuration
 ┣ 📜sitemap.ts                  # SEO sitemap configuration
 ┗ 📜style.css                   # Additional custom styles
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn
- Python 3.8+ (for backend)
- FastAPI backend running on port 8000

### Frontend Installation

1. Clone the repository

```bash
git clone https://github.com/tapader13/modelflow-frontend.git
cd modelflow-frontend
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
# Add other auth provider credentials as needed
```

4. Run the development server

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

### Backend Setup

1. Ensure your FastAPI backend is running:

```bash
cd backend
uvicorn main:app --reload --port 8000
```

2. Verify backend is accessible at [http://127.0.0.1:8000](http://127.0.0.1:8000)

## 📡 API Endpoints

### Titanic Predictions

- `GET /titanic/logistic-single-user` - Get user's Titanic predictions
- `POST /titanic/logistic-predict` - Predict single Titanic survival

### Movie Rating Predictions

- `GET /movie-rating/linear-single-user` - Get user's movie predictions
- `POST /movie-rating/linear-predict` - Linear Regression prediction
- `POST /movie-rating/decission-predict` - Decision Tree prediction
- `POST /movie-rating/forest-predict` - Random Forest prediction
- `POST /movie-rating/neighbour-predict-rating` - KNN prediction
- `POST /movie-rating/svr-predict-rating` - SVR prediction

### Car Price Predictions

- `GET /car-price/linear-single-user` - Get user's car price predictions
- `POST /car-price/decission-predict` - Decision Tree prediction
- `POST /car-price/linear-predict` - Linear Regression prediction
- `POST /car-price/random-forest-predict` - Random Forest prediction
- `POST /car-price/knn-predict` - KNN prediction
- `POST /car-price/svr-predict` - SVR prediction

### Common Endpoints

- `GET /common/get-all-models-data` - Get all models with performance metrics
- `GET /common/all-predictions` - Get all predictions for authenticated user
- `POST /common/csv-batch-upload` - Upload CSV for batch predictions

## 📊 Required CSV Columns

### Titanic Dataset

```csv
pclass, name, sex, age, sibsp, parch, ticket, fare, cabin, embarked, email
```

### Movie Rating Dataset

```csv
rank, name, year, genre, certificate, run_time, tagline, budget, box_office, casts, directors, writers
```

### Car Price Dataset

```csv
ID, Levy, Manufacturer, Model, Prod. year, Category, Leather interior, Fuel type, Engine volume, Mileage, Cylinders, Gear box type, Drive wheels, Doors, Wheel, Color, Airbags
```

## 🎯 Usage Guide

### Single Predictions

1. Navigate to the specific model page (e.g., `/car-price` for car price prediction)
2. Form fields are pre-filled with test data for quick testing
3. Modify values as needed or use defaults
4. Click "Predict" to get results
5. Results display in a card on the right side

### CSV Batch Upload

1. Go to `/csv-upload`
2. Select your dataset (Titanic, Movie Rating, or Car Price)
3. Choose the ML model to use
4. Upload your CSV file
5. The system validates column names (exact match required)
6. Click "Predict" to process all rows
7. Results display in a table below

### Model Comparison

1. Visit `/compare` to see all models grouped by dataset
2. Best performing model for each dataset is highlighted with a gold badge
3. View average predictions and performance metrics

### Prediction History

1. Go to `/predictions` to view all your past predictions
2. Predictions are grouped by dataset
3. Each entry shows input data, model used, and prediction result

## 🔒 Authentication

All API requests require authentication via NextAuth. The session provides a `backendToken` that is sent in the Authorization header:

```typescript
headers: {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${session.backendToken}`,
}
```

## 🎨 Color Scheme

The dashboard uses a professional black-to-blue color palette:

- **Background**: White (#FFFFFF)
- **Primary**: Blue shades (from #000000 to #007BFF)
- **Accents**: Blue for buttons, links, and interactive elements
- **Text**: Black (#000000) for primary text, gray (#6B7280) for secondary
- **Success**: Green (#10B981) for positive indicators
- **Warning**: Orange (#F59E0B) for cautions

## 🛠️ Development

### Adding a New Model

1. Create a new page in the appropriate dataset folder
2. Copy the structure from an existing model page
3. Update the API endpoint URL
4. Update the model name display
5. Add the new model to the comparison page

### Adding a New Dataset

1. Create a new folder under `app/`
2. Create model pages for each ML algorithm
3. Add the dataset to CSV upload validation
4. Update the home dashboard to fetch and display data
5. Add to model comparison page
6. Update required columns in README

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 👤 Author

**Minhaj Tapader**

- Website: https://minhaj-mu.vercel.app/
- Github: [@tapader13](https://github.com/tapader13)
- LinkedIn: [Minhaj Uddin Tapader](https://www.linkedin.com/in/minhaj-uddin-tapader/)
- Twitter: [@MinhajTapader](https://twitter.com/MinhajTapader)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [FastAPI](https://fastapi.tiangolo.com/) for the Python backend
- [Scikit-learn](https://scikit-learn.org/) for machine learning algorithms
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [shadcn/ui](https://ui.shadcn.com/) for UI components

## ⭐ Support

Give a ⭐️ if this project helped you!

---

Built with ❤️ using Next.js and FastAPI
