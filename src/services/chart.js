import { stringify } from 'qs';
import request from '@/utils/request';

export async function getLingJian(params) {
  return request(`/api/find.part_style?${stringify(params)}`);
}

export async function getAnalyze(params) {
  console.log(params);
  // return request(`/api/analyze?${stringify(params)}`);
  // return request('/api/analyze', {
  //   method: 'POST',
  //   body: params,
  // });
}

export async function getZone(params) {
  // return request(`/api/find.zone_info?${stringify(params)}`);
  return request('/api/find.zone_info', {
    method: 'POST',
    body: params,
  });
}

export async function getGroupResult(params) {
  // return request(`/api/group_result?${stringify(params)}`);
  return request('/api/group_result', {
    method: 'POST',
    body: params,
  });
}

export function getlanguage() {
  return request(`/api/find.language`);
}

export async function getHost(params) {
  return request(`/api/find.host?${stringify(params)}`);
}

export async function summaryResult(params) {
  return request('/api/summary_result', {
    method: 'POST',
    body: params,
  });
}

export async function getContrastAnalyze(params) {
  console.log(params);
  // return request('/api/analyze', {
  //   method: 'POST',
  //   body: params,
  // });
}

export async function getContrastZone(params) {
  return request('/api/find.zone_info', {
    method: 'POST',
    body: params,
  });
}

export async function findFail(params) {
  return request(`/api/find.fail_result?page=${params.page}`, {
    method: 'POST',
    body: params.parm,
  });
}

export async function sameName(params) {
  return request('/api/check.duplicate_scan', {
    method: 'POST',
    body: params,
  });
}
