/**
 * Created by @VanSoftware on 21/06/2018.
 */
const FILTER_TYPE_SINGLE  = 1;
const FILTER_TYPE_MULTIPLE = 2;
const FILTER_TYPE_CUSTOM = 3;



const FILTER_AGE_L20 = 1;
const FILTER_AGE_20_30  = 2;
const FILTER_AGE_30_40  = 3;
const FILTER_AGE_40_50  = 4;
const FILTER_AGE_50_60  = 5;
const FILTER_AGE_G60  = 6;
const FILTER_AGE_ANY = 7;


const FILTER_CUSTOM_TYPE_INPUT =  1;
const FILTER_CUSTOM_TYPE_SELECT  = 2;




const FILTER = [
    {
        ID : "const FILTER_ID 1",
        type : FILTER_TYPE_SINGLE,
        name : "Filter Name e.g. Gender",
        initial : ["InitialValue e.g. MALE"], //KEEP ORDER of DEFAULTS/INITIALS as in OPTIONS below
        options : [
            {
                name : "Option Name",
                value :   1
            },
            {
                name : "Option Name 2",
                value :  2
            },
        ]

    },
    {
        ID : "const FILTER_ID 2",
        type : FILTER_TYPE_MULTIPLE,
        name : "Filter Name e.g. Ages",
        initial : ["InitialValue e.g. MALE"], //KEEP ORDER of DEFAULTS/INITIALS as in OPTIONS below
        options : [
            {
                name : "Option Name",
                value :   1
            },
            {
                name : "Option Name 2",
                value :  2
            },
        ]

    },
    {
        ID : "const FILTER_ID 3",
        type : FILTER_TYPE_CUSTOM,
        name : "Filter Name e.g. Address",
        initial : ["Any","","",""], //KEEP ORDER of DEFAULTS/INITIALS as in OPTIONS below
        options : [
            {
                type : FILTER_CUSTOM_TYPE_SELECT,
                value :   "const VALUE",
                name : "Name",
                source : [] //array with the values for select
            },
            {
                type : FILTER_CUSTOM_TYPE_INPUT,
                value : "const Value", //Used to identify the input later
                maxLength : 100,
                placeholder : "Placeholder for input field",
                name : "Name",
            },
        ]
    },
];


const FILTER_KEY_SORT = "sort";
const FILTER_SORT_TYPE_AZ = 1;
const FILTER_SORT_TYPE_ZA = 2;
const FILTER_SORT_TYPE_NEWEST = 3;
const FILTER_SORT_TYPE_OLDEST = 4;



class Filter{

    get assoc() {
        return this._assoc;
    }

    set assoc(value) {
        this._assoc = value;
    }

    get list() {
        return this._list;
    }

    set list(value) {
        this._list = value;
    }






    constructor(filters = []){
        this.list = [];
        this.assoc = {};

        this.bindFilters(filters);
        this.bindFilters(filters,true);

    }

    bindFilters(filters = [], assoc = false){

        let self = this;
        for(let i = 0; i < filters.length; i++) if(filters.hasOwnProperty(i)){
            let item = new FilterItem(filters[i]);
            if(assoc === true) {self.assoc[item.ID] = item;}
            else self.list.push(item);
        }

    }
}



class FilterItem{

    //Standard values
    get chosen() {
        return this._chosen;
    }
    set chosen(value) {
        this._chosen = value;
    }
    get initial() {
        return this._initial;
    }
    set initial(value) {
        this._initial = value;
    }
    get name() {
        return this._name;
    }
    set name(value) {
        this._name = value;
    }
    get type() {
        return this._type;
    }
    set type(value) {
        this._type = parseInt(value);
    }
    /**
     *
     * @returns {Array}
     */
    get options() {
        return this._options;
    }
    /**
     *
     * @param {Array} value
     */
    set options(value) {
        this._options = value;
    }
    get ID() {
        return this._ID;
    }
    set ID(value) {
        this._ID = value;
    }


    constructor(object){
        this.ID = ClassHelper.getValue(object, "ID");
        this.type = ClassHelper.getValue(object, "type");
        this.name =  ClassHelper.getValue(object, "name");
        this.initial = ClassHelper.getArray(object, "initial") ? ClassHelper.getArray(object, "initial") : "";
        this.chosen = this.initial;
        this.options = [];

        let temp = ClassHelper.getArray(object,"options");
        if(temp !== null && temp.length > 0) for(let i = 0; i < temp.length; i++) this.options.push(new FilterOption(temp[i]));

    }

    isCustomized(){

        if(this.initial.length !== this.chosen.length) return true;

        for(let i = 0; i < this.initial.length; i++){
            if(String(this.initial[i]) !== String(this.chosen[i])) return true;
        }

        return false;
    };

    getOptionByValue(value){

        for(let i = 0; i < this.options.length; i++){
            if(String(this.options[i].value) === String(value))
                return this.options[i];
        }

        return null;
    };
}


class FilterOption{
    get source() {
        return this._source;
    }

    set source(value) {
        this._source = value;
    }
    get type() {
        return this._type;
    }

    set type(value) {
        this._type = value;
    }
    get placeholder() {
        return this._placeholder;
    }

    set placeholder(value) {
        this._placeholder = value;
    }

    get value() {
        return this._value;
    }
    set value(value) {
        this._value = value;
    }
    get name() {
        return this._name;
    }
    set name(value) {
        this._name = value;
    }


    get maxLength() {
        return this._maxLength;
    }
    set maxLength(value) {
        this._maxLength = value;
    }





    constructor(object){


    this.name = ClassHelper.getValue(object, "name");
    this.value = ClassHelper.getValue(object, "value") ? ClassHelper.getValue(object, "value") : "";

    this.maxLength = ClassHelper.getValue(object, "maxLength");
    this.placeholder = ClassHelper.getValue(object, "placeholder");

    this.type = ClassHelper.getValue(object, "type") ? parseInt(ClassHelper.getValue(object, "type")) : null;
    this.source = ClassHelper.getArray(object,"source");

}
}


