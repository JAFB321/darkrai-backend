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
    
    console.log('Server IP:', serverIp);
    console.log(ips.length, 'network IP found');
    console.log(ips);
    
    for (const ip of ips) {
        console.log(ip);
        try {

            const url = `http://${ip}/sync?serverIp=${serverIp}`
            const response = await fetch(url)  
            console.log(response.status);
            const body = await response.json();

            if(response.status === 200 && body.ip){
                return `http://${body.ip}`
            }
            
        } catch (error) {}

    }
    return `http://localhost:${PORT}/api/simulate`
}