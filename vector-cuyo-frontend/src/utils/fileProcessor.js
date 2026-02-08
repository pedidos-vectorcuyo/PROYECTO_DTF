
/**
 * Reads PNG metadata (Width, Height, DPI) from the file header.
 * Falls back to createImageBitmap if header parsing fails.
 * @param {File} file 
 * @returns {Promise<{width: number, height: number, dpiX: number}>}
 */
const readMetadata = (file) => {
    return new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = e => {
            const view = new DataView(e.target.result);
            let res = { width: 0, height: 0, dpiX: 72 }; // Default DPI 72 if not found

            // Check for PNG signature
            if (view.getUint32(0) === 0x89504E47) {
                let offset = 8;
                while (offset < view.byteLength) {
                    let len = view.getUint32(offset);
                    let type = view.getUint32(offset + 4);

                    // IHDR chunk: Width and Height
                    if (type === 0x49484452) {
                        res.width = view.getUint32(offset + 8);
                        res.height = view.getUint32(offset + 12);
                    }

                    // pHYs chunk: Physical Pixel Dimensions (DPI)
                    if (type === 0x70485973) {
                        let x = view.getUint32(offset + 8);
                        // unit specifier: 1 is meters
                        if (view.getUint8(offset + 16) === 1) {
                            res.dpiX = Math.round(x * 0.0254);
                        }
                    }
                    offset += 12 + len;
                }
            }

            if (!res.width) {
                createImageBitmap(file).then(b => {
                    resolve({ width: b.width, height: b.height, dpiX: 72 });
                }).catch(() => resolve(res));
            } else {
                resolve(res);
            }
        };
        // Read first 128KB which should contain the header chunks
        reader.readAsArrayBuffer(file.slice(0, 128 * 1024));
    });
};

/**
 * Validates a file against DTF printing constraints.
 * @param {File} file 
 * @returns {Promise<{valid: boolean, errors: string[], warnings: string[], meta: any}>}
 */
export const processFile = async (file) => {
    const errors = [];
    const warnings = [];

    // 1. Type Check
    if (file.type !== "image/png") {
        return { valid: false, errors: ["Solo archivos PNG son permitidos."], warnings, meta: null };
    }

    // 2. Metadata Extraction
    const meta = await readMetadata(file);
    const dpi = meta.dpiX || 72;
    const anchoCm = (meta.width / dpi) * 2.54;
    const largoM = ((meta.height / dpi) * 2.54) / 100;

    const metaResult = {
        ...meta,
        dpi,
        anchoCm,
        largoM,
        fileName: file.name,
        fileSize: file.size
    };

    // 3. Validation Logic
    if (dpi >= 350) {
        errors.push(`DPI demasiado alto (${dpi}). Máximo recomendado: 300.`);
    }
    if (dpi < 299) {
        // Original logic was an alert/error, but maybe strict
        errors.push(`DPI bajo (${dpi}). Mínimo requerido: 300.`);
    }

    if (anchoCm > 57.5) {
        errors.push(`El ancho (${anchoCm.toFixed(1)}cm) excede el máximo de 57.5cm.`);
    }

    // Limits
    if (largoM >= 10) {
        errors.push("El largo del archivo excede los 10 metros.");
    }

    // Warnings (User confirmation needed in UI)
    if (anchoCm < 55) {
        warnings.push(`Aprovechamiento de ancho bajo (${anchoCm.toFixed(1)}cm). Recomendado: 55-57cm.`);
    }
    if (largoM < 1) {
        warnings.push(`Largo menor a 1m (${largoM.toFixed(2)}m). Se cobrará el mínimo de 1 metro.`);
    }

    return {
        valid: errors.length === 0,
        errors,
        warnings,
        meta: metaResult,
        previewUrl: URL.createObjectURL(file)
    };
};
