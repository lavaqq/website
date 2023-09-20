import { useState, useEffect } from 'react';

const Carousel = ({ data }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [autoChangeTimer, setAutoChangeTimer] = useState(null);

    const goToNextSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === data.length - 1 ? 0 : prevIndex + 1
        );
        resetAutoChangeTimer();
    };

    const goToPrevSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? data.length - 1 : prevIndex - 1
        );
        resetAutoChangeTimer();
    };

    const resetAutoChangeTimer = () => {
        if (autoChangeTimer) {
            clearTimeout(autoChangeTimer);
        }
        setAutoChangeTimer(setTimeout(goToNextSlide, 4000));
    };

    useEffect(() => {
        setAutoChangeTimer(setTimeout(goToNextSlide, 4000));

        return () => {
            if (autoChangeTimer) {
                clearTimeout(autoChangeTimer);
            }
        };
    }, []);

    return (
        <div className='featured-container'>
            <p className="featured__title">(featured work)</p>
            <div className="featured">
                <button className="featured__control" onClick={goToPrevSlide}>
                    ←
                </button>
                <a className="featured__link" href={data[currentIndex].href}>
                    <img
                        src={data[currentIndex].src}
                        alt="Project image"
                        className="featured__image"
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
