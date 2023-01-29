const getters ={
  account: (state: any) => state.user.account,
  token: (state: any) => state.user.token,
  roles: (state: any) => state.user.roles,
  home_animate: (state: any) => state.user.home_animate
}

export default getters