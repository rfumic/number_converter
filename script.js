function isHexDigit(value) {
    return /^[0-9a-fA-F]$/.test(value);
}

function isBinDigit(value) {
    return /^[0-1]$/.test(value);
}

const dec_input = document.getElementById("decimal");
const bin_input = document.getElementById("binary");
const hex_input = document.getElementById("hex");

// let previous_valid_dec = null;
// let previous_valid_bin = null;
// let previous_valid_hex = null;

const TYPE = Object.freeze({
    DEC: 0,
    BIN: 1,
    HEX: 2,
});

let curr_type = 0;

const all_types = [
    { input: dec_input, prev_valid: null, base: 10 },
    { input: bin_input, prev_valid: null, base: 2 },
    { input: hex_input, prev_valid: null, base: 16 },
];

function zero_out_values() {
    for(const item of all_types) {
        item.input.value = "";
        item.prev_valid = "";
    }
}

function calculate() {
    const changed_item = all_types[curr_type];
    const new_value = Number.parseInt(changed_item.input.value, changed_item.base);

    for(let i = 0; i < all_types.length; i++) {
        const item = all_types[i];
        if(i == curr_type) {
            changed_item.prev_valid = changed_item.input.value;
        } else {
            item.input.value = new_value.toString(item.base);
            item.prev_valid = item.input.value;
        }
    }

}

dec_input.addEventListener("input", (e) => {
    curr_type = TYPE.DEC;
    const dec = all_types[curr_type];

    if(isNaN(e.data)) {
        dec.input.value = dec.prev_valid ?? "";
    } else {
        calculate();
    }

    if(dec.input.value.trim().length == 0) {
        zero_out_values();
    }

});

bin_input.addEventListener("input", (e) => {
    curr_type = TYPE.BIN;
    const bin = all_types[curr_type];

    if(e.inputType == "insertFromPaste") {
        let valid_paste = false;
        for (let i = 0, len = bin.input.value.length; i < len; i++) {
            if(isBinDigit(bin.input.value[i])) {
                valid_paste = true;
            } else {
                valid_paste = false;
                break;
            }
        }

        if(valid_paste) { 
            calculate(); 
            return;
        }
    }

    if(isNaN(e.data) || e.data < 0 || e.data > 1) {
        bin.input.value = bin.prev_valid ?? "";
    } else {
        calculate();
    }

    if(bin.input.value.trim().length == 0) {
        zero_out_values();
    }
});

hex_input.addEventListener("input", (e) => {
    curr_type = TYPE.HEX;
    const hex = all_types[curr_type];

    if(e.inputType.startsWith("delete")) {
        if(hex.input.value) {
            calculate();
            return;
        }
        zero_out_values();
        return;
    }

    if(e.inputType == "insertFromPaste") {
        let is_valid = true;

        for (let i = 0, len = hex.input.value.length; i < len; i++) {
            if(!isHexDigit(hex.input.value[i])) {
                is_valid = false;
                break;
            }
        }

        if(is_valid) {
            calculate();
        } else {
            hex.input.value = hex.prev_valid;
        }
        return;
    }

    if(isHexDigit(e.data)) {
        calculate();
    } else {
        hex.input.value = hex.prev_valid ?? "";
    }

    if(hex.input.value.trim().length == 0) {
        zero_out_values();
    }
});

