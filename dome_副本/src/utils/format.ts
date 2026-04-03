/**
 * 手机号脱敏处理（TS 版，类型安全）
 * @param phone - 原始手机号（支持字符串/数字类型，允许空值）
 * @returns 脱敏后的手机号（非11位返回原数据，空值返回原空值）
 */
export const formatPhone = (
  phone: string | number | undefined | null
): string | undefined | null => {
  // 空值直接返回（TS 类型守卫，避免后续处理报错）
  if (phone === undefined || phone === null) return phone;
  
  // 统一转为字符串处理（兼容数字类型，同时保证类型）
  const phoneStr = String(phone).trim();
  
  // 校验 11 位纯数字手机号（TS 类型窄化，确保逻辑安全）
  const phoneReg = /^(\d{3})\d{4}(\d{4})$/;
  if (phoneReg.test(phoneStr)) {
    return phoneStr.replace(phoneReg, '$1****$2');
  }
  
  // 非 11 位手机号返回原字符串（保证类型一致性）
  return phoneStr;
};