# node-redis-caching-middleware

This project provides a middleware for Node.js applications that integrates Redis caching, allowing you to cache responses and improve the performance of your backend.

## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

## Installation

### Run Locally

####  Server
1. Download or clone this repo.
2. Enter in server folder
3. Execute `bun i` to install the dependencies.
4. Copy `.env.example` to `.env` and set the environment variables.
5. Start the Redis database container:
  ```
  docker-compose up -d 
  ```
6. Start the development server:
  ```
  bun dev
  ```