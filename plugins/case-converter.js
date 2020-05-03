export const convertCase = (key) => {
  return key.replace(/([A-Z])/g, '_$1').toLowerCase()
}
