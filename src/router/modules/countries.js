import countriesRecord from "../../views/countries/record/index.vue";
import { t } from "../../plugins/I18n/index";

const CountriesRoutes = [
  {
    path: "/countries",
    component: countriesRecord,
    name: "CountryRecord",
    meta: {
      hidden: false,
      title: t("drawer.countries"),
    },
  },
];

export default CountriesRoutes;
