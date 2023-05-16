
export const getAlerta = (pasoActual: number, pasosTotal: number) => {
    const newPasoActual = pasoActual
    const pastillasRestantes = pasosTotal - newPasoActual

    if(pastillasRestantes === 0) return 3;
    if(pastillasRestantes === 1) return 2;
    if(pastillasRestantes === 2) return 1;
    return 0;
}