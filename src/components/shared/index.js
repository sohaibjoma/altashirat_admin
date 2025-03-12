import { app } from "../../myApp/index.js"

//text inputs imports
import TextInput from "./Inputs/textfields/TextInput/index.vue"
import PhoneNum from "./Inputs/textfields/PhoneNum/index.vue"
import PhoneCode from "./Inputs/textfields/PhoneCode/index.vue"
import Password from "./Inputs/textfields/Password/index.vue"
import ConfirmPassword from "./Inputs/textfields/ConfirmPassword/index.vue"
import Select from "./Inputs/Select/index.vue"
import TextArea from "./Inputs/TextArea/index.vue"

app.component("TextInput",TextInput);
app.component("PhoneNum",PhoneNum);
app.component("PhoneCode",PhoneCode);
app.component("Password",Password);
app.component("ConfirmPassword",ConfirmPassword);
app.component("Select", Select);
app.component("TextArea",TextArea);

//buttons and selects imports
import MainButton from './Inputs/buttons/MainButton/index.vue'
import OutlinedButton from './Inputs/buttons/OutlinedButton/index.vue'
import LocaleSelector from './Inputs/LocaleSelector/index.vue'

app.component("MainButton",MainButton)
app.component("OutlinedButton",OutlinedButton)
app.component("LocaleSelector",LocaleSelector)

//inputs imports
import BooleanCheckbox from './Inputs/BooleanCheckbox/index.vue'
import NumberInput from './Inputs/NumberInput/index.vue'
import RangeInput from './Inputs/RangeInput/index.vue'

app.component("BooleanCheckbox",BooleanCheckbox)
app.component("NumberInput",NumberInput)
app.component("RangeInput",RangeInput)

//notifications imports 
import ErrorNotify from './Inputs/notifications/ErrorNotify/index.vue'
import SuccessNotify from './Inputs/notifications/SuccessNotify/index.vue'

app.component("ErrorNotify",ErrorNotify)
app.component("SuccessNotify",SuccessNotify)

//image compponent import
import Image from './Image/index.vue'
app.component("Image",Image)

//
// table import 
import CustomTable from './CustomTable/index.vue'
app.component("CustomTable",CustomTable)

//pagination import
import Pagination from './Pagination/index.vue'
app.component("Pagination",Pagination)


//table actions imports
import DeleteDialog from './DeleteDialog/index.vue'
import EditFiring from './EditFiring/index.vue'
import ToggleVisibility from './ToggleVisibility/index.vue'

app.component("DeleteDialog",DeleteDialog)
app.component("EditFiring",EditFiring)
app.component("ToggleVisibility",ToggleVisibility)


//form imports
import TitlesForm from './TitlesForm/index.vue'
app.component("TitlesForm",TitlesForm)

