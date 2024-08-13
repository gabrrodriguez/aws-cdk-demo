


import TechnicianCard from '../TechnicianCard';

const MyAverageTime = () => {
  const topRightTime = '1h 30m';
  const bottomLeftTime = '2h 15m';
  const averageTime = calculateAverageTime(topRightTime, bottomLeftTime);

//   return (
//     <TechnicianCard>
//       <h2 className="text-2xl font-bold text-left mb-4">My Average Time</h2>
//       <div className="flex justify-center items-center">
//         <div className="relative">
//           <div className="w-40 h-40 rounded-full bg-blue-500 text-white flex flex-col items-center justify-center">            
//             <span className="text-lg font-bold">AVG</span>
//             <span className="text-3xl font-bold">{averageTime}</span>
//           </div>
//           <div className="absolute top-2 left-2 w-16 h-16 rounded-full bg-red-500 text-white flex flex-col items-center justify-center -translate-x-1/4 -translate-y-1/4">
//             <span className="text-sm font-bold">Major</span>
//             <span className="text-sm font-bold">{bottomLeftTime}</span>
//           </div>
//           <div className="absolute bottom-0 right-0 w-16 h-16 rounded-full bg-green-500 text-white flex flex-col items-center justify-center translate-x-1/4 translate-y-1/4">
//             <span className="text-sm font-bold">Minor</span>
//             <span className="text-sm font-bold">{topRightTime}</span>
//           </div>
//         </div>
//       </div>
//     </TechnicianCard>
//   );
// };

return (
  <TechnicianCard>
    <h2 className="text-2xl font-bold text-left mb-4">My Average Time</h2> {/* Added mb-4 for consistent margin */}
    <div className="flex justify-center items-center h-full">
      <div className="relative">
        <div className="w-40 h-40 rounded-full bg-blue-500 text-white flex flex-col items-center justify-center">            
          <span className="text-lg font-bold">AVG</span>
          <span className="text-3xl font-bold">{averageTime}</span>
        </div>
        <div className="absolute top-2 left-2 w-16 h-16 rounded-full bg-red-500 text-white flex flex-col items-center justify-center -translate-x-1/4 -translate-y-1/4">
          <span className="text-sm font-bold">Major</span>
          <span className="text-sm font-bold">{bottomLeftTime}</span>
        </div>
        <div className="absolute bottom-0 right-0 w-16 h-16 rounded-full bg-green-500 text-white flex flex-col items-center justify-center translate-x-1/4 translate-y-1/4">
          <span className="text-sm font-bold">Minor</span>
          <span className="text-sm font-bold">{topRightTime}</span>
        </div>
      </div>
    </div>
  </TechnicianCard>
);
};





// this works if the values are strings, will need to change if the numbers datetime
const calculateAverageTime = (time1, time2) => {
  const [hours1, minutes1] = time1.split('h');
  const [hours2, minutes2] = time2.split('h');

  const totalMinutes1 = parseInt(hours1) * 60 + parseInt(minutes1);
  const totalMinutes2 = parseInt(hours2) * 60 + parseInt(minutes2);

  const averageMinutes = Math.round((totalMinutes1 + totalMinutes2) / 2);

  const averageHours = Math.floor(averageMinutes / 60);
  const averageMinutesRemaining = averageMinutes % 60;

  return `${averageHours}h ${averageMinutesRemaining}m`;
};

export default MyAverageTime;



// import SummaryOfTasks from '../../Components/DashboardCards/SummaryOfTasks';
// import MyAverageTime from '../../Components/DashboardCards/MyAverageTime';
// import DailyTasks from '../../Components/DashboardCards/DailyTasks';
// import MyOpenTasks from '../../Components/DashboardCards/MyOpenTasks';

// // mocking a task
// const myTasks = [
//   {
//     id: '1',
//     summary: 'Task 1',
//     priority: 'High',
//     machine: 'Machine A',
//     type: 'Maintenance',
//     description: 'Perform routine maintenance on Machine A.',
//   },
// ]

// const TechnicianDashboard = () => {
//   return (
//     <div className="flex flex-col">
//       <div className = "md:flex-row md:items-stretch md:space-x-10 p-4">
      
//         <div className="md:w-2/3">
//           <SummaryOfTasks />
//         </div>
//         <div className="md:w-3/4 flex flex-col md:flex-row md:space-x-4">
//           <MyAverageTime />
//           <DailyTasks />
//         </div>
      
//       </div>
//     </div>
//   );
// };

// export default TechnicianDashboard;