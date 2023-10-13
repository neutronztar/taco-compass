import Svg, { Polygon, Rect } from 'react-native-svg';

const Arrow = ({ angle }) => (
    <Svg
        height="100%"
        width="100%"
        viewBox="0 0 100 100"
        transform={`rotate(${-angle}, 50, 50)`}
    >
        <Rect x="0" y="40" width="80" height="20" fill="blue" />
        <Polygon points="100,50 70,25 70,75" fill="blue" />
    </Svg>
);

export default Arrow;
