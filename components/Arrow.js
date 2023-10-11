import { View, StyleSheet } from 'react-native';
import Svg, {
    Polygon,
    Rect,
} from 'react-native-svg';

const Arrow = ({ angle }) => (
    <View
        style={[
            StyleSheet.absoluteFill,
            { alignItems: 'center', justifyContent: 'center' },
        ]}>
        <Svg height="100%" width="100%" viewBox="0 0 100 100" transform={`rotate(${-angle}, 50, 50)`}>
            <Rect
                x="0"
                y="40"
                width="80"
                height="20"
                fill="blue"
            />
            <Polygon
                points="100,50 70,25 70,75"
                fill="blue"
            />
        </Svg>
    </View>
)

export default Arrow;