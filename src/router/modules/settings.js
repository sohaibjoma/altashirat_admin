import allSettings from "../../views/settings/allSettings/index.vue";
import editSettings from "../../views/settings/editSettings/index.vue";
const settingsRoutes = [
  { path: '/settings', component: allSettings, name: 'settings', meta: {
    hidden: true,
  }
  },
  { path: '/settings/:id', component: editSettings, name: 'editSettings', meta: {
    hidden: true,
  }
  },
]

export default settingsRoutes