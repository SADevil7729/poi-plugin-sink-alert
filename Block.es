export const windowMode = true;
const { PLUGIN_PATH, PLUGIN_EXTRA_PATH } = window
import { isTest } from './index.es'
export const BlockBattleTypeAlert = (num) => {
    //禁用戰鬥陣型
    //1=単縦陣, 2=複縦陣, 3=輪形陣, 4=梯形陣, 5=単横陣, 6=警戒陣
    //7=進擊按鈕

    var str
    str = document.createElement('div')
    str.id = 'poi-plugin-sink-alert-BattleTypeBlockAlert'
    var SheepAddress = ""
    if (isTest()) {
        SheepAddress = "url('" + PLUGIN_EXTRA_PATH.replaceAll("\\", "/") + "/node_modules/poi-plugin-sink-alert/image/Sheep.png');";
    } else {
        SheepAddress = "url('" + PLUGIN_PATH.replaceAll("\\", "/") + "/node_modules/poi-plugin-sink-alert/image/Sheep.png');";
    }
    str.style = "position: fixed;"
        + "z-index: 14;"
        + "background-position: center center;background-size: cover;background-color: rgb(0, 0, 0);display: block;"
        + "background-image: "
        + SheepAddress

    var NowEventFlag = 0;
    //是否為活動期間(有無警戒陣)
    var GameWidth = getStore('layout.webview.width')
    var GameHeight = getStore('layout.webview.height')
    var WindowWidth = getStore('layout.window.width')
    var WindowHeight = getStore('layout.window.height')
    var DisplayMode = getStore('config.poi.layout.mode')
    var DisplayReverseMode = getStore('config.poi.layout.reverse')
    //「POI視窗左上角」到「遊戲本體畫面左上角」的座標差距
    //根據不同視窗布局而不同算法
    var DeltaX = 0
    var DeltaY = 0
    if (DisplayMode == 'horizontal' && DisplayReverseMode == true) {
        DeltaX = WindowWidth - GameWidth
        DeltaY = (WindowHeight - GameHeight) / 2
    }
    else if (DisplayMode == 'horizontal' && DisplayReverseMode == false) {
        DeltaX = 0
        DeltaY = (WindowHeight - GameHeight) / 2
    }
    else if (DisplayMode == 'vertical' && DisplayReverseMode == true) {
        DeltaX = (WindowWidth - GameWidth) / 2
        DeltaY = WindowHeight - GameHeight - 18.5
    }
    else if (DisplayMode == 'vertical' && DisplayReverseMode == false) {
        DeltaX = (WindowWidth - GameWidth) / 2
        DeltaY = 9
    }

    str.style.width = (GameWidth * 155 / 1200 + 15).toString() + 'px'
    str.style.height = (GameHeight * 45 / 720 + 15).toString() + 'px'

    if (NowEventFlag == 0) {
        //如果是非活動期間
        if (num == 1) {
            str.style.left = (GameWidth * 595 / 1200 + DeltaX).toString() + 'px'
            str.style.top = (GameHeight * 253 / 720 + DeltaY).toString() + 'px'
        }
        else if (num == 2) {
            str.style.left = (GameWidth * 788 / 1200 + DeltaX).toString() + 'px'
            str.style.top = (GameHeight * 253 / 720 + DeltaY).toString() + 'px'
        }
        else if (num == 3) {
            str.style.left = (GameWidth * 987 / 1200 + DeltaX).toString() + 'px'
            str.style.top = (GameHeight * 253 / 720 + DeltaY).toString() + 'px'
        }
        else if (num == 4) {
            str.style.left = (GameWidth * 695 / 1200 + DeltaX).toString() + 'px'
            str.style.top = (GameHeight * 493 / 720 + DeltaY).toString() + 'px'
        }
        else if (num == 5) {
            str.style.left = (GameWidth * 892 / 1200 + DeltaX).toString() + 'px'
            str.style.top = (GameHeight * 493 / 720 + DeltaY).toString() + 'px'
        }
    }
    if (num == 7) {
        str.style.left = (GameWidth * 325 / 1200 + DeltaX).toString() + 'px'
        str.style.top = (GameHeight * 283 / 720 + DeltaY).toString() + 'px'
        str.style.width = (GameWidth * 205 / 1200 + 20).toString() + 'px'
        str.style.height = (GameHeight * 154 / 720 + 20).toString() + 'px'
    }
    document.getElementById('poi').append(str);
}

export const removeBlockBattleTypeAlert = () => {
    var GameWidth = getStore('layout.webview.width')
    var GameHeight = getStore('layout.webview.height')
    var WindowWidth = getStore('layout.window.width')
    var WindowHeight = getStore('layout.window.height')
    var DisplayMode = getStore('config.poi.layout.mode')
    var DisplayReverseMode = getStore('config.poi.layout.reverse')
    //「POI視窗左上角」到「遊戲本體畫面左上角」的座標差距
    //根據不同視窗布局而不同算法
    var DeltaX = 0
    var DeltaY = 0
    if (DisplayMode == 'horizontal' && DisplayReverseMode == true) {
        DeltaX = WindowWidth - GameWidth
        DeltaY = (WindowHeight - GameHeight) / 2
    }
    else if (DisplayMode == 'horizontal' && DisplayReverseMode == false) {
        DeltaX = 0
        DeltaY = (WindowHeight - GameHeight) / 2
    }
    else if (DisplayMode == 'vertical' && DisplayReverseMode == true) {
        DeltaX = (WindowWidth - GameWidth) / 2
        DeltaY = WindowHeight - GameHeight - 18.5
    }
    else if (DisplayMode == 'vertical' && DisplayReverseMode == false) {
        DeltaX = (WindowWidth - GameWidth) / 2
        DeltaY = 9
    }

    var HideAddress = ""
    if (isTest()) {
        HideAddress = "url('" + PLUGIN_EXTRA_PATH.replaceAll("\\", "/") + "/node_modules/poi-plugin-sink-alert/image/Hide.png');";
    } else {
        HideAddress = "url('" + PLUGIN_PATH.replaceAll("\\", "/") + "/node_modules/poi-plugin-sink-alert/image/Hide.png');";
    }

    var str;
    str = document.createElement('div');
    str.id = 'poi-plugin-sink-alert-removeBattleTypeBlockAlert';
    str.style = "position: fixed;"
        + "z-index: 14;"
        + "background-position: center center;background-size: contain;background-color: rgba(0, 0, 0,0);display: block;"
        + "background-image: "
        + HideAddress

    str.style.width = (GameWidth * 200 / 1200 + 15).toString() + 'px'
    str.style.height = (GameHeight * 45 / 720 + 15).toString() + 'px'
    str.style.left = (GameWidth * 950 / 1200 + DeltaX).toString() + 'px'
    str.style.top = (GameHeight * 670 / 720 + DeltaY).toString() + 'px'

    document.getElementById('poi').append(str);
}
