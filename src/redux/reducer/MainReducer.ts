import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface MainState {
  status: string;
  isMainLoading: boolean;
  pagiLoading: boolean;
  error?: string;
  peopleListRes?: any;
  getProfileRes?: any;
  getDashboardRes?: any;
  schedulesListRes?: any;
  schedulesCalendarRes?: any;
  schedulesByDateRes?: any;
  teamsListRes?: any;
  teamDetailsRes?: any;
  teamMembersRes?: any;
  teamMembersByIdRes?: any;
  membersOverallRes?: any;
  teamLogsRes?: any;
  toolsAssignedRes?: any;
  toolsLogsRes?: any;
  takeToolRes?: any;
  dropToolRes?: any;
  getNotificationsRes?: any;
  readNotificationRes?: any;
  readAllNotificationsRes?: any;
  updateProfileRes?: any;
  deleteAccountRes?: any;
  getInventoryCategoriesRes?: any;
  getInventoryDetailsRes?: any;
  addInventoryToolRes?: any;
  getInventoryListRes?: any;
  getToolsListRes?: any;
  inventoryLocationsRes?: any;
  getCmsRes?: any;
  respondToolStatusCheckRes?: any;
}

const initialState: MainState = {
  status: '',
  isMainLoading: false,
  pagiLoading: false,
  peopleListRes: [],
  getProfileRes: {},
  getNotificationsRes: {},
  readNotificationRes: {},
  readAllNotificationsRes: {},
  updateProfileRes: {},
  deleteAccountRes: {},
  getDashboardRes: {},
  schedulesListRes: [],
  schedulesCalendarRes: {},
  schedulesByDateRes: [],
  teamsListRes: [],
  teamDetailsRes: {},
  teamMembersRes: [],
  teamMembersByIdRes: [],
  membersOverallRes: [],
  teamLogsRes: [],
  toolsAssignedRes: [],
  toolsLogsRes: [],
  takeToolRes: {},
  dropToolRes: {},
  getInventoryCategoriesRes: [],
  getInventoryDetailsRes: {},
  addInventoryToolRes: {},
  getInventoryListRes: [],
  getToolsListRes: [],
  inventoryLocationsRes: [],
  getCmsRes: {},
  respondToolStatusCheckRes: {},
};

const MainSlice = createSlice({
  name: 'Main',
  initialState,
  reducers: {
    //getProfile Setup
    peopleListRequest(state, action: PayloadAction<any>) {
      state.isMainLoading = true;
      state.status = action.type;
    },
    peopleListSuccess(state, action: PayloadAction<any>) {
      state.isMainLoading = false;
      if (action.payload?.page === 1) {
        state.peopleListRes = action.payload.data;
      } else {
        state.peopleListRes = [
          ...(state.peopleListRes || []),
          ...(action.payload.data || []),
        ];
      }
      state.status = action.type;
    },
    peopleListFailure(state, action: PayloadAction<any>) {
      state.isMainLoading = false;
      state.error = action.payload?.error || 'userList failed';
      state.status = action.type;
    },

    // schedules
    getSchedulesRequest(state, action: PayloadAction<any>) {
      state.isMainLoading = true;
      state.status = action.type;
    },
    getSchedulesSuccess(state, action: PayloadAction<any>) {
      state.isMainLoading = false;
      state.schedulesListRes = action.payload;
      state.status = action.type;
    },
    getSchedulesFailure(state, action: PayloadAction<any>) {
      state.isMainLoading = false;
      state.error = action.payload?.error || 'getSchedules failed';
      state.status = action.type;
    },

    getSchedulesCalendarRequest(state, action: PayloadAction<any>) {
      state.isMainLoading = true;
      state.status = action.type;
    },
    getSchedulesCalendarSuccess(state, action: PayloadAction<any>) {
      state.isMainLoading = false;
      state.schedulesCalendarRes = action.payload;
      state.status = action.type;
    },
    getSchedulesCalendarFailure(state, action: PayloadAction<any>) {
      state.isMainLoading = false;
      state.error = action.payload?.error || 'getSchedulesCalendar failed';
      state.status = action.type;
    },

    getSchedulesByDateRequest(state, action: PayloadAction<any>) {
      state.isMainLoading = true;
      state.status = action.type;
    },
    getSchedulesByDateSuccess(state, action: PayloadAction<any>) {
      state.isMainLoading = false;
      state.schedulesByDateRes = action.payload;
      state.status = action.type;
    },
    getSchedulesByDateFailure(state, action: PayloadAction<any>) {
      state.isMainLoading = false;
      state.error = action.payload?.error || 'getSchedulesByDate failed';
      state.status = action.type;
    },
    // get dashboard
    getDashboardRequest(state, action: PayloadAction<any>) {
      state.isMainLoading = true;
      state.status = action.type;
    },
    getDashboardSuccess(state, action: PayloadAction<any>) {
      state.isMainLoading = false;
      state.getDashboardRes = action.payload;
      state.status = action.type;
    },
    getDashboardFailure(state, action: PayloadAction<any>) {
      state.isMainLoading = false;
      state.error = action.payload?.error || 'getDashboard failed';
      state.status = action.type;
    },

    // teams
    getTeamsRequest(state, action: PayloadAction<any>) {
      state.isMainLoading = true;
      state.status = action.type;
    },
    getTeamsSuccess(state, action: PayloadAction<any>) {
      state.isMainLoading = false;
      state.teamsListRes = action.payload;
      state.status = action.type;
    },
    getTeamsFailure(state, action: PayloadAction<any>) {
      state.isMainLoading = false;
      state.error = action.payload?.error || 'getTeams failed';
      state.status = action.type;
    },

    getTeamDetailsRequest(state, action: PayloadAction<any>) {
      state.isMainLoading = true;
      state.status = action.type;
    },
    getTeamDetailsSuccess(state, action: PayloadAction<any>) {
      state.isMainLoading = false;
      state.teamDetailsRes = action.payload;
      state.status = action.type;
    },
    getTeamDetailsFailure(state, action: PayloadAction<any>) {
      state.isMainLoading = false;
      state.error = action.payload?.error || 'getTeamDetails failed';
      state.status = action.type;
    },

    getTeamMembersRequest(state, action: PayloadAction<any>) {
      state.isMainLoading = true;
      state.status = action.type;
    },
    getTeamMembersSuccess(state, action: PayloadAction<any>) {
      state.isMainLoading = false;
      state.teamMembersRes = action.payload;
      state.status = action.type;
    },
    getTeamMembersFailure(state, action: PayloadAction<any>) {
      state.isMainLoading = false;
      state.error = action.payload?.error || 'getTeamMembers failed';
      state.status = action.type;
    },

    getTeamMembersByIdRequest(state, action: PayloadAction<any>) {
      state.isMainLoading = true;
      state.status = action.type;
    },
    getTeamMembersByIdSuccess(state, action: PayloadAction<any>) {
      state.isMainLoading = false;
      state.teamMembersByIdRes = action.payload;
      state.status = action.type;
    },
    getTeamMembersByIdFailure(state, action: PayloadAction<any>) {
      state.isMainLoading = false;
      state.error = action.payload?.error || 'getTeamMembersById failed';
      state.status = action.type;
    },

    getMembersOverallRequest(state, action: PayloadAction<any>) {
      if (action.payload?.page_no > 1) {
        state.pagiLoading = true;
      } else {
        state.isMainLoading = true;
      }
      state.status = action.type;
    },
    getMembersOverallSuccess(state, action: PayloadAction<any>) {
      state.isMainLoading = false;
      state.pagiLoading = false;
      if (action.payload?.page === 1) {
        state.membersOverallRes = {
          data: action.payload.data,
          last_page: action.payload.last_page,
        };
      } else {
        state.membersOverallRes = {
          ...state.membersOverallRes,
          data: [
            ...(state.membersOverallRes?.data || []),
            ...(action.payload.data || []),
          ],
        };
      }
      state.status = action.type;
    },
    getMembersOverallFailure(state, action: PayloadAction<any>) {
      state.isMainLoading = false;
      state.pagiLoading = false;
      state.error = action.payload?.error || 'getMembersOverall failed';
      state.status = action.type;
    },

    getTeamLogsRequest(state, action: PayloadAction<any>) {
      state.isMainLoading = true;
      state.status = action.type;
    },
    getTeamLogsSuccess(state, action: PayloadAction<any>) {
      state.isMainLoading = false;
      state.teamLogsRes = action.payload;
      state.status = action.type;
    },
    getTeamLogsFailure(state, action: PayloadAction<any>) {
      state.isMainLoading = false;
      state.error = action.payload?.error || 'getTeamLogs failed';
      state.status = action.type;
    },

    // tools
    takeToolRequest(state, action: PayloadAction<any>) {
      state.isMainLoading = true;
      state.status = action.type;
    },
    takeToolSuccess(state, action: PayloadAction<any>) {
      state.isMainLoading = false;
      state.takeToolRes = action.payload;
      state.status = action.type;
    },
    takeToolFailure(state, action: PayloadAction<any>) {
      state.isMainLoading = false;
      state.error = action.payload?.error || 'takeTool failed';
      state.status = action.type;
    },

    dropToolRequest(state, action: PayloadAction<any>) {
      state.isMainLoading = true;
      state.status = action.type;
    },
    dropToolSuccess(state, action: PayloadAction<any>) {
      state.isMainLoading = false;
      state.dropToolRes = action.payload;
      state.status = action.type;
    },
    dropToolFailure(state, action: PayloadAction<any>) {
      state.isMainLoading = false;
      state.error = action.payload?.error || 'dropTool failed';
      state.status = action.type;
    },

    getToolsAssignedRequest(state, action: PayloadAction<any>) {
      if (action.payload?.page_no > 1) {
        state.pagiLoading = true;
      } else {
        state.isMainLoading = true;
      }
      state.status = action.type;
    },
    getToolsAssignedSuccess(state, action: PayloadAction<any>) {
      state.isMainLoading = false;
      state.pagiLoading = false;
      if (action.payload?.page === 1) {
        state.toolsAssignedRes = {
          data: action.payload.data,
          last_page: action.payload.last_page,
        };
      } else {
        state.toolsAssignedRes = {
          ...state.toolsAssignedRes,
          data: [
            ...(state.toolsAssignedRes?.data || []),
            ...(action.payload.data || []),
          ],
        };
      }
      state.status = action.type;
    },
    getToolsAssignedFailure(state, action: PayloadAction<any>) {
      state.isMainLoading = false;
      state.pagiLoading = false;
      state.error = action.payload?.error || 'getToolsAssigned failed';
      state.status = action.type;
    },

    getToolsLogsRequest(state, action: PayloadAction<any>) {
      state.isMainLoading = true;
      state.status = action.type;
    },
    getToolsLogsSuccess(state, action: PayloadAction<any>) {
      state.isMainLoading = false;
      state.toolsLogsRes = action.payload;
      state.status = action.type;
    },
    getToolsLogsFailure(state, action: PayloadAction<any>) {
      state.isMainLoading = false;
      state.error = action.payload?.error || 'getToolsLogs failed';
      state.status = action.type;
    },

    getToolsListRequest(state, action: PayloadAction<any>) {
      state.isMainLoading = true;
      state.status = action.type;
    },
    getToolsListSuccess(state, action: PayloadAction<any>) {
      state.isMainLoading = false;
      if (action.payload?.page === 1) {
        state.getToolsListRes = action.payload.data;
      } else {
        state.getToolsListRes = [
          ...(state.getToolsListRes || []),
          ...(action.payload.data || []),
        ];
      }
      state.status = action.type;
    },
    getToolsListFailure(state, action: PayloadAction<any>) {
      state.isMainLoading = false;
      state.error = action.payload?.error || 'getToolsList failed';
      state.status = action.type;
    },

    // inventory
    getInventoryCategoriesRequest(state, action: PayloadAction<any>) {
      state.isMainLoading = true;
      state.status = action.type;
    },
    getInventoryCategoriesSuccess(state, action: PayloadAction<any>) {
      state.isMainLoading = false;
      state.getInventoryCategoriesRes = action.payload;
      state.status = action.type;
    },
    getInventoryCategoriesFailure(state, action: PayloadAction<any>) {
      state.isMainLoading = false;
      state.error = action.payload?.error || 'getInventoryCategories failed';
      state.status = action.type;
    },

    getInventoryDetailsRequest(state, action: PayloadAction<any>) {
      state.isMainLoading = true;
      state.status = action.type;
    },
    getInventoryDetailsSuccess(state, action: PayloadAction<any>) {
      state.isMainLoading = false;
      state.getInventoryDetailsRes = action.payload;
      state.status = action.type;
    },
    getInventoryDetailsFailure(state, action: PayloadAction<any>) {
      state.isMainLoading = false;
      state.error = action.payload?.error || 'getInventoryDetails failed';
      state.status = action.type;
    },

    addInventoryToolRequest(state, action: PayloadAction<any>) {
      state.isMainLoading = true;
      state.status = action.type;
    },
    addInventoryToolSuccess(state, action: PayloadAction<any>) {
      state.isMainLoading = false;
      state.addInventoryToolRes = action.payload;
      state.status = action.type;
    },
    addInventoryToolFailure(state, action: PayloadAction<any>) {
      state.isMainLoading = false;
      state.error = action.payload?.error || 'addInventoryTool failed';
      state.status = action.type;
    },

    getInventoryListRequest(state, action: PayloadAction<any>) {
      state.isMainLoading = true;
      state.status = action.type;
    },
    getInventoryListSuccess(state, action: PayloadAction<any>) {
      state.isMainLoading = false;
      // if (action.payload?.page === 1) {
      state.getInventoryListRes = action.payload;
      // } else {
      //   state.getInventoryListRes = [
      //     ...(state.getInventoryListRes || []),
      //     ...(action.payload.data || []),
      //   ];
      // }
      state.status = action.type;
    },
    getInventoryListFailure(state, action: PayloadAction<any>) {
      state.isMainLoading = false;
      state.error = action.payload?.error || 'getInventoryList failed';
      state.status = action.type;
    },

    getInventoryLocationsRequest(state, action: PayloadAction<any>) {
      state.isMainLoading = true;
      state.status = action.type;
    },
    getInventoryLocationsSuccess(state, action: PayloadAction<any>) {
      state.isMainLoading = false;
      state.inventoryLocationsRes = action.payload;
      state.status = action.type;
    },
    getInventoryLocationsFailure(state, action: PayloadAction<any>) {
      state.isMainLoading = false;
      state.error = action.payload?.error || 'getInventoryLocations failed';
      state.status = action.type;
    },

    // notifications
    getNotificationsRequest(state, action: PayloadAction<any>) {
      state.isMainLoading = true;
      state.status = action.type;
    },
    getNotificationsSuccess(state, action: PayloadAction<any>) {
      state.isMainLoading = false;
      state.getNotificationsRes = action.payload;
      state.status = action.type;
    },
    getNotificationsFailure(state, action: PayloadAction<any>) {
      state.isMainLoading = false;
      state.error = action.payload?.error || 'getNotifications failed';
      state.status = action.type;
    },

    readNotificationRequest(state, action: PayloadAction<any>) {
      state.isMainLoading = true;
      state.status = action.type;
    },
    readNotificationSuccess(state, action: PayloadAction<any>) {
      state.isMainLoading = false;
      state.readNotificationRes = action.payload;
      state.status = action.type;
    },
    readNotificationFailure(state, action: PayloadAction<any>) {
      state.isMainLoading = false;
      state.error = action.payload?.error || 'readNotification failed';
      state.status = action.type;
    },

    readAllNotificationsRequest(state, action: PayloadAction<any>) {
      state.isMainLoading = true;
      state.status = action.type;
    },
    readAllNotificationsSuccess(state, action: PayloadAction<any>) {
      state.isMainLoading = false;
      state.readAllNotificationsRes = action.payload;
      state.status = action.type;
    },
    readAllNotificationsFailure(state, action: PayloadAction<any>) {
      state.isMainLoading = false;
      state.error = action.payload?.error || 'readAllNotifications failed';
      state.status = action.type;
    },

    // profile
    getProfileRequest(state, action: PayloadAction<any>) {
      state.isMainLoading = true;
      state.status = action.type;
    },
    getProfileSuccess(state, action: PayloadAction<any>) {
      console.log('333', action.payload);
      state.isMainLoading = false;
      state.getProfileRes = action.payload;
      state.status = action.type;
    },
    getProfileFailure(state, action: PayloadAction<any>) {
      state.isMainLoading = false;
      state.error = action.payload?.error || 'getProfile failed';
      state.status = action.type;
    },

    updateProfileRequest(state, action: PayloadAction<any>) {
      state.isMainLoading = true;
      state.status = action.type;
    },
    updateProfileSuccess(state, action: PayloadAction<any>) {
      state.isMainLoading = false;
      state.updateProfileRes = action.payload;
      state.status = action.type;
    },
    updateProfileFailure(state, action: PayloadAction<any>) {
      state.isMainLoading = false;
      state.error = action.payload?.error || 'updateProfile failed';
      state.status = action.type;
    },

    deleteAccountRequest(state, action: PayloadAction<any>) {
      state.isMainLoading = true;
      state.status = action.type;
    },
    deleteAccountSuccess(state, action: PayloadAction<any>) {
      state.isMainLoading = false;
      state.deleteAccountRes = action.payload;
      state.status = action.type;
    },
    deleteAccountFailure(state, action: PayloadAction<any>) {
      state.isMainLoading = false;
      state.error = action.payload?.error || 'deleteAccount failed';
      state.status = action.type;
    },


    getCmsRequest(state, action: PayloadAction<any>) {
      state.isMainLoading = true;
      state.status = action.type;
    },
    getCmsSuccess(state, action: PayloadAction<any>) {
      state.isMainLoading = false;
      state.getCmsRes = action.payload;
      state.status = action.type;
    },
    getCmsFailure(state, action: PayloadAction<any>) {
      state.isMainLoading = false;
      state.error = action.payload?.error || 'getCms failed';
      state.status = action.type;
    },


    respondToolStatusCheckRequest(state, action: PayloadAction<any>) {
      state.isMainLoading = true;
      state.status = action.type;
    },
    respondToolStatusCheckSuccess(state, action: PayloadAction<any>) {
      state.isMainLoading = false;
      state.respondToolStatusCheckRes = action.payload;
      state.status = action.type;
    },
    respondToolStatusCheckFailure(state, action: PayloadAction<any>) {
      state.isMainLoading = false;
      state.error = action.payload?.error || 'respondToolStatusCheck failed';
      state.status = action.type;
    },
  },
});

export const {
  peopleListRequest,
  peopleListSuccess,
  peopleListFailure,

  getDashboardRequest,
  getDashboardSuccess,
  getDashboardFailure,

  // schedules
  getSchedulesRequest,
  getSchedulesSuccess,
  getSchedulesFailure,
  getSchedulesCalendarRequest,
  getSchedulesCalendarSuccess,
  getSchedulesCalendarFailure,
  getSchedulesByDateRequest,
  getSchedulesByDateSuccess,
  getSchedulesByDateFailure,

  // teams
  getTeamsRequest,
  getTeamsSuccess,
  getTeamsFailure,
  getTeamDetailsRequest,
  getTeamDetailsSuccess,
  getTeamDetailsFailure,
  getTeamMembersRequest,
  getTeamMembersSuccess,
  getTeamMembersFailure,
  getTeamMembersByIdRequest,
  getTeamMembersByIdSuccess,
  getTeamMembersByIdFailure,
  getMembersOverallRequest,
  getMembersOverallSuccess,
  getMembersOverallFailure,
  getTeamLogsRequest,
  getTeamLogsSuccess,
  getTeamLogsFailure,

  // tools
  takeToolRequest,
  takeToolSuccess,
  takeToolFailure,
  dropToolRequest,
  dropToolSuccess,
  dropToolFailure,
  getToolsAssignedRequest,
  getToolsAssignedSuccess,
  getToolsAssignedFailure,
  getToolsLogsRequest,
  getToolsLogsSuccess,
  getToolsLogsFailure,
  getToolsListRequest,
  getToolsListSuccess,
  getToolsListFailure,

  // inventory
  getInventoryCategoriesRequest,
  getInventoryCategoriesSuccess,
  getInventoryCategoriesFailure,
  getInventoryDetailsRequest,
  getInventoryDetailsSuccess,
  getInventoryDetailsFailure,
  addInventoryToolRequest,
  addInventoryToolSuccess,
  addInventoryToolFailure,
  getInventoryListRequest,
  getInventoryListSuccess,
  getInventoryListFailure,

  // notifications
  getNotificationsRequest,
  getNotificationsSuccess,
  getNotificationsFailure,
  readNotificationRequest,
  readNotificationSuccess,
  readNotificationFailure,
  readAllNotificationsRequest,
  readAllNotificationsSuccess,
  readAllNotificationsFailure,



  // profile
  getProfileRequest,
  getProfileSuccess,
  getProfileFailure,
  updateProfileRequest,
  updateProfileSuccess,
  updateProfileFailure,
  deleteAccountRequest,
  deleteAccountSuccess,
  deleteAccountFailure,
  getInventoryLocationsRequest,
  getInventoryLocationsSuccess,
  getInventoryLocationsFailure,
  getCmsRequest,
  getCmsSuccess,
  getCmsFailure,
  respondToolStatusCheckRequest,
  respondToolStatusCheckSuccess,
  respondToolStatusCheckFailure,


} = MainSlice.actions;

export default MainSlice.reducer;
