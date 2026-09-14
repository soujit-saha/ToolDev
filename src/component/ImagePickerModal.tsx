import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { COLORS, FONTS } from '../utils/constants';
import { ms, mvs } from '../utils/helper/metric';
import normalize from '../utils/helper/normalize';

interface Props {
    isVisible: boolean;
    onClose: () => void;
    onCameraPress: () => void;
    onGalleryPress: () => void;
    onModalHide?: () => void;
}

const ImagePickerModal = ({ isVisible, onClose, onCameraPress, onGalleryPress, onModalHide }: Props) => {
    return (
        <Modal
            isVisible={isVisible}
            onBackdropPress={onClose}
            onBackButtonPress={onClose}
            onModalHide={onModalHide}
            style={styles.modal}
            backdropOpacity={0.5}
            animationIn="slideInUp"
            animationOut="slideOutDown"
            useNativeDriver
        >
            <View style={styles.container}>
                <View style={styles.handle} />
                <Text style={styles.title}>Choose an option</Text>

                <View style={styles.optionsContainer}>
                    <TouchableOpacity style={styles.optionBtn} onPress={onCameraPress} activeOpacity={0.7}>
                        <Text style={styles.optionText}>Camera</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.optionBtn} onPress={onGalleryPress} activeOpacity={0.7}>
                        <Text style={styles.optionText}>Gallery</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.cancelBtn} onPress={onClose} activeOpacity={0.7}>
                    <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

export default ImagePickerModal;

const styles = StyleSheet.create({
    modal: {
        margin: 0,
        justifyContent: 'flex-end',
    },
    container: {
        backgroundColor: COLORS.white,
        borderTopLeftRadius: ms(20),
        borderTopRightRadius: ms(20),
        paddingHorizontal: ms(20),
        paddingTop: mvs(10),
        paddingBottom: mvs(30),
        alignItems: 'center',
    },
    handle: {
        width: ms(40),
        height: mvs(5),
        backgroundColor: COLORS.lightGray,
        borderRadius: ms(3),
        marginBottom: mvs(15),
    },
    title: {
        fontFamily: FONTS.bold,
        fontSize: normalize(18),
        color: COLORS.black,
        marginBottom: mvs(25),
    },
    optionsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        marginBottom: mvs(20),
        gap: ms(20),
    },
    optionBtn: {
        flex: 1,
        paddingVertical: mvs(15),
        backgroundColor: 'rgba(199, 200, 243, 0.1)', // Light pink bg
        borderRadius: ms(15),
        borderWidth: 1,
        borderColor: COLORS.primary,
        alignItems: 'center',
    },
    optionText: {
        fontFamily: FONTS.bold,
        fontSize: normalize(16),
        color: COLORS.primary,
    },
    cancelBtn: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: mvs(15),
        borderRadius: ms(15),
        backgroundColor: COLORS.background, // Match container bg / very light grayish white
    },
    cancelText: {
        fontFamily: FONTS.bold,
        fontSize: normalize(16),
        color: COLORS.black,
    },
});
