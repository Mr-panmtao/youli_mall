import { Base64 } from 'js-base64'

// 加严
const salting = 'admin-authority'

// 加密
const encryptString = name => {
  return Base64.encode(name + salting)
}

// 解密
const decodeString = name => {
  const decodeName = Base64.decode(name) || ''

  if (
    decodeName &&
    decodeName.split &&
    decodeName.split(salting) &&
    decodeName.split(salting)[0]
  ) {
    return decodeName.split(salting)[0]
  } else {
    return ''
  }
}

export { encryptString, decodeString }
