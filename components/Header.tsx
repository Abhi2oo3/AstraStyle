
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="text-center">
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-500">
        Gemini Virtual Try-On
      </h1>
      <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
        See yourself in any outfit instantly. Upload your photo and the clothing you like, and let our AI handle the rest.
      </p>
    </header>
  );
};
