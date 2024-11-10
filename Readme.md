# RAG CHATBOT

RAG chatbot is a backend application to provide a seamless experience for users
to interact with their documents. The app create embeddings from the content of file (.pdf, .txt, .docx) and stores them in vector database for easy querying among embeddings enabling quick and
accurate information retrieval later on. The backend uses MongoDB for data storage, and pinecone as vector database.

---

## Table of Contents

- [Project Features](#project-features)
- [Tech Stack](#tech-stack)
- [Libraries Used](#libraries-used)
- [Setup and Installation](#setup-and-installation)
- [Environment Variables](#environment-variables)
- [API Endpoints and Sample Requests](#api-endpoints-and-sample-requests)
- [Development Choices](#development-choices)
- [Deployment](#deployment)
- [Potential Improvements](#potential-improvements)
- [Acknowledgements](#acknowledgements)

---

## Project Features

- **Processing file**: Split the contents of text-based files and stores embeddings in vector DB.
- **Chat with file**: Users can query with file content. The app provide accurate response.
- **Chat history**: Users can view chat history.

---

## Tech Stack

- **Backend**: NodeJs, Express, Typescript, Langchain
- **Database**: PineconeDB, MongoDB
- **Model** - gemini-pro, text-embedding-004 by google-genai

---

## Libraries Used

- **@langchain/core**, **@langchain/google-genai**: AI-powered language generation and interaction with Google Generative AI.
- **@pinecone-database/pinecone**: Connect to Pinecone for storing and retrieving vector embeddings.
- **cors**: Cross-Origin Resource Sharing configuration middleware.
- **dotenv**: Loads environment variables from `.env` file.
- **express**: Fast, minimal web server framework.
- **nodemon**: Automatically restarts server on file changes..
- **multer**: Middleware for handling file uploads
- **pdf-parse**: Extract contents of .pdf files
- **mammoth**: Extract contents of .docx files
- **typescript**: Used to write TypeScript code.
- **ts-node**: Execute typescript code.

---

## Setup and Installation

### Prerequisites

- NodeJS
- MongoDB
- Pinecone
- Git (for version control)

### Environment Variables

- Create a `.env` file in the backend directory and copy the content from `.env.example` into it.
- Get Pinecone DB api from https://app.pinecone.io
- Run your mongodb locally or get a uri string from mongodb atlas.
- rest all variables can be same

### Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/ayushjaiz/rag-chatbot
   cd rag-chatbot
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Run the Backend Application:**
   ```bash
   npm run build
   npm run start
   ```

---

## API Endpoints and Sample Requests

### POST `/api/documents/process`

Process document and store embeddings in database

#### Request:

```http
POST /api/documents/process
```

#### Body

```
file: [Upload your text-based file here]
```

#### Response:

```json
{
    "assetId": "850bae1c-ef2f-48e7-af53-dcc67c086247",
    "message": "Document processed successfully"
}
```

### POST `/api/chat/start`

Accepts as assetId and create chat session

#### Request:

```http
POST /api/chat/start
```

#### Body

```json
{
  "assetId": "850bae1c-ef2f-48e7-af53-dcc67c086247"
}
```

#### Response:

```json
{
    "chatThreadId": "84578f88-30ce-4454-a0ef-ff3973788cae"
}
```

### POST `/api/chat/message`

Sends a user message to an active chat session.

#### Request:

```http
POST /api/chat/message
```

#### Body

```json
{
    "chatThreadId": "84578f88-30ce-4454-a0ef-ff3973788cae",
    "message": "What is SQL?"
}
```

#### Response(Stream):

```
data: SQL stands for Structured Query Language, and it is used to communicate with the Database
```

```
data: . This is a standard language used to perform tasks such as retrieval, updates, insertion and deletion of data from a database.
```

### GET `/chat/history`

Access chat history via chatThreadId

#### Request:

```http
POST /api/chat/history
```

#### body

```json
{
  "chatThreadId": "84578f88-30ce-4454-a0ef-ff3973788cae"
}
```

#### Response:

```json
{
  "chatHistory": {
      "_id": "67307da4bc6d8095c8643e7b",
      "chatThreadId": "84578f88-30ce-4454-a0ef-ff3973788cae",
      "assetId": "850bae1c-ef2f-48e7-af53-dcc67c086247",
      "startedAt": "2024-11-10T09:32:20.564Z",
      "messages": [
          {
              "timeString": "2024-11-10T09:33:47.966Z",
              "role": "USER",
              "message": "What is SQL?",
              "_id": "67307dfbbc6d8095c8643e7f"
          },
          {
              "timeString": "2024-11-10T09:33:47.966Z",
              "role": "AGENT",
              "message": "SQL stands for Structured Query Language, and it is used to communicate with the Database. This is a standard language used to perform tasks such as retrieval, updates, insertion and deletion of data from a database.",
              "_id": "67307dfbbc6d8095c8643e80"
          }
      ],
      "__v": 0
  }
}
```

---

## Development Choices

### Why Node.js?

- Excellent package ecosystem
- Strong async/await support
- Easy deployment options

### Why Typescript?

- Prevent from errors during development phase
- Type security
- Faster code development

### Why MongoDB?

- Flexible schema for review data
- Easy to scale
- Free tier available on MongoDB Atlas

### Why Pinecone?

- Easy documentation
- Free tier avaliable on Pinecone Console

---

## Deployment

This app is deployed on render: https://rag-chatbot-0fjv.onrender.com

---

## Potential Improvements

- Divide backend into microservices
- Uploading files to Cloudinary/S3

---

## Acknowledgements

This project was completed with the assistance of various online resources. I utilized the following tools and sources to support the development of this application:

- Google + Stack Overflow - for bugs and documentation of libraries
- Mongoose and Pinecone docs
- Some youtube tutorials understanding langchain and vectordb
