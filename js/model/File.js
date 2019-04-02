/**
 * Created by @VanSoftware on 06/07/2018.
 */

const FILE_KEY_ID = "ID";
const FILE_KEY_NAME = "name";
const FILE_KEY_TYPE = "type";
const FILE_KEY_SIZE = "size";
const FILE_KEY_INSTANTIATED= "instantiated";

class File{
    get instantiated() {
        return this._instantiated;
    }

    set instantiated(value) {
        this._instantiated = value;
    }
    get size() {
        return this._size;
    }

    set size(value) {
        this._size = value;
    }
    get type() {
        return this._type;
    }

    set type(value) {
        this._type = value;
    }
    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }
    get ID() {
        return this._ID;
    }

    set ID(value) {
        this._ID = value;
    }

    constructor(object){
        this.ID = ClassHelper.getValue(object, FILE_KEY_ID,true);
        this.name = ClassHelper.getValue(object, FILE_KEY_NAME,true);
        this.type = ClassHelper.getValue(object, FILE_KEY_TYPE,true);
        this.size = ClassHelper.getValue(object, FILE_KEY_SIZE,true);
        this.instantiated = ClassHelper.getValue(object, FILE_KEY_INSTANTIATED,true);

    }



    parseFileUploaderObject(pathToRoot = ""){
        let self = this;
        return{
            name: self.name,
            type : self.type,
            size : self.size,
            file: "path.png",
            data : {
                thumbnail:
                    (   self.type === "image/png" ||
                        self.type === "image/jpeg" ||
                        self.type === "image/jpg") ?
                        "path.png" : "",
                myID : self.ID,
            }
        }

    }
}