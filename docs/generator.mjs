import { BIOMARKER_VALUES } from "./mappings.mjs";

function returnTime() {
    const d = new Date();
    const pad = (n, len = 2) => n.toString().padStart(len, '0');

    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ` +
        `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}.${pad(d.getMilliseconds(), 3)}`;
}

function renderRow(barcode, biomarker) {
    return [
        barcode,
        barcode,
        barcode,
        7533,
        '2000-11-11',
        '2026-01-10 09:41:00.930',
        '2026-01-10 09:41:00.930',
        returnTime(),
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

