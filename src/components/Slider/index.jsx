import Carousel from "react-bootstrap/Carousel";
import SliderImage1 from "../../../public/images/Slider/SlideImage1.jpg";
import SliderImage2 from "../../../public/images/Slider/SlideImage2.jpg";
import SliderImage3 from "../../../public/images/Slider/SlideImage3.jpg";
import SliderImage4 from "../../../public/images/Slider/SlideImage4.jpg";
import SliderImage5 from "../../../public/images/Slider/SlideImage5.jpg";
import SliderImage6 from "../../../public/images/Slider/SlideImage6.jpg";
import SliderImage7 from "../../../public/images/Slider/SlideImage7.jpg";

export default function Slider({ imageAds = [] }) {
    const defaultSlides = [
        {
            alt: "Slider Image 1",
            src: SliderImage1.src,
        },
        {
            alt: "Slider Image 2",
            src: SliderImage2.src,
        },
        {
            alt: "Slider Image 3",
            src: SliderImage3.src,
        },
        {
            alt: "Slider Image 4",
            src: SliderImage4.src,
        },
        {
            alt: "Slider Image 5",
            src: SliderImage5.src,
        },
        {
            alt: "Slider Image 6",
            src: SliderImage6.src,
        },
        {
            alt: "Slider Image 7",
            src: SliderImage7.src,
        }
    ];

    const imageAdSlides = imageAds.filter((ad) => ad.imagePath).map((ad, index) => ({
        alt: `Advertisement ${index + 1}`,
        src: `${process.env.BASE_API_URL}/${ad.imagePath.replaceAll("\\", "/")}`,
    }));

    const slides = imageAdSlides.length > 0 ? imageAdSlides : defaultSlides;

    return (
        <Carousel indicators={false}>
            {slides.map((item, index) => (
                <Carousel.Item key={index}>
                    <img src={item.src} alt={item.alt} className="slider-image" />
                </Carousel.Item>
            ))}
        </ Carousel>
    );
}
