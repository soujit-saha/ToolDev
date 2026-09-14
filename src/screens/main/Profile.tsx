import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, StatusBar, Alert, Modal } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, ICONS } from '../../utils/constants';
import { ms, mvs, s, vs } from '../../utils/helper/metric';
import { useDispatch, useSelector } from 'react-redux';
import { logoutRequest, deleteAccountRequest } from '../../redux/reducer/AuthReducer';
import { goBack, navigate } from '../../utils/helper/RootNavigation';
import Loader from '../../utils/helper/Loader';
import { getCmsRequest } from '../../redux/reducer/MainReducer';
import { WebView } from 'react-native-webview';

const Profile = () => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const { getProfileRes, isMainLoading, getCmsRes } = useSelector((state: any) => state.MainReducer);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<string | null>(null);

  const openModal = (type: string) => {
    setModalType(type);
    setModalVisible(true);
    onCMSPress(type)
  };

  const closeModal = () => {
    setModalVisible(false);
    setModalType(null);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: () => dispatch(logoutRequest({})),
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => dispatch(deleteAccountRequest({})),
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  // console.log(getProfileRes, 'getProfileRes');

  const onCMSPress = (type: string) => {
    dispatch(getCmsRequest({ alias: type == "Terms and Condition" ? "terms-and-conditions" : "help-and-support" }))
  }

  // console.log('76', getCmsRes?.data?.[0]?.description)
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.primary} />
      <Loader visible={isMainLoading} />
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={() => goBack()}>
            <Image source={ICONS.back} style={styles.headerIcon} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity style={styles.iconBtn} onPress={() => navigate('Notifications')}>
            <Image source={ICONS.notification} style={styles.headerIcon} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: ms(66) + insets.bottom + mvs(20) }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Image source={getProfileRes?.data?.profile_image ? { uri: getProfileRes?.data?.profile_image } : ICONS.profile} style={styles.avatar} />
            {/* <View style={styles.verifiedBadge}>
              <Image source={ICONS.check} style={styles.verifiedIcon} />
            </View> */}
          </View>
          <Text style={styles.userName}>{getProfileRes?.data?.name}</Text>
          <Text style={styles.userRole}>{getProfileRes?.data?.email}</Text>
        </View>

        {/* Tools Assigned Card */}
        <View style={styles.toolsCard}>
          <Text style={styles.toolsLabel}>TOOLS ASSIGNED</Text>
          <Text style={styles.toolsCount}>{getProfileRes?.data?.tools_assigned}</Text>
        </View>

        {/* Options List */}
        <View style={styles.optionsCard}>
          <TouchableOpacity style={styles.optionRow} onPress={() => openModal('Terms and Condition')}>
            <Image source={ICONS.terms} style={styles.optionIcon} />
            <Text style={styles.optionText}>Terms and Condition</Text>
            <Image source={ICONS.nextArrow} style={styles.chevronIcon} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.optionRow} onPress={handleDeleteAccount}>
            <Image source={ICONS.account} style={styles.optionIcon} />
            <Text style={styles.optionText}>Delete Account</Text>
            <Image source={ICONS.nextArrow} style={styles.chevronIcon} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.optionRow} onPress={() => openModal('Help & Support')}>
            <Image source={ICONS.help} style={styles.optionIcon} />
            <Text style={styles.optionText}>Help & Support</Text>
            <Image source={ICONS.nextArrow} style={styles.chevronIcon} />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} activeOpacity={0.8} onPress={handleLogout}>
          <Image source={ICONS.logout} style={styles.logoutIcon} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* Dynamic Modal for Terms and Help */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeModal}
      >
        <View style={styles.container}>
          <StatusBar barStyle="dark-content" backgroundColor={COLORS.primary} />
          <View style={[styles.header, { paddingTop: insets.top }]}>
            <View style={styles.headerContent}>
              <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={closeModal}>
                <Image source={ICONS.back} style={styles.headerIcon} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>{modalType}</Text>
              <View style={styles.iconBtn} />
            </View>
          </View>
          <View style={{ flex: 1, paddingHorizontal: s(16) }}>
            {getCmsRes?.data?.[0]?.description ? (
              <>
                <Image source={{ uri: getCmsRes?.data?.[0]?.image_path }} style={{ height: ms(100), width: ms(100), resizeMode: 'contain', alignSelf: 'center', marginVertical: ms(10) }} />

                <WebView
                  source={{ html: getCmsRes?.data?.[0]?.description }}
                  style={{ flex: 1, backgroundColor: 'transparent' }}
                  originWhitelist={['*']}
                  showsVerticalScrollIndicator={false}
                />
              </>
            ) : (
              <Text style={{ textAlign: 'center', marginTop: 20 }}>Loading...</Text>
            )}
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
};

export default Profile;

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
  profileCard: {
    backgroundColor: '#F9FAFB', // very light grey / white-ish
    borderRadius: ms(16),
    alignItems: 'center',
    paddingVertical: mvs(24),
    marginBottom: mvs(16),
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: mvs(12),
  },
  avatar: {
    width: s(80),
    height: s(80),
    borderRadius: ms(40),
    backgroundColor: '#E5E7EB',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: s(24),
    height: s(24),
    borderRadius: ms(12),
    backgroundColor: COLORS.success,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F9FAFB',
  },
  verifiedIcon: {
    width: s(12),
    height: s(12),
    tintColor: COLORS.white,
    resizeMode: 'contain',
  },
  userName: {
    fontFamily: FONTS.bold24,
    fontSize: ms(22),
    color: COLORS.blackText,
    marginBottom: mvs(4),
  },
  userRole: {
    fontFamily: FONTS.regular18,
    fontSize: ms(14),
    color: COLORS.primary,
  },
  toolsCard: {
    backgroundColor: COLORS.white,
    borderRadius: ms(16),
    padding: ms(20),
    marginBottom: mvs(16),
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: vs(2) },
    shadowOpacity: 0.05,
    shadowRadius: ms(8),
    elevation: 2,
  },
  toolsLabel: {
    fontFamily: FONTS.semiBold18,
    fontSize: ms(12),
    color: COLORS.shuttleGray,
    letterSpacing: 0.5,
    marginBottom: mvs(8),
  },
  toolsCount: {
    fontFamily: FONTS.bold28,
    fontSize: ms(28),
    color: COLORS.blackText,
  },
  optionsCard: {
    backgroundColor: COLORS.white,
    borderRadius: ms(16),
    paddingVertical: mvs(8),
    marginBottom: mvs(16),
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: vs(2) },
    shadowOpacity: 0.05,
    shadowRadius: ms(8),
    elevation: 2,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: mvs(16),
    paddingHorizontal: s(20),
  },
  optionIcon: {
    width: s(20),
    height: s(20),
    tintColor: COLORS.primary,
    resizeMode: 'contain',
    marginRight: s(16),
  },
  optionText: {
    flex: 1,
    fontFamily: FONTS.bold18,
    fontSize: ms(15),
    color: COLORS.blackText,
  },
  chevronIcon: {
    width: s(16),
    height: s(16),
    tintColor: COLORS.placeholderGray,
    resizeMode: 'contain',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginLeft: s(56),
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderRadius: ms(16),
    paddingVertical: mvs(16),
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: vs(2) },
    shadowOpacity: 0.05,
    shadowRadius: ms(8),
    elevation: 2,
  },
  logoutIcon: {
    width: s(20),
    height: s(20),
    tintColor: COLORS.error,
    resizeMode: 'contain',
    marginRight: s(8),
  },
  logoutText: {
    fontFamily: FONTS.bold18,
    fontSize: ms(15),
    color: COLORS.error,
  },
  modalBodyText: {
    fontFamily: FONTS.regular18,
    fontSize: ms(14),
    color: COLORS.blackText,
    lineHeight: 22,
  },
});
