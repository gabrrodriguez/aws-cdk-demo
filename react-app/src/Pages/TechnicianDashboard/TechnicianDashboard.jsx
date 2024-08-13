



import SummaryOfTasks from '../../Components/DashboardCards/SummaryOfTasks';
import MyAverageTime from '../../Components/DashboardCards/MyAverageTime';
import DailyTasks from '../../Components/DashboardCards/DailyTasks';
import MyOpenTasks from '../../Components/DashboardCards/MyOpenTasks';

// mocking tasks
const initialTasks = [
  {
    id: '1',
    summary: 'Task 1',
    priority: 2,
    machine: 'ABX',
    type: 'Maintenance',
    description: 'Perform routine maintenance on Machine ABX.',
  },
  {
    id: '2',
    summary: 'Task 2',
    priority: 2,
    machine: 'ABX',
    type: 'Maintenance',
    description: 'Perform routine maintenance on Machine ABX.',
  },
  {
    id: '3',
    summary: 'Task 3',
    priority: 2,
    machine: 'ABX',
    type: 'Maintenance',
    description: 'Perform routine maintenance on Machine ABX.',
  },
  {
    id: '4',
    summary: 'Task 3',
    priority: 2,
    machine: 'ABX',
    type: 'Maintenance',
    description: 'Perform routine maintenance on Machine ABX.',
  },
  {
    id: '5',
    summary: 'Task 3',
    priority: 2,
    machine: 'ABX',
    type: 'Maintenance',
    description: 'Perform routine maintenance on Machine ABX.',
  },
  {
    id: '6',
    summary: 'Task 3',
    priority: 2,
    machine: 'ABX',
    type: 'Maintenance',
    description: 'Perform routine maintenance on Machine ABX.',
  },
  {
    id: '7',
    summary: 'Task 3',
    priority: 2,
    machine: 'ABX',
    type: 'Maintenance',
    description: 'Perform routine maintenance on Machine ABX.',
  },
  {
    id: '8',
    summary: 'Task 3',
    priority: 2,
    machine: 'ABX',
    type: 'Maintenance',
    description: 'Perform routine maintenance on Machine ABX.',
  },
  {
    id: '9',
    summary: 'Task 3',
    priority: 2,
    machine: 'ABX',
    type: 'Maintenance',
    description: 'Perform routine maintenance on Machine ABX.',
  },
  {
    id: '10',
    summary: 'Task 3',
    priority: 2,
    machine: 'ABX',
    type: 'Maintenance',
    description: 'Perform routine maintenance on Machine ABX.',
  },
  {
    id: '11',
    summary: 'Task 3',
    priority: 2,
    machine: 'ABX',
    type: 'Maintenance',
    description: 'Perform routine maintenance on Machine ABX.',
  },
]

const TechnicianDashboard = () => {
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
        <div className="md:col-span-3 gap-10">
          <SummaryOfTasks />
        </div>
        <div className="md:col-span-2">
          <MyAverageTime />
        </div>
        <div className="md:col-span-2">
          <DailyTasks />
        </div>
      </div>
      <div className="mt-4 py-4">
        <MyOpenTasks  initialTasks = {initialTasks}/>
      </div>
    </div>
  );
};

export default TechnicianDashboard;