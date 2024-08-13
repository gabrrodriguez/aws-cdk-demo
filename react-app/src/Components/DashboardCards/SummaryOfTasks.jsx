import TechnicianCard from '../TechnicianCard';
import { Link } from "react-router-dom";




const SummaryOfTasks = () => {
  return (
    <TechnicianCard isLarge={true}>
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-left mb-4">Summary of Tasks</h2> {/* Added mb-4 for consistent margin */}
        <div className="h-0.5 bg-gray-800"></div>
      </div>
      <div className="grid grid-cols-2">
        <div className="pl-10">
          <h3 className="text-base font-bold mb-2">Tasks Assigned:</h3>
          <h3 className="text-base font-bold mb-2">Open Tasks:</h3>
          <h3 className="text-base font-bold mb-2">In Review Tasks:</h3>
          <h3 className="text-base font-bold mb-2">Closed Tasks:</h3>
        </div>
        <div className="text-left">
          {/* placeholder for backend functionality to get tasks */}
          <p className="mb-2 font-semibold">0</p>
          <p className="mb-2 font-semibold">0</p>
          <p className="mb-2 font-semibold">0</p>
          <p className="mb-2 font-semibold">0</p>
        </div>
      </div>
      <div className="flex justify-end mt-2">
        <Link
          to="tasks"
          className="bg-gray-700 hover:bg-gray-500 text-gray-200 font-bold py-1 px-4 rounded"
        >
          <div> Go to List of Tasks {'>'} </div>
        </Link>
      </div>
    </TechnicianCard>
  );
};

export default SummaryOfTasks;