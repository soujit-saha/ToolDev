import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, ICONS, IMAGES } from '../../utils/constants';
import { ms, mvs, s, vs } from '../../utils/helper/metric';
import { navigate } from '../../utils/helper/RootNavigation';
import HeaderContainer from '../../component/HeaderContainer';
import connectionrequest from '../../utils/helper/NetInfo';
import { useDispatch, useSelector } from 'react-redux';
import { getProfileRequest, getInventoryCategoriesRequest } from '../../redux/reducer/MainReducer';
import ToastAlert from '../../utils/helper/Toast';
import Loader from '../../utils/helper/Loader';

const Dashboard = () => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch()

  const { getInventoryCategoriesRes, isMainLoading } = useSelector(
    (state: any) => state.MainReducer,
  );

  useEffect(() => {
    connectionrequest()
      .then(() => {
        dispatch(getProfileRequest({}));
        dispatch(getInventoryCategoriesRequest({}));
      })
      .catch(err => {
        ToastAlert('Please connect To Internet');
      });
  }, [dispatch])

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.primary} />
      <Loader visible={isMainLoading} />

      {/* Header */}
      <HeaderContainer
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Inventory Dashboard</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconBtn} onPress={() => navigate('Profile')}>
              <Image source={ICONS.profile} style={styles.headerIcon} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={() => navigate('Notifications')}>
              <Image source={ICONS.notification} style={styles.headerIcon} />
            </TouchableOpacity>
          </View>
        </View>
      </HeaderContainer>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: ms(66) + insets.bottom + mvs(20) }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Actions Grid */}
        <View style={styles.actionsGrid}>
          {/* Take */}
          <TouchableOpacity style={styles.actionCard} activeOpacity={0.8} onPress={() => navigate('Take')}>
            <LinearGradient colors={['#6366f1', '#4f46e5']} style={styles.actionIconContainer}>
              <Image source={ICONS.take} style={[styles.actionIcon,]} />
            </LinearGradient>
            <View style={styles.actionTextRow}>
              <Text style={styles.actionText}>Take</Text>
              <Image source={ICONS.nextArrow} style={styles.arrowIcon} />
            </View>
          </TouchableOpacity>

          {/* Drop */}
          <TouchableOpacity style={styles.actionCard} activeOpacity={0.8} onPress={() => navigate('Drop')}>
            <LinearGradient colors={['#10b981', '#059669']} style={styles.actionIconContainer}>
              <Image source={ICONS.drop} style={[styles.actionIcon,]} />
            </LinearGradient>
            <View style={styles.actionTextRow}>
              <Text style={styles.actionText}>Drop</Text>
              <Image source={ICONS.nextArrow} style={styles.arrowIcon} />
            </View>
          </TouchableOpacity>

          {/* Logs */}
          <TouchableOpacity style={styles.actionCard} activeOpacity={0.8} onPress={() => navigate('Logs')}>
            <LinearGradient colors={['#f59e0b', '#d97706']} style={styles.actionIconContainer}>
              <Image source={ICONS.logs} style={[styles.actionIcon,]} />
            </LinearGradient>
            <View style={styles.actionTextRow}>
              <Text style={styles.actionText}>Logs</Text>
              <Image source={ICONS.nextArrow} style={styles.arrowIcon} />
            </View>
          </TouchableOpacity>

          {/* Teams */}
          <TouchableOpacity style={styles.actionCard} activeOpacity={0.8} onPress={() => navigate('Teams')}>
            <LinearGradient colors={['#ec4899', '#db2777']} style={styles.actionIconContainer}>
              <Image source={ICONS.teams} style={[styles.actionIcon,]} />
            </LinearGradient>
            <View style={styles.actionTextRow}>
              <Text style={styles.actionText}>Members</Text>
              <Image source={ICONS.nextArrow} style={styles.arrowIcon} />
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.categoriesHeader} 
          onPress={() => navigate('ToolCategories')}
          activeOpacity={0.8}
        >
          <View style={styles.categoriesHeaderLeft}>
            <View style={styles.categoriesIconContainer}>
              <Image source={ICONS.allTools} style={styles.categoriesHeaderIcon} />
            </View>
            <View>
              <Text style={styles.sectionTitle}>Inventory Tools</Text>
              <Text style={styles.sectionSubtitle}>View & manage tool categories</Text>
            </View>
          </View>
          <View style={styles.categoriesHeaderRight}>
            <Text style={styles.viewAllText}>View All</Text>
            <Image source={ICONS.nextArrow} style={styles.categoriesArrowIcon} />
          </View>
        </TouchableOpacity>



        <Image style={{ height: ms(120), width: "100%", resizeMode: 'contain', alignSelf: 'center', marginTop: ms(20) }} source={IMAGES.banner} />


        {/* Categories Grid */}
        {/* <View style={styles.categoriesGrid}>
          {(() => {
            const categories = Array.isArray(getInventoryCategoriesRes)
              ? getInventoryCategoriesRes
              : Array.isArray(getInventoryCategoriesRes?.data)
                ? getInventoryCategoriesRes.data
                : [];

            if (getInventoryCategoriesRes?.length > 0) {
              return getInventoryCategoriesRes?.map((category: any, index: number) => (
                <TouchableOpacity key={category?.id || category?.uuid || index} style={styles.categoryCard}>
                  <Image source={ICONS.allTools} style={styles.categoryIcon} />
                  <Text style={styles.categoryText} numberOfLines={4}>
                    {category?.name || category?.title || 'Category'}
                  </Text>
                </TouchableOpacity>
              ));
            }

            return (
              <Text style={{ textAlign: 'center', width: '100%', marginTop: 20 }}>
                {isMainLoading ? 'Loading Categories...' : 'No Categories Found'}
              </Text>
            );
          })()}
        </View> */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundTertiary, // lighter grey
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
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    marginLeft: s(16),
  },
  scrollContent: {
    padding: s(16),
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: mvs(24),
  },
  actionCard: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: ms(16),
    padding: ms(16),
    marginBottom: mvs(16),
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: vs(2) },
    shadowOpacity: 0.05,
    shadowRadius: ms(8),
    elevation: 3,
  },
  actionIconContainer: {
    width: s(40),
    height: s(40),
    borderRadius: ms(10),
    backgroundColor: '#F3F4F6', // very light grey for background of icon
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: mvs(16),
  },
  actionIcon: {
    width: s(20),
    height: s(20),
    resizeMode: 'contain',
    tintColor: COLORS.white
  },
  actionTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionText: {
    fontFamily: FONTS.bold18,
    fontSize: ms(16),
    color: COLORS.blackText,
  },
  arrowIcon: {
    width: s(12),
    height: s(12),
    resizeMode: 'contain',
    tintColor: COLORS.placeholderGray,
  },
  categoriesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: ms(16),
    paddingVertical: mvs(14),
    paddingHorizontal: ms(16),
    marginBottom: mvs(16),
    borderWidth: 1,
    borderColor: 'rgba(0, 86, 190, 0.08)',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: vs(3) },
    shadowOpacity: 0.08,
    shadowRadius: ms(10),
    elevation: 4,
  },
  categoriesHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(12),
  },
  categoriesIconContainer: {
    width: s(40),
    height: s(40),
    borderRadius: ms(12),
    backgroundColor: 'rgba(0, 86, 190, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoriesHeaderIcon: {
    width: s(20),
    height: s(20),
    resizeMode: 'contain',
    tintColor: COLORS.primary,
  },
  sectionTitle: {
    fontFamily: FONTS.bold18,
    fontSize: ms(15),
    color: COLORS.blackText,
  },
  sectionSubtitle: {
    fontFamily: FONTS.regular18,
    fontSize: ms(11),
    color: COLORS.shuttleGray,
    marginTop: vs(2),
  },
  categoriesHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 86, 190, 0.06)',
    paddingVertical: mvs(6),
    paddingHorizontal: ms(12),
    borderRadius: ms(20),
    gap: ms(4),
  },
  viewAllText: {
    fontFamily: FONTS.bold18,
    fontSize: ms(12),
    color: COLORS.primary,
  },
  categoriesArrowIcon: {
    width: s(12),
    height: s(12),
    resizeMode: 'contain',
    tintColor: COLORS.primary,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '31%',
    backgroundColor: COLORS.white,
    borderRadius: ms(16),
    paddingVertical: mvs(20),
    alignItems: 'center',
    marginBottom: mvs(12),
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: vs(2) },
    shadowOpacity: 0.05,
    shadowRadius: ms(8),
    elevation: 2,
  },
  categoryIcon: {
    width: s(32),
    height: s(32),
    resizeMode: 'contain',
    marginBottom: mvs(12),
    tintColor: COLORS.primary,
  },
  categoryText: {
    fontFamily: FONTS.bold18,
    fontSize: ms(12),
    color: COLORS.blackText,
    textAlign: 'center',
  },
});
