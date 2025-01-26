import Carousel from "react-bootstrap/Carousel";
import TestImage from "../../../public/images/testImage.jpg";

export default function Slider() {
    return (
        <Carousel indicators={false}>
            <Carousel.Item>
                <img src={TestImage.src} alt="" className="mw-100" />
            </Carousel.Item>
            <Carousel.Item>
                <img src={TestImage.src} alt="" className="mw-100" />
            </Carousel.Item>
            <Carousel.Item>
                <img src={TestImage.src} alt="" className="mw-100" />
            </Carousel.Item>
        </ Carousel>
    );
}