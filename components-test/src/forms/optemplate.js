import {bindable, observable} from "aurelia-framework"

export class Optemplate{
/*	@bindable "firstName"
	@bindable "fullName"*/

	firstName = "Unknown";

	constructor(){

	}
	bind(){
		observable(this, 'firstName');
	}

	firstNameChanged(newValue, oldValue){
		console.log('firstName Changed', newValue);
	}
}