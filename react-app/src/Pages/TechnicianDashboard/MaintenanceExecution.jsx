import React from 'react';

const MaintenanceExecution = ({ task, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl">
        {/* Top cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {/* Tasks card */}
          <div className="bg-gray-100 rounded-lg p-4">
            <h3 className="text-lg font-bold mb-2">Tasks:</h3>
            {/* Tasks content */}
          </div>
          {/* %Complete card */}
          <div className="bg-gray-100 rounded-lg p-4">
            <h3 className="text-lg font-bold mb-2">%Complete:</h3>
            {/* %Complete content */}
          </div>
          {/* Time Elapsed card */}
          <div className="bg-gray-100 rounded-lg p-4">
            <h3 className="text-lg font-bold mb-2">Time Elapsed:</h3>
            {/* Time Elapsed content */}
          </div>
          {/* Comments card */}
          <div className="bg-gray-100 rounded-lg p-4">
            <h3 className="text-lg font-bold mb-2">Comments:</h3>
            {/* Comments content */}
          </div>
        </div>

        {/* Step and directions */}
        <div className="grid grid-cols-2 gap-4">
          {/* Step and directions card */}
          <div className="bg-gray-100 rounded-lg p-4 h-96 overflow-y-auto">
            <h3 className="text-lg font-bold mb-2">Step 1: Lorem ipsum</h3>
            <p className="mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed auctor, nisl nec ultricies tincidunt, nisl
              nisl aliquam nisl, eget aliquam nisl nisl eget nisl. Sed auctor, nisl nec ultricies tincidunt, nisl nisl
              aliquam nisl, eget aliquam nisl nisl eget nisl.
            </p>
            {/* Additional steps */}
          </div>

          {/* Image and comments card */}
          <div className="bg-gray-100 rounded-lg p-4">
            <div className="h-1/2 bg-gray-300 mb-4"></div>
            <div className="h-1/2">
              <h3 className="text-lg font-bold mb-2">Comments:</h3>
              <textarea
                className="w-full h-32 p-2 border border-gray-300 rounded-md resize-none"
                placeholder="Enter your comments..."
              ></textarea>
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2">
                Submit
              </button>
            </div>
          </div>
        </div>

        {/* Close button */}
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default MaintenanceExecution;