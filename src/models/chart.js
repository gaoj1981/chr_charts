import { isResOK } from '@/utils/BizUtil';
import {
  getLingJian,
  getZone,
  getAnalyze,
  getGroupResult,
  getHost,
  summaryResult,
  getContrastZone,
  getContrastAnalyze,
  getlanguage,
  findFail,
  sameName,
} from '@/services/chart';

const servToReduce = {
  getLingJian: { method: getLingJian, reduce: 'getLingJian' },
  getZone: { method: getZone, reduce: 'getZone' },
  getAnalyze: { method: getAnalyze, reduce: 'getAnalyze' },
  getGroupResult: { method: getGroupResult, reduce: 'getGroupResult' },
  getHost: { method: getHost, reduce: 'getHost' },
  summaryResult: { method: summaryResult, reduce: 'summaryResult' },
  getContrastZone: { method: getContrastZone, reduce: 'getContrastZone' },
  getContrastAnalyze: { method: getContrastAnalyze, reduce: 'getContrastAnalyze' },
  getlanguage: { method: getlanguage, reduce: 'getlanguage' },
  findFail: { method: findFail, reduce: 'findFail' },
  sameName: { method: sameName, reduce: 'sameName' },
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
    contrastZone: {},
    getContrastAnalyze: [],
    getlanguage: '',
    findFail: {},
    sameName: {},
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
    getContrastAnalyze(state, action) {
      const parm = [];
      state.contrastZone.forEach((v, k) => {
        console.log(v);
        if (v !== 0) {
          if (state.getContrastAnalyze[k]) {
            parm.push(state.getContrastAnalyze[k]);
          } else {
            parm.push(action.payload);
          }
        } else {
          parm.push([]);
        }
      });
      return {
        ...state,
        getContrastAnalyze: parm,
      };
    },
    getContrastZone(state, action) {
      let parm = null;
      if (state.contrastZone[0] === undefined) {
        if (action.payload[0]) {
          parm = action.payload;
        } else {
          parm = [0];
        }
      } else {
        parm = [];
        state.contrastZone.forEach(v => {
          parm.push(v);
        });
        if (action.payload[0]) {
          const [index] = action.payload;
          parm.push(index);
        } else {
          const index = 0;
          parm.push(index);
        }
      }
      return {
        ...state,
        contrastZone: parm,
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

    findFail(state, action) {
      return {
        ...state,
        findFail: action.payload,
      };
    },

    sameName(state, action) {
      return {
        ...state,
        sameName: action.payload,
      };
    },

    getlanguage(state, action) {
      return {
        ...state,
        getlanguage: action.payload,
      };
    },

    // 清空编辑state
    cleanEditState(state, action) {
      return {
        ...state,
        zone: action.payload,
        getAnalyze: action.payload,
        contrastZone: action.payload,
        getContrastAnalyze: action.payload,
        groupResult: action.payload,
        summaryResult: action.payload,
      };
    },
  },
};
