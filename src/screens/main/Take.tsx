import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, StatusBar, TextInput, Modal, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, ICONS } from '../../utils/constants';
import { ms, mvs, s, vs } from '../../utils/helper/metric';
import HeaderContainer from '../../component/HeaderContainer';
import { useDispatch, useSelector } from 'react-redux';
import { getTeamsRequest, getToolsListRequest, getTeamMembersByIdRequest, takeToolRequest, getMembersOverallRequest, getInventoryLocationsRequest } from '../../redux/reducer/MainReducer';
import { navigate } from '../../utils/helper/RootNavigation';
import Loader from '../../utils/helper/Loader';

const DropdownInput = ({ label, value, onPress }: { label: string; value: string; onPress?: () => void }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{label}</Text>
    <TouchableOpacity style={styles.dropdownWrapper} activeOpacity={0.8} onPress={onPress}>
      <Text style={styles.dropdownValue}>{value}</Text>
      <Image source={ICONS.deopDown} style={styles.dropdownIcon} />
    </TouchableOpacity>
  </View>
);

const Take = () => {
  const insets = useSafeAreaInsets();


  const dispatch = useDispatch();

  const { status, teamsListRes, isMainLoading, pagiLoading, getInventoryCategoriesRes, teamMembersByIdRes, getToolsListRes, inventoryLocationsRes, membersOverallRes } = useSelector((state: any) => state.MainReducer);


  const [selectedTools, setSelectedTools] = useState<any[]>([]);
  const [tempSelectedTools, setTempSelectedTools] = useState<any[]>([]);
  const [toolQuantities, setToolQuantities] = useState<Record<string, number>>({ tool1: 1 });
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedSource, setSelectedSource] = useState<any>(null);
  const [selectedTeamMember, setSelectedTeamMember] = useState<any>(null);
  const [memberPage, setMemberPage] = useState(1);
  const [sourceTab, setSourceTab] = useState<'Location' | 'Individuals'>('Location');
  const [searchQuery, setSearchQuery] = useState('');

  const openModal = (type: string) => {
    setModalType(type);
    setSearchQuery('');
    if (type === 'Tool') {
      setTempSelectedTools([...selectedTools]);
    }
    setModalVisible(true);
  };

  const handleConfirmSelection = () => {
    setToolQuantities(prev => {
      const newQtys = { ...prev };
      Object.keys(newQtys).forEach(key => {
        if (!tempSelectedTools.some(t => t.id.toString() === key.toString())) {
          delete newQtys[key];
        }
      });
      tempSelectedTools.forEach(tool => {
        if (!newQtys[tool.id]) newQtys[tool.id] = 1;
      });

      const finalizedTools = tempSelectedTools.map(tool => ({
        ...tool,
        quantity: newQtys[tool.id]
      }));
      setSelectedTools(finalizedTools);

      return newQtys;
    });
    setModalVisible(false);
  };

  const increaseToolQuantity = (id: string) => {
    setToolQuantities(prev => {
      const newQty = (prev[id] || 1) + 1;
      setSelectedTools(currentList => currentList.map(tool => tool.id === id ? { ...tool, quantity: newQty } : tool));
      return { ...prev, [id]: newQty };
    });
  };

  const decreaseToolQuantity = (id: string) => {
    setToolQuantities(prev => {
      const currentQty = prev[id] || 1;
      if (currentQty <= 1) {
        setSelectedTools(currentList => currentList.filter(tool => tool.id.toString() !== id.toString()));
        const newQtys = { ...prev };
        delete newQtys[id];
        return newQtys;
      } else {
        const newQty = currentQty - 1;
        setSelectedTools(currentList => currentList.map(tool => tool.id === id ? { ...tool, quantity: newQty } : tool));
        return { ...prev, [id]: newQty };
      }
    });
  };

  const toggleToolSelection = (toolObject: any) => {
    setTempSelectedTools(prev => {
      if (prev.some(t => t.id === toolObject.id)) {
        return prev.filter(t => t.id !== toolObject.id);
      } else {
        return [...prev, toolObject];
      }
    });
  };

  const handleTakeTool = () => {
    if (!selectedSource?.id || !selectedCategory?.id || selectedTools.length === 0) {
      return;
    }




    const payload = {
      employee_id: sourceTab == "Individuals" ? selectedSource?.employee_id : '',
      // team_member_id: selectedTeamMember.id,
      source: sourceTab == "Location" ? selectedSource.name : '',
      source_id: sourceTab == "Location" ? selectedSource.id : "",
      category_id: selectedCategory.id,
      notes: "",
      tools: selectedTools.map(tool => ({
        tool_id: tool.id || '',
        quantity: tool.quantity
      }))
    };
    console.log('123456789', payload)
    dispatch(takeToolRequest(payload));
  };

  const renderToolCard = (toolObject: any) => {
    const isSelected = tempSelectedTools.some(t => t.id === toolObject.id);
    return (
      <TouchableOpacity
        style={[styles.toolCard, isSelected && styles.toolCardSelected]}
        activeOpacity={0.8}
        onPress={() => toggleToolSelection(toolObject)}
      >
        <View style={[styles.toolIconWrapper, isSelected && { backgroundColor: '#DBEAFE' }]}>
          <Image source={ICONS.matchesActive} style={styles.toolIcon} />
        </View>
        <View style={styles.toolInfo}>
          <Text style={styles.toolName}>{toolObject.name}</Text>
          <Text style={styles.toolSerial}>{`S/N: ${toolObject.serial_number || ''}`}</Text>
        </View>
        <View style={styles.toolCheckWrapper}>
          {isSelected ? (
            <Image source={ICONS.check} style={styles.checkIcon} />
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    // dispatch(getTeamsRequest({}));
    dispatch(getToolsListRequest({}));
    dispatch(getMembersOverallRequest({ page_no: 1, per_page: 20 }));
    dispatch(getInventoryLocationsRequest({ per_page: 20 }));
  }, []);

  useEffect(() => {
    if (status === 'Main/takeToolSuccess') {
      setSelectedCategory(null);
      setSelectedSource(null);
      setSelectedTeamMember(null);
      setSelectedTools([]);
      setTempSelectedTools([]);
      setToolQuantities({ tool1: 1 });
      setSearchQuery('');
    }
  }, [status]);

  useEffect(() => {
    if (modalType === 'Team Member' || (modalType === 'Source' && sourceTab === 'Individuals')) {
      const delayDebounceFn = setTimeout(() => {
        dispatch(getMembersOverallRequest({ page_no: 1, per_page: 20, search: searchQuery }));
        setMemberPage(1);
      }, 500);
      return () => clearTimeout(delayDebounceFn);
    }
  }, [searchQuery, modalType, sourceTab, dispatch]);

  const handleModalEndReached = () => {
    if ((modalType === 'Team Member' || (modalType === 'Source' && sourceTab === 'Individuals')) && !isMainLoading && !pagiLoading) {
      const lastPage = membersOverallRes?.last_page || 1;
      if (memberPage < lastPage) {
        const nextPage = memberPage + 1;
        setMemberPage(nextPage);
        dispatch(getMembersOverallRequest({ page_no: nextPage, per_page: 20 }));
      }
    }
  };

  const getModalData = () => {
    let data: any = [];
    switch (modalType) {
      case 'Tool': data = getToolsListRes || []; break;
      case 'Category': data = getInventoryCategoriesRes || []; break;
      case 'Source': data = sourceTab === 'Location' ? (inventoryLocationsRes || []) : (Array.isArray(membersOverallRes) ? membersOverallRes : membersOverallRes?.data || []); break;
      case 'Team Member': data = Array.isArray(membersOverallRes) ? membersOverallRes : membersOverallRes?.data || []; break;
      default: data = []; break;
    }

    if (searchQuery && (modalType === 'Tool' || modalType === 'Category' || (modalType === 'Source' && sourceTab === 'Location'))) {
      return data.filter((item: any) => {
        const name = item?.name || item?.first_name || item?.title || item?.serial_number || '';
        return name.toLowerCase().includes(searchQuery.toLowerCase());
      });
    }
    return data;
  };

  const renderModalItem = ({ item, index }: any) => {
    switch (modalType) {
      case 'Tool':
        return <View key={item?.id}>{renderToolCard(item)}</View>;
      case 'Category':
        return (
          <TouchableOpacity key={item?.id || item?.uuid || item} style={[styles.toolCard, { marginBottom: mvs(12), paddingVertical: mvs(16) }]} activeOpacity={0.8} onPress={() => { setSelectedCategory(item); setModalVisible(false); }}>
            <Text style={[styles.toolName, { marginLeft: s(8) }]}>{item?.name || item?.title || 'Category'}</Text>
          </TouchableOpacity>
        );
      case 'Source':
        return (
          <TouchableOpacity key={item?.id || item?.uuid || index} style={[styles.toolCard, { marginBottom: mvs(12), paddingVertical: mvs(16) }]} activeOpacity={0.8} onPress={() => { setSelectedSource(item); setModalVisible(false); }}>
            <Text style={[styles.toolName, { marginLeft: s(8) }]}>
              {sourceTab === 'Individuals' ? (item?.name || item?.first_name) : (item?.name || item?.title || 'Source')}
            </Text>
          </TouchableOpacity>
        );
      case 'Team Member':
        return (
          <TouchableOpacity key={item?.id || item?.uuid || index} style={[styles.toolCard, { marginBottom: mvs(12), paddingVertical: mvs(16) }]} activeOpacity={0.8} onPress={() => { setSelectedTeamMember(item); setModalVisible(false); }}>
            <Text style={[styles.toolName, { marginLeft: s(8) }]}>{item?.name || item?.first_name}</Text>
          </TouchableOpacity>
        );
      default:
        return null;
    }
  };

  console.log("getToolsListRes", selectedTools)

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.primary} />
      <Loader visible={isMainLoading} />
      {/* Header */}
      {/* <View style={[styles.header, { paddingTop: insets.top }]}> */}
      <HeaderContainer>
        <View style={styles.headerContent}>
          {/* <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Image source={ICONS.back} style={styles.headerIcon} />
          </TouchableOpacity> */}
          <Text style={styles.headerTitle}>Take Tool</Text>
          <TouchableOpacity style={styles.iconBtn} onPress={() => navigate('Notifications')}>
            <Image source={ICONS.notification} style={styles.headerIcon} />
          </TouchableOpacity>
        </View>
      </HeaderContainer>
      {/* </View> */}

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: ms(66) + insets.bottom + mvs(20) }]}
        showsVerticalScrollIndicator={false}
      >
        <DropdownInput label="Category" value={selectedCategory?.name || selectedCategory?.title || 'Select'} onPress={() => openModal('Category')} />
        <DropdownInput label="Source" value={selectedSource?.name || selectedSource?.title || 'Select'} onPress={() => openModal('Source')} />
        {/* <DropdownInput label="Team Member Name" value={selectedTeamMember?.name || selectedTeamMember?.title || 'Select'} onPress={() => openModal('Team Member')} /> */}
        <DropdownInput label="Tool" value={selectedTools?.length > 0 ? "Select More Tools" : "Select"} onPress={() => openModal('Tool')} />

        {/* selected tools */}
        <View style={{ marginTop: mvs(16) }}>
          {selectedTools.map(tool => {
            return (
              <View key={tool.id} style={[styles.toolCard, { marginBottom: mvs(12) }]}>
                <View style={[styles.toolIconWrapper, { backgroundColor: '#DBEAFE' }]}>
                  <Image source={ICONS.matchesActive} style={styles.toolIcon} />
                </View>
                <View style={styles.toolInfo}>
                  <Text style={styles.toolName}>{tool?.name}</Text>
                  <Text style={styles.toolSerial}>{`S/N: ${tool?.serial_number || ''}`}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.backgroundTertiary, borderRadius: ms(8) }}>
                  <TouchableOpacity onPress={() => decreaseToolQuantity(tool.id)} style={styles.qtyBtn} activeOpacity={0.7}>
                    <Image source={ICONS.minus} style={styles.qtyIcon} />
                  </TouchableOpacity>
                  <Text style={styles.qtyValue}>{toolQuantities[tool.id] || 1}</Text>
                  <TouchableOpacity onPress={() => increaseToolQuantity(tool.id)} style={styles.qtyBtn} activeOpacity={0.7}>
                    <Image source={ICONS.plus} style={styles.qtyIcon} />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>

        {/* Action Button */}

        <TouchableOpacity style={styles.confirmBtn} activeOpacity={0.8} onPress={handleTakeTool}>
          <Image source={ICONS.take} style={styles.confirmBtnIcon} />
          <Text style={styles.confirmBtnText}>Confirm Take</Text>
        </TouchableOpacity>

      </ScrollView>

      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.container}>
          <StatusBar barStyle="dark-content" backgroundColor={COLORS.primary} />
          <View style={[styles.header, { paddingTop: insets.top }]}>
            <View style={styles.headerContent}>
              <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={() => setModalVisible(false)}>
                <Image source={ICONS.back} style={styles.headerIcon} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Select {modalType}</Text>
              <View style={styles.iconBtn} />
            </View>
          </View>
          <FlatList
            data={getModalData()}
            keyExtractor={(item, index) => (item?.id || item?.uuid || index).toString()}
            contentContainerStyle={styles.scrollContent}
            ListHeaderComponent={
              <View style={styles.inputContainer}>
                <Text style={styles.label}>{modalType}</Text>
                {modalType === 'Source' && (
                  <View style={{ flexDirection: 'row', marginTop: mvs(8), marginBottom: mvs(16), borderRadius: ms(8), backgroundColor: '#E5E7EB', padding: ms(4) }}>
                    <TouchableOpacity style={{ flex: 1, paddingVertical: mvs(8), alignItems: 'center', backgroundColor: sourceTab === 'Location' ? COLORS.white : 'transparent', borderRadius: ms(6) }} onPress={() => { setSourceTab('Location'); setSearchQuery(''); }}>
                      <Text style={{ fontFamily: sourceTab === 'Location' ? FONTS.bold18 : FONTS.medium18, color: sourceTab === 'Location' ? COLORS.primary : COLORS.shuttleGray }}>Location</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flex: 1, paddingVertical: mvs(8), alignItems: 'center', backgroundColor: sourceTab === 'Individuals' ? COLORS.white : 'transparent', borderRadius: ms(6) }} onPress={() => { setSourceTab('Individuals'); setSearchQuery(''); }}>
                      <Text style={{ fontFamily: sourceTab === 'Individuals' ? FONTS.bold18 : FONTS.medium18, color: sourceTab === 'Individuals' ? COLORS.primary : COLORS.shuttleGray }}>Individuals</Text>
                    </TouchableOpacity>
                  </View>
                )}
                <View style={styles.searchWrapper}>
                  <Image source={ICONS.search} style={styles.searchIcon} />
                  <TextInput
                    style={styles.searchInput}
                    placeholder={modalType === 'Tool' ? "Search by name or serial..." : `Search ${modalType}...`}
                    placeholderTextColor={COLORS.placeholderGray}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                </View>
              </View>
            }
            renderItem={renderModalItem}
            onEndReached={modalType === 'Team Member' || (modalType === 'Source' && sourceTab === 'Individuals') ? handleModalEndReached : undefined}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              (modalType === 'Team Member' || (modalType === 'Source' && sourceTab === 'Individuals')) && pagiLoading ? (
                <ActivityIndicator size="small" color={COLORS.primary} style={{ marginVertical: mvs(20) }} />
              ) : null
            }
          />

          {modalType === 'Tool' && (
            <View style={{ padding: s(16), backgroundColor: COLORS.white }}>
              <TouchableOpacity style={styles.confirmBtn} activeOpacity={0.8} onPress={handleConfirmSelection}>
                <Text style={styles.confirmBtnText}>Confirm Selection</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>

    </SafeAreaView>
  );
};

export default Take;

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
    marginBottom: mvs(16),
  },
  label: {
    fontFamily: FONTS.bold18,
    fontSize: ms(14),
    color: COLORS.blackText,
    marginBottom: mvs(8),
  },
  dropdownWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: vs(48),
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: ms(8),
    paddingHorizontal: s(16),
    backgroundColor: COLORS.white,
  },
  dropdownValue: {
    fontFamily: FONTS.regular18,
    fontSize: ms(14),
    color: COLORS.blackText,
  },
  dropdownIcon: {
    width: s(16),
    height: s(16),
    resizeMode: 'contain',
    tintColor: COLORS.shuttleGray,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: vs(48),
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: ms(8),
    paddingHorizontal: s(16),
    backgroundColor: '#F9FAFB', // very light grey for search input
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
  toolsList: {
    marginBottom: mvs(16),
  },
  toolCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: ms(12),
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: ms(12),
    marginBottom: mvs(8),
  },
  toolCardSelected: {
    backgroundColor: '#EEF2FF', // light blue tint
    borderColor: COLORS.primary,
  },
  toolIconWrapper: {
    width: s(40),
    height: s(40),
    borderRadius: ms(8),
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: s(12),
  },
  toolIcon: {
    width: s(20),
    height: s(20),
    resizeMode: 'contain',
    tintColor: COLORS.primary,
  },
  toolInfo: {
    flex: 1,
  },
  toolName: {
    fontFamily: FONTS.bold18,
    fontSize: ms(14),
    color: COLORS.blackText,
    marginBottom: mvs(2),
  },
  toolSerial: {
    fontFamily: FONTS.regular18,
    fontSize: ms(12),
    color: COLORS.shuttleGray,
  },
  toolCheckWrapper: {
    width: s(24),
    height: s(24),
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkIcon: {
    width: s(20),
    height: s(20),
    resizeMode: 'contain',
    // tintColor: COLORS.primary,
  },
  quantityWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: vs(48),
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: ms(8),
    paddingHorizontal: s(16),
    backgroundColor: COLORS.white,
  },
  qtyBtn: {
    padding: s(8),
  },
  qtyIcon: {
    width: ms(14),
    height: ms(14),
    resizeMode: 'contain',
    tintColor: COLORS.shuttleGray,
    // marginHorizontal: ms(4)
  },
  qtyValue: {
    fontFamily: FONTS.bold18,
    fontSize: ms(16),
    color: COLORS.blackText,
    marginHorizontal: ms(6)
  },
  confirmBtn: {
    flexDirection: 'row',
    height: vs(54),
    backgroundColor: COLORS.primary,
    borderRadius: ms(8),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: mvs(8),
  },
  confirmBtnIcon: {
    width: s(20),
    height: s(20),
    resizeMode: 'contain',
    tintColor: COLORS.white,
    marginRight: s(8),
  },
  confirmBtnText: {
    fontFamily: FONTS.bold18,
    fontSize: ms(16),
    color: COLORS.white,
  },
});
