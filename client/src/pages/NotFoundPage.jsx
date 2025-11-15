// src/pages/NotFoundPage.js
import React from "react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
      <h1 className="text-8xl font-bold mb-4">404</h1>
      <p className="mb-6 text-lg">Oops! The page you are looking for does not exist.</p>
      <Link
        to="/"
        className="px-6 py-3 bg-primary text-white rounded hover:bg-secondary hover:text-primary"
      >
        Go to Homepage
      </Link>
    </div>
  );
}
