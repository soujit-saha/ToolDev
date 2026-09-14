import React, { useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, StatusBar, FlatList } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, ICONS } from '../../utils/constants';
import { ms, mvs, s, vs } from '../../utils/helper/metric';
import { goBack, navigate } from '../../utils/helper/RootNavigation';
import { useDispatch, useSelector } from 'react-redux';
import connectionrequest from '../../utils/helper/NetInfo';
import { getNotificationsRequest, respondToolStatusCheckRequest } from '../../redux/reducer/MainReducer';
import ToastAlert from '../../utils/helper/Toast';
import { useFocusEffect } from '@react-navigation/native';
import Loader from '../../utils/helper/Loader';

interface NotificationItemProps {
    type: 'error' | 'success' | 'info' | 'tool_status_check';
    title: string;
    time: string;
    description: string;
    icon: any;
    uuid?: string;
    check_status?: string;
    onRespond?: (uuid: string, feedback: boolean) => void;
}



const Notifications = () => {
    const insets = useSafeAreaInsets();

    const dispatch = useDispatch()
    const { getNotificationsRes, isMainLoading } = useSelector((state: any) => state.MainReducer)

    const handleRespond = (uuid: string, feedback: boolean) => {
        dispatch(respondToolStatusCheckRequest({
            uuid,
            data: { feedback },
            refreshPayload: {}
        }));
    };

    const NotificationItem = ({ type, title, time, description, icon, uuid, check_status, onRespond }: NotificationItemProps) => {
        let borderColor = COLORS.primary;
        let iconTint = COLORS.primary;

        if (type === 'error') {
            borderColor = COLORS.error;
            iconTint = COLORS.error;
        } else if (type === 'success') {
            borderColor = COLORS.success;
            iconTint = COLORS.success;
        } else if (type === 'tool_status_check') {
            borderColor = COLORS.primary;
            iconTint = COLORS.primary;
        }

        return (
            <View style={styles.cardContainer}>
                <View style={[styles.borderLeft, { backgroundColor: borderColor }]} />
                <View style={styles.cardContent}>
                    <View style={styles.cardHeader}>
                        <Image source={icon} style={[styles.cardIcon, { tintColor: iconTint }]} />
                        <Text style={styles.cardTitle}>{title}</Text>
                        <Text style={styles.cardTime}>{time}</Text>
                    </View>
                    <Text style={styles.cardDesc}>{description}</Text>
                    {check_status == 'responded' && <Text style={{ ...styles.cardDesc, color: COLORS.success, textTransform: 'capitalize', marginTop: ms(10) }}>*{check_status}</Text>}
                    {
                        check_status == "pending" && <View style={{ flexDirection: "row", alignItems: 'center', gap: s(10), padding: s(10) }}>
                            <TouchableOpacity onPress={() => uuid && onRespond?.(uuid, true)} style={{ flex: 1, backgroundColor: COLORS.success, padding: s(5), borderRadius: ms(5), alignItems: 'center' }}>
                                <Text style={{ fontFamily: FONTS.medium18, fontSize: ms(14), color: COLORS.white }}>Yes</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => uuid && onRespond?.(uuid, false)} style={{ flex: 1, backgroundColor: COLORS.error, padding: s(5), borderRadius: ms(5), alignItems: 'center' }}>
                                <Text style={{ fontFamily: FONTS.medium18, fontSize: ms(14), color: COLORS.white }}>No</Text>
                            </TouchableOpacity>
                        </View>}
                </View>
            </View>
        );
    };


    useFocusEffect(useCallback(() => {
        connectionrequest()
            .then(() => {
                dispatch(getNotificationsRequest({}));
            })
            .catch(err => {
                ToastAlert('Please connect To Internet');
            });
    }, []))
    useEffect(() => {
        connectionrequest()
            .then(() => {
                dispatch(getNotificationsRequest({}));
            })
            .catch(err => {
                ToastAlert('Please connect To Internet');
            });
    }, [])

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.primary} />
            <Loader visible={isMainLoading} />
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top }]}>
                <View style={styles.headerContent}>
                    <TouchableOpacity onPress={() => goBack()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                        <Image source={ICONS.back} style={styles.headerIcon} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Notifications</Text>
                    <TouchableOpacity style={styles.iconBtn} onPress={() => navigate('ScheduleCalendar')}>
                        <Image source={ICONS.calendor} style={styles.headerIcon} />
                    </TouchableOpacity>
                </View>
            </View>

            <FlatList
                data={getNotificationsRes?.data?.data ?? []}
                style={[styles.scrollContent,
                    // { paddingBottom: ms(100) + insets.bottom + mvs(50) }
                ]}

                renderItem={({ item, index }) => (
                    <NotificationItem
                        key={item?.uuid || index}
                        type={item?.type == "low_stock" ? "error" : item?.type == "tool_returned" ? "info" : item?.type == "maintenance_alert" ? "info" : item?.type == 'tool_status_check' ? "tool_status_check" : 'success'}
                        title={item?.title || 'Unknown Notification'}
                        time={item?.time_ago || 'Unknown Time'}
                        description={item?.message || 'No description available'}
                        icon={item?.type == "low_stock" ? ICONS.alertRed : item?.type == "tool_returned" ? ICONS.container : item?.type == "maintenance_alert" ? ICONS.help : item?.type == 'tool_status_check' ? ICONS.container : ICONS.check}
                        uuid={item?.status_check?.uuid}
                        check_status={item?.status_check?.status}
                        onRespond={handleRespond}
                    />
                )}
                keyExtractor={(item, index) => index.toString()}
                ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: mvs(20), fontFamily: FONTS.medium18, fontSize: ms(14), color: COLORS.blackText }}>No Data Available</Text>}
            />


        </SafeAreaView>
    );
};

export default Notifications;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6', // light grey background
    },
    header: {
        backgroundColor: COLORS.primary,
        paddingBottom: mvs(16),
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: s(16),
        marginTop: mvs(16),
    },
    headerIcon: {
        width: s(24),
        height: s(24),
        tintColor: COLORS.white,
        resizeMode: 'contain',
    },
    headerTitle: {
        fontFamily: FONTS.bold18,
        fontSize: ms(18),
        color: COLORS.white,
        flex: 1,
        textAlign: 'center',
    },
    iconBtn: {
        padding: s(4),
    },
    scrollContent: {
        padding: s(16),
    },
    cardContainer: {
        flexDirection: 'row',
        backgroundColor: COLORS.white,
        borderRadius: ms(12),
        marginBottom: mvs(12),
        overflow: 'hidden',
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: vs(2) },
        shadowOpacity: 0.05,
        shadowRadius: ms(8),
        elevation: 2,
    },
    borderLeft: {
        width: s(4),
        height: '100%',
    },
    cardContent: {
        flex: 1,
        padding: ms(16),
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: mvs(8),
    },
    cardIcon: {
        width: s(16),
        height: s(16),
        resizeMode: 'contain',
        marginTop: mvs(2),
        marginRight: s(8),
    },
    cardTitle: {
        flex: 1,
        fontFamily: FONTS.bold18,
        fontSize: ms(14),
        color: COLORS.blackText,
        lineHeight: mvs(20),
    },
    cardTime: {
        fontFamily: FONTS.regular18,
        fontSize: ms(12),
        color: COLORS.placeholderGray,
        marginLeft: s(8),
        marginTop: mvs(2),
    },
    cardDesc: {
        fontFamily: FONTS.regular18,
        fontSize: ms(13),
        color: COLORS.shuttleGray,
        lineHeight: mvs(18),
        marginLeft: s(24), // Align with title text (16 icon width + 8 margin)
    },
});
