import dayjs from 'dayjs'
import { Dosis } from "../entity";
import { Between } from "typeorm";
import DB from "../data-source";

const dosisRepository = DB.getRepository(Dosis);

export const getAlertas = async () => {
    const now = dayjs()

    const dosisEnRango = await dosisRepository.find({
        where: {
            suministrado: false,
            alertado: false,
            fecha: Between(now.subtract(15, 'minutes').toDate(), now.add(15, 'minutes').toDate()),
            planMedicacion: {
                activo: true
            }
        },
        order: {
            fecha:{
                direction: 'ASC'
            }
        },
        relations: {
            planMedicacion: {
                medicamento: true,
                tratamiento: {
                    paciente: true
                }
            }
        }
    })

    type AlertType = '5-min' | '10-min' | 'last-10-min'
    type Alert = { type: AlertType, dosis: Dosis, minutes: number } 
    const alertas: Alert[] = []
    
    for (const dosis of dosisEnRango) {
        const fechaDosis = dayjs(dosis.fecha)
        const minutosFaltantes = fechaDosis.diff(now, 'minutes')

        let type: AlertType = null
        if(minutosFaltantes > 4 && minutosFaltantes <= 7) type = '5-min'
        if(minutosFaltantes > 9 && minutosFaltantes <= 12) type = '10-min'
        if(minutosFaltantes > -12 && minutosFaltantes <= -9) type = 'last-10-min'

        if(!type) continue

        alertas.push({
            dosis,
            type,
            minutes: minutosFaltantes
        })
        
    }

    // alertas.push({
    //     dosis: dosisEnRango[0],
    //     minutes: 123,
    //     type: '5-min'
    // })

    return alertas
}

export const registrarAlertas = (dosisId: string) => {
    if(!dosisId) return
    return dosisRepository.update({id: +dosisId}, { alertado: true })
}