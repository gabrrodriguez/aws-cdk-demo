
// import PropTypes from 'prop-types';

// const TechnicianCard = ({ children, isLarge }) => {
//   const cardClasses = `bg-gray-200 rounded-lg shadow-md p-6 ${
//     isLarge ? 'w-full md:w-full' : 'w-full md:w-3/4'
//   } h-64 md:h-75`;

//   return <div className={cardClasses}>{children}</div>;
// };

// TechnicianCard.propTypes = {
//   isLarge: PropTypes.bool.isRequired,
//   children: PropTypes.node.isRequired,
// };

// export default TechnicianCard;


import PropTypes from 'prop-types';

// const TechnicianCard = ({ children, isLarge }) => {
//   const cardClasses = `bg-gray-200 rounded-lg shadow-md p-6 ${
//     isLarge ? 'w-full' : 'w-full'
//   } h-full md:h-75 flex flex-col justify-center`;

//   return <div className={cardClasses}>{children}</div>;
// };

// TechnicianCard.propTypes = {
//   isLarge: PropTypes.bool.isRequired,
//   children: PropTypes.node.isRequired,
// };

// export default TechnicianCard;



const TechnicianCard = ({ children, isLarge }) => {
  const cardClasses = `bg-gray-200 rounded-lg shadow-md p-6 ${
    isLarge ? 'md:col-span-3' : 'md:col-span-2'
  } h-full flex flex-col justify-center`;

  return <div className={cardClasses}>{children}</div>;
};

TechnicianCard.propTypes = {
  isLarge: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
};

export default TechnicianCard;