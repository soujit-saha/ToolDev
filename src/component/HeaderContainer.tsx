import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, StatusBar, ImageSourcePropType, ViewStyle, StyleProp } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS } from '../utils/constants';
import { ms, mvs, s } from '../utils/helper/metric';

interface HeaderContainerProps {

    children: React.ReactNode;
    containerStyle?: StyleProp<ViewStyle>;
}

const HeaderContainer: React.FC<HeaderContainerProps> = ({
    children,
    containerStyle,
}) => {
    return (
        <View style={[styles.container, containerStyle]}>
            {children}
        </View>
    );
};

export default HeaderContainer;

const styles = StyleSheet.create({
    container: {
        paddingTop: mvs(20),
        backgroundColor: COLORS.primary,
        paddingBottom: mvs(15)
    },

});
