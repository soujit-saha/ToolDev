import AsyncStorage from '@react-native-async-storage/async-storage';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import ToastAlert from '../../utils/helper/Toast';
import {
  peopleListFailure,
  peopleListSuccess,
  getDashboardSuccess,
  getDashboardFailure,
  getSchedulesSuccess,
  getSchedulesFailure,
  getSchedulesCalendarSuccess,
  getSchedulesCalendarFailure,
  getSchedulesByDateSuccess,
  getSchedulesByDateFailure,
  getTeamsSuccess,
  getTeamsFailure,
  getTeamDetailsSuccess,
  getTeamDetailsFailure,
  getTeamMembersSuccess,
  getTeamMembersFailure,
  getTeamMembersByIdSuccess,
  getTeamMembersByIdFailure,
  getMembersOverallSuccess,
  getMembersOverallFailure,
  getTeamLogsSuccess,
  getTeamLogsFailure,
  takeToolSuccess,
  takeToolFailure,
  dropToolSuccess,
  dropToolFailure,
  getToolsAssignedSuccess,
  getToolsAssignedFailure,
  getToolsLogsSuccess,
  getToolsLogsFailure,
  getToolsListSuccess,
  getToolsListFailure,

  getNotificationsSuccess,
  getNotificationsFailure,
  readNotificationSuccess,
  readNotificationFailure,
  readAllNotificationsSuccess,
  readAllNotificationsFailure,
  getProfileSuccess,
  getProfileFailure,
  updateProfileSuccess,
  updateProfileFailure,
  deleteAccountSuccess,
  deleteAccountFailure,
  getInventoryCategoriesSuccess,
  getInventoryCategoriesFailure,
  getInventoryDetailsSuccess,
  getInventoryDetailsFailure,
  addInventoryToolSuccess,
  addInventoryToolFailure,
  getInventoryListSuccess,
  getInventoryListFailure,
  getInventoryLocationsSuccess,
  getInventoryLocationsFailure,
  getCmsSuccess,
  getCmsFailure,
  respondToolStatusCheckSuccess,
  respondToolStatusCheckFailure,
} from '../reducer/MainReducer';
// import { getApi, postApi } from '../../utils/helper/ApiRequest';
import { ApiHeaders, ApiResponse } from '../types';
import { constants } from '../../utils/constants';
import {
  getApi,
  postApi,
  deleteApi,
  getApiWithParam,
} from '../../utils/helper/ApiRequest';
import { goBack, navigate } from '../../utils/helper/RootNavigation';
import { cacheSignal } from 'react';
import { getTokenSuccess } from '../reducer/AuthReducer';

const getItems = (state: any) => state.AuthReducer;

//people list saga
export function* peopleListSaga(
  action: PayloadAction<any>,
): Generator<any, void, any> {
  const item = yield select(getItems);
  console.log('item', item.getTokenResponse);
  const header: ApiHeaders = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: item.getTokenResponse,
  };
  try {
    const page = action.payload?.page || 1;
    const limit = action.payload?.limit || 10;
    const response: ApiResponse = yield call(
      getApi,
      `users?page=${page}&limit=${limit}`,
      header,
    );

    console.log('118', response);
    yield put(
      peopleListSuccess({
        data: response?.data?.data?.data || [],
        page: page,
      }),
    );
  } catch (error: any) {
    console.log(error);
    yield put(peopleListFailure(error));
    ToastAlert(error?.response?.data?.message || 'Social Main Failed');
  }
}

export function* getDashboardSaga(
  action: PayloadAction<any>,
): Generator<any, void, any> {
  const item = yield select(getItems);
  const header: ApiHeaders = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: item.getTokenResponse,
  };
  try {
    const response: ApiResponse = yield call(getApi, 'dashboard', header);
    yield put(getDashboardSuccess(response?.data));
  } catch (error: any) {
    yield put(getDashboardFailure(error));
    ToastAlert(error?.response?.data?.message || 'getDashboard Failed');
  }
}

// schedules
export function* getSchedulesSaga(
  action: PayloadAction<any>,
): Generator<any, void, any> {
  const item = yield select(getItems);
  const header: ApiHeaders = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: item.getTokenResponse,
  };
  try {
    const response: ApiResponse = yield call(getApi, 'schedules', header);
    yield put(getSchedulesSuccess(response?.data));
  } catch (error: any) {
    yield put(getSchedulesFailure(error));
    ToastAlert(error?.response?.data?.message || 'getSchedules Failed');
  }
}

export function* getSchedulesCalendarSaga(
  action: PayloadAction<any>,
): Generator<any, void, any> {
  const item = yield select(getItems);
  const header: ApiHeaders = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: item.getTokenResponse,
  };
  try {
    const params = action.payload || {};
    const response: ApiResponse = yield call(
      getApiWithParam,
      'schedules/calendar',
      params,
      header,
    );
    yield put(getSchedulesCalendarSuccess(response?.data));
  } catch (error: any) {
    yield put(getSchedulesCalendarFailure(error));
    ToastAlert(error?.response?.data?.message || 'getSchedulesCalendar Failed');
  }
}

export function* getSchedulesByDateSaga(
  action: PayloadAction<any>,
): Generator<any, void, any> {
  const item = yield select(getItems);
  const header: ApiHeaders = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: item.getTokenResponse,
  };
  try {
    const date = action.payload?.date;
    const response: ApiResponse = yield call(
      getApi,
      `schedules/date/${date}`,
      header,
    );
    yield put(getSchedulesByDateSuccess(response?.data));
  } catch (error: any) {
    yield put(getSchedulesByDateFailure(error));
    ToastAlert(error?.response?.data?.message || 'getSchedulesByDate Failed');
  }
}

// teams
export function* getTeamsSaga(
  action: PayloadAction<any>,
): Generator<any, void, any> {
  const item = yield select(getItems);
  const header: ApiHeaders = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: item.getTokenResponse,
  };
  try {
    const response: ApiResponse = yield call(getApi, 'teams', header);
    yield put(getTeamsSuccess(response?.data?.data));
  } catch (error: any) {
    yield put(getTeamsFailure(error));
    ToastAlert(error?.response?.data?.message || 'getTeams Failed');
  }
}

export function* getTeamDetailsSaga(
  action: PayloadAction<any>,
): Generator<any, void, any> {
  const item = yield select(getItems);
  const header: ApiHeaders = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: item.getTokenResponse,
  };
  try {
    const uuid = action.payload?.uuid;
    const response: ApiResponse = yield call(getApi, `teams/${uuid}`, header);
    yield put(getTeamDetailsSuccess(response?.data));
  } catch (error: any) {
    yield put(getTeamDetailsFailure(error));
    ToastAlert(error?.response?.data?.message || 'getTeamDetails Failed');
  }
}

export function* getTeamMembersSaga(
  action: PayloadAction<any>,
): Generator<any, void, any> {
  const item = yield select(getItems);
  const header: ApiHeaders = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: item.getTokenResponse,
  };
  try {
    const uuid = action.payload?.uuid;
    const response: ApiResponse = yield call(
      getApi,
      `teams/${uuid}/members`,
      header,
    );
    yield put(getTeamMembersSuccess(response?.data));
  } catch (error: any) {
    yield put(getTeamMembersFailure(error));
    ToastAlert(error?.response?.data?.message || 'getTeamMembers Failed');
  }
}

export function* getTeamMembersByIdSaga(
  action: PayloadAction<any>,
): Generator<any, void, any> {
  const item = yield select(getItems);
  const header: ApiHeaders = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: item.getTokenResponse,
  };
  try {
    const params = action.payload || {};
    const response: ApiResponse = yield call(
      getApiWithParam,
      'teams/members/by-id',
      params,
      header,
    );
    yield put(getTeamMembersByIdSuccess(response?.data?.data));
  } catch (error: any) {
    yield put(getTeamMembersByIdFailure(error));
    ToastAlert(error?.response?.data?.message || 'getTeamMembersById Failed');
  }
}

export function* getMembersOverallSaga(
  action: PayloadAction<any>,
): Generator<any, void, any> {
  const item = yield select(getItems);
  const header: ApiHeaders = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: item.getTokenResponse,
  };
  try {
    const params = action.payload || {};
    const response: ApiResponse = yield call(
      getApiWithParam,
      'teams/members/overall',
      params,
      header,
    );
    console.log('response', response)
    yield put(getMembersOverallSuccess({
      data: response?.data?.data?.data || response?.data?.data || response?.data || [],
      page: params.page_no || 1,
      last_page: response?.data?.data?.last_page || 1,
    }));
  } catch (error: any) {
    yield put(getMembersOverallFailure(error));
    ToastAlert(error?.response?.data?.message || 'getMembersOverall Failed');
  }
}

export function* getTeamLogsSaga(
  action: PayloadAction<any>,
): Generator<any, void, any> {
  const item = yield select(getItems);
  const header: ApiHeaders = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: item.getTokenResponse,
  };
  try {
    const uuid = action.payload?.uuid;
    const response: ApiResponse = yield call(
      getApi,
      `teams/${uuid}/logs`,
      header,
    );
    yield put(getTeamLogsSuccess(response?.data));
  } catch (error: any) {
    yield put(getTeamLogsFailure(error));
    ToastAlert(error?.response?.data?.message || 'getTeamLogs Failed');
  }
}

// tools
export function* takeToolSaga(
  action: PayloadAction<any>,
): Generator<any, void, any> {
  const item = yield select(getItems);
  const header: ApiHeaders = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: item.getTokenResponse,
  };
  try {
    const response: ApiResponse = yield call(
      postApi,
      'tools/take',
      action.payload,
      header,
    );
    yield put(takeToolSuccess(response?.data));
    ToastAlert(response?.data?.message || 'Tool taken');
  } catch (error: any) {
    yield put(takeToolFailure(error));
    ToastAlert(error?.response?.data?.message || 'takeTool Failed');
  }
}

export function* dropToolSaga(
  action: PayloadAction<any>,
): Generator<any, void, any> {
  const item = yield select(getItems);
  const header: ApiHeaders = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: item.getTokenResponse,
  };
  try {
    const response: ApiResponse = yield call(
      postApi,
      'tools/drop',
      action.payload,
      header,
    );
    yield put(dropToolSuccess(response?.data));
    ToastAlert(response?.data?.message || 'Tool dropped');
  } catch (error: any) {
    yield put(dropToolFailure(error));
    ToastAlert(error?.response?.data?.message || 'dropTool Failed');
  }
}

export function* getToolsAssignedSaga(
  action: PayloadAction<any>,
): Generator<any, void, any> {
  const item = yield select(getItems);
  const header: ApiHeaders = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: item.getTokenResponse,
  };
  try {
    const params = action.payload || {};
    const response: ApiResponse = yield call(
      getApiWithParam,
      'tools/assigned',
      params,
      header,
    );
    yield put(getToolsAssignedSuccess({
      data: response?.data?.data?.data || response?.data?.data || response?.data || [],
      page: params.page_no || 1,
      last_page: response?.data?.data?.last_page || 1,
    }));
  } catch (error: any) {
    yield put(getToolsAssignedFailure(error));
    ToastAlert(error?.response?.data?.message || 'getToolsAssigned Failed');
  }
}

export function* getToolsLogsSaga(
  action: PayloadAction<any>,
): Generator<any, void, any> {
  const item = yield select(getItems);
  const header: ApiHeaders = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: item.getTokenResponse,
  };
  try {
    const response: ApiResponse = yield call(getApi, 'tools/logs', header);
    yield put(getToolsLogsSuccess(response?.data));
  } catch (error: any) {
    yield put(getToolsLogsFailure(error));
    ToastAlert(error?.response?.data?.message || 'getToolsLogs Failed');
  }
}

export function* getToolsListSaga(
  action: PayloadAction<any>,
): Generator<any, void, any> {
  const item = yield select(getItems);
  const header: ApiHeaders = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: item.getTokenResponse,
  };
  try {
    const params = action.payload || {};
    const response: ApiResponse = yield call(
      getApiWithParam,
      'tools',
      params,
      header,
    );
    yield put(getToolsListSuccess({
      data: response?.data?.data?.data || response?.data?.data || response?.data || [],
      page: params.page || 1,
    }));
  } catch (error: any) {
    yield put(getToolsListFailure(error));
    ToastAlert(error?.response?.data?.message || 'getToolsList Failed');
  }
}

// Inventory
export function* getInventoryCategoriesSaga(
  action: PayloadAction<any>,
): Generator<any, void, any> {
  const item = yield select(getItems);
  const header: ApiHeaders = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: item.getTokenResponse,
  };
  try {
    const response: ApiResponse = yield call(getApi, 'inventory/categories', header);
    yield put(getInventoryCategoriesSuccess(response?.data?.data));
  } catch (error: any) {
    yield put(getInventoryCategoriesFailure(error));
    ToastAlert(error?.response?.data?.message || 'getInventoryCategories Failed');
  }
}

export function* getInventoryDetailsSaga(
  action: PayloadAction<any>,
): Generator<any, void, any> {
  const item = yield select(getItems);
  const header: ApiHeaders = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: item.getTokenResponse,
  };
  try {
    const uuid = action.payload?.uuid;
    const response: ApiResponse = yield call(getApi, `inventory/${uuid}`, header);
    yield put(getInventoryDetailsSuccess(response?.data));
  } catch (error: any) {
    yield put(getInventoryDetailsFailure(error));
    ToastAlert(error?.response?.data?.message || 'getInventoryDetails Failed');
  }
}

export function* addInventoryToolSaga(
  action: PayloadAction<any>,
): Generator<any, void, any> {
  const item = yield select(getItems);
  const header: ApiHeaders = {
    Accept: 'application/json',
    contenttype: 'multipart/form-data',
    accesstoken: item.getTokenResponse,
  };
  try {
    const response: ApiResponse = yield call(postApi, 'inventory/add', action.payload, header);
    yield put(addInventoryToolSuccess(response?.data));
    ToastAlert(response?.data?.message || 'Inventory tool added');
  } catch (error: any) {
    console.log('ADD INVENTORY ERROR:', error?.response?.data || error);
    yield put(addInventoryToolFailure(error));
    ToastAlert(error?.response?.data?.message || 'addInventoryTool Failed');
  }
}

export function* getInventoryListSaga(
  action: PayloadAction<any>,
): Generator<any, void, any> {
  const item = yield select(getItems);
  const header: ApiHeaders = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: item.getTokenResponse,
  };
  try {
    const params = action.payload || {};
    const response: ApiResponse = yield call(
      getApiWithParam,
      'tools/inventory-logs',
      params,
      header,
    );
    yield put(getInventoryListSuccess(response?.data?.data?.members));

    console.log('INVENTORY LIST:', response?.data?.data?.members);
  } catch (error: any) {
    yield put(getInventoryListFailure(error));
    ToastAlert(error?.response?.data?.message || 'getInventoryList Failed');
  }
}

// Notifications
export function* getNotificationsSaga(
  action: PayloadAction<any>,
): Generator<any, void, any> {
  const item = yield select(getItems);
  const header: ApiHeaders = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: item.getTokenResponse,
  };
  try {
    const params = action.payload || {};
    const response: ApiResponse = yield call(
      getApiWithParam,
      'notifications',
      params,
      header,

    );
    yield put(getNotificationsSuccess(response?.data));
  } catch (error: any) {
    yield put(getNotificationsFailure(error));
    ToastAlert(error?.response?.data?.message || 'getNotifications Failed');
  }
}

export function* readNotificationSaga(
  action: PayloadAction<any>,
): Generator<any, void, any> {
  const item = yield select(getItems);
  const header: ApiHeaders = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: item.getTokenResponse,
  };
  try {
    const id = action.payload?.id;
    const response: ApiResponse = yield call(postApi, `notifications/read/${id}`, {}, header);
    yield put(readNotificationSuccess(response?.data));
  } catch (error: any) {
    yield put(readNotificationFailure(error));
    ToastAlert(error?.response?.data?.message || 'readNotification Failed');
  }
}

export function* readAllNotificationsSaga(
  action: PayloadAction<any>,
): Generator<any, void, any> {
  const item = yield select(getItems);
  const header: ApiHeaders = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: item.getTokenResponse,
  };
  try {
    const response: ApiResponse = yield call(postApi, 'notifications/read-all', {}, header);
    yield put(readAllNotificationsSuccess(response?.data));
  } catch (error: any) {
    yield put(readAllNotificationsFailure(error));
    ToastAlert(error?.response?.data?.message || 'readAllNotifications Failed');
  }
}

// Profile
export function* getProfileSaga(
  action: PayloadAction<any>,
): Generator<any, void, any> {
  const item = yield select(getItems);
  const header: ApiHeaders = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: item.getTokenResponse,
  };
  try {
    const response: ApiResponse = yield call(getApi, 'profile', header);
    yield put(getProfileSuccess(response?.data));
  } catch (error: any) {
    yield put(getProfileFailure(error));
    ToastAlert(error?.response?.data?.message || 'getProfile Failed');
  }
}

export function* updateProfileSaga(
  action: PayloadAction<any>,
): Generator<any, void, any> {
  const item = yield select(getItems);
  const header: ApiHeaders = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: item.getTokenResponse,
  };
  try {
    const response: ApiResponse = yield call(postApi, 'profile/update', action.payload, header);
    yield put(updateProfileSuccess(response?.data));
    ToastAlert(response?.data?.message || 'Profile updated');
  } catch (error: any) {
    yield put(updateProfileFailure(error));
    ToastAlert(error?.response?.data?.message || 'updateProfile Failed');
  }
}

export function* deleteAccountSaga(
  action: PayloadAction<any>,
): Generator<any, void, any> {
  const item = yield select(getItems);
  const header: ApiHeaders = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: item.getTokenResponse,
  };
  try {
    const response: ApiResponse = yield call(postApi, 'profile/delete-account', action.payload, header);
    yield put(deleteAccountSuccess(response?.data));
    ToastAlert(response?.data?.message || 'Account deleted');
  } catch (error: any) {
    yield put(deleteAccountFailure(error));
    ToastAlert(error?.response?.data?.message || 'deleteAccount Failed');
  }
}

export function* getInventoryLocationsSaga(
  action: PayloadAction<any>,
): Generator<any, void, any> {
  const item = yield select(getItems);
  const header: ApiHeaders = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: item.getTokenResponse,
  };
  try {
    const params = action.payload || {};
    const response: ApiResponse = yield call(
      getApiWithParam,
      'inventory/locations',
      params,
      header,
    );
    yield put(getInventoryLocationsSuccess(response?.data?.data?.data));
  } catch (error: any) {
    yield put(getInventoryLocationsFailure(error));
    ToastAlert(error?.response?.data?.message || 'getInventoryLocations Failed');
  }
}

export function* getCmsSaga(
  action: PayloadAction<any>,
): Generator<any, void, any> {
  const item = yield select(getItems);
  const header: ApiHeaders = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: item.getTokenResponse,
  };
  try {
    const params = action.payload || {};
    const response: ApiResponse = yield call(
      getApiWithParam,
      'cms',
      params,
      header,
    );
    yield put(getCmsSuccess(response?.data));
  } catch (error: any) {
    yield put(getCmsFailure(error));
    ToastAlert(error?.response?.data?.message || 'getCms Failed');
  }
}

export function* respondToolStatusCheckSaga(
  action: PayloadAction<any>,
): Generator<any, void, any> {
  const item = yield select(getItems);
  const header: ApiHeaders = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: item.getTokenResponse,
  };
  try {
    const { uuid, data, refreshPayload } = action.payload;
    const response: ApiResponse = yield call(
      postApi,
      `tools/status-checks/${uuid}/respond`,
      data,
      header,
    );
    yield put(respondToolStatusCheckSuccess(response?.data));
    ToastAlert(response?.data?.message || 'Status check responded');
    yield put({ type: 'Main/getNotificationsRequest', payload: refreshPayload || {} });
  } catch (error: any) {
    yield put(respondToolStatusCheckFailure(error));
    ToastAlert(error?.response?.data?.message || 'Failed to respond to status check');
  }
}

// Watcher Saga
export function* watchMainSaga(): Generator<any, void, any> {
  yield takeLatest('Main/peopleListRequest', peopleListSaga);
  yield takeLatest('Main/getDashboardRequest', getDashboardSaga);
  yield takeLatest('Main/getSchedulesRequest', getSchedulesSaga);
  yield takeLatest(
    'Main/getSchedulesCalendarRequest',
    getSchedulesCalendarSaga,
  );
  yield takeLatest('Main/getSchedulesByDateRequest', getSchedulesByDateSaga);

  yield takeLatest('Main/getTeamsRequest', getTeamsSaga);
  yield takeLatest('Main/getTeamDetailsRequest', getTeamDetailsSaga);
  yield takeLatest('Main/getTeamMembersRequest', getTeamMembersSaga);
  yield takeLatest('Main/getTeamMembersByIdRequest', getTeamMembersByIdSaga);
  yield takeLatest('Main/getMembersOverallRequest', getMembersOverallSaga);
  yield takeLatest('Main/getTeamLogsRequest', getTeamLogsSaga);

  yield takeLatest('Main/takeToolRequest', takeToolSaga);
  yield takeLatest('Main/dropToolRequest', dropToolSaga);
  yield takeLatest('Main/getToolsAssignedRequest', getToolsAssignedSaga);
  yield takeLatest('Main/getToolsLogsRequest', getToolsLogsSaga);
  yield takeLatest('Main/getToolsListRequest', getToolsListSaga);

  yield takeLatest('Main/getInventoryCategoriesRequest', getInventoryCategoriesSaga);
  yield takeLatest('Main/getInventoryDetailsRequest', getInventoryDetailsSaga);
  yield takeLatest('Main/addInventoryToolRequest', addInventoryToolSaga);
  yield takeLatest('Main/getInventoryListRequest', getInventoryListSaga);
  yield takeLatest('Main/getInventoryLocationsRequest', getInventoryLocationsSaga);

  yield takeLatest('Main/getNotificationsRequest', getNotificationsSaga);
  yield takeLatest('Main/readNotificationRequest', readNotificationSaga);
  yield takeLatest('Main/readAllNotificationsRequest', readAllNotificationsSaga);

  yield takeLatest('Main/getProfileRequest', getProfileSaga);
  yield takeLatest('Main/updateProfileRequest', updateProfileSaga);
  yield takeLatest('Main/deleteAccountRequest', deleteAccountSaga);
  yield takeLatest('Main/getCmsRequest', getCmsSaga);
  yield takeLatest('Main/respondToolStatusCheckRequest', respondToolStatusCheckSaga);
}
