const isJSONString = (str: string): boolean => {
  if (typeof str !== 'string') return false;

  try {
    const parsed = JSON.parse(str);
    return typeof parsed === 'object' && parsed !== null;
  } catch (e) {
    return false;
  }
}

export {
  isJSONString,
}