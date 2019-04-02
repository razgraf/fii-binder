/**
 * Created by @VanSoftware on 13/01/2019.
 */
let actions_source = [
    {
    name : "sum",
    parameters : "all",
    action : function(values){
        let sum = 0;
        for(let i = 0; i < values.length; i++) sum+=parseInt(values[i]);
        return sum;
    }
    },
    {
        name : "enum",
        parameters : "all",
        action : function(values){
            let sum = "";
            for(let i = 0; i < values.length; i++) sum+= (sum === "") ? String(values[i]): ", "+String(values[i]);
            return sum;
        }
    },
    {
        name : "enum_and",
        parameters : "all",
        action : function(values){
            let sum = "";
            for(let i = 0; i < values.length; i++) sum+= (sum === "") ? String(values[i]): (i === values.length - 1) ? " and "+String(values[i])  : ", "+String(values[i]);
            return sum;
        }
    },
    {
        name : "times",
        parameters : "all",
        action : function(values){
            let product = 1;
            for(let i = 0; i < values.length; i++) product*=parseInt(values[i]);
            return product;
        }
    }


    ];


class BinderAction{
    get action () {
        return this._function;
    }

    set action (value) {
        this._function = value;
    }
    get parameters() {
        return this._parameters;
    }

    set parameters(value) {
        this._parameters = value;
    }
    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    constructor(object){
        this.name = ClassHelper.getValue(object, "name");
        this.parameters = ClassHelper.getValue(object, "parameters");
        this.action = ClassHelper.isFunctionSetInObject("action",object) ? object["action"] : null;
    }


    

    static pushAction(object, array = G_Actions){
        let temp = new BinderAction(object);
        if(this.isActionDeclared(temp.name, array)) throw new Error("Action already declared.");
        array.push(temp);
    }

    static isActionDeclared(name, array = G_Actions){
        for(let i = 0; i < array.length; i++) if( array[i].name === name) return true;
        return false;
    }

    static findActionByName(name, array = G_Actions){
        for(let i = 0; i < array.length; i++) if( array[i].name === name) return array[i];
        return null;
    }

    static callAction(action_name, values, array = G_Actions ){
        if(!this.isActionDeclared(action_name, array)) throw new Error("Action missing.");
        let binderAction = this.findActionByName(action_name,array); if(binderAction === null ) throw new Error("Action missing at call.");

        return binderAction.action(values);
    }

    static init(source = actions_source, target = G_Actions ){
        return new Promise((resolve, reject) => {
            for(let i = 0; i < source.length; i++){
                this.pushAction(source[i], target);
            }
            resolve();
        });

    }

}

