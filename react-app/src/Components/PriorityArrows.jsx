import { memo } from 'react';
import PropTypes from 'prop-types';

const PriorityArrows = memo(({ priority }) => {
  return (
    <div className="w-8 flex justify-center items-center">
      <span className="text-yellow-500 font-bold">{priority}</span>
    </div>
  );
});

PriorityArrows.displayName = 'PriorityArrows';

PriorityArrows.propTypes = {
  priority: PropTypes.number.isRequired,
};

export default PriorityArrows;