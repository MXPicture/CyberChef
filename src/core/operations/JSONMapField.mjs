/**
 * @author MXPicture [@gmail.com]
 * @copyright MXPicture 2022
 * @license Apache-2.0
 */

import jpath from "jsonpath";
import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";

/**
 * JSON map field
 */
class JSONMapField extends Operation {

    /**
     * JSONMapField constructor
     */
    constructor() {
        super();

        this.name = "JSON map field";
        this.module = "Default";
        this.description = "Maps a JSON field";
        this.infoURL = "";
        this.inputType = "JSON";
        this.outputType = "JSON";
        this.args = [
            {
                name: "Source field",
                type: "string",
                value: ""
            },
            {
                name: "Target field",
                type: "string",
                value: ""
            },
            {
                name: "Target fieldname",
                type: "string",
                value: ""
            }
        ];
    }

    /**
     * Maps a JSON field.
     *
     * @returns {JSON}
     */
    map() {
        for (let item of this.input) {
          let newItem = this.mapItem(item);
        }
    }
    
    /**
     * Maps a JSON field.
     *
     * @param {JSON} item
     * @returns {JSON}
     */
    mapItem(item) {
        try {
            results = jpath.query(obj, query);
        } catch (err) {
            throw new OperationError(`Invalid JPath expression: ${err.message}`);
        }
        
        return item;
    }

    /**
     * @param {JSON} input
     * @param {Object[]} args
     * @returns {JSON}
     */
    run(input, args) {
        const [sourceField, targetField, targetFieldname] = args;

        // Record values so they don't have to be passed to other functions explicitly
        this.sourceField = sourceField;
        this.targetField = targetField;
        this.targetFieldname = targetFieldname;
        this.input = input;
        let single = false;
        if (!(this.input instanceof Array)) {
            this.input = [input];
            single = true;
        }
        
        let output = [];

        try {
            output = this.map();
        } catch (err) {
            output = this.input;
        }
        
        if (single) {
            return output[0];
        } 
        
        return output;
    }
}

export default JSONMapField;
