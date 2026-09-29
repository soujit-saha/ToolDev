import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
  TextInput,
  ScrollView,
  Platform,
  FlatList,
  Switch,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Modal from 'react-native-modal';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ImagePickerModal from '../../component/ImagePickerModal';
import { useDispatch, useSelector } from 'react-redux';
import { getInventoryCategoriesRequest, addInventoryToolRequest, getInventoryLocationsRequest, addInventoryLocationRequest } from '../../redux/reducer/MainReducer';
import { COLORS, FONTS, ICONS } from '../../utils/constants';
import { ms, mvs, s, vs } from '../../utils/helper/metric';
import { goBack } from '../../utils/helper/RootNavigation';
import ToastAlert from '../../utils/helper/Toast';
import { ActivityIndicator } from 'react-native';
import Loader from '../../utils/helper/Loader';

const AddNewTool = () => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();

  const { getInventoryCategoriesRes, inventoryLocationsRes, status, isMainLoading } = useSelector((state: any) => state.MainReducer);

  const [stock, setStock] = useState(1);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isCategoryModalVisible, setCategoryModalVisible] = useState(false);
  const [toolPhoto, setToolPhoto] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  const [toolName, setToolName] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [isLocationModalVisible, setLocationModalVisible] = useState(false);
  const [locationPage, setLocationPage] = useState(1);
  const [categoryPage, setCategoryPage] = useState(1);
  const [isAddLocationModalVisible, setAddLocationModalVisible] = useState(false);
  const [newLocName, setNewLocName] = useState('');
  const [newLocDesc, setNewLocDesc] = useState('');
  const [newLocIsActive, setNewLocIsActive] = useState(true);


  React.useEffect(() => {
    dispatch(getInventoryLocationsRequest({ page: 1, per_page: 5 }));
  }, [dispatch]);


  const rawCategories = Array.isArray(getInventoryCategoriesRes)
    ? getInventoryCategoriesRes
    : Array.isArray(getInventoryCategoriesRes?.data)
      ? getInventoryCategoriesRes.data
      : [];

  const categories = rawCategories.filter((item: any) => 
    item?.name !== 'All' && item?.title !== 'All'
  );

  const incrementStock = () => setStock(prev => prev + 1);
  const decrementStock = () => setStock(prev => (prev > 0 ? prev - 1 : 0));

  const [pendingPickerAction, setPendingPickerAction] = useState<'camera' | 'gallery' | null>(null);

  const openCameraPicker = async () => {
    try {
      const result = await launchCamera({ mediaType: 'photo', quality: 0.8 });
      if (result.didCancel) return;
      if (result.errorCode) {
        if (result.errorCode === 'camera_unavailable') {
          ToastAlert('Camera is unavailable on simulator or device');
        } else if (result.errorCode === 'permission') {
          ToastAlert('Camera permission was denied');
        } else {
          ToastAlert(result.errorMessage || 'Failed to open camera');
        }
        return;
      }
      if (result.assets && result.assets.length > 0) {
        setToolPhoto(result.assets[0]);
      }
    } catch (err: any) {
      ToastAlert('Error opening camera');
    }
  };

  const openGalleryPicker = async () => {
    try {
      const result = await launchImageLibrary({ mediaType: 'photo', quality: 0.8 });
      if (result.didCancel) return;
      if (result.errorCode) {
        if (result.errorCode === 'permission') {
          ToastAlert('Gallery permission was denied');
        } else {
          ToastAlert(result.errorMessage || 'Failed to open gallery');
        }
        return;
      }
      if (result.assets && result.assets.length > 0) {
        setToolPhoto(result.assets[0]);
      }
    } catch (err: any) {
      ToastAlert('Error opening gallery');
    }
  };

  const handleCameraPress = () => {
    setPendingPickerAction('camera');
    setModalVisible(false);
  };

  const handleGalleryPress = () => {
    setPendingPickerAction('gallery');
    setModalVisible(false);
  };

  const handleModalHide = () => {
    if (pendingPickerAction === 'camera') {
      setPendingPickerAction(null);
      setTimeout(() => openCameraPicker(), 100);
    } else if (pendingPickerAction === 'gallery') {
      setPendingPickerAction(null);
      setTimeout(() => openGalleryPicker(), 100);
    }
  };

  React.useEffect(() => {
    if (status === 'Main/addInventoryToolSuccess') {
      goBack();
    }
    if (status === 'Main/addInventoryLocationSuccess') {
      setLocationPage(1);
      dispatch(getInventoryLocationsRequest({ page: 1, per_page: 5 }));
    }
  }, [status, dispatch]);

  const handleSubmit = () => {
    if (!toolName.trim() || !selectedLocation || !selectedCategory) {
      ToastAlert('Please fill all required fields');
      return;
    }

    // !serialNumber.trim() ||

    const formData = new FormData();
    formData.append('name', toolName);
    formData.append('serial_number', serialNumber);
    if (selectedLocation?.id) {
      formData.append('assigned_location', String(selectedLocation.id));
    }
    if (selectedCategory?.id) {
      formData.append('category_id', String(selectedCategory.id));
    }
    if (selectedCategory?.name) {
      formData.append('category', selectedCategory.name);
    }
    formData.append('initial_stock', String(stock));

    if (toolPhoto) {
      formData.append('photo', {
        uri: toolPhoto.uri,
        name: toolPhoto.fileName || toolPhoto.name || 'photo.jpg',
        type: toolPhoto.type || 'image/jpeg',
      } as any);
    }

    // if (data.profile_image?.uri) {
    //   formData.append('profile_image', {
    //     uri: data.profile_image.uri,
    //     name: data.profile_image.name ?? 'profile_image.jpg',
    //     type: data.profile_image.type ?? 'image/jpeg',
    //   } as any);
    // }

    dispatch(addInventoryToolRequest(formData));
  };

  const handleAddLocationSubmit = () => {
    if (!newLocName.trim()) {
      ToastAlert('Please enter location name');
      return;
    }
    const formData = new FormData();
    formData.append('name', newLocName);
    formData.append('description', newLocDesc);
    formData.append('is_active', newLocIsActive ? '1' : '0');

    dispatch(addInventoryLocationRequest(formData));
    setAddLocationModalVisible(false);
    setNewLocName('');
    setNewLocDesc('');
    setNewLocIsActive(true);
  };

  console.log('100', toolPhoto);

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
          <Text style={styles.headerTitle}>Add New Assets</Text>
          <View style={styles.placeholderIcon} />
        </View>
      </View>

      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        extraScrollHeight={120}
        extraHeight={150}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + ms(50) },
        ]}
      >
        {/* Upload Section */}
        <TouchableOpacity
          style={[styles.uploadContainer, toolPhoto && { paddingVertical: 0, borderWidth: 0 }]}
          activeOpacity={0.7}
          onPress={() => setModalVisible(true)}
        >
          {toolPhoto ? (
            <Image
              source={{ uri: toolPhoto.uri }}
              style={{ width: '100%', height: mvs(150), borderRadius: ms(12), resizeMode: 'cover' }}
            />
          ) : (
            <>
              <View style={styles.cameraCircle}>
                <Image source={ICONS.camera} style={styles.cameraIcon} />
              </View>
              <Text style={styles.uploadText}>Upload Tool Photo</Text>
              <Text style={styles.supportText}>Supports JPG, PNG or HEIC</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={styles.formCard}>
          {/* Category */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category</Text>
            <TouchableOpacity style={styles.dropdown} onPress={() => setCategoryModalVisible(true)}>
              <Text style={styles.inputText}>
                {selectedCategory ? (selectedCategory?.name || selectedCategory?.title) : 'Select Category'}
              </Text>
              <Image source={ICONS.deopDown} style={styles.dropdownIcon} />
            </TouchableOpacity>
          </View>

          {/* Tool Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tool Name</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Enter Tool Name"
                placeholderTextColor={COLORS.placeholderGray}
                value={toolName}
                onChangeText={setToolName}
              />
            </View>
          </View>

          {/* Serial Number */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Serial Number</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Enter Serial Number"
                placeholderTextColor={COLORS.placeholderGray}
                value={serialNumber}
                onChangeText={setSerialNumber}
              />
              {/* <TouchableOpacity>
                <Image source={ICONS.qr} style={styles.fieldIcon} />
              </TouchableOpacity> */}
            </View>
          </View>

          {/* Assigned Location */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Assigned Location</Text>
            <TouchableOpacity style={styles.dropdown} onPress={() => setLocationModalVisible(true)}>
              <Text style={styles.inputText}>
                {selectedLocation ? (selectedLocation?.name || selectedLocation?.title) : 'Select Location'}
              </Text>
              <Image source={ICONS.deopDown} style={styles.dropdownIcon} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Stock Section */}
        <View style={styles.stockCard}>
          <Text style={styles.stockLabel}>Initial Stock</Text>
          <View style={styles.counterContainer}>
            <TouchableOpacity onPress={decrementStock} style={styles.counterBtn}>
              <Image source={ICONS.minus} style={styles.counterIcon} />
            </TouchableOpacity>
            <Text style={styles.stockCount}>{stock}</Text>
            <TouchableOpacity onPress={incrementStock} style={styles.counterBtn}>
              <Image source={ICONS.plus} style={styles.counterIcon} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitBtn} activeOpacity={0.8} onPress={handleSubmit} disabled={isMainLoading}>
          {isMainLoading ? (
            <ActivityIndicator size="small" color={COLORS.white} />
          ) : (
            <Text style={styles.submitBtnText}>Add to Inventory</Text>
          )}
        </TouchableOpacity>
      </KeyboardAwareScrollView>

      {/* Image Picker Modal */}
      <ImagePickerModal
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onCameraPress={handleCameraPress}
        onGalleryPress={handleGalleryPress}
        onModalHide={handleModalHide}
      />
      {/* Category Picker Modal */}
      <Modal
        isVisible={isCategoryModalVisible}
        onBackdropPress={() => setCategoryModalVisible(false)}
        style={{ justifyContent: 'flex-end', margin: 0 }}
      >
        <View style={styles.categoryModalContent}>
          <Text style={styles.modalTitle}>Select Category</Text>
          <FlatList
            data={categories}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => (item?.id || item?.uuid || index).toString()}
            style={styles.categoryList}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.categoryItem}
                onPress={() => {
                  setSelectedCategory(item);
                  setCategoryModalVisible(false);
                }}
              >
                <Text style={styles.categoryItemText}>{item?.name || item?.title}</Text>
              </TouchableOpacity>
            )}

            ListEmptyComponent={() => (
              <Text style={{ textAlign: 'center', marginVertical: mvs(20) }}>No Categories Found</Text>
            )}

          />
        </View>
      </Modal>

      {/* Location Picker Modal */}
      <Modal
        isVisible={isLocationModalVisible}
        onBackdropPress={() => setLocationModalVisible(false)}
        style={{ justifyContent: 'flex-end', margin: 0 }}
      >
        <View style={styles.categoryModalContent}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: mvs(15) }}>
            <View style={{ width: s(60) }} />
            <Text style={[styles.modalTitle, { marginBottom: 0 }]}>Select Location</Text>
            <TouchableOpacity onPress={() => {
              setLocationModalVisible(false);
              setTimeout(() => setAddLocationModalVisible(true), 400);
            }} style={{ width: s(60), alignItems: 'flex-end' }}>
              <Text style={{ fontFamily: FONTS.bold18, fontSize: ms(12), color: COLORS.primary }}>Add New</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={Array.isArray(inventoryLocationsRes) ? inventoryLocationsRes : inventoryLocationsRes?.data || []}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => (item?.id || item?.uuid || index).toString()}
            style={styles.categoryList}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.categoryItem}
                onPress={() => {
                  setSelectedLocation(item);
                  setLocationModalVisible(false);
                }}
              >
                <Text style={styles.categoryItemText}>{item?.name || item?.title}</Text>
              </TouchableOpacity>
            )}
            onEndReached={() => {
              if (!isMainLoading) {
                const lastPage = inventoryLocationsRes?.last_page || 1;
                if (locationPage < lastPage) {
                  const nextPage = locationPage + 1;
                  setLocationPage(nextPage);
                  dispatch(getInventoryLocationsRequest({ page: nextPage, per_page: 5 }));
                }
              }
            }}
            onEndReachedThreshold={0.5}
            ListEmptyComponent={() => (
              <Text style={{ textAlign: 'center', marginVertical: mvs(20) }}>No Locations Found</Text>
            )}
            ListFooterComponent={() => (
              isMainLoading && locationPage > 1 ? (
                <ActivityIndicator size="small" color={COLORS.primary} style={{ marginVertical: mvs(10) }} />
              ) : null
            )}
          />
        </View>
      </Modal>

      {/* Add Location Modal */}
      <Modal
        isVisible={isAddLocationModalVisible}
        onBackdropPress={() => setAddLocationModalVisible(false)}
        style={{ justifyContent: 'flex-end', margin: 0 }}
      >
        <View style={styles.categoryModalContent}>
          <Text style={styles.modalTitle}>Add New Location</Text>
          
          <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Name *</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter Name"
                  placeholderTextColor={COLORS.placeholderGray}
                  value={newLocName}
                  onChangeText={setNewLocName}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter Description"
                  placeholderTextColor={COLORS.placeholderGray}
                  value={newLocDesc}
                  onChangeText={setNewLocDesc}
                />
              </View>
            </View>

            <View style={[styles.inputGroup, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: mvs(10) }]}>
              <Text style={styles.label}>Is Active</Text>
              <Switch
                value={newLocIsActive}
                onValueChange={setNewLocIsActive}
                trackColor={{ false: '#767577', true: COLORS.primary }}
              />
            </View>

            <TouchableOpacity style={[styles.submitBtn, { marginTop: mvs(30) }]} activeOpacity={0.8} onPress={handleAddLocationSubmit}>
              <Text style={styles.submitBtnText}>Submit Location</Text>
            </TouchableOpacity>
          </KeyboardAwareScrollView>
        </View>
      </Modal>

    </SafeAreaView>
  );
};

export default AddNewTool;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
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
  placeholderIcon: {
    width: s(24),
  },
  scrollContent: {
    paddingHorizontal: s(16),
    paddingTop: mvs(20),
  },
  uploadContainer: {
    backgroundColor: COLORS.white,
    borderRadius: ms(12),
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    paddingVertical: mvs(30),
    alignItems: 'center',
    marginBottom: mvs(20),
  },
  cameraCircle: {
    width: s(50),
    height: s(50),
    borderRadius: ms(25),
    backgroundColor: '#E6F0FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: mvs(12),
  },
  cameraIcon: {
    width: s(24),
    height: s(24),
    tintColor: COLORS.primary,
    resizeMode: 'contain',
  },
  uploadText: {
    fontFamily: FONTS.bold18,
    fontSize: ms(14),
    color: COLORS.blackText,
    marginBottom: mvs(4),
  },
  supportText: {
    fontFamily: FONTS.regular18,
    fontSize: ms(12),
    color: COLORS.shuttleGray,
  },
  formCard: {
    backgroundColor: COLORS.white,
    borderRadius: ms(12),
    padding: s(16),
    marginBottom: mvs(20),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: mvs(16),
  },
  label: {
    fontFamily: FONTS.bold18,
    fontSize: ms(14),
    color: COLORS.blackText,
    marginBottom: mvs(8),
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F3F4F6',
    borderRadius: ms(8),
    paddingHorizontal: s(12),
    height: mvs(48),
  },
  inputText: {
    fontFamily: FONTS.regular18,
    fontSize: ms(14),
    color: COLORS.blackText,
  },
  dropdownIcon: {
    width: s(16),
    height: s(16),
    tintColor: COLORS.shuttleGray,
    resizeMode: 'contain',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: ms(8),
    paddingHorizontal: s(12),
    height: mvs(48),
  },
  input: {
    flex: 1,
    fontFamily: FONTS.regular18,
    fontSize: ms(14),
    color: COLORS.blackText,
  },
  fieldIcon: {
    width: s(20),
    height: s(20),
    tintColor: COLORS.shuttleGray,
    resizeMode: 'contain',
  },
  stockCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    borderRadius: ms(12),
    padding: s(16),
    marginBottom: mvs(30),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  stockLabel: {
    fontFamily: FONTS.bold18,
    fontSize: ms(15),
    color: COLORS.blackText,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: ms(40),
    paddingHorizontal: ms(5),
    paddingVertical: mvs(5),
  },
  counterBtn: {
    width: ms(32),
    height: ms(32),
    borderRadius: ms(16),
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  counterIcon: {
    width: s(14),
    height: s(14),
    tintColor: COLORS.primary,
    resizeMode: 'contain',
  },
  stockCount: {
    fontFamily: FONTS.bold18,
    fontSize: ms(16),
    color: COLORS.blackText,
    marginHorizontal: ms(10),
    width: ms(60),
    textAlign: 'center',
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: ms(12),
    height: mvs(54),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: mvs(40),
  },
  submitBtnText: {
    fontFamily: FONTS.bold18,
    fontSize: ms(16),
    color: COLORS.white,
  },
  modalContent: {
    backgroundColor: COLORS.white,
    paddingHorizontal: ms(20),
    paddingBottom: ms(40),
    paddingTop: ms(20),
    borderTopLeftRadius: ms(20),
    borderTopRightRadius: ms(20),
  },
  modalBtn: {
    paddingVertical: mvs(15),
    alignItems: 'center',
  },
  modalDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  modalBtnText: {
    fontFamily: FONTS.bold18,
    fontSize: ms(16),
    color: COLORS.blackText,
  },
  categoryModalContent: {
    backgroundColor: COLORS.white,
    paddingHorizontal: ms(20),
    paddingBottom: ms(40),
    paddingTop: ms(20),
    borderTopLeftRadius: ms(20),
    borderTopRightRadius: ms(20),
    height: '80%',
  },
  modalTitle: {
    fontFamily: FONTS.bold18,
    fontSize: ms(18),
    color: COLORS.blackText,
    marginBottom: mvs(15),
    textAlign: 'center',
  },
  categoryList: {
    marginBottom: mvs(10),
  },
  categoryItem: {
    paddingVertical: mvs(15),
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  categoryItemText: {
    fontFamily: FONTS.regular18,
    fontSize: ms(16),
    color: COLORS.blackText,
  },
});
