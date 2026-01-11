import { TESTS, TEST_LOOKUP } from "./mappings.mjs";
import generateCsv from "./generator.mjs";

// Add validation state tracking
let isPrimaryValid = false;
let isSecondaryValid = true; // Optional field starts as valid

document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('#test-type').value = '';

    const bloodTestsList = document.querySelector('#blood-tests');
    const dnaTestsList = document.querySelector('#dna-tests');

    const primaryBarcodeDiv = document.querySelector('#primary-barcode-input');
    const secondaryBarcodeDiv = document.querySelector('#secondary-barcode-input');

    const primaryBarcodeInput = document.querySelector('#primary-barcode');
    const secondaryBarcodeInput = document.querySelector('#secondary-barcode');

    document.querySelector('#test-type').addEventListener('change', handleTestTypeChange);
    document.querySelector('#blood-test-type').addEventListener('change', handleBloodTestTypeChange);

    bloodTestsList.style.display = 'none';
    dnaTestsList.style.display = 'none';

    primaryBarcodeDiv.style.display = 'none';
    secondaryBarcodeDiv.style.display = 'none';

    primaryBarcodeInput.value = '';
    secondaryBarcodeInput.value = '';

    // Adding event listeners to barcode inputs on page load
    primaryBarcodeInput.addEventListener('input', handleBarcodeInput);
    // secondaryBarcodeInput.addEventListener('input', formatBarcode);

    const generateCsvButton = document.querySelector('.generate-csv-btn');
    generateCsvButton.style.display = 'none';
    generateCsvButton.addEventListener('click', render);

    const resetButton = document.querySelector('#reset-page');
    resetButton.addEventListener('click', resetForm);

    Object.entries(TEST_LOOKUP).forEach(([key, value]) => {
        addOption('#blood-test-type', key, value);
    })
});

function addOption(selectId, value, text) {
    const selectElement = document.querySelector(selectId);
    const newOption = document.createElement('option');
    newOption.className = 'select-option';
    newOption.value = value;
    newOption.textContent = text;
    // Alternatively: newOption.innerText = text;

    selectElement.appendChild(newOption);
}

function handleBarcodeInput(event) {
    let submitFlag = false;
    // First format the barcode
    formatBarcode(event);

    // Then validate and update button visibility
    validateAndUpdateButton(submitFlag);
}

function formatBarcode(event) {
    let barcodeElement = event.target;
    let barcode = barcodeElement.value;
    const errorElement = document.querySelector(`#${barcodeElement.id}-error`);

    errorElement.textContent = '';
    let formattedBarcode = '';

    // Remove hyphens only
    let rawInput = barcode.replace(/-/g, '').toUpperCase();

    // Split into letters and digits
    let letters = rawInput.slice(0, 6).replace(/[^A-Z]/g, '');
    let digits = rawInput.slice(6, 10).replace(/[^0-9]/g, '');

    if (letters.length + digits.length > 10) {
        errorElement.textContent = "Enter a valid barcode";
    }

    if (letters.length > 0) {
        formattedBarcode += letters.substring(0, 3);
    }

    if (letters.length > 3) {
        formattedBarcode += '-' + letters.substring(3, 6);
    }

    if (letters.length === 6 && digits.length > 0) {
        formattedBarcode += '-' + digits.substring(0, 4);
    }
    console.log(formattedBarcode);



    barcodeElement.value = formattedBarcode;
}

function validateBarcode(barcode) {
    const barcodeRegex = /^[A-Z]{3}-[A-Z]{3}-[\d]{4}$/i;
    return barcodeRegex.test(barcode);
}

function validateAndUpdateButton(onSubmit = false) {
    const primaryBarcodeInput = document.querySelector('#primary-barcode');
    const secondaryBarcodeInput = document.querySelector('#secondary-barcode');
    const generateCsvButton = document.querySelector('.generate-csv-btn');
    const bloodTestType = document.querySelector('#blood-test-type').value;
    const barcodes = TESTS[bloodTestType]?.barcodes;

    // Validate primary barcode (mandatory)
    let primaryValue = primaryBarcodeInput?.value || '';
    let secondaryValue;
    isPrimaryValid = validateBarcode(primaryValue);

    // Validate secondary barcode if needed (optional)
    if (barcodes === 2) {
        secondaryValue = secondaryBarcodeInput?.value || '';
        // Secondary is optional, so it's valid if:
        // 1. It's empty (user hasn't started typing), OR
        // 2. It has content and is properly formatted
        const hasSecondaryContent = secondaryValue.trim().length > 0;
        isSecondaryValid = !hasSecondaryContent || validateBarcode(secondaryValue);
    } else {
        // If only one barcode is needed, secondary is always valid
        isSecondaryValid = true;
    }

    // Update error displays
    const primaryError = document.querySelector('#primary-barcode-error');
    const secondaryError = document.querySelector('#secondary-barcode-error');

    if (primaryBarcodeInput) {
        if (onSubmit) {
            // On submit: show error if empty or invalid
            primaryError.textContent = (primaryValue.trim() && isPrimaryValid) ? '' : 'Please enter a valid barcode';
        } else {
            // During input: only show error if user has typed and it's invalid
            const hasPrimaryContent = primaryValue.trim().length > 0;
            primaryError.textContent = (isPrimaryValid || !hasPrimaryContent) ? '' : 'Please enter a valid barcode';
        }
    }

    if (secondaryBarcodeInput && barcodes === 2) {
        secondaryValue = secondaryBarcodeInput.value || '';

        if (onSubmit) {
            // On submit: If test requires 2 barcodes, validate secondary
            if (barcodes === 2) {
                const hasSecondaryContent = secondaryValue.trim().length > 0;
                // Show error if user started typing but entered invalid barcode
                secondaryError.textContent = (!hasSecondaryContent || validateBarcode(secondaryValue)) ? '' : 'Please enter a valid barcode';
            }
        } else {
            // During input: only show error if user has typed and it's invalid
            const hasSecondaryContent = secondaryValue.trim().length > 0;
            secondaryError.textContent = (isSecondaryValid || !hasSecondaryContent) ? '' : 'Please enter a valid barcode';
        }
    }

    // Show button only if all conditions are met
    const testTypeSelected = document.querySelector('#test-type').value !== '';
    const bloodTestTypeSelected = document.querySelector('#blood-test-type').value !== '';

    if (testTypeSelected && bloodTestTypeSelected && isPrimaryValid && isSecondaryValid) {
        if (isSecondaryValid && validateBarcode(secondaryValue)) {
            console.log(`secondary: ${secondaryValue} - ${validateBarcode(secondaryValue)}`)
            generateCsvButton.style.display = 'flex';
        }
        else {
            generateCsvButton.style.display = 'flex';
        }
    } else {
        generateCsvButton.style.display = 'none';
    }

    // Return validation status for form submission
    return isPrimaryValid && isSecondaryValid;
}

function handleTestTypeChange() {
    let testTypeElement = document.querySelector('#test-type');
    let testType = testTypeElement.value;

    console.log(`Test Type Value: "${testType}"`);

    if (testType === 'blood') {
        document.querySelector('#blood-tests').style.display = 'block';
        document.querySelector('#dna-tests').style.display = 'none';
    }
    else if (testType === 'dna') {
        document.querySelector('#dna-tests').style.display = 'block';
        document.querySelector('#blood-tests').style.display = 'none';
    }
    else {
        document.querySelector('#blood-tests').style.display = 'none';
        document.querySelector('#dna-tests').style.display = 'none';

        document.querySelectorAll('.barcode-input').forEach(element => {
            element.style.display = 'none';
        })
        testTypeElement.style.color = grey;
    }
}

function handleBloodTestTypeChange() {
    let bloodTestType = document.querySelector('#blood-test-type').value;

    const primaryBarcodeInput = document.querySelector('#primary-barcode-input');
    const secondaryBarcodeInput = document.querySelector('#secondary-barcode-input');

    document.querySelector('#test-type-hidden').value = bloodTestType;

    const barcodes = TESTS[bloodTestType]?.barcodes;

    if (barcodes == 1) {
        primaryBarcodeInput.style.display = 'block';
        secondaryBarcodeInput.style.display = 'none';
    }
    else if (barcodes == 2) {
        primaryBarcodeInput.style.display = 'block';
        secondaryBarcodeInput.style.display = 'block';

        secondaryBarcodeInput.addEventListener('input', handleBarcodeInput);
    }
    else {
        primaryBarcodeInput.style.display = 'none';
        secondaryBarcodeInput.style.display = 'none';
    }
}

function render() {
    let submitFlag = true;
    // Validate first before generating CSV
    validateAndUpdateButton(submitFlag);
    const generateCsvButton = document.querySelector('#generate-csv');

    // Only proceed if button is visible (all validations passed)
    if (getComputedStyle(generateCsvButton).display === 'none') {
        return;
    }

    const test = document.querySelector('#test-type-hidden').value;
    const noOfBarcodes = TESTS[test]?.barcodes;
    const primaryBarcodeInput = document.querySelector('#primary-barcode');
    const outputColumn = document.querySelector('.csv-column'); // Fixed typo: 'cloumn' → 'column'

    // Clear previous output
    outputColumn.innerHTML = '';

    // Generate primary CSV
    let primaryCsv = generateCsv(primaryBarcodeInput.value, TESTS[test]?.primary);

    const primaryOutputDiv = document.createElement('div');
    primaryOutputDiv.className = 'col-md-12 mx-auto single-csv-output';
    // primaryOutputDiv.className = 'csv-output';

    const primaryOutput = document.createElement('pre');
    primaryOutput.className = 'result-csv';
    primaryOutput.id = 'primary-csv';
    primaryOutput.textContent = primaryCsv;

    const primaryOutputCopy = document.createElement('button');
    primaryOutputCopy.className = 'btn btn-primary copy-btn neubrutalist-btn';
    primaryOutputCopy.id = 'primary-csv-copy';
    primaryOutputCopy.textContent = 'Copy';
    primaryOutputCopy.addEventListener('click', copyResultCSV);

    primaryOutputDiv.appendChild(primaryOutputCopy);
    primaryOutputDiv.appendChild(primaryOutput);
    outputColumn.appendChild(primaryOutputDiv);

    // Generate secondary CSV if needed
    if (noOfBarcodes == 2) {
        const secondaryBarcodeInput = document.querySelector('#secondary-barcode');

        // Only generate if secondary barcode is provided (optional)
        if (secondaryBarcodeInput && secondaryBarcodeInput.value.trim() !== '') {
            let secondaryCsv = generateCsv(secondaryBarcodeInput.value, TESTS[test]?.secondary);

            const secondaryOutputDiv = document.createElement('div');
            primaryOutputDiv.className = 'col-md-5 mx-auto csv-output';
            secondaryOutputDiv.className = 'col-md-5 mx-auto csv-output';
            // secondaryOutputDiv.className = 'csv-output';

            const secondaryOutput = document.createElement('pre');
            secondaryOutput.className = 'result-csv';
            secondaryOutput.id = 'secondary-csv';
            secondaryOutput.textContent = secondaryCsv;

            const secondaryOutputCopy = document.createElement('button');
            secondaryOutputCopy.className = 'btn btn-primary copy-btn neubrutalist-btn';
            secondaryOutputCopy.id = 'secondary-csv-copy';
            secondaryOutputCopy.textContent = 'Copy';
            secondaryOutputCopy.addEventListener('click', copyResultCSV);

            secondaryOutputDiv.appendChild(secondaryOutputCopy);
            secondaryOutputDiv.appendChild(secondaryOutput);
            outputColumn.appendChild(secondaryOutputDiv);
        }
    }
}

function copyResultCSV(event) {
    const copyBtnId = event.target.id;
    console.log(`Copy Button ID: ${copyBtnId}`);

    // Determine which CSV to copy
    const csvId = copyBtnId.replace('-copy', '');
    const csvElement = document.querySelector(`#${csvId}`);

    if (!csvElement) {
        console.error(`Element #${csvId} not found`);
        return;
    }

    // Use Clipboard API for better reliability
    navigator.clipboard.writeText(csvElement.textContent)
        .then(() => {
            // Visual feedback
            const originalText = event.target.textContent;
            event.target.textContent = 'Copied!';
            event.target.classList.add('copied');

            // Reset after 2 seconds
            setTimeout(() => {
                event.target.textContent = originalText;
                event.target.classList.remove('copied');
            }, 2000);
        })
        .catch(err => {
            console.error('Failed to copy: ', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = csvElement.textContent;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
        });
}

function resetForm() {
    document.querySelector('#test-type').value = '';
    document.querySelector('#blood-test-type').value = '';
    document.querySelector('#primary-barcode').value = '';
    document.querySelector('#secondary-barcode').value = '';

    // Hide all sections
    document.querySelector('#blood-tests').style.display = 'none';
    document.querySelector('#dna-tests').style.display = 'none';
    document.querySelector('#primary-barcode-input').style.display = 'none';
    document.querySelector('#secondary-barcode-input').style.display = 'none';
    document.querySelector('.generate-csv-btn').style.display = 'none';

    // Clear outputs
    const outputColumn = document.querySelector('.csv-column');
    if (outputColumn) outputColumn.innerHTML = '';

    // Clear errors
    document.querySelectorAll('.error').forEach(el => el.textContent = '');

    // Reset validation states
    isPrimaryValid = false;
    isSecondaryValid = true;
}
