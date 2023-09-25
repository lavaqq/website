import { useState, useEffect } from "react";

const Carousel = ({ data }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoChangeTimer, setAutoChangeTimer] = useState(null);

  const goToNextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === data.length - 1 ? 0 : prevIndex + 1,
    );
    resetAutoChangeTimer();
  };

  const goToPrevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? data.length - 1 : prevIndex - 1,
    );
    resetAutoChangeTimer();
  };

  const resetAutoChangeTimer = () => {
    if (autoChangeTimer) {
      clearTimeout(autoChangeTimer);
    }
    setAutoChangeTimer(setTimeout(goToNextSlide, 6000));
  };

  useEffect(() => {
    data.forEach((item) => {
      const img = new Image();
      img.src = item.png;
    });

    setAutoChangeTimer(setTimeout(goToNextSlide, 6000));

    return () => {
      if (autoChangeTimer) {
        clearTimeout(autoChangeTimer);
      }
    };
  }, []);

  return (
    <div className="featured-container">
      <p className="featured__title">(featured work)</p>
      <div className="featured">
        <button className="featured__control" onClick={goToPrevSlide}>
          ←
        </button>
        <a
          className="featured__link"
          href={data[currentIndex].href}
          target="_blank"
        >
          <img
            src={data[currentIndex].png}
            alt="Project image"
            className={`featured__image ${currentIndex === 0 ? "reset" : ""}`}
            key={currentIndex}
            width="300"
            height="300"
            loading="lazy"
            decoding="async"
          />
        </a>
        <button className="featured__control" onClick={goToNextSlide}>
          →
        </button>
      </div>
    </div>
  );
};

export default Carousel;
