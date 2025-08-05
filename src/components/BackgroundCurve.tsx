import React, { ReactElement } from "react";
import { Dimensions, View } from "react-native";
import Svg, { Path, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const BackgroundCurve = (): ReactElement => {
  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
      <Svg
        height={screenHeight}
        width={screenWidth}
        style={{ position: 'absolute' }}
      >
        <Defs>
          <SvgLinearGradient id="curveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3" />
            <Stop offset="50%" stopColor="#7C3AED" stopOpacity="0.2" />
            <Stop offset="100%" stopColor="#6D28D9" stopOpacity="0.1" />
          </SvgLinearGradient>
        </Defs>
        <Path
          d={`M 0 ${screenHeight * 0.2} 
              Q ${screenWidth * 0.3} ${screenHeight * 0.1} 
                ${screenWidth * 0.6} ${screenHeight * 0.3}
              Q ${screenWidth * 0.8} ${screenHeight * 0.45} 
                ${screenWidth} ${screenHeight * 0.35}
              L ${screenWidth} ${screenHeight}
              L 0 ${screenHeight}
              Z`}
          fill="url(#curveGradient)"
        />
        <Path
          d={`M 0 ${screenHeight * 0.3} 
              Q ${screenWidth * 0.4} ${screenHeight * 0.2} 
                ${screenWidth * 0.7} ${screenHeight * 0.4}
              Q ${screenWidth * 0.9} ${screenHeight * 0.55} 
                ${screenWidth} ${screenHeight * 0.45}`}
          stroke="#8B5CF6"
          strokeWidth="2"
          fill="none"
          strokeOpacity="0.4"
        />
      </Svg>
    </View>
  );
};

export default BackgroundCurve;