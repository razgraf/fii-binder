/**
 * Created by razvan on 17/03/2018.
 */

const INPUT_DANGER_SMALL = 1;
const INPUT_DANGER_BIG = 2;


const INPUT_TYPE_CHECK = 1;
const INPUT_TYPE_TEXT = 2;
const INPUT_TYPE_NUMBER = 3;
const INPUT_TYPE_DATE = 4;
const INPUT_TYPE_OPTION = 5;
const INPUT_TYPE_RADIO = 6;
const INPUT_TYPE_IMAGE = 7;

const INPUT_KEY_ELEMENT = "element";

const INPUT_KEY_INITIALIZED = "initialized";
const INPUT_KEY_PARENT = "parent";
const INPUT_KEY_GRANDPARENT = "grandparent";
const INPUT_KEY_ID = "ID";
const INPUT_KEY_CLASS  = "class";
const INPUT_KEY_NAME = "name";

const INPUT_KEY_VALUE = "value";
const INPUT_KEY_TYPE = "type";
const INPUT_KEY_DANGER  = "danger";
const INPUT_KEY_SOURCE = "source";

const INPUT_KEY_MAXLENGTH = "maxlength";
const INPUT_KEY_PLACEHOLDER = "placeholder";

const INPUT_KEY_EXTRA_DATA = "data";
const INPUT_KEY_LABEL = "label";


const INPUT_FLAG_NORMAL = 91;
const INPUT_FLAG_SELECT_REQUIRE_EXTRA = 92;


const INPUT_KEY_CALLBACK = "callback";
const INPUT_KEY_CUSTOM = "custom";


class Input{
    get callback() {
        return this._callback;
    }

    set callback(value) {
        this._callback = value;
    }
    get custom() {
        return this._custom;
    }

    set custom(value) {
        this._custom = value;
    }
    get flag() {
        return this._flag;
    }

    set flag(value) {
        this._flag = value;
    }


    get isGroup() {
        return this._isGroup;
    }

    set isGroup(value) {
        this._isGroup = value;
    }

    get extraData() {
        return this._extraData;
    }

    set extraData(value) {
        this._extraData = value;
    }
    get value() {
        return this._value;
    }

    set value(value) {
        this._value = value;
    }
    get maxlength() {
        return this._maxlength;
    }

    set maxlength(value) {
        this._maxlength = value;
    }
    get placeholder() {
        return this._placeholder;
    }

    set placeholder(value) {
        this._placeholder = value;
    }
    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }
    get class() {
        return this._class;
    }

    set class(value) {
        this._class = value;
    }
    get ID() {
        return this._ID;
    }

    set ID(value) {
        this._ID = value;
    }
    get label() {
        return this._label;
    }

    set label(value) {
        this._label = value;
    }
    get element() {
        return this._element;
    }

    set element(value) {
        this._element = value;
    }
    get type() {
        return this._type;
    }

    set type(value) {
        this._type = value;
    }
    get parent() {
        return this._parent;
    }

    set parent(value) {
        this._parent = value;
    }
    get initialized() {
        return this._initialized;
    }

    set initialized(value) {
        this._initialized = value;
    }
    get danger() {
        return this._danger;
    }

    set danger(value) {
        this._danger = value;
    }


    /**
     *
     * @returns {Array}
     */
    get source() {
        return this._source;
    }

    /**
     *
     * @param {Array} value
     */
    set source(value) {
        this._source = value;
    }
    /**
     *
     * @param {Object} object
     */
    constructor(object){

        this.isGroup = false;
        this.custom = ClassHelper.getValue(object, INPUT_KEY_CUSTOM) ? ClassHelper.getValue(object, INPUT_KEY_CUSTOM) : false;
        this.flag = INPUT_FLAG_NORMAL;
        this.initialized = ClassHelper.getValue(object,INPUT_KEY_INITIALIZED) ? ClassHelper.getValue(object,INPUT_KEY_INITIALIZED) : false;
        this.parent = ClassHelper.getValue(object,INPUT_KEY_PARENT);
        this.type = ClassHelper.getValue(object, INPUT_KEY_TYPE);


        if(this.initialized){
            this.element = ClassHelper.getValue(object, INPUT_KEY_ELEMENT);
            this.label = this.element.siblings("p").text();
            this.ID = this.element.attr("id") !== null && this.element.attr("id") !== undefined ? this.element.attr("id") : null;
            this.class = this.element.attr("class") !== null && this.element.attr("_class") !== undefined ? this.element.attr("_class") : null;
            this.name = this.element.attr("name") !== null && this.element.attr("name") !== undefined ? this.element.attr("name") : null;
            this.placeholder = this.element.attr("placeholder") !== null && this.element.attr("placeholder") !== undefined ? this.element.attr("placeholder") : null;
            this.maxlength = this.element.attr("maxlength") !== null && this.element.attr("maxlength") !== undefined ? this.element.attr("maxlength") : null;
            this.value = this.element.val();
        }
        else if(this.parent) {

            this.ID = ClassHelper.getValue(object, INPUT_KEY_ID);
            this.class = ClassHelper.getValue(object, INPUT_KEY_CLASS);
            this.name = ClassHelper.getValue(object, INPUT_KEY_NAME);
            this.extraData = ClassHelper.getValue(object, INPUT_KEY_EXTRA_DATA);
            this.placeholder = ClassHelper.getValue(object, INPUT_KEY_PLACEHOLDER);
            this.maxlength = ClassHelper.getValue(object, INPUT_KEY_MAXLENGTH);
            this.value = ClassHelper.getValue(object, INPUT_KEY_VALUE);
            this.label = ClassHelper.getValue(object, INPUT_KEY_LABEL);
        }


        this.danger = ClassHelper.getValue(object,INPUT_KEY_DANGER);
        this.callback = object.hasOwnProperty("callback") ? object["callback"] : null;
        this.source = ClassHelper.getArray(object, INPUT_KEY_SOURCE);

        this.restore();
    }




    restore(){
        try {if (this.element && this.element.length > 0 && this.element.hasClass("warn")) this.element.removeClass("warn");}
        catch (elementMissingError){}
    };

    warn(){
        try {if (this.element && this.element.length > 0 && ! this.element.hasClass("warn")) this.element.addClass("warn");}
        catch (elementMissingError){}
    };


    getValueFromElement(){
        return this.element && this.element.length > 0 ? this.element.val() : null;
    }

    getSanitizedValues(){

        let object = {};
        object.ID =  this.ID ? ' id="'+this.ID+'" ' : '';
        object.class = this.class ? ' class="'+this.class+'" ' : '';
        object.name = this.name ? ' name="'+this.name+'" ' : '';
        object.extraData = this.extraData ? ' '+this.extraData + ' ' : '';
        object.placeholder = this.placeholder ? this.placeholder : 'Fill in here...';
        object.value = this.value ? this.value : '';
        object.label = this.label ? this.label : 'Unlabeled';
        object.maxlength = this.maxlength ? 'maxlength="'+this.maxlength+'"' : '';


        return object;
    }

}







class TextInput extends Input{
    get ckeditor() {
        return this._ckeditor;
    }

    set ckeditor(value) {
        this._ckeditor = value;
    }
    get color() {
        return this._color;
    }

    set color(value) {
        this._color = value;
    }

    get area() {
        return this._area;
    }

    set area(value) {
        this._area = value;
    }

    /**
     *
     * @param {Object} object will say if the input is custom-data / create dynamically (e.g. Bank Name) and not standardized (e.g. First Name/Birthday)
     */
    constructor(object) {
        super(object);
        this.type = INPUT_TYPE_TEXT;
        this.area = !!ClassHelper.getValue(object, "area");
        this.color = ClassHelper.isDataSetInObject("color", object);
        this.ckeditor = ClassHelper.isDataSetInObject("ckeditor",object);
        if (this.parent && !this.initialized) this.standardPrint();
        if(this.callback) this.callback(this);

    }



    standardPrint() {

        let O = this.getSanitizedValues();

        if(this.ckeditor) {
            let code = '<div class="input"> ' +
                '<textarea ' + O.ID + ' ' + O.class + ' ' + O.name + ' ' + O.extraData + '></textarea> ' +
                '<label for="' + this.ID + '"></label> ' +
                '<p></p> ' +
                '</div>';

            this.parent.append(code);
            if (this.parent.find($("#" + this.ID))) {
                this.initialized = true;
                this.element = this.parent.find($("#" + this.ID));
                this.element.siblings("p").text(O.label);

                let self = this;

                try {
                    self.ckeditor = CKEDITOR.replace(self.ID,{height: 600,});
                    self.ckeditor.setData(ClassHelper.sanitize(self.value));
                }catch(err){
                    console.error(err);
                    self.ckeditor = null;
                }

            }
        }
        else {

            let code = '<div class="input"> ' +
                (this.area ?
                        '<textarea  data-gramm_editor="false"  type="text"  ' + O.ID + ' ' + O.class + ' ' + O.name + ' ' + O.extraData + ' ' + O.maxlength + '  placeholder="' + O.placeholder + '"></textarea> ' :
                        '<input  type="' + (this.color === true ? "color" : "text") + '"  ' + O.ID + ' ' + O.class + ' ' + O.name + ' ' + O.extraData + ' ' + O.maxlength + ' value=""   placeholder="' + (this.color ? "" : O.placeholder) + '"/> '

                ) +
                '<label for="' + this.ID + '"></label> ' +
                '<p></p> ' +
                '</div>';

            this.parent.append(code);
            if (this.parent.find($("#" + this.ID))) {
                this.initialized = true;
                this.element = this.parent.find($("#" + this.ID));
                this.element.siblings("p").text(O.label);
                this.element.val(O.value);
            }
        }
    }




    getValueFromElement(){
        return (!ClassHelper.isEmpty(this.ckeditor) && this.ckeditor) ? JSON.stringify(this.ckeditor.getData()) :  (this.element && this.element.length > 0 ? this.element.val() : null);
    }



}

class DateInput extends Input{

    constructor(object) {
        super(object);
        this.type = INPUT_TYPE_DATE;
        if (this.parent && !this.initialized) this.standardPrint();
        if(this.callback) this.callback(this);
    }


    standardPrint() {

        let O = this.getSanitizedValues();

        let code =  '<div class="input"> ' +
            '<input type="date"  '+O.ID+' '+O.class+' '+O.name+' '+O.extraData+'  '+O.maxlength+' value=""   placeholder="'+O.placeholder+'"/> ' +
            '<label for="'+this.ID+'"></label> ' +
            '<p></p> ' +
            '</div>';

        this.parent.append(code);

        if(this.parent.find($("#"+this.ID))) {
            this.initialized = true;
            this.element = this.parent.find($("#"+this.ID));
            this.element.siblings("p").text(O.label);
            this.element.val(O.value);
        }
    }

    getValueFromElement(){
        return this.element && this.element.length > 0 ? this.element.val() : null;
    }



}
class NumberInput extends Input{
    get isPhone() {
        return this._isPhone;
    }

    set isPhone(value) {
        this._isPhone = value;
    }

    constructor(object) {
        super(object);
        this.type = INPUT_TYPE_NUMBER;
        this.isPhone = ClassHelper.getValue(object,"isPhone");
        if (this.parent && !this.initialized) this.standardPrint();
        if(this.callback) this.callback(this);
    }


    standardPrint() {

        let O = this.getSanitizedValues();

        let code =  '<div class="input"> ' +
            '<input type="'+(this.isPhone ? "tel" : "number") +'" '+O.ID+' '+O.class+' '+O.name+' '+O.extraData+'  '+O.maxlength+' pattern="[0-9.]+"  value=""   placeholder="'+O.placeholder+'"/> ' +
            '<label for="'+this.ID+'"></label> ' +
            '<p></p> ' +
            '</div>';

        this.parent.append(code);

        if(this.parent.find($("#"+this.ID))) {
            this.initialized = true;
            this.element = this.parent.find($("#"+this.ID));
            this.element.siblings("p").text(O.label);
            this.element.val(O.value);
        }
    }


    getValueFromElement(){
        return this.element && this.element.length > 0 ? this.element.val() : null;
    }



}
NumberInput.prototype.check = function(){
    let value = this.value;
    return (value!==null && value.match(/^[0-9]+$/) !== null);
};
NumberInput.prototype.checkPhoneNumber = function(){
    let value = this.value;
    return (value!==null && value.match(/^\+?[0-9]{3}-?[0-9]{6,12}$/));
};



class CheckboxGroup extends ClassHelper{
    get initial() {
        return this._initial;
    }

    set initial(value) {
        this._initial = value;
    }
    get label() {
        return this._label;
    }

    set label(value) {
        this._label = value;
    }
    get danger() {
        return this._danger;
    }

    set danger(value) {
        this._danger = value;
    }

    get element() {
        return this._element;
    }

    set element(value) {
        this._element = value;
    }
    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }
    get parent() {
        return this._parent;
    }

    set parent(value) {
        this._parent = value;
    }
    get isGroup() {
        return this._isGroup;
    }

    set isGroup(value) {
        this._isGroup = value;
    }

    get boxes() {
        return this._boxes;
    }

    set boxes(value) {
        this._boxes = value;
    }

    constructor(parent,name,label,initial,boxes = [], element = null, danger = INPUT_DANGER_BIG){
        super();
        this.isGroup = true;
        this.parent = parent;
        this.name = name;
        this.danger = danger;
        this.label = label;
        this.initial = initial;

        if(element !== null && element.length > 0) this.element = element;
        else this.standardPrint();


        this.boxes = [];
        for(let i = 0; i < boxes.length; i++){
            boxes[i][INPUT_KEY_PARENT] = this.element.find(".container");
            boxes[i][INPUT_KEY_NAME] = this.name;
            boxes[i][INPUT_KEY_DANGER] = this.danger;
            this.boxes.push(new CheckboxInput(boxes[i]));
        }

        if(this.initial && this.initial.length > 0)for(let i=0; i < this.initial.length; i++){
            this.element.find('input[type="checkbox"][name="'+this.name+'"][value="'+this.initial[i]+'"]').attr('checked','checked');
        }

        if(this.callback) this.callback(this);

    }


    getValueFromElement(){
        if(this.element && this.element > 0){
            let values = [];
            this.element.find("input[type='checkbox'][data-name='"+this.name+"']:checked").each(function(){
                let choice = $(this);
                if(choice && choice.length > 0 && choice.val() !== null && choice.val().length !== 0) values.push(choice.val());
            });
            if(values && values.length > 0) return values;
        }
        return null;
    }


    standardPrint(){
        if(this.parent && this.name) {
            let code = '<div data-name ="' + this.name + '" class="group-checkbox"><p>'+this.label+'</p><div class="container"></div></div>';
            this.parent.append(code);

            this.element = this.parent.find(".group-checkbox[data-name='"+this.name+"']");
        }
    }



    restore(){
        try {if (this.element && this.element.length > 0 && this.element.hasClass("warning")) this.element.removeClass("warning");}
        catch (elementMissingError){}
    };

    warn(){
        try {if (this.element && this.element.length > 0 && ! this.element.hasClass("warning")) this.element.addClass("warning");}
        catch (elementMissingError){}
    };


}
class CheckboxInput extends Input{

    constructor(object) {
        super(object);
        if (this.parent && !this.initialized) this.standardPrint();
    }


    standardPrint() {

        let O = this.getSanitizedValues();

        let code =  '<div class="checkbox"> ' +
            '<input type="checkbox"  '+O.ID+' '+O.class+' '+O.name+' '+O.extraData+'  '+O.maxlength+' value=""   placeholder="'+O.placeholder+'"/> ' +
            '<label for="'+this.ID+'"></label> ' +
            '<p></p> ' +
            '</div>';

        this.parent.append(code);

        if(this.parent.find($("#"+this.ID))) {
            this.initialized = true;
            this.element = this.parent.find($("#"+this.ID));
            this.element.siblings("p").text(O.label);
            this.element.val(O.value);
        }
    }


    getValueFromElement(){
        return this.element && this.element.length > 0 ? this.element.val() : null;
    }





}



class RadioGroup extends ClassHelper{
    get callback() {
        return this._callback;
    }

    set callback(value) {
        this._callback = value;
    }
    get initial() {
        return this._initial;
    }

    set initial(value) {
        this._initial = value;
    }
    get ID() {
        return this._ID;
    }

    set ID(value) {
        this._ID = value;
    }
    get label() {
        return this._label;
    }

    set label(value) {
        this._label = value;
    }
    get danger() {
        return this._danger;
    }

    set danger(value) {
        this._danger = value;
    }

    get element() {
        return this._element;
    }

    set element(value) {
        this._element = value;
    }
    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }
    get parent() {
        return this._parent;
    }

    set parent(value) {
        this._parent = value;
    }
    get isGroup() {
        return this._isGroup;
    }

    set isGroup(value) {
        this._isGroup = value;
    }

    get boxes() {
        return this._boxes;
    }

    set boxes(value) {
        this._boxes = value;
    }


    constructor(nameID, parent, label, initial,boxes = [], element = null, danger = INPUT_DANGER_BIG, callback = null){
        super();
        this.ID = nameID;
        this.isGroup = true;
        this.parent = parent;
        this.name = nameID;
        this.danger = danger;
        this.label = label;
        this.initial = initial;
        this.callback = callback;

        if(element !== null && element.length > 0) this.element = element;
        else this.standardPrint();


        this.boxes = [];
        for(let i = 0; i < boxes.length; i++){
            boxes[i][INPUT_KEY_PARENT] = this.element.find(".container");
            boxes[i][INPUT_KEY_NAME] = this.name;
            boxes[i][INPUT_KEY_DANGER] = this.danger;
            this.boxes.push(new RadioInput(boxes[i]));
        }

        this.element.find('input[type="radio"][name="'+this.name+'"][value="'+this.initial+'"]').attr('checked','checked');
        if(this.callback && typeof this.callback === 'action') this.callback(this);

    }

    getValueFromElement(){
        if(this.element && this.element.length > 0){
            let choice =  this.element.find("input[type='radio'][name='"+this.name+"']:checked");
            if(choice && choice.length > 0) return choice.val();
        }
        return null;
    }


    standardPrint(){
        if(this.parent && this.name) {
            let code = '<div data-name ="' + this.name + '" class="group-radio"><p>'+this.label+'</p><div class="container"></div></div>';
            this.parent.append(code);

            this.element = this.parent.find(".group-radio[data-name='"+this.name+"']");
        }
    }


    restore(){
        try {if (this.element && this.element.length > 0 && this.element.hasClass("warning")) this.element.removeClass("warning");}
        catch (elementMissingError){}
    };

    warn(){
        try {if (this.element && this.element.length > 0 && ! this.element.hasClass("warning")) this.element.addClass("warning");}
        catch (elementMissingError){}
    };

}
class RadioInput extends Input{

    constructor(object) {
        super(object);
        if (this.parent && !this.initialized) this.standardPrint();
        if(this.callback) this.callback(this);
    }


    standardPrint() {

        let O = this.getSanitizedValues();

        let code =  '<div class="radio"> ' +
            '<input type="radio"  '+O.ID+' '+O.class+' '+O.name+' '+O.extraData+'  '+O.maxlength+' value=""   placeholder="'+O.placeholder+'"/> ' +
            '<label for="'+this.ID+'"></label> ' +
            '<p></p> ' +
            '</div>';

        this.parent.append(code);

        if(this.parent.find($("#"+this.ID))) {
            this.initialized = true;
            this.element = this.parent.find($("#"+this.ID));
            this.element.siblings("p").text(O.label);
            this.element.val(O.value);
        }
    }


    getValueFromElement(){
        return this.element && this.element.length > 0 ? this.element.val() : null;
    }



}



class SelectInput extends Input{


    constructor(object) {
        super(object);
        if (this.parent && !this.initialized) this.standardPrint();
        if(this.callback) this.callback(this);
    }


    standardPrint() {

        let O = this.getSanitizedValues();
        if(O.name) O.name = "data-"+O.name;

        let code =  '<div class="select"> ' +
            '<select '+O.ID+' '+O.class+' '+O.name+' '+O.extraData+'></select> ' +
            '<label for="'+this.ID+'"></label> ' +
            '<p></p> ' +
            '</div>';

        this.parent.append(code);

        if(this.parent.find($("#"+this.ID))) {
            this.initialized = true;
            this.element = this.parent.find($("#"+this.ID));
            this.element.siblings("p").text(O.label);
            if(this.source && this.source.length > 0)for(let i=0; i < this.source.length; i++){
                this.element.append("<option value='"+this.source[i].value+"'>"+this.source[i].name+"</option>");
            }
            this.element.find("option[value='"+this.value+"']").attr('selected', 'selected');
        }
    }


    getValueFromElement(){
        return this.element && this.element.length > 0 ? this.element.find("option:selected").val() : null;
    }


    changeSource(newSource){
        if(this.source && this.source.length > 0)for(let i=0; i < this.source.length; i++){
            this.source = newSource;
            this.element.html("");
            this.element.append("<option value='"+this.source[i].value+"'>"+this.source[i].name+"</option>");
        }
    }


    restore(){
        try {
            if(this.flag === INPUT_FLAG_SELECT_REQUIRE_EXTRA){
                if (this.child && this.child.element && this.child.element.length > 0 && this.child.element.hasClass("warn")) this.child.element.removeClass("warn");
            }else  if (this.element && this.element.length > 0 && this.element.hasClass("warn")) this.element.removeClass("warn");
        }
        catch (elementMissingError){}
    };

    warn(){
        try {
            if(this.flag === INPUT_FLAG_SELECT_REQUIRE_EXTRA) {
                if (this.child && this.child.element && this.child.element.length > 0 && ! this.child.element.hasClass("warn")) this.child.element.addClass("warn");
            }
            else if (this.element && this.element.length > 0 && ! this.element.hasClass("warn")) this.element.addClass("warn");}
        catch (elementMissingError){}
    };

}


class SelectInputCustom extends Input{


    constructor(object) {
        super(object);
        if (this.parent && !this.initialized) this.standardPrint();
        if(this.callback) this.callback(this);
    }


    standardPrint() {

        let O = this.getSanitizedValues();
        if(O.name) O.name = "data-"+O.name;

        let code =  '<div class="select"> ' +
            '<input  type="text" list="list-'+this.ID+'"  '+O.ID+' '+O.class+' '+O.name+' '+O.extraData+' '+O.maxlength+' value="" placeholder="'+O.placeholder+'"/> '+
            '<datalist id="list-'+this.ID+'"></datalist>'+
            '<label for="'+this.ID+'"></label> ' +
            '<p></p> ' +
            '</div>';

        this.parent.append(code);

        if(this.parent.find($("#"+this.ID))) {
            this.initialized = true;
            this.element = this.parent.find($("#"+this.ID));
            this.element.val(O.value);
            this.element.siblings("p").text(O.label);
            if(this.source && this.source.length > 0)for(let i=0; i < this.source.length; i++){
                this.element.siblings("datalist").append("<option value='"+this.source[i].value+"'>"+this.source[i].name+"</option>");
            }
        }
    }


    getValueFromElement(){
        return this.element && this.element.length > 0 ? this.element.val() : null;
    }


}

function parseWorldRaceForSelectInput(){
    let list = WORLD_RACE;
    for(let i=0; i < list.length; i++){
        list[i].name = list[i].hasOwnProperty("custom") && list[i].custom === true ? list[i].parent + " - Other" : list[i].parent + " - " +list[i].name;
        list[i].value = list[i].ID;
    }
    return list;
}

function parseCountryCodesForSelectInput(){
    let list = countryCodes;
    for(let i=0; i < list.length; i++){
        list[i].name = list[i]["country_en"];
        list[i].value =  list[i].name;
    }
    return list;
}


function parseStatusForSelectInput(){
    let list = EMPLOYEE_STATUS;
    for(let i=0; i < list.length - 1; i++){
        list[i].value =  list[i].ID;
    }
    return list;
}






class ImageInput extends Input{
    get changed() {
        return this._changed;
    }

    set changed(value) {
        this._changed = value;
    }

    get grandparent() {
        return this._grandparent;
    }

    set grandparent(value) {
        this._grandparent = value;
    }

    get preview() {
        return this._preview;
    }

    set preview(value) {
        this._preview = value;
    }



    constructor(object) {
        super(object);
        this.type = INPUT_TYPE_IMAGE;
        this.changed = false;
        if (this.parent && !this.initialized) this.standardPrint();
    }


    standardPrint() {

        let O = this.getSanitizedValues();

        if(O.name) O.name = "data-"+O.name;

        let code =
            ' <div class="upload" data-id="'+this.ID+'"> ' +
            '<div class="upload-container"> ' +
            '<div class="picture"> ' +
            '<input type="file" '+O.ID+' '+O.class+' '+O.name+' '+O.extraData+'  accept="image/png,image/jpg,image/jpeg" title="'+O.label+'"/> ' +
            '<img src="'+PATH_DEFAULT_PICTURE+'" /> ' +
            '</div> ' +
            '</div> ' +
            '<div class="upload-action"> ' +
            '<div class="upload-button"><span>Alege</span></div> ' +
            '<div class="upload-button-remove"><span>Șterge</span></div> ' +
            '</div> ' +
            '<p>'+O.label+'</p> ' +
            '</div>';

        this.parent.append(code);

        if(this.parent.find($("#"+this.ID))) {
            this.initialized = true;
            this.element = this.parent.find($("#"+this.ID));
            this.preview = this.element.siblings("img");
            this.grandparent = this.parent.find($(".upload[data-id='"+this.ID+"']"));
            if(this.value){
                if(this.preview.length > 0) {
                    ClassHelper.bindPicture(this.preview, this.value);
                }
                this.element.val("");
            }
        }

        this.init();
    }



    getValueFromElement(){
        return ((this.element &&
        this.element.length > 0 &&
        this.element[0].files !== null &&
        this.element[0].files.length > 0 &&
        this.element[0].files[0] !== null &&
        this.element[0].files[0] !== undefined) ?
            this.element[0].files[0] : null);
    }



    init(){

        let self = this;

        if(!this.element) return null;

        let chooseButton = this.grandparent.find(".upload-button");
        let removeButton = this.grandparent.find(".upload-button-remove");

        disableButtonClick(removeButton);


        chooseButton.unbind().on("click",function(){
            self.element.click();
        });

        this.element.unbind().on("change",function(event){
            if( event.target.files.length > 0 &&
                $.inArray(event.target.files[0].name.split('.').pop().toLowerCase(), ['jpeg', 'jpg', 'png']) !== -1 &&
                event.target.files[0].size < 3000000
            ){

                let reader = new FileReader();
                reader.onload = function () { self.preview.prop("src", reader.result);};
                reader.readAsDataURL(event.target.files[0]);
                self.changed = true;
                enableButtonClick(removeButton)

            }
            else{
                if(isEmpty(event) || isEmpty(event.target) || isEmpty(event.target.files) || isEmpty(event.target.files[0]) || event.target.files[0].size > 3000000) showAlert("Please choose a file < 5MB",ALERT_TYPE_FAILURE,1000);
                self.preview.prop("src",PATH_DEFAULT_PICTURE);
                self.element.val("");
                disableButtonClick(removeButton);

            }
        });


        removeButton.unbind().on("click",function(){
            self.element.val("");
            self.preview.prop("src",PATH_DEFAULT_PICTURE);
        });



        return this;
    }


    restore(){
        try {if (this.grandparent && this.grandparent.length > 0 && this.grandparent.hasClass("warn")) this.grandparent.removeClass("warn");}
        catch (elementMissingError){}
    };

    warn(){
        try {if (this.grandparent && this.grandparent.length > 0 && ! this.grandparent.hasClass("warn")) this.grandparent.addClass("warn");}
        catch (elementMissingError){}
    };

}




class DangerItem extends ClassHelper{

    get text() {
        return this._text;
    }

    set text(value) {
        this._text = value;
    }
    get input() {
        return this._input;
    }

    set input(value) {
        this._input = value;
    }
    get type() {
        return this._type;
    }

    set type(value) {
        this._type = value;
    }
    get ID() {
        return this._ID;
    }

    set ID(value) {
        this._ID = value;
    }

    constructor(ID ,type = INPUT_DANGER_SMALL, input = null, text = "There is an invalid field. Please fix it first."){
        super();
        this.ID = ID;
        this.type = type;
        this.input = input;
        this.text = text;
    }


    alert(){
        showAlert(this.text,ALERT_TYPE_FAILURE,1000);
    }
}


/**
 * ----------------------------------------------------------------------
 *
 *
 * Example of inputs
 *
 *
 * ----------------------------------------------------------------------


 new ImageInput({
            ID : EMPLOYEE_KEY_PROFILE_PICTURE,
            parent : primaryPicture,
            label : "Profile Picture (~)",
            danger : INPUT_DANGER_SMALL
        }),
 new TextInput({
            ID : EMPLOYEE_KEY_FIRSTNAME,
            parent : primary,
            label : "First Name",
            placeholder : "Enter the surname...",
            maxlength : 80,
            danger : INPUT_DANGER_BIG
        }),
 new NumberInput({
            ID : EMPLOYEE_KEY_PHONE,
            parent : about,
            label : "Phone (~)",
            placeholder : "Enter phone number...",
            maxlength : 30,
            danger : INPUT_DANGER_SMALL,
            isPhone : true
        }),


 new SelectInput({
            ID: ADDRESS_KEY_COUNTRY,
            parent: address,
            label: "Country",
            value: "United Kingdom",
            source: parseCountryCodesForSelectInput(),
            danger:  INPUT_DANGER_BIG
        }),


 new RadioGroup(EMPLOYEE_KEY_GENDER,primary,"Gender",WORLD_GENDER_MAN,[
 {
      ID : EMPLOYEE_KEY_GENDER + WORLD_GENDER_MAN,
      label : "Male",
      value : WORLD_GENDER_MAN,
 },
 {
      ID : EMPLOYEE_KEY_GENDER + WORLD_GENDER_WOMAN,
      label : "Female",
      value : WORLD_GENDER_WOMAN,
 }
 ],INPUT_DANGER_BIG),


 new SelectInputCustom({
            ID : EMPLOYEE_KEY_CUSTOM_DATA_LABEL+"-"+customDataIndex,
            parent : custom,
            label : "Label/Name",
            source : dataLabelSource,
            placeholder : "Enter field name (e.g. Bank Name)",
            maxlength: 1000,
            danger : INPUT_DANGER_BIG,
            data : "data-group='"+customDataIndex+"'  data-type='"+EMPLOYEE_KEY_CUSTOM_DATA_LABEL+"'",
            custom : true
        }),
 *
 *
 * ----------------------------------------------------------------------
 */





