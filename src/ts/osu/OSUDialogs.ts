import TestDialog from "../../components/dialogs/TestDialog.vue";
import {OSUDialog} from "./OSUDialogStack";


export class OSUDialogs {

  public static testDialog = new OSUDialog('test', TestDialog)
}