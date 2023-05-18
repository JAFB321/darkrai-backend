import { getAlertas, registrarAlertas } from "../routes/alertas.service";
import { getLocalIP } from "../utils/esp-finder";
import { pushAlert } from "./pushover";

const localIp = getLocalIP()

export class NotificationsScheduler {
  private intervalID

  constructor(){}

  public start(){
    if(this.intervalID) return

    setTimeout(() => {
      this.checkAlerts().catch(console.error)
      this.sendOpenApp().catch(console.error)
    }, 500);

    this.intervalID = setInterval(() => {
      this.checkAlerts().catch(console.error)
    }, 10000)
    // 60000
  }

  public stop(){
    if(!this.intervalID) return
    clearInterval(this.intervalID)
    this.intervalID = null
  }

  async checkAlerts() {
    const alertas = await getAlertas()
    
    if(alertas.length){
      console.log('Enviando alertas');
      
      pushAlert({
        message: 'Un medicamento necesita ser suministrado',
        title: 'Dosis para dispensar',
        url: `http://${localIp}:3000/suministrar`,
        url_title: 'Ver detalles'
      })
    }

    const dosisIds = alertas.map(({dosis}) => dosis.id)
    await Promise.allSettled(dosisIds.map((dosisId) => registrarAlertas(dosisId+'')))
  }

  async sendOpenApp(){
    pushAlert({
      message: 'Bienvenido, el sistema esta listo',
      title: 'Darkrai',
      url: `http://${localIp}:3000/`,
      url_title: 'Abrir app'
    })
  }
}

export default new NotificationsScheduler()