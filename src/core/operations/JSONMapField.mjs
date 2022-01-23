/**
 * @author MXPicture [@gmail.com]
 * @copyright MXPicture 2022
 * @license Apache-2.0
 */

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
     * Converts JSON to a CSV equivalent.
     *
     * @param {boolean} force - Whether to force conversion of data to fit in a cell
     * @returns {string}
     */
    toCSV(force=false) {
        const self = this;
        // If the JSON is an array of arrays, this is easy
        if (this.flattened[0] instanceof Array) {
            return this.flattened
                .map(row => row
                    .map(d => self.escapeCellContents(d, force))
                    .join(this.cellDelim)
                )
                .join(this.rowDelim) +
                this.rowDelim;
        }

        // If it's an array of dictionaries...
        const header = Object.keys(this.flattened[0]);
        return header
            .map(d => self.escapeCellContents(d, force))
            .join(this.cellDelim) +
            this.rowDelim +
            this.flattened
                .map(row => header
                    .map(h => row[h])
                    .map(d => self.escapeCellContents(d, force))
                    .join(this.cellDelim)
                )
                .join(this.rowDelim) +
                this.rowDelim;
    }

    /**
     * @param {JSON} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const [sourceField, targetField, targetFieldname] = args;

        // Record values so they don't have to be passed to other functions explicitly
        this.sourceField = sourceField;
        this.targetField = targetField;
        this.targetFieldname = targetFieldname;
        this.input = input;
        if (!(this.flattened instanceof Array)) {
            this.flattened = [input];
        }

        try {
            return this.toCSV();
        } catch (err) {
            try {
                this.flattened = flatten(input);
                if (!(this.flattened instanceof Array)) {
                    this.flattened = [this.flattened];
                }
                return this.toCSV(true);
            } catch (err) {
                throw new OperationError("Unable to parse JSON to CSV: " + err.toString());
            }
        }
    }

    /**
     * Correctly escapes a cell's contents based on the cell and row delimiters.
     *
     * @param {string} data
     * @param {boolean} force - Whether to force conversion of data to fit in a cell
     * @returns {string}
     */
    escapeCellContents(data, force=false) {
        if (typeof data === "number") data = data.toString();
        if (force && typeof data !== "string") data = JSON.stringify(data);

        // Double quotes should be doubled up
        data = data.replace(/"/g, '""');

        // If the cell contains a cell or row delimiter or a double quote, it must be enclosed in double quotes
        if (
            data.indexOf(this.cellDelim) >= 0 ||
            data.indexOf(this.rowDelim) >= 0 ||
            data.indexOf("\n") >= 0 ||
            data.indexOf("\r") >= 0 ||
            data.indexOf('"') >= 0
        ) {
            data = `"${data}"`;
        }

        return data;
    }

}

export default JSONToCSV;
