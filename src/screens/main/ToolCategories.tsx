import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  TextInput,
  FlatList,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, ICONS } from '../../utils/constants';
import { ms, mvs, s, vs } from '../../utils/helper/metric';
import { goBack, navigate } from '../../utils/helper/RootNavigation';
import { useDispatch, useSelector } from 'react-redux';
import { getToolsListRequest } from '../../redux/reducer/MainReducer';
import { useFocusEffect } from '@react-navigation/native';
import Loader from '../../utils/helper/Loader';

const CATEGORIES = ['All', 'Hand Tools', 'PPE', 'Safety', 'Power Tools'];

const TOOLS_DATA = [
  {
    id: '1',
    name: 'Adjustable Wrench',
    available: '12',
    icon: ICONS.wrench,
    bgColor: '#E6F0FF',
    tintColor: '#0056BE',
  },
  {
    id: '2',
    name: 'Claw Hammer',
    available: '08',
    icon: ICONS.handTools,
    bgColor: '#E6F0FF',
    tintColor: '#0056BE',
  },
  {
    id: '3',
    name: 'Tape Measure 8m',
    available: '24',
    icon: ICONS.measure,
    bgColor: '#E6F0FF',
    tintColor: '#0056BE',
  },
  {
    id: '4',
    name: 'Screwdriver Set',
    available: '15',
    icon: ICONS.handTools,
    bgColor: '#E6F0FF',
    tintColor: '#0056BE',
  },
  {
    id: '5',
    name: 'Impact Driver',
    available: '00',
    icon: ICONS.driver,
    bgColor: '#FFEBEB',
    tintColor: COLORS.error,
  },
];

const ToolCategories = () => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const { getProfileRes, teamsListRes, isMainLoading, getInventoryCategoriesRes, teamMembersByIdRes, getToolsListRes, inventoryLocationsRes, membersOverallRes } = useSelector((state: any) => state.MainReducer);

  const [selectedCategory, setSelectedCategory] = useState<any>({ id: '', name: 'All' });
  const [searchQuery, setSearchQuery] = useState('');

  const renderCategory = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() => setSelectedCategory(item)}
      style={[
        styles.categoryTab,
        selectedCategory?.id === item?.id && styles.selectedCategoryTab,
      ]}
    >
      <Text
        style={[
          styles.categoryText,
          selectedCategory?.id === item?.id && styles.selectedCategoryText,
        ]}
      >
        {item?.name}
      </Text>
    </TouchableOpacity>
  );

  const renderToolItem = ({ item }: any) => (
    <View style={styles.toolCard}>
      <View style={[styles.iconContainer, { backgroundColor: item.bgColor }]}>
        <Image
          source={{ uri: item?.photo }}
          style={[styles.toolIcon, { tintColor: item.tintColor }]}
        />
      </View>
      <Text style={styles.toolName}>{item.name}</Text>
      <View
        style={[
          styles.countBadge,
          { backgroundColor: item?.available_stock === '00' ? '#FFF5F5' : '#F0F7FF' },
        ]}
      >
        <Text
          style={[
            styles.countText,
            { color: item?.available_stock === '00' ? COLORS.error : COLORS.primary },
          ]}
        >
          {item?.available_stock}
        </Text>
      </View>
    </View>
  );

  useFocusEffect(
    useCallback(() => {
      const delayDebounceFn = setTimeout(() => {
        dispatch(getToolsListRequest({ search: searchQuery, category_id: selectedCategory?.id || '' }));
      }, 500);

      return () => clearTimeout(delayDebounceFn);
    }, [searchQuery, selectedCategory, dispatch])
  );

  // console.log('123456789', getProfileRes?.data)

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.primary} />
      <Loader visible={isMainLoading} />
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => goBack()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Image source={ICONS.back} style={styles.headerIcon} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Inventory</Text>
          {getProfileRes?.data?.is_admin ?
            <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={() => navigate('AddNewTool')}>
              <Image source={ICONS.plus} style={styles.headerIcon} />
            </TouchableOpacity>
            :
            <View style={styles.headerIcon} />}
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionLabel}>Find Resources</Text>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Image source={ICONS.container} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search tools or PPE..."
            placeholderTextColor={COLORS.placeholderGray}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Categories */}
        <View style={styles.categoriesWrapper}>
          <FlatList
            data={[{ id: '', name: 'All' }, ...(getInventoryCategoriesRes || [])]}
            renderItem={renderCategory}
            keyExtractor={(item, index) => item?.id ? item.id.toString() : index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}

          />
        </View>

        {/* List Header */}
        <View style={styles.listHeader}>
          <Text style={styles.listHeaderText}>TOOL NAME</Text>
          <Text style={styles.listHeaderText}>AVAILABLE</Text>
        </View>

        {/* Tools List */}
        <FlatList
          data={getToolsListRes}
          renderItem={renderToolItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.toolsList,
            { paddingBottom: insets.bottom + mvs(20) },
          ]}
          ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: mvs(20), fontFamily: FONTS.medium18, fontSize: ms(14), color: COLORS.blackText }}>No Data Available</Text>}

        />
      </View>
    </SafeAreaView>
  );
};

export default ToolCategories;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
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
  content: {
    flex: 1,
    paddingHorizontal: s(16),
    paddingTop: mvs(20),
    backgroundColor: '#F9FAFB',
  },
  sectionLabel: {
    fontFamily: FONTS.bold18,
    fontSize: ms(14),
    color: COLORS.blackText,
    marginBottom: mvs(8),
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: ms(10),
    paddingHorizontal: s(12),
    height: mvs(48),
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: mvs(20),
  },
  searchIcon: {
    width: s(20),
    height: s(20),
    tintColor: COLORS.shuttleGray,
    marginRight: s(10),
  },
  searchInput: {
    flex: 1,
    fontFamily: FONTS.regular18,
    fontSize: ms(14),
    color: COLORS.blackText,
  },
  categoriesWrapper: {
    marginBottom: mvs(24),
  },
  categoriesList: {
    paddingRight: s(16),
  },
  categoryTab: {
    paddingHorizontal: s(20),
    paddingVertical: mvs(10),
    borderRadius: ms(20),
    backgroundColor: '#F3F4F6',
    marginRight: s(10),
  },
  selectedCategoryTab: {
    backgroundColor: COLORS.primary,
  },
  categoryText: {
    fontFamily: FONTS.semiBold18,
    fontSize: ms(13),
    color: COLORS.shuttleGray,
  },
  selectedCategoryText: {
    color: COLORS.white,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: s(12),
    marginBottom: mvs(12),
  },
  listHeaderText: {
    fontFamily: FONTS.bold18,
    fontSize: ms(11),
    color: COLORS.shuttleGray,
    letterSpacing: 0.5,
  },
  toolsList: {
    backgroundColor: COLORS.white,
    borderRadius: ms(16),
    padding: s(8),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  toolCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: mvs(12),
    paddingHorizontal: s(12),
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  iconContainer: {
    width: s(36),
    height: s(36),
    borderRadius: ms(8),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: s(12),
  },
  toolIcon: {
    width: ms(50),
    height: ms(50),
    resizeMode: 'contain',
    backgroundColor: COLORS.gray,
    borderRadius: ms(8),
  },
  toolName: {
    flex: 1,
    fontFamily: FONTS.bold18,
    fontSize: ms(14),
    color: COLORS.blackText,
  },
  countBadge: {
    width: s(40),
    height: mvs(24),
    borderRadius: ms(6),
    justifyContent: 'center',
    alignItems: 'center',
  },
  countText: {
    fontFamily: FONTS.bold18,
    fontSize: ms(13),
  },
});
