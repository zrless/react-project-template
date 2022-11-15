import { notification } from 'antd';
const queryString = require('query-string');

declare global {
  interface Window {
    fetch: any;
  }
}

interface Version {
  v5?: string;
  v6?: string;
}

export const API_VERSION: Version = {
  v5: '/v5',
  v6: '/v6',
};

const DEFAULT_ERROR_MESSAGE = '请求失败! 请稍后重试...';
const VERSION = 'web-3.1.1';
const commonParmas: string = '?v=web-3.1.1-BIZ-OPEN&uniqueid=web';
let errorHandling = false;

const addVersionToUrl = (path: string) => {
  const newPath = path.split('?')[0];
  const { query } = queryString.parseUrl(path);
  const params = queryString.stringify({ ...query, v: VERSION });
  return `${newPath}?${params}`;
};

const handleWarning = (err: any): any => {
  if (!err.silent && !errorHandling) {
    errorHandling = true;

    notification.warning({
      message: '提示',
      description: err,
    });

    setTimeout(() => {
      if (errorHandling) {
        errorHandling = false;
      }
    }, 2000);
  }
};

/**
 *
 * @param path 请求路径
 * @param payload 请求参数 body
 * @returns {Promise<Object.data>} 包含_success键的返回data对象
 */

interface ResultProps {
  data: any | undefined;
  code: string | undefined;
  message: string | undefined | null;
}

function commonRequest(
  prefix: string | undefined,
  path: string,
  payload?: any,
): Promise<ResultProps> {
  const isFormData = Object.prototype.toString.call(payload) === '[object FormData]';
  const headers = {
    'Content-Type': '',
    Authorization: '',
  };
  if (!isFormData) headers['Content-Type'] = 'application/json';

  const method = (payload || {}).method || 'POST';
  const options = { method, headers, body: null };
  if (method !== 'GET') {
    options.body = isFormData ? payload : JSON.stringify(payload);
  }

  const token = window.localStorage.getItem('access_token');
  if (token) options.headers['Authorization'] = token;

  const pathWithCommonParmas = path + commonParmas;
  return window
    .fetch(prefix + '/' + addVersionToUrl(pathWithCommonParmas), options)
    .then(function (response: { status: number; statusText: string | undefined }) {
      if (response.status >= 200 && response.status < 300) return response;
      const error = new Error(response.statusText);
      throw error;
    })
    .then((data: { json: () => any }) => data.json())
    .then((res: { data: any; message: any; code: any }) => {
      let { data, message, code } = res;
      if ((!code || code.toString() !== '200') && +code < 1000) {
        notification.warning({ message: message || path + ' 接口 code：' + code });
      }
      const result: ResultProps = { data, code, message };
      return result;
    })
    .catch(handleWarning);
}

export function requestV5(path: string, payload?: any) {
  return commonRequest(API_VERSION.v5, path, payload);
}

export function requestV6(path: string, payload?: any) {
  return commonRequest(API_VERSION.v6, path, payload);
}
