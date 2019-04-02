/**
 * Created by @VanSoftware on 13/01/2019.
 */


class Binder{

    get result() {
        return this._result;
    }

    set result(value) {
        this._result = value;
    }


    constructor(){

    }

    init(){
        this.result = "";
        G_Constants = [];
        return new Promise((resolve, reject) => {
            resolve();
        });
    }

    parse(text, preview, alert = true){

        G_Constants = [];
        this.result = "";

        let quoteOpened = false;

        let flag = false;
        let lines = text.split("\n");
        //console.log(lines);


        try {
            for (let i = 0; i < lines.length; i++) {
                let line = lines[i];

                if(line.length === 0) continue;


                if (line[0] === "\"") {
                    quoteOpened = true;
                    if(line[line.length - 1] === "\"") {
                        this.result += (line).slice(1, -1);
                        quoteOpened = false;
                    }
                    else {
                        this.result += (line).slice(1);
                        while(quoteOpened) {
                            i++;
                            if (i >= lines.length) throw new Error("Content string has been opened but never closed.");
                            let next_line = lines[i];
                            next_line = next_line.trim();
                            if (next_line[next_line.length - 1] === "\"") {
                                this.result +=  "\n";
                                this.result += (next_line).slice(0, -1);
                                quoteOpened = false;
                            }
                            else {
                                this.result +=  "\n";
                                this.result += next_line;
                            }
                        }
                    }
                }
                else if (line[0] === "\\") {
                    this.result += "\n";
                }
                else{
                    let tokens = line.split(/(\s+)/).filter(function (e) { return e.trim().length > 0;});
                    //console.log(tokens);
                    if(tokens.length === 0) continue;

                    if(String(tokens[0]).toLowerCase() === "const"){
                        if(tokens.length !== 3) throw new Error("Constant declaration doesn't match the 'Const name value' at line "+(i+1)+".");
                        if(SyntaxUtil.isConstant(tokens[1])) throw new Error("Constant declared multiple times: const "+tokens[1]+" at line "+(i+1)+".");
                        if(isNaN(tokens[2])) {
                            throw new Error("Constants should store only integer values: const "+tokens[1]+" at line "+(i+1)+".");
                        }

                        G_Constants[tokens[1]] = tokens[2];


                    }
                    else if(tokens[0] === "do"){
                        let parser = new BinderParser(line);
                        this.result += "<span class='parsed'>"+parser.value +"</span>";
                    }
                    else if( tokens.length === 3 &&  String(tokens[0]).toLowerCase() === "use" && String(tokens[1]).toLowerCase() === "const") {
                        if(!SyntaxUtil.isConstant(tokens[2])) throw new Error("Use of undeclared constant '"+tokens[2]+"' at line "+(i+1)+".");
                        this.result += "<span class='const'>"+G_Constants[tokens[2]] +"</span>";
                    }
                    else throw new Error("Unrecognized syntax in initial parser at line "+(i+1)+".");
                }
            }

        }catch(e){
            console.log(e);
            flag = true;
            showAlert(e.message, ALERT_TYPE_FAILURE, 3000);
        }

        if(!flag && !isEmpty(preview)) {
            preview.html(this.result);
            if(alert) showAlert("Binded successfully!",ALERT_TYPE_SUCCESS,1400);
        }


    }
}