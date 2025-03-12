import { app } from "../../myApp/index.js"

//text inputs imports
import TextInput from "./Inputs/textfields/TextInput/index.vue"
import PhoneNum from "./Inputs/textfields/PhoneNum/index.vue"
import PhoneCode from "./Inputs/textfields/PhoneCode/index.vue"
import Password from "./Inputs/textfields/Password/index.vue"
import ConfirmPassword from "./Inputs/textfields/ConfirmPassword/index.vue"
import TextArea from "./Inputs/TextArea/index.vue"

app.component("TextInput",TextInput);
app.component("PhoneNum",PhoneNum);
app.component("PhoneCode",PhoneCode);
app.component("Password",Password);
app.component("ConfirmPassword",ConfirmPassword);
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


//pagination import


//table actions imports

