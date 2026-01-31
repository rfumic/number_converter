const dec_input = document.getElementById("decimal");
const bin_input = document.getElementById("binary");
const hex_input = document.getElementById("hex");

const TYPE = Object.freeze({
    DEC: 0,
    BIN: 1,
    HEX: 2,
});

let curr_type = 0;

const all_numeric_values = [
    { input: dec_input, prev_valid: null, base: 10 },
    { input: bin_input, prev_valid: null, base: 2 },
    { input: hex_input, prev_valid: null, base: 16 },
];

function zeroOutValues() {
    for(const numeric_value of all_numeric_values) {
        numeric_value.input.value = "";
        numeric_value.prev_valid = "";
    }
}

function calculate() {
    const changed_item = all_numeric_values[curr_type];
    const new_value = Number.parseInt(changed_item.input.value, changed_item.base);

    for(let i = 0; i < all_numeric_values.length; i++) {
        const item = all_numeric_values[i];
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
    const dec = all_numeric_values[curr_type];
    const is_valid_value = !isNaN(dec.input.value);
    const is_valid_digit = !isNaN(e.data);

    genericHandler(e, dec, is_valid_value, is_valid_digit);
});

bin_input.addEventListener("input", (e) => {
    curr_type = TYPE.BIN;
    const bin = all_numeric_values[curr_type];
    const is_valid_value = /^[01]+$/.test(bin.input.value);
    const is_valid_digit = e.data === "0" || e.data === "1";

    genericHandler(e, bin, is_valid_value, is_valid_digit);
});

hex_input.addEventListener("input", (e) => {
    curr_type = TYPE.HEX;
    const hex = all_numeric_values[curr_type];
    const is_valid_value = /^[0-9a-fA-F]+$/.test(hex.input.value);
    const is_valid_digit = /^[0-9a-fA-F]$/.test(e.data);

    genericHandler(e, hex, is_valid_value, is_valid_digit);
});

function genericHandler(e, numeric_value, is_valid_value, is_valid_digit) {
    let valid = false;

    if(e.inputType.startsWith("delete")) {
        if(numeric_value.input.value) {
            calculate();
        } else {
            zeroOutValues();
        }

        return;
    }

    if(e.inputType === "insertFromPaste") {
        valid = is_valid_value;
    } else {
        valid = is_valid_digit;
    }

    if(!valid) {
        numeric_value.input.value = numeric_value.prev_valid ?? "";
    }

    if(!numeric_value.input.value.trim()) {
        zeroOutValues();
        return;
    }

    if(valid) {
        calculate();
    }
}

