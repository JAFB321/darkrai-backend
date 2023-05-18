import find from 'local-devices'
import nodeIP from 'ip'
import fetch from 'node-fetch'
import { DISABLE_SEARCH_IP, PORT } from '../config'

export const searchEspIP = async () => {
    const ips = await find({skipNameResolution: true})
    return ips.map(({ip}) => ip)
}

export const getLocalIP = (): string => {
    const ip = nodeIP.address()    
    return ip || `localhost`
}

export const findEspIP = async () => {
    const serverIp = getLocalIP()
    console.log(serverIp);
    
    const ips = DISABLE_SEARCH_IP ? [] : await searchEspIP()
    console.log(ips);
    
    const foundIp = await new Promise<string>((resolve) => {

        if(DISABLE_SEARCH_IP){
            resolve(null)
        } else {
            setTimeout(() => {
                resolve(null)
            }, 30000);
        }

        // Search esp accross network
        ips.forEach(async (ip) => {
            try {
                    const url = `http://${ip}/sync?serverIp=${serverIp}`
                    const response = await fetch(url)  
                    console.log(ip, response.status);
                    const body = await response.json();
        
                    if(response.status === 200 && body.ip){
                        resolve(`http://${body.ip}`)
                    }    
            } catch (error) {}
        })

    }).catch<null>(() => null)

    if(foundIp) return foundIp
    else return `http://localhost:${PORT}/api/simulate`

}