// TODO this needs to be fixed where it should not exceed the navigation height. I also stopped the ability to scroll on the technicianLayout so that needs to be fixed but for now its fine

import { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { HiXCircle } from 'react-icons/hi';
import MaintenanceExecution from '../../Pages/TechnicianDashboard/MaintenanceExecution'; // Import the TaskForm component

const MyOpenTasks = ({ initialTasks }) => {
  const [tasks, setTasks] = useState(initialTasks);
  const [showForm, setShowForm] = useState(false); // State variable to control form visibility
  const [selectedTask, setSelectedTask] = useState(null); // State variable to store the selected task

  const handlePriorityChange = (taskId, newPriority) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, priority: newPriority } : task
      )
    );
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task); // Store the selected task
    setShowForm(true); // Show the form
  };

  return (
    <div className="bg-gray-200 rounded-lg shadow-md p-6 w-full max-h-[calc(100vh-4rem)] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-left">My Open Tasks:</h2>
        <Link
          to="tasks"
          className="bg-gray-700 hover:bg-gray-500 text-gray-200 font-bold py-1 px-4 rounded"
        >
          <div>Go to List of Tasks {'>'}</div>
        </Link>
      </div>
      <div className="flex flex-col h-full">
        <div className="flex font-bold text-lg mb-2">
          <div className="w-8 text-center">
            <HiXCircle className="text-red-500" />
          </div>
          <div className="w-1/4 font-bold">Summary</div>
          <div className="w-12 flex justify-start pl-2">P</div>
          <div className="w-1/5 pr-4">Machine</div>
          <div className="w-1/5">Type</div>
          <div className="flex-1">Description</div>
        </div>
        <div className="overflow-y-auto h-full">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <div
                key={task.id}
                className="flex bg-white rounded-lg shadow-md p-2 mb-2 cursor-pointer"
                onClick={() => handleTaskClick(task)}
              >
                <div className="w-8 text-center">
                  <HiXCircle className="text-red-500" />
                </div>
                <div className="w-1/4">{task.summary}</div>
                <div className="w-12 flex justify-start pl-0">
                  <select
                    value={task.priority}
                    onChange={(e) => handlePriorityChange(task.id, Number(e.target.value))}
                    className="w-full"
                  >
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                  </select>
                </div>
                <div className="w-1/5">{task.machine}</div>
                <div className="w-1/5">{task.type}</div>
                <div className="flex-1">{task.description}</div>
              </div>
            ))
          ) : (
            <div className="text-gray-500">No tasks found.</div>
          )}
        </div>
      </div>
      {showForm && <MaintenanceExecution task={selectedTask} onClose={() => setShowForm(false)} />}
    </div>
  );
};

MyOpenTasks.propTypes = {
  initialTasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      summary: PropTypes.string.isRequired,
      priority: PropTypes.number.isRequired,
      machine: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default MyOpenTasks;