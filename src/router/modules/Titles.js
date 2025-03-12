import record from "../../views/titles/record/index.vue"
import actions from "../../views/titles/actions/index.vue"
import {t } from "../../plugins/I18n/index"

const TitlesRoutes = [
  { path: '/titles', component: record, name: 'TitleRecord' ,meta:{
    hidden: false,
    title: t("drawer.titles")
  } },
  { path: '/titles/actions', component: actions, name: 'Titleactions' ,meta:{
    hidden: true
  }},
  { path: '/titles/actions/:id', component: actions, name: 'EditAction' ,meta:{
    hidden: true
  }}

]

export default TitlesRoutes;