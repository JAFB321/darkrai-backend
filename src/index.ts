import { PORT } from './config'
import AppDataSource from "./data-source"
import app from './app'
import { findEspIP, searchEspIP } from './utils/esp-finder';

AppDataSource.initialize().then(async () => {
    console.log('AppDataSource Initialized ');
    
    const espURL = await findEspIP()
    console.log('ESP8266 URL:', espURL);
    app.set('esp_url', espURL)

    app.listen(PORT, '0.0.0.0', () => {
        console.log('Server listening on port', PORT);     
    })
    
}).catch(error => console.log(error))
