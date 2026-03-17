import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 py-8">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-xl text-center space-y-6">
        
        {/* Animated 404 Text */}
        <div className="relative inline-block text-9xl font-extrabold text-indigo-600 animate-pulse-slow">
          404
        </div>
        
        {/* Main Message */}
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Page not found
        </h1>
        
        {/* Description */}
        <p className="mt-4 text-base leading-7 text-gray-600">
          Sorry, we couldn’t find the page you’re looking for. It might have been moved or doesn't exist.
        </p>
        
        {/* Action Button */}
        <div className="mt-8 flex justify-center">
          <Link
            to="/"
            className="rounded-md bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transform transition hover:scale-105 active:scale-95"
          >
            Go back home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;