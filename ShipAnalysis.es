import { BlockBattleTypeAlert, removeBlockBattleTypeAlert } from './Block.es'
export const windowMode = true;
import Swal from 'sweetalert2'
import { getShipImgPathHelper } from 'poi-plugin-navy-album'
import './Style.css'
const ServerAddress = getStore('info.server.ip')
const { PLUGIN_PATH, PLUGIN_EXTRA_PATH } = window
import { isTest } from './index.es'
const sgRaw = _.get(getStore(), ['const', '$shipgraph'], [])
var NodeNum = 0//戰鬥結束/剛出擊之後，路上經過幾個節點(每次戰鬥後歸0)，用來計算delaytime

export const handleGameResponse = (e) => {
    const { path, body } = e.detail;
    switch (path) {
        case '/kcsapi/api_req_map/start': {
        }
        case '/kcsapi/api_req_map/next': {
            NodeNum += 1
            var RecommendBattleType = document.querySelector('[id=poi-plugin-sink-alert-settings-RecommendBattleType]:checked')
            //console.log(body)
            if (RecommendBattleType != null && [4, 5, 7].includes(body.api_event_id)) {
                //如果是4(通常戰鬥) 5(BOSS戰鬥) 7(航空戰4或航空偵查0)
                if ([7].includes(body.api_event_id && [0].includes(body.api_event_kind))) {
                } else {
                    FindEnemy(body.api_rashin_flg, path)
                }
            }
        }
        case '/kcsapi/api_req_battle_midnight/sp_midnight': {
        }
        case '/kcsapi/api_port/port': {
        }
        case '/kcsapi/api_req_sortie/ld_airbattle': {
        }
        case '/kcsapi/api_req_sortie/battle': {
            CleanBlockImage()
            break;
        }
        case '/kcsapi/api_req_sortie/battleresult': {
            CleanBlockImage()
            var FleetHp = getStore('battle.result.deckHp')
            var FleetID = getStore('battle.result.deckShipId')
            var BossCell = getStore('battle.result.boss')
            var DamagedFlag = 0
            var FlagShipDamagedFlag = 0
            for (var i = 0; i < FleetHp.length; i++) {
                if (FleetHp[i] != 0 && FleetHp[i] * 4 <= GetMaxHP(FleetID[i])) {
                    DamagedFlag++
                    if (i == 0) {
                        FlagShipDamagedFlag++
                    }
                }
            }
            if (DamagedFlag >= 1 && !BossCell) {
                var CheckSheepAlert = document.querySelector('[id=poi-plugin-sink-alert-settings-SheepAlert]:checked')
                var CheckFullScreenAlert = document.querySelector('[id=poi-plugin-sink-alert-settings-FullScreenAlert]:checked')
                if (CheckSheepAlert != null && FlagShipDamagedFlag == 0) {
                    //羊羊版大破警告！！！
                    setTimeout(BlockBattleTypeAlert, 10000, 7);
                    setTimeout(removeBlockBattleTypeAlert, 10000);
                }
                if (CheckFullScreenAlert != null) {
                    //全屏版大破警告！！！
                    var fleet = getStore('info.fleets.0.api_ship').map(id => GetAlbumID(id))
                    var ShipImageUrlHTML = ''
                    ShipImageUrlHTML += "<img src='"
                    if (isTest()) {
                        ShipImageUrlHTML += PLUGIN_EXTRA_PATH.replaceAll("\\", "/") + "/node_modules/poi-plugin-sink-alert/image/Nigero.jpg"
                    } else {
                        ShipImageUrlHTML += PLUGIN_PATH.replaceAll("\\", "/") + "/node_modules/poi-plugin-sink-alert/image/Nigero.jpg"
                    }
                    ShipImageUrlHTML += "' width='200px' height='200px' alt='一張圖片'>"
                    ShipImageUrlHTML += "<br><br>"
                    ShipImageUrlHTML += "<div>大破警告!!!</div>"
                    ShipImageUrlHTML += "<br>"
                    for (var i = 0; i < fleet.length; i++) {
                        if (fleet[i] != null) {
                            if (FleetHp[i] != 0 && FleetHp[i] * 4 <= GetMaxHP(FleetID[i])) {
                                ShipImageUrlHTML += "<div style='font-size:24px;text-align: right; margin: 30px;'>"
                                ShipImageUrlHTML += "LV" + GetLV(FleetID[i])
                                ShipImageUrlHTML += "<img src='http://"
                                ShipImageUrlHTML += ServerAddress
                                ShipImageUrlHTML += getShipImgPathHelper(sgRaw)(fleet[i], "banner", true)
                                ShipImageUrlHTML += "' width='240' height='60' alt='一張圖片'></div>"
                            }
                        }
                    }
                    var backdropImage = "'rgba(255, 32, 32, 0.4)' "
                    backdropImage += "url('"
                    if (isTest()) {
                        backdropImage += PLUGIN_EXTRA_PATH.replaceAll("\\", "/") + "/node_modules/poi-plugin-sink-alert/image/Kasumi.gif"
                    } else {
                        backdropImage += PLUGIN_PATH.replaceAll("\\", "/") + "/node_modules/poi-plugin-sink-alert/image/Kasumi.gif"
                    }
                    backdropImage += "') "
                    backdropImage += "left top "
                    backdropImage += "no-repeat "

                    //彈出全屏警告
                    Swal.fire({
                        //title: '大破警告!',
                        //text: '咩嚕咩嚕咩！！！',
                        width: "500px",
                        //icon: 'question',
                        confirmButtonText: '我知道風險了',
                        backdrop: backdropImage,//是否允許點警告外的背景而關閉警告
                        allowOutsideClick: false,
                        background: "#2F343C",
                        color: "#cbad92ff",
                        html: ShipImageUrlHTML,
                    })
                }

            }
            break;
        }
    }
}

function CleanBlockImage() {
    //把所有的羊羊圖片清除
    while (document.getElementById('poi-plugin-sink-alert-BattleTypeBlockAlert') != null) {
        document.getElementById('poi-plugin-sink-alert-BattleTypeBlockAlert').remove();
    }
    while (document.getElementById('poi-plugin-sink-alert-removeBattleTypeBlockAlert') != null) {
        document.getElementById('poi-plugin-sink-alert-removeBattleTypeBlockAlert').remove();
    }
}

function FindEnemy(RashinFlag, path) {
    var Sortie = getStore('sortie');
    var SystemConst = getStore('const');
    var Fleets = getStore('info.fleets');
    var Ships = getStore('info.ships');
    var SortieFleetNum = 0
    //第幾艦隊出擊，假設為單艦隊
    if (Sortie.sortieStatus[0]) {
        SortieFleetNum = 0
    }
    else if (Sortie.sortieStatus[1]) {
        SortieFleetNum = 1
    }
    else if (Sortie.sortieStatus[2]) {
        SortieFleetNum = 2
    }
    else if (Sortie.sortieStatus[3]) {
        SortieFleetNum = 3
    }

    var SortieShipNum = 0
    //總共幾艘船出擊
    for (var i = 0; i < Fleets[SortieFleetNum].api_ship.length; i++) {
        if (Fleets[SortieFleetNum].api_ship[i] >= 1) {
            SortieShipNum++
        }

    }
    if (SortieShipNum <= 3) {
        //小於3隻免選陣型
        return -1
    }

    var SortieSubmarineNum = 0
    var SotrieEquip274Num = 0
    //12cm30連装噴進砲改二 ID274 
    for (var i = 0; i < SortieShipNum; i++) {
        if ([13, 14].includes(GetShipType(Fleets[SortieFleetNum].api_ship[i]))) {
            //是不是潛水艇 13=潛水艇 14=潛水空母
            SortieSubmarineNum++
        } else {
            //不是潛水艇的船，有沒有裝噴二
            var Flag274 = false
            for (var j = 0; j < Ships[Fleets[SortieFleetNum].api_ship[i]].api_slotnum; j++) {
                if (Ships[Fleets[SortieFleetNum].api_ship[i]].api_slot[j] >= 1) {
                    if (GetEquipAlbumID(Ships[Fleets[SortieFleetNum].api_ship[i]].api_slot[j]) == 274) {
                        SotrieEquip274Num++
                        Flag274 = true
                        break
                    }
                }
            }
            if (Flag274 == false && Ships[Fleets[SortieFleetNum].api_ship[i]].api_slot_ex != -1) {
                if (GetEquipAlbumID(Ships[Fleets[SortieFleetNum].api_ship[i]].api_slot_ex) == 274) {
                    SotrieEquip274Num++
                }
            }
        }
    }
    var EnemySubmarineNum = 0;
    if (Sortie.nextEnemyInfo != undefined && Sortie.nextEnemyInfo.length >= 1 && Sortie.nextEnemyInfo[0].api_ship_ids != undefined) {
        for (var i = 0; i < Sortie.nextEnemyInfo[0].api_ship_ids.length; i++) {
            //假設敵人是單艦隊
            if ([13, 14].includes(SystemConst.$ships[Sortie.nextEnemyInfo[0].api_ship_ids[i]].api_stype)) {
                //如果敵人艦種有潛水艇或潛水空母
                EnemySubmarineNum += 1;
            }
        }
    }
    var DelayTime = 0
    if (RashinFlag == 1) {
        DelayTime = 9800
        //需不需要轉羅盤
    }
    else {
        DelayTime = 4950
    }
    if (path == "/kcsapi/api_req_map/start") {
        DelayTime += 1950
        //從母港第一次出擊就遇到戰鬥
    }
    if (NodeNum == 1) {
        DelayTime += 900
        //戰鬥結束/剛從母港出擊之後，路上經過 NodeNum 個節點才遇到戰鬥(每次戰鬥後歸0)，用來計算delaytime
    }
    NodeNum = 0

    //陣型推薦
    //部分海域特例
    var SpecialFlag = false

    if (Sortie.sortieMapId == "16") {
        if ([8, 11, 12, 16].includes(Sortie.currentNode)) {
            //例外：全員均為潛水艇或防空100%
            //1=単縦陣, 2=複縦陣, 3=輪形陣, 4=梯形陣, 5=単横陣, 6=警戒陣
            if (SortieSubmarineNum + SotrieEquip274Num < SortieShipNum) {
                setTimeout(BlockBattleTypeAlert, DelayTime, 1);
                setTimeout(BlockBattleTypeAlert, DelayTime, 2);
                setTimeout(BlockBattleTypeAlert, DelayTime, 4);
                setTimeout(BlockBattleTypeAlert, DelayTime, 5);
                SpecialFlag = true
            }
        }
    }
    else if (Sortie.sortieMapId == "35") {
        if ([5, 12].includes(Sortie.currentNode)) {
            //例外：潛水艇和水上混編
            setTimeout(BlockBattleTypeAlert, DelayTime, 3);
            setTimeout(BlockBattleTypeAlert, DelayTime, 5);
            SpecialFlag = true
        }
    }
    else if (Sortie.sortieMapId == "41") {
        if ([4, 11].includes(Sortie.currentNode)) {
            //例外：潛水艇和水上混編
            setTimeout(BlockBattleTypeAlert, DelayTime, 1);
            setTimeout(BlockBattleTypeAlert, DelayTime, 3);
            SpecialFlag = true
        }
    }
    else if (Sortie.sortieMapId == "42") {
        if ([2].includes(Sortie.currentNode)) {
            //例外：潛水艇和水上混編
            setTimeout(BlockBattleTypeAlert, DelayTime, 1);
            setTimeout(BlockBattleTypeAlert, DelayTime, 3);
            setTimeout(BlockBattleTypeAlert, DelayTime, 5);
            SpecialFlag = true
        }
    }
    else if (Sortie.sortieMapId == "43") {
        if ([1].includes(Sortie.currentNode)) {
            //例外：潛水艇和水上混編
            setTimeout(BlockBattleTypeAlert, DelayTime, 1);
            setTimeout(BlockBattleTypeAlert, DelayTime, 3);
            SpecialFlag = true
        }
    }
    else if (Sortie.sortieMapId == "44") {
        if ([11].includes(Sortie.currentNode)) {
            //例外：潛水艇和水上混編
            setTimeout(BlockBattleTypeAlert, DelayTime, 3);
            setTimeout(BlockBattleTypeAlert, DelayTime, 5);
            SpecialFlag = true
        }
    }
    else if (Sortie.sortieMapId == "52") {
        if ([3, 9, 12, 19].includes(Sortie.currentNode)) {
            //例外：全員均為潛水艇或防空100%
            if (SortieSubmarineNum + SotrieEquip274Num < SortieShipNum) {
                setTimeout(BlockBattleTypeAlert, DelayTime, 1);
                setTimeout(BlockBattleTypeAlert, DelayTime, 2);
                setTimeout(BlockBattleTypeAlert, DelayTime, 4);
                setTimeout(BlockBattleTypeAlert, DelayTime, 5);
                SpecialFlag = true
            }
        }
        else if ([4].includes(Sortie.currentNode)) {
            //例外：潛水艇和水上混編
            if (EnemySubmarineNum >= 1) {
                setTimeout(BlockBattleTypeAlert, DelayTime, 1);
                setTimeout(BlockBattleTypeAlert, DelayTime, 3);
                setTimeout(BlockBattleTypeAlert, DelayTime, 5);
                SpecialFlag = true
            } else {
                setTimeout(BlockBattleTypeAlert, DelayTime, 2);
                setTimeout(BlockBattleTypeAlert, DelayTime, 3);
                setTimeout(BlockBattleTypeAlert, DelayTime, 4);
                setTimeout(BlockBattleTypeAlert, DelayTime, 5);
                SpecialFlag = true
            }
        }
    }
    else if (Sortie.sortieMapId == "53") {
        if ([9, 10, 11, 14, 16, 20, 21].includes(Sortie.currentNode)) {
            //例外：夜戰
            setTimeout(BlockBattleTypeAlert, DelayTime, 3);
            setTimeout(BlockBattleTypeAlert, DelayTime, 5);
            SpecialFlag = true
        }
    }
    else if (Sortie.sortieMapId == "54") {
        if ([3].includes(Sortie.currentNode)) {
            //例外：潛水艇和水上混編
            setTimeout(BlockBattleTypeAlert, DelayTime, 1);
            setTimeout(BlockBattleTypeAlert, DelayTime, 3);
            setTimeout(BlockBattleTypeAlert, DelayTime, 5);
            SpecialFlag = true
        }
        else if ([6, 8, 10, 19, 20].includes(Sortie.currentNode)) {
            //例外：夜戰
            setTimeout(BlockBattleTypeAlert, DelayTime, 3);
            setTimeout(BlockBattleTypeAlert, DelayTime, 5);
            SpecialFlag = true
        }
    }
    else if (Sortie.sortieMapId == "55") {
        if ([19, 28].includes(Sortie.currentNode)) {
            //例外：潛水艇和水上混編
            setTimeout(BlockBattleTypeAlert, DelayTime, 3);
            setTimeout(BlockBattleTypeAlert, DelayTime, 5);
            SpecialFlag = true
        }
        else if ([7, 13].includes(Sortie.currentNode)) {
            //例外：夜戰
            setTimeout(BlockBattleTypeAlert, DelayTime, 3);
            setTimeout(BlockBattleTypeAlert, DelayTime, 5);
            SpecialFlag = true
        }
    }
    else if (Sortie.sortieMapId == "64") {
        if ([4, 6, 7, 9, 15, 16, 17, 19].includes(Sortie.currentNode)) {
            //例外：全員均為潛水艇或防空100%
            if (SortieSubmarineNum + SotrieEquip274Num < SortieShipNum) {
                setTimeout(BlockBattleTypeAlert, DelayTime, 1);
                setTimeout(BlockBattleTypeAlert, DelayTime, 2);
                setTimeout(BlockBattleTypeAlert, DelayTime, 4);
                setTimeout(BlockBattleTypeAlert, DelayTime, 5);
                SpecialFlag = true
            }
        }
        else if ([5].includes(Sortie.currentNode)) {
            //例外：潛水艇和水上混編
            setTimeout(BlockBattleTypeAlert, DelayTime, 1);
            setTimeout(BlockBattleTypeAlert, DelayTime, 3);
            setTimeout(BlockBattleTypeAlert, DelayTime, 5);
            SpecialFlag = true
        }
    }
    else if (Sortie.sortieMapId == "65") {
        if ([7, 8, 15, 16].includes(Sortie.currentNode)) {
            //例外：全員均為潛水艇或防空100%
            if (SortieSubmarineNum + SotrieEquip274Num < SortieShipNum) {
                setTimeout(BlockBattleTypeAlert, DelayTime, 1);
                setTimeout(BlockBattleTypeAlert, DelayTime, 2);
                setTimeout(BlockBattleTypeAlert, DelayTime, 4);
                setTimeout(BlockBattleTypeAlert, DelayTime, 5);
                SpecialFlag = true
            }
        }
        else if ([10].includes(Sortie.currentNode)) {
            //例外：夜戰
            setTimeout(BlockBattleTypeAlert, DelayTime, 3);
            setTimeout(BlockBattleTypeAlert, DelayTime, 5);
            SpecialFlag = true
        }
    }
    else if (Sortie.sortieMapId == "72") {
        if ([7].includes(Sortie.currentNode)) {
            //例外：潛水艇和水上混編
            setTimeout(BlockBattleTypeAlert, DelayTime, 1);
            setTimeout(BlockBattleTypeAlert, DelayTime, 3);
            setTimeout(BlockBattleTypeAlert, DelayTime, 5);
            SpecialFlag = true
        }
    }
    else if (Sortie.sortieMapId == "74") {
        if ([4, 5, 13, 17].includes(Sortie.currentNode)) {
            //例外：全員均為潛水艇或防空100%
            if (SortieSubmarineNum + SotrieEquip274Num < SortieShipNum) {
                setTimeout(BlockBattleTypeAlert, DelayTime, 1);
                setTimeout(BlockBattleTypeAlert, DelayTime, 2);
                setTimeout(BlockBattleTypeAlert, DelayTime, 4);
                setTimeout(BlockBattleTypeAlert, DelayTime, 5);
                SpecialFlag = true
            }
        }
        else if ([12, 20].includes(Sortie.currentNode)) {
            //例外：潛水艇和水上混編
            setTimeout(BlockBattleTypeAlert, DelayTime, 1);
            setTimeout(BlockBattleTypeAlert, DelayTime, 2);
            setTimeout(BlockBattleTypeAlert, DelayTime, 3);
            setTimeout(BlockBattleTypeAlert, DelayTime, 4);
            SpecialFlag = true
        }
        else if ([10, 18].includes(Sortie.currentNode)) {
            //例外：潛水艇和水上混編
            if (SortieSubmarineNum == SortieShipNum) {
                //如果我方全員都是潛水艇
                setTimeout(BlockBattleTypeAlert, DelayTime, 2);
                setTimeout(BlockBattleTypeAlert, DelayTime, 3);
                setTimeout(BlockBattleTypeAlert, DelayTime, 4);
                setTimeout(BlockBattleTypeAlert, DelayTime, 5);
            } else {
                setTimeout(BlockBattleTypeAlert, DelayTime, 1);
                setTimeout(BlockBattleTypeAlert, DelayTime, 2);
                setTimeout(BlockBattleTypeAlert, DelayTime, 3);
                setTimeout(BlockBattleTypeAlert, DelayTime, 4);
            }
            SpecialFlag = true
        }
        else if ([16, 21, 22, 23].includes(Sortie.currentNode)) {
            //例外：潛水艇和水上混編
            setTimeout(BlockBattleTypeAlert, DelayTime, 3);
            setTimeout(BlockBattleTypeAlert, DelayTime, 5);
            SpecialFlag = true
        }
    }
    else if (Sortie.sortieMapId == "75") {
        if ([1].includes(Sortie.currentNode)) {
            //例外：全員均為潛水艇或防空100%
            if (SortieSubmarineNum + SotrieEquip274Num < SortieShipNum) {
                setTimeout(BlockBattleTypeAlert, DelayTime, 1);
                setTimeout(BlockBattleTypeAlert, DelayTime, 2);
                setTimeout(BlockBattleTypeAlert, DelayTime, 4);
                setTimeout(BlockBattleTypeAlert, DelayTime, 5);
                SpecialFlag = true
            }
        }
    }
    if (SpecialFlag == false && Sortie.nextEnemyInfo != undefined && Sortie.nextEnemyInfo.length >= 1 && Sortie.nextEnemyInfo[0].api_ship_ids != undefined) {
        if (EnemySubmarineNum == 0) {
            //單縱陣Only
            //1=単縦陣, 2=複縦陣, 3=輪形陣, 4=梯形陣, 5=単横陣, 6=警戒陣
            setTimeout(BlockBattleTypeAlert, DelayTime, 2);
            setTimeout(BlockBattleTypeAlert, DelayTime, 3);
            setTimeout(BlockBattleTypeAlert, DelayTime, 4);
            setTimeout(BlockBattleTypeAlert, DelayTime, 5);

        }
        else if (EnemySubmarineNum == 3 || EnemySubmarineNum == Sortie.nextEnemyInfo[0].api_ship_ids.length) {
            //單橫陣Only
            setTimeout(BlockBattleTypeAlert, DelayTime, 1);
            setTimeout(BlockBattleTypeAlert, DelayTime, 2);
            setTimeout(BlockBattleTypeAlert, DelayTime, 3);
            setTimeout(BlockBattleTypeAlert, DelayTime, 4);
        }
        else {
            //混合陣容，不判斷
        }
    }
    setTimeout(removeBlockBattleTypeAlert, DelayTime);
}


function GetAlbumID(ID) {
    if (ID >= 1) {
        var Album = getStore('info.ships')
        return Album[ID].api_ship_id
    } else {
        return null
    }
}
function GetEquipAlbumID(ID) {
    if (ID >= 1) {
        var Album = getStore('info.equips')
        return Album[ID].api_slotitem_id
    } else {
        return null
    }
}
function GetMaxHP(ID) {
    if (ID >= 1) {
        var Album = getStore('info.ships')
        return Album[ID].api_maxhp

    } else {
        return null
    }
}
function GetLV(ID) {
    if (ID >= 1) {
        var Album = getStore('info.ships')
        return Album[ID].api_lv

    } else {
        return null
    }
}
function GetShipType(ID) {
    //取得艦種
    var AlbumID = GetAlbumID(ID)
    if (AlbumID >= 1) {
        var Album = getStore('const.$ships')
        return Album[AlbumID].api_stype
    } else {
        return null
    }
}
export const KeyResponse = (e) => {
    if (e.key == "q") {
        CleanBlockImage()
    }
}
export const MouseResponse = (e) => {
    if (e.srcElement.id == 'poi-plugin-sink-alert-removeBattleTypeBlockAlert') {
        CleanBlockImage()
    }
}