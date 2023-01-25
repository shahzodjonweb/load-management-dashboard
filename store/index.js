export const state = () => ({
  pageHeader: "",
  user: {
    id: "",
    name: "",
    email: "",
    phone: "",
    company: null,
    has_company: false,
  },
  refresh: 0,
});

export const mutations = {
  setHeader(state, payload) {
    state.pageHeader = payload;
  },
  setUser(state, payload) {
    state.user = payload;
  },
  refreshPage(state) {
    state.refresh++;
  },
};
