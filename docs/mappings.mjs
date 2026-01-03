export const BIOMARKER_VALUES = {
    // Thrive Panel – primary
    NA: 145.9,
    UREA: 8,
    CREA: 21,
    EGFR: 91,
    ALT: 56,
    ALP: 103.9,
    GGT: 76,
    BILI: 20.9,
    ALB: 51,
    TP: 79.9,
    TSH: 4.1,
    K: 4.3,
    CL: 102,
    AST: 35,
    CHOL: 6,
    HDL: 2.2,
    LDL: 2.5,
    TRIG: 3.3,
    CHLHDLRTO: 2.3,
    NHDL: 0.3,

    B12A: 10,
    CRP: 5,
    FERR: 150,
    FOL: 5,
    FT4: 21,
    GLOB: 34.9,
    VITD: 144,

    HIV: 'Not detected',
    SPYH: 'Not detected',



    // Thrive Panel – secondary
    HGB: 'NA',
    HCT: 'NA',
    RBC: 'NA',
    MCV: 'NA',
    MCH: 'NA',
    MCHC: 'NA',
    RDW: 'NA',
    WBC: 'NA',
    NEU: 'NA',
    LYMP: 'NA',
    MONO: 'NA',
    EOS: 'NA',
    BAS: 'NA',
    PLT: 'NA',
    HBA1c: 'NA',

    // Blue biomarkers
    CLAU: 'Not detected',
    GON: 'Not detected'

};

export const TESTS = {
    "thrive-panel": {
        barcodes: 2,
        primary: [
            'NA', 'UREA', 'CREA', 'EGFR', 'ALT', 'ALP', 'GGT',
            'BILI', 'ALB', 'TP', 'TSH', 'K', 'CL', 'AST',
            'CHOL', 'HDL', 'LDL', 'TRIG', 'CHLHDLRTO', 'NHDL'
        ],
        secondary: [
            'HGB', 'HCT', 'RBC', 'MCV', 'MCH', 'MCHC',
            'RDW', 'WBC', 'NEU', 'LYMP', 'MONO',
            'EOS', 'BAS', 'PLT', 'HBA1c'
        ]
    }
};

export const TEST_LOOKUP = {
    "thrive-panel": "Thrive Panel"
}
