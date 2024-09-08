import { useState } from 'react';
import PropTypes from 'prop-types';

import StarRatingStar from './StarRatingStar';

StarRating.propTypes = {
  maxRating: PropTypes.number,
  colorText: PropTypes.string,
  colorStroke: PropTypes.string,
  colorStar: PropTypes.string,
  size: PropTypes.number,
  fontSize: PropTypes.number,
  className: PropTypes.string,
  messages: PropTypes.array,
  defaultRating: PropTypes.number,
  onSetRating: PropTypes.func,
};

export default function StarRating({
  maxRating = 8,
  colorText = '#fcc419',
  colorStroke = '#fcc419',
  colorStar = '#fcc419',
  size = 48,
  fontSize = size * 0.8,
  className = '',
  messages = [],
  defaultRating = 0,
  onSetRating,
}) {
  const [rating, setRating] = useState(defaultRating);
  const [tempRating, setTempRating] = useState(null);

  function handleRating(rating) {
    // HANDLE COMPONENT'S INTERNAL RATING UPDATE
    setRating(rating);
    // HAND OUT THE COMPONENT RATING TO PARENT
    onSetRating(rating);
  }

  return (
    <div
      style={{ display: 'flex', alignItems: 'center', gap: '16px' }}
      className={className}
    >
      <div style={{ display: 'flex' }}>
        {Array.from({ length: maxRating }, (_, i) => (
          <StarRatingStar
            colorStar={colorStar}
            colorStroke={colorStroke}
            size={size}
            key={i}
            onRate={() => handleRating(i + 1)}
            onHoverIn={() => setTempRating(i + 1)}
            onHoverOut={() => setTempRating(0)}
            full={tempRating ? tempRating >= i + 1 : rating >= i + 1}
          />
        ))}
      </div>
      <p
        style={{
          lineHeight: '1',
          margin: '0',
          color: colorText,
          fontSize: `${fontSize}px`,
        }}
      >
        {messages.length === maxRating
          ? messages[tempRating ? tempRating - 1 : rating - 1]
          : tempRating || rating || ''}
      </p>
    </div>
  );
}
