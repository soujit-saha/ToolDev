import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, StatusBar, FlatList } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, ICONS } from '../../utils/constants';
import { ms, mvs, s, vs } from '../../utils/helper/metric';
import { goBack } from '../../utils/helper/RootNavigation';
import { useDispatch, useSelector } from 'react-redux';
import { getNotificationsRequest, getSchedulesByDateRequest, respondToolStatusCheckRequest } from '../../redux/reducer/MainReducer';
import connectionrequest from '../../utils/helper/NetInfo';
import ToastAlert from '../../utils/helper/Toast';
import moment from 'moment';
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



const CalendarComponent = ({ selectedDate, onSelectDate }: { selectedDate: Date, onSelectDate: (date: Date) => void }) => {
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date(selectedDate));
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const generateDates = () => {
    const year = currentMonthDate.getFullYear();
    const month = currentMonthDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = getDaysInMonth(year, month);
    const daysInPrevMonth = getDaysInMonth(year, month - 1);

    const dates = [];

    // Previous month days
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      dates.push({
        day: daysInPrevMonth - i,
        currentMonth: false,
        date: new Date(year, month - 1, daysInPrevMonth - i)
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      dates.push({
        day: i,
        currentMonth: true,
        date: new Date(year, month, i)
      });
    }

    // Next month days
    const totalDays = dates.length;
    const nextMonthDays = totalDays % 7 === 0 ? 0 : 7 - (totalDays % 7);
    for (let i = 1; i <= nextMonthDays; i++) {
      dates.push({
        day: i,
        currentMonth: false,
        date: new Date(year, month + 1, i)
      });
    }

    return dates.map(d => ({
      ...d,
      selected: d.date.toDateString() === selectedDate.toDateString()
    }));
  };

  const dates = generateDates();

  const handlePrevMonth = () => {
    setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 1));
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const headerText = `${monthNames[currentMonthDate.getMonth()]} ${currentMonthDate.getFullYear()}`;




  return (
    <SafeAreaView style={styles.calendarCard}>
      {/* Calendar Header */}
      <View style={styles.calendarHeader}>
        <Text style={styles.calendarMonth}>{headerText}</Text>
        <View style={styles.calendarNav}>
          <TouchableOpacity onPress={handlePrevMonth} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Image source={ICONS.ButtonPrev} style={styles.chevronRight} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNextMonth} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Image source={ICONS.ButtonNext} style={styles.chevronRight} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Days of Week */}
      <View style={styles.daysRow}>
        {daysOfWeek.map((day, index) => (
          <Text key={index} style={styles.dayOfWeek}>{day}</Text>
        ))}
      </View>

      {/* Dates Grid */}
      <View style={styles.datesGrid}>
        {dates.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.dateCell, item.selected && styles.selectedDateCell]}
            activeOpacity={0.7}
            onPress={() => onSelectDate(item.date)}
          >
            <Text style={[
              styles.dateText,
              !item.currentMonth && styles.otherMonthDateText,
              item.selected && styles.selectedDateText
            ]}>
              {item.day}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

const ScheduleCalendar = () => {
  const insets = useSafeAreaInsets();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { getNotificationsRes, isMainLoading } = useSelector((state: any) => state.MainReducer)

  const formattedDate = selectedDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const dispatch = useDispatch();

  const handleRespond = (uuid: string, feedback: boolean) => {
    dispatch(respondToolStatusCheckRequest({
      uuid,
      data: { feedback },
      refreshPayload: { date: moment(selectedDate).format('YYYY-MM-DD') }
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
          {check_status == "pending" && <View style={{ flexDirection: "row", alignItems: 'center', gap: s(10), padding: s(10) }}>
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

  useEffect(() => {
    connectionrequest()
      .then(() => {
        dispatch(getNotificationsRequest({ date: moment(selectedDate).format('YYYY-MM-DD') }));
      })
      .catch(err => {
        ToastAlert('Please connect To Internet');
      });
  }, [selectedDate]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.primary} />
      <Loader visible={isMainLoading} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => goBack()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Image source={ICONS.back} style={styles.headerIcon} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Schedule Calendar</Text>
          <View style={styles.headerRightPlaceholder} />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: ms(66) + insets.bottom + mvs(20) }]}
        showsVerticalScrollIndicator={false}
      >
        <CalendarComponent selectedDate={selectedDate} onSelectDate={setSelectedDate} />

        <Text style={styles.selectedDateHeader}>{formattedDate}</Text>


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

        {/* <NotificationItem
          type="error"
          title="Maintenance Alert: 4 Power Tools due for tagging"
          time="2m ago"
          description="Required scheduled safety inspection for Milwaukee M18 sets in Zone B."
          icon={ICONS.alertRed}
        />

        <NotificationItem
          type="success"
          title="Tool Returned: Impact Drill returned by John Smith"
          time="15m ago"
          description="Asset #ID-8824 verified and placed back in Locker 04."
          icon={ICONS.check}
        />

        <NotificationItem
          type="info"
          title="Low Stock: Safety Harnesses (L) under 5 units"
          time="1h ago"
          description="Automatic reorder threshold reached. Current inventory: 3 units."
          icon={ICONS.container}
        />

        <NotificationItem
          type="error"
          title="Overdue Asset: Excavator Key #02"
          time="3h ago"
          description="Assigned to Mike Ross. Expected return was 12:00 PM."
          icon={ICONS.alertRed}
        /> */}

      </ScrollView>
    </View>
  );
};

export default ScheduleCalendar;

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
  headerRightPlaceholder: {
    width: s(24), // Match the width of the back icon for proper centering
  },
  scrollContent: {
    padding: s(16),
  },
  calendarCard: {
    backgroundColor: COLORS.white,
    borderRadius: ms(16),
    padding: ms(16),
    marginBottom: mvs(24),
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: vs(2) },
    shadowOpacity: 0.05,
    shadowRadius: ms(8),
    elevation: 2,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: mvs(16),
  },
  calendarMonth: {
    fontFamily: FONTS.bold18,
    fontSize: ms(16),
    color: COLORS.blackText,
  },
  calendarNav: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chevronLeft: {
    width: s(12),
    height: s(12),
    tintColor: COLORS.blackText,
    resizeMode: 'contain',
    marginRight: s(16),
  },
  chevronRight: {
    width: ms(30),
    height: ms(30),
    tintColor: COLORS.black,
    resizeMode: 'contain',
    marginHorizontal: ms(5)
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: mvs(12),
  },
  dayOfWeek: {
    width: `${100 / 7}%`,
    textAlign: 'center',
    fontFamily: FONTS.semiBold18,
    fontSize: ms(10),
    color: COLORS.shuttleGray,
    letterSpacing: 0.5,
  },
  datesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dateCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1, // Make cells square
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: mvs(5),
  },
  selectedDateCell: {
    backgroundColor: COLORS.primary,
    borderRadius: ms(20), // Large enough to be a full circle
  },
  dateText: {
    fontFamily: FONTS.regular18,
    fontSize: ms(14),
    color: COLORS.blackText,
  },
  otherMonthDateText: {
    color: COLORS.placeholderGray,
  },
  selectedDateText: {
    color: COLORS.white,
    fontFamily: FONTS.bold18,
  },
  selectedDateHeader: {
    fontFamily: FONTS.bold18,
    fontSize: ms(15),
    color: COLORS.blackText,
    marginBottom: mvs(16),
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
    marginLeft: s(24),
  },
});
