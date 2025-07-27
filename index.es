import { handleGameResponse, KeyResponse, MouseResponse } from './ShipAnalysis.es'
//import { handleGameRequest } from './ShipAnalysis.es'
import { Settings as settingsClass } from './settings'
export const windowMode = true;

export function pluginDidLoad() {
    window.addEventListener('game.response', handleGameResponse);
    //window.addEventListener('game.request', handleGameRequest)
    window.addEventListener("keyup", KeyResponse);
    window.addEventListener("mouseup", MouseResponse);

}
export function pluginWillUnload() {
    window.removeEventListener('game.response', handleGameResponse);
    //window.removeEventListener('game.request', handleGameRequest);
    window.removeEventListener('keyup', KeyResponse);
    window.removeEventListener("mouseup", MouseResponse);
}
export function isTest(){
    var plugins=getStore('plugins')
    for(var i=0;i<plugins.length;i++){
        if(plugins[i].id=="poi-plugin-sink-alert"){
            return plugins[i].isExtra
        }
    }
}
export {
    settingsClass
}