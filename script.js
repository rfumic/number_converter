function isHexDigit(value) {
    return /^[0-9a-fA-F]$/.test(value);
}

function isBinDigit(value) {
    return /^[0-1]$/.test(value);
}

const dec_input = document.getElementById("decimal");
const bin_input = document.getElementById("binary");
const hex_input = document.getElementById("hex");

let previous_valid_dec = null;
let previous_valid_bin = null;
let previous_valid_hex = null;

function zero_out_values() {
    dec_input.value = "";
    previous_valid_dec = dec_input.value;

    bin_input.value = "";
    previous_valid_bin = bin_input.value;

    hex_input.value = "";
    previous_valid_hex = hex_input.value;
}

dec_input.addEventListener("input", (e) => {
    if(isNaN(e.data)) {
        dec_input.value = previous_valid_dec ?? "";
    } else {
        previous_valid_dec = dec_input.value;

        bin_input.value = Number(dec_input.value).toString(2);
        previous_valid_bin = bin_input.value;
        hex_input.value = Number(dec_input.value).toString(16);
        previous_valid_hex = hex_input.value;
    }

    if(dec_input.value.trim().length == 0) {
        bin_input.value = "";
        previous_valid_bin = bin_input.value;

        hex_input.value = "";
        previous_valid_hex = hex_input.value;
    }

});

bin_input.addEventListener("input", (e) => {
    function calculate() {
        previous_valid_bin = bin_input.value;

        dec_input.value = Number.parseInt(bin_input.value, 2).toString(10);
        previous_valid_dec = dec_input.value;
        hex_input.value = Number.parseInt(bin_input.value, 2).toString(16);
        previous_valid_hex = hex_input.value;
    }

    if(e.inputType == "insertFromPaste") {
        let valid_paste = false;
        for (let i = 0, len = bin_input.value.length; i < len; ++i ) {
            if(isBinDigit(bin_input.value[i])) {
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

    // TODO: better check
    if(isNaN(e.data) || e.data < 0 || e.data > 1) {
        bin_input.value = previous_valid_bin ?? "";
    } else {
        calculate();
    }

    if(bin_input.value.trim().length == 0) {
        zero_out_values();
    }
});

hex_input.addEventListener("input", (e) => {
    function calculate() {
        previous_valid_hex = hex_input.value;

        dec_input.value = Number.parseInt(hex_input.value, 16).toString(10);
        previous_valid_dec = dec_input.value;
        bin_input.value = Number.parseInt(hex_input.value, 16).toString(2);
        previous_valid_bin = bin_input.value;
    }

    if(e.inputType.startsWith("delete")) {
        if(hex_input.value) {
            calculate();
            return;
        }
        zero_out_values();
        return;
    }
    if(e.inputType == "insertFromPaste") {
        let is_valid = true;
        for (let i=0, len = hex_input.value.length; i < len; ++i ) {
            if(!isHexDigit(hex_input.value[i])) {
                is_valid = false;
                break;
            }
        }
        if(is_valid) {
            calculate();
        } else {
            hex_input.value = previous_valid_hex;
        }
        return;
    }

    if(isHexDigit(e.data)) {
        calculate();
    } else {
        hex_input.value = previous_valid_hex ?? "";
    }

    if(hex_input.value.trim().length == 0) {
        zero_out_values();
    }
});

