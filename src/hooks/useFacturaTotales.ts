import type { FacturaForm } from "../types";

export const useFacturaTotales = (items: FacturaForm["items"]) => {
    const igvRate = 0.18;

    const subtotalCalc = items.reduce((acc, item) => {
        const totalItem = (item.cantidad || 0) * (item.precioUnitario || 0);
        const valorVentaItem = totalItem / (1 + igvRate);
        return acc + valorVentaItem;
    }, 0);

    const igvCalc = items.reduce((acc, item) => {
        const totalItem = (item.cantidad || 0) * (item.precioUnitario || 0);
        const valorVentaItem = totalItem / (1 + igvRate);
        const igvItem = totalItem - valorVentaItem;
        return acc + igvItem;
    }, 0);

    const totalCalc = subtotalCalc + igvCalc;

    return {
        subtotalCalc,
        igvCalc,
        totalCalc,
        igvRate
    };
};