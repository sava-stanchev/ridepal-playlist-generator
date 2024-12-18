export const Slider = ({ title, value, onChange }) => {
  return (
    <div className="genre-slider">
      <label htmlFor={title} className="genre-slider__title">
        {title}
      </label>
      <div className="genre-slider__input-container">
        <input
          type="range"
          id={title}
          className="genre-slider__input"
          min={0}
          max={100}
          step="10"
          value={value}
          onChange={onChange}
        />
      </div>
      <span className="genre-slider__value">{value}%</span>
    </div>
  );
};
