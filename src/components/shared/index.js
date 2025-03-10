import { app } from "../../myApp/index.js"

//text inputs imports
import TextInput from "./Inputs/textfields/TextInput/index.vue"
import PhoneNum from "./Inputs/textfields/PhoneNum/index.vue"
import PhoneCode from "./Inputs/textfields/PhoneCode/index.vue"
import Password from "./Inputs/textfields/Password/index.vue"
import ConfirmPassword from "./Inputs/textfields/ConfirmPassword/index.vue"


app.component("TextInput",TextInput);
app.component("PhoneNum",PhoneNum);
app.component("PhoneCode",PhoneCode);
app.component("Password",Password);
app.component("ConfirmPassword",ConfirmPassword);

//buttons and selects imports
import MainButton from './Inputs/buttons/MainButton/index.vue'
import OutlinedButton from './Inputs/buttons/OutlinedButton/index.vue'

app.component("MainButton",MainButton)
app.component("OutlinedButton",OutlinedButton)


//notifications imports 
import ErrorNotify from './Inputs/notifications/ErrorNotify/index.vue'
import SuccessNotify from './Inputs/notifications/SuccessNotify/index.vue'

app.component("ErrorNotify",ErrorNotify)
app.component("SuccessNotify",SuccessNotify)

// table import 


//pagination import


//table actions imports

