const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  companyId: state => state.user.companyId,
  name: state => state.user.name
}
export default getters
