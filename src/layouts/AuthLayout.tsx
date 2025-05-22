import React from "react";
import Img from "../assets/Logo Minimalista ChefComanda.png";

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex flex-col items-center border-rounded-lg">
          {/* Modern Chef Illustration */}
          <img
            src={Img}
            alt="ChefComanda Logo"
            className="rounded-lg shadow-xl max-w-full h-auto"
            style={{ maxHeight: "300px" }}
          />
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow-xl rounded-lg sm:px-10">
          {children}
        </div>
      </div>

      <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
        &copy; {new Date().getFullYear()} ChefComanda. Todos os direitos
        reservados.
      </div>
    </div>
  );
};

export default AuthLayout;
