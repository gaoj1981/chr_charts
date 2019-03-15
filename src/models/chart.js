import { isResOK } from '@/utils/BizUtil';
import {
  getLingJian,
  getZone,
  getAnalyze,
  getGroupResult,
  getHost,
  summaryResult,
} from '@/services/chart';

const servToReduce = {
  getLingJian: { method: getLingJian, reduce: 'getLingJian' },
  getZone: { method: getZone, reduce: 'getZone' },
  getAnalyze: { method: getAnalyze, reduce: 'getAnalyze' },
  getGroupResult: { method: getGroupResult, reduce: 'getGroupResult' },
  getHost: { method: getHost, reduce: 'getHost' },
  summaryResult: { method: summaryResult, reduce: 'summaryResult' },
};

//
export default {
  namespace: 'charts',

  state: {
    getLingJian: [],
    getAnalyze: [],
    zone: {},
    groupResult: {},
    getHost: [],
    summaryResult: [],
  },

  effects: {
    *reqCommon({ service, payload, callback }, { call, put }) {
      const postParamObj = servToReduce[service];
      const response = yield call(postParamObj.method, payload);
      //
      if (isResOK(response)) {
        const { reduce } = postParamObj;
        if (reduce) {
          yield put({
            type: reduce,
            payload: response,
          });
        }
        if (callback) callback();
      }
    },
  },

  reducers: {
    getLingJian(state, action) {
      return {
        ...state,
        getLingJian: action.payload,
      };
    },
    getAnalyze(state, action) {
      return {
        ...state,
        getAnalyze: action.payload,
      };
    },
    getZone(state, action) {
      return {
        ...state,
        zone: action.payload,
      };
    },
    getHost(state, action) {
      return {
        ...state,
        getHost: action.payload,
      };
    },
    getGroupResult(state, action) {
      return {
        ...state,
        groupResult: action.payload,
      };
    },
    summaryResult(state, action) {
      return {
        ...state,
        summaryResult: action.payload,
      };
    },

    // 清空编辑state
    cleanEditState(state, action) {
      return {
        ...state,
        zone: action.payload,
        getAnalyze: action.payload,
        groupResult: action.payload,
        summaryResult: action.payload,
      };
    },
  },
};
