const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  companyId: state => state.user.companyId,
  name: state => state.user.name,
  dynRouters: state => state.user.routers,
  dynPermissionBtns: state => state.user.permissionBtns
}
export default getters
