


import TechnicianCard from '../TechnicianCard';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

// Mock data
const mockData = {
  labels: ['Open', 'Closed', 'In Review'],
  datasets: [
    {
      data: [20, 40, 15],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      borderWidth: 12,
      borderColor: '#e5e7eb',
      hoverBorderWidth: 2,
      hoverBorderColor: 'black',
    },
  ],
};

// const DailyTasks = () => {
//   return (
//     <TechnicianCard isLarge={true}>
//       <h2 className="text-2xl font-bold text-left mb-4">Daily Tasks</h2>
//       <div className="flex flex-col md:flex-row h-full">
//         <div className="w-full md:w-2/3 pr-4 h-full flex justify-center items-center">
//           <div className="chart-container" style={{ width: '150px', height: '250px' }}>
//             <Pie
//               data={mockData}
//               width={200}
//               height={200}
//               options={{
//                 responsive: false, // Disable responsiveness
//                 maintainAspectRatio: false, // Disable aspect ratio maintenance
//                 plugins: {
//                   legend: {
//                     display: false,
//                   },
//                 },
//                 cutout: 0, // Remove the cutout
//               }}
//             />
//           </div>
//         </div>
//         <div className="w-full md:w-1/3 flex-shrink h-full">
//           {/* Render the legend here */}
//           <div className="flex flex-col h-full justify-center">
//             <div className="flex items-center mb-2">
//               <div className="w-4 h-4 square-full bg-[#FF6384] mr-2"></div>
//               <span>Open</span>
//             </div>
//             <div className="flex items-center mb-2">
//               <div className="w-4 h-4 square-full bg-[#36A2EB] mr-2"></div>
//               <span>Closed</span>
//             </div>
//             <div className="flex items-center mb-2">
//               <div className="w-4 h-4 square-full bg-[#FFCE56] mr-2"></div>
//               <span>In Review</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </TechnicianCard>
//   );
// };

const DailyTasks = () => {
  return (
    <TechnicianCard isLarge={false}>
      <h2 className="text-2xl font-bold text-left mb-4">Daily Tasks</h2> {/* Added mb-4 for consistent margin */}
      <div className="flex flex-col md:flex-row h-full">
        <div className="w-full md:w-2/3 pr-4 h-full flex justify-center items-center">
          <div className="chart-container" style={{ width: '150px', height: '250px' }}>
            <Pie
              data={mockData}
              width={200}
              height={200}
              options={{
                responsive: false, // Disable responsiveness
                maintainAspectRatio: false, // Disable aspect ratio maintenance
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                cutout: 0, // Remove the cutout
              }}
            />
          </div>
        </div>
        <div className="w-full md:w-1/3 flex-shrink h-full">
          {/* Render the legend here */}
          <div className="flex flex-col h-full justify-center">
            <div className="flex items-center mb-2">
              <div className="w-4 h-4 square-full bg-[#FF6384] mr-2"></div>
              <span>Open</span>
            </div>
            <div className="flex items-center mb-2">
              <div className="w-4 h-4 square-full bg-[#36A2EB] mr-2"></div>
              <span>Closed</span>
            </div>
            <div className="flex items-center mb-2">
              <div className="w-4 h-4 square-full bg-[#FFCE56] mr-2"></div>
              <span>In Review</span>
            </div>
          </div>
        </div>
      </div>
    </TechnicianCard>
  );
};

export default DailyTasks;