import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, StatusBar, TextInput } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, ICONS } from '../../utils/constants';
import { ms, mvs, s, vs } from '../../utils/helper/metric';
import HeaderContainer from '../../component/HeaderContainer';
import { useDispatch, useSelector } from 'react-redux';
import { getInventoryListRequest } from '../../redux/reducer/MainReducer';
import { navigate } from '../../utils/helper/RootNavigation';
import { useFocusEffect } from '@react-navigation/native';
import Loader from '../../utils/helper/Loader';

const Logs = () => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();

  const { getInventoryListRes, isMainLoading } = useSelector(
    (state: any) => state.MainReducer,
  );

  const [searchQuery, setSearchQuery] = React.useState('');

  useFocusEffect(
    React.useCallback(() => {
      const delayDebounceFn = setTimeout(() => {
        dispatch(getInventoryListRequest({ page: 1, search: searchQuery }));
      }, 500);

      return () => clearTimeout(delayDebounceFn);
    }, [searchQuery, dispatch])
  )

  const renderMemberCard = (
    name: string,
    id: string,
    status: string,
    tools: { tool_name: string; status: string }[] | null
  ) => {
    return (
      <View style={styles.memberCard}>
        {/* Card Header */}
        <View style={styles.memberHeader}>
          <Image source={ICONS.profile} style={styles.memberAvatar} />
          <View style={styles.memberInfo}>
            <Text style={styles.memberName}>{name}</Text>
            <Text style={styles.memberId}>ID: {id}</Text>
          </View>
          <View style={[styles.statusBadge, status === 'IDLE' && styles.statusBadgeIdle]}>
            <Text style={[styles.statusText, status === 'IDLE' && styles.statusTextIdle]}>
              {status}
            </Text>
          </View>
        </View>

        {/* Card Body */}
        <View style={styles.memberBody}>
          {tools && tools.length > 0 ? (
            tools.map((tool, index) => (
              <View key={index} style={styles.toolRow}>
                <Text style={styles.toolName}>{tool?.tool_name}</Text>
                <Text
                  style={[
                    styles.toolState,
                    tool?.status === 'In Use' ? { color: COLORS.primary } : { color: COLORS.shuttleGray },
                  ]}
                >
                  {tool?.status}
                </Text>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No active tools assigned</Text>
            </View>
          )}
        </View>
      </View>
    );
  };


  console.log('getInventoryListRes', getInventoryListRes)
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.primary} />
      <Loader visible={isMainLoading} />
      {/* Header */}
      <HeaderContainer>
        <View style={styles.headerContent}>
          {/* <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Image source={ICONS.back} style={styles.headerIcon} />
          </TouchableOpacity> */}
          <Text style={styles.headerTitle}>Inventory Logs</Text>
          <TouchableOpacity style={styles.iconBtn} onPress={() => navigate('Notifications')}>
            <Image source={ICONS.notification} style={styles.headerIcon} />
          </TouchableOpacity>
        </View>
      </HeaderContainer>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: ms(66) + insets.bottom + mvs(20) }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Search Member</Text>
          <View style={styles.searchWrapper}>
            <Image source={ICONS.search} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Filter by name or ID..."
              placeholderTextColor={COLORS.placeholderGray}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Actives</Text>
          {/* <Text style={styles.sectionCount}>3 Members</Text> */}
        </View>

        {/* Logs List */}
        <View style={styles.logsList}>
          {getInventoryListRes && getInventoryListRes.length > 0 ? (
            getInventoryListRes.map((item: any, index: number) => (
              renderMemberCard(
                item?.name || 'Unknown',
                item?.employee_id || item?.uuid || `Item-${index}`,
                item?.status || 'Active',
                item?.tools || null
              )
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                {isMainLoading ? 'Loading...' : 'No inventory items found'}
              </Text>
            </View>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default Logs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundTertiary,
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
    // flex: 1,
    // textAlign: 'center',
  },
  iconBtn: {
    padding: s(4),
  },
  scrollContent: {
    padding: s(16),
  },
  inputContainer: {
    marginBottom: mvs(24),
  },
  label: {
    fontFamily: FONTS.bold18,
    fontSize: ms(14),
    color: COLORS.blackText,
    marginBottom: mvs(8),
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: vs(48),
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: ms(8),
    paddingHorizontal: s(16),
    backgroundColor: '#F9FAFB',
  },
  searchIcon: {
    width: s(20),
    height: s(20),
    resizeMode: 'contain',
    tintColor: COLORS.placeholderGray,
    marginRight: s(8),
  },
  searchInput: {
    flex: 1,
    fontFamily: FONTS.regular18,
    fontSize: ms(14),
    color: COLORS.textPrimary,
    height: '100%',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: mvs(16),
  },
  sectionTitle: {
    fontFamily: FONTS.bold18,
    fontSize: ms(14),
    color: COLORS.blackText,
  },
  sectionCount: {
    fontFamily: FONTS.regular18,
    fontSize: ms(13),
    color: COLORS.shuttleGray,
  },
  logsList: {
    // marginBottom: mvs(16),
  },
  memberCard: {
    backgroundColor: COLORS.white,
    borderRadius: ms(12),
    padding: ms(16),
    marginBottom: mvs(16),
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: vs(2) },
    shadowOpacity: 0.05,
    shadowRadius: ms(4),
    elevation: 2,
  },
  memberHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: mvs(16),
  },
  memberAvatar: {
    width: s(40),
    height: s(40),
    borderRadius: ms(20),
    backgroundColor: '#E5E7EB',
    marginRight: s(12),
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontFamily: FONTS.bold18,
    fontSize: ms(15),
    color: COLORS.blackText,
    marginBottom: mvs(2),
  },
  memberId: {
    fontFamily: FONTS.regular18,
    fontSize: ms(13),
    color: COLORS.shuttleGray,
  },
  statusBadge: {
    backgroundColor: '#DBEAFE', // Light blue background
    paddingHorizontal: s(12),
    paddingVertical: mvs(4),
    borderRadius: ms(12),
  },
  statusBadgeIdle: {
    backgroundColor: '#F3F4F6', // Light gray background
  },
  statusText: {
    fontFamily: FONTS.bold18,
    fontSize: ms(10),
    color: COLORS.primary,
    letterSpacing: 0.5,
  },
  statusTextIdle: {
    color: COLORS.shuttleGray,
  },
  memberBody: {
    paddingTop: mvs(16),
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  toolRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: mvs(12),
  },
  toolName: {
    fontFamily: FONTS.regular18,
    fontSize: ms(14),
    color: COLORS.blackText,
  },
  toolState: {
    fontFamily: FONTS.bold18,
    fontSize: ms(13),
  },
  emptyState: {
    backgroundColor: '#F9FAFB',
    borderRadius: ms(8),
    paddingVertical: mvs(12),
    alignItems: 'center',
  },
  emptyStateText: {
    fontFamily: FONTS.regular18,
    fontSize: ms(13),
    color: COLORS.shuttleGray,
  },
});
