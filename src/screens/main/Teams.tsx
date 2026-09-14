import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, StatusBar, TextInput, ActivityIndicator, FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, ICONS } from '../../utils/constants';
import { ms, mvs, s, vs } from '../../utils/helper/metric';
import { goBack, navigate } from '../../utils/helper/RootNavigation';
import { getTeamsRequest, getMembersOverallRequest } from '../../redux/reducer/MainReducer';
import Loader from '../../utils/helper/Loader';

interface TeamCardProps {
  title: string;
  count: number;
  icon: any;
  iconBgColor: string;
  iconTintColor?: string;
}

const TeamCard = ({ item, title, count, icon, iconBgColor, iconTintColor }: any) => {
  return (
    <TouchableOpacity onPress={() => navigate('TeamsDetails', { item })} style={styles.cardContainer} activeOpacity={0.8}>
      <View style={[styles.iconWrapper, { backgroundColor: iconBgColor }]}>
        <Image
          source={icon}
          style={[styles.cardIcon, iconTintColor ? { tintColor: iconTintColor } : null]}
        />
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardCount}>{count} Technicians</Text>
      </View>
      <Image source={ICONS.nextArrow} style={styles.chevronIcon} />
    </TouchableOpacity>
  );
};

const Teams = () => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();

  const { teamsListRes, membersOverallRes, isMainLoading, pagiLoading } = useSelector((state: any) => state.MainReducer);

  const [activeTab, setActiveTab] = useState('Teams');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(getTeamsRequest({}));
  }, [dispatch]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      dispatch(getMembersOverallRequest({ page_no: 1, per_page: 20, search: searchQuery }));
      setPage(1);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, dispatch]);

  const handleEndReached = () => {
    if (!isMainLoading && !pagiLoading && activeTab === 'Individuals') {
      const lastPage = membersOverallRes?.last_page || 1;
      if (page < lastPage) {
        const nextPage = page + 1;
        setPage(nextPage);
        dispatch(getMembersOverallRequest({ page_no: nextPage, per_page: 20, search: searchQuery }));
      }
    }
  };

  const teams = Array.isArray(teamsListRes) ? teamsListRes : Array.isArray(teamsListRes?.data) ? teamsListRes?.data : Array.isArray(teamsListRes?.data?.data) ? teamsListRes?.data?.data : [];

  const filteredTeams = teams.filter((item: any) => {
    const title = item?.name || item?.title || '';
    return title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const individuals = Array.isArray(membersOverallRes) ? membersOverallRes : Array.isArray(membersOverallRes?.data) ? membersOverallRes?.data : [];
  const filteredIndividuals = individuals.filter((item: any) => {
    const title = item?.first_name ? `${item.first_name} ${item.last_name || ''}` : item?.name || '';
    return title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const renderMemberCard = (
    name: string,
    id: string,
    status: string,
    tools: { tool_name?: string; name?: string; status?: string; state?: string }[] | null
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
            tools.map((tool: any, index: number) => (
              <View key={index} style={styles.toolRow}>
                <Text style={styles.toolName}>{tool?.tool_name || tool?.name}</Text>
                <Text
                  style={[
                    styles.toolState,
                    (tool?.status === 'In Use' || tool?.state === 'In Use') ? { color: COLORS.primary } : { color: COLORS.shuttleGray },
                  ]}
                >
                  {tool?.status || tool?.state}
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.primary} />
      <Loader visible={isMainLoading} />
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => goBack()}
          // hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Image source={ICONS.back} style={styles.headerIcon} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Members</Text>
          {/* <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}> */}
          {/* <Image source={ICONS.plus} style={styles.headerIcon} /> */}
          {/* </TouchableOpacity> */}
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'Teams' && styles.activeTabButton]}
          onPress={() => setActiveTab('Teams')}
        >
          <Text style={[styles.tabText, activeTab === 'Teams' && styles.activeTabText]}>Teams</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'Individuals' && styles.activeTabButton]}
          onPress={() => setActiveTab('Individuals')}
        >
          <Text style={[styles.tabText, activeTab === 'Individuals' && styles.activeTabText]}>Individuals</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={activeTab === 'Teams' ? filteredTeams : filteredIndividuals}
        keyExtractor={(item, index) => (item?.uuid || item?.id || index).toString()}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: ms(66) + insets.bottom + mvs(20) }]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            {/* Search Bar */}
            <View style={styles.searchWrapper}>
              <Image source={ICONS.search} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder={activeTab === 'Teams' ? "Search teams..." : "Search individuals..."}
                placeholderTextColor={COLORS.placeholderGray}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            {/* Subheader */}
            <View style={styles.subheaderRow}>
              <Text style={styles.subheaderLeft}>
                {activeTab === 'Teams' ? 'ACTIVE TEAMS' : 'ACTIVE INDIVIDUALS'}
              </Text>
              <Text style={styles.subheaderRight}>
                {activeTab === 'Teams' ? filteredTeams.length + " Total" : ''}
                {/* filteredIndividuals.length */}
              </Text>
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: mvs(40) }}>
            {isMainLoading && page === 1 ? (
              <ActivityIndicator size="large" color={COLORS.primary} />
            ) : (
              <Text style={{ fontFamily: FONTS.regular18, color: COLORS.placeholderGray }}>
                {activeTab === 'Teams' ? 'No teams found.' : 'No individuals found.'}
              </Text>
            )}
          </View>
        }
        renderItem={({ item, index }) => {
          if (activeTab === 'Teams') {
            const colors = ["#EEF2FF", "#ECFDF5", "#FFF7ED", "#EFF6FF"];
            const tints = [COLORS.primary, COLORS.success, COLORS.accent, COLORS.info];
            const icons = [ICONS.electrical, ICONS.carpentry, ICONS.wrench, ICONS.hvac];
            return (
              <TeamCard
                item={item}
                title={item?.name || item?.title || 'Unknown Team'}
                count={item?.members_count || item?.count || 0}
                icon={icons[index % icons.length]}
                iconBgColor={colors[index % colors.length]}
                iconTintColor={tints[index % tints.length]}
              />
            );
          } else {
            const name = item?.first_name ? `${item.first_name} ${item.last_name || ''}` : item?.name || 'Unknown';
            return renderMemberCard(
              name,
              item?.employee_id || item?.uuid || item?.id || `IND-${index}`,
              item?.status || 'Active',
              item?.active_tools || null
            );
          }
        }}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          pagiLoading ? (
            <ActivityIndicator size="small" color={COLORS.primary} style={{ marginVertical: mvs(20) }} />
          ) : null
        }
      />
    </SafeAreaView>
  );
};

export default Teams;

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
    // justifyContent: 'space-between',
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
  scrollContent: {
    padding: s(16),
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    marginTop: mvs(16),
    marginHorizontal: s(16),
    borderRadius: ms(8),
    padding: ms(4),
  },
  tabButton: {
    flex: 1,
    paddingVertical: vs(8),
    alignItems: 'center',
    borderRadius: ms(6),
  },
  activeTabButton: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontFamily: FONTS.bold18,
    fontSize: ms(14),
    color: COLORS.shuttleGray,
  },
  activeTabText: {
    color: COLORS.white,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: vs(48),
    backgroundColor: COLORS.white,
    borderRadius: ms(8),
    paddingHorizontal: s(16),
    marginBottom: mvs(24),
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: vs(2) },
    shadowOpacity: 0.05,
    shadowRadius: ms(4),
    elevation: 2,
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
  subheaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: mvs(16),
  },
  subheaderLeft: {
    fontFamily: FONTS.bold18,
    fontSize: ms(12),
    color: COLORS.shuttleGray,
    letterSpacing: 0.5,
  },
  subheaderRight: {
    fontFamily: FONTS.bold18,
    fontSize: ms(12),
    color: COLORS.primary,
  },
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: ms(12),
    padding: ms(16),
    marginBottom: mvs(12),
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: vs(2) },
    shadowOpacity: 0.05,
    shadowRadius: ms(4),
    elevation: 2,
  },
  iconWrapper: {
    width: s(40),
    height: s(40),
    borderRadius: ms(10),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: s(16),
  },
  cardIcon: {
    width: s(20),
    height: s(20),
    resizeMode: 'contain',
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontFamily: FONTS.bold18,
    fontSize: ms(15),
    color: COLORS.blackText,
    marginBottom: mvs(4),
  },
  cardCount: {
    fontFamily: FONTS.regular18,
    fontSize: ms(13),
    color: COLORS.shuttleGray,
  },
  chevronIcon: {
    width: s(16),
    height: s(16),
    resizeMode: 'contain',
    tintColor: COLORS.placeholderGray,
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
    borderColor: '#E5E7EB',
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
    borderTopColor: '#E5E7EB',
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
