import { BIOMARKER_VALUES } from "./mappings.mjs";

function renderRow(barcode, biomarker) {
    return [
        barcode,
        barcode,
        barcode,
        7533,
        '1978-01-01',
        '2022-11-15 07:09:19.930',
        '2022-11-16 09:33:19.930',
        '2022-11-16 10:02:07.930',
        biomarker,
        BIOMARKER_VALUES[biomarker],
        '',
        ''
    ].join(',');
}

function generateCsv(barcode, biomarkerList) {
    if (!barcode) return '';

    return biomarkerList
        .map(marker => renderRow(barcode, marker))
        .join('\n');
}

export default generateCsv;
