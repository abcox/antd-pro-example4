import { Effect, Reducer } from 'umi';

import { TableListItem } from './data.d';
import { queryRule, updateRule, addRule, removeRule } from './service';

export interface StateType {
  list: TableListItem[];
}

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetch: Effect;
    appendFetch: Effect;
    submit: Effect;
  };
  reducers: {
    queryList: Reducer<StateType>;
    appendList: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'rule',

  state: {
    list: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryRule, payload);
      // console.log(`${Model.namespace}/fetch response: `, response);
      yield put({
        type: 'queryList',
        payload: Array.isArray(response.data) ? response.data : [],
      });
    },
    *appendFetch({ payload }, { call, put }) {
      const response = yield call(queryRule, payload);
      yield put({
        type: 'appendList',
        payload: Array.isArray(response) ? response : [],
      });
    },
    *submit({ payload }, { call, put }) {
      // console.log(`${Model.namespace}/submit payload: `, payload);
      let callback;
      if (payload.key) {
        callback = Object.keys(payload).length === 1 ? removeRule : updateRule;
      } else {
        callback = addRule;
      }
      // console.log(`${Model.namespace}/submit callback(name): `, callback.toString());
      const response = yield call(callback, payload); // post
      // console.log(`${Model.namespace}/submit response: `, response);
      yield put({
        type: 'queryList',
        payload: response,
      });
    },
  },

  reducers: {
    queryList(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    appendList(state = { list: [] }, action) {
      return {
        ...state,
        list: state.list.concat(action.payload),
      };
    },
  },
};

export default Model;
