import CryptoJS from 'crypto-js';

export function isMD5(params: any) {
  let paramsText = '';
  if (params) {
    Object.keys(params).sort().map(key => {
      if (params[key] !== '' && params[key] !== null && params[key] !== undefined) {
        paramsText += params[key]
      }
    })
  } else {
    paramsText = ''
  }
  const key = 'CdO23vdMos23f9l3d2*z2'
  const date = Date.parse(String(new Date())) / 1000 >> 0
  const sign = CryptoJS.MD5( paramsText + date + key ).toString()
  const data = Object.assign({
    sign,
    stime: date,
  }, params)

  return data
}