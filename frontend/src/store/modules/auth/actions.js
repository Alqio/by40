/* ============
 * Actions for the auth module
 * ============
 *
 * The actions that are available on the
 * auth module.
 */

import Vue from 'vue';
import AuthProxy from '../../../proxies/AuthProxy';
import * as types from './mutation-types';

export const check = ({ commit }) => {
  commit(types.CHECK);
};

export const register = ({ commit }, payload) => {
  new AuthProxy()
    .register(payload)
    .then((response) => {
      commit(types.LOGIN, response.id_token);
      Vue.router.push({
        name: 'home.index',
      });
    })
    .catch(() => {
    });
};

export const login = ({ commit }, payload) => {
  new AuthProxy()
    .login(payload)
    .then((response) => {
      commit(types.LOGIN, response.id_token);
      Vue.router.push({
        name: 'home.index',
      });
    }).catch(() => {
    });
};

export const logout = ({ commit }) => {
  commit(types.LOGOUT);
};

export default {
  check,
  register,
  login,
  logout,
};
