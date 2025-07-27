import styled from 'styled-components'
import React, { PureComponent } from 'react'
import {
    Checkbox, Position
} from '@blueprintjs/core'
import { Tooltip } from 'views/components/etc/overlay'

const OptionCheckbox = styled(Checkbox)`
  margin-top: 10px;
  margin-bottom: 10px;
`

const fs = require('fs');
const { APPDATA_PATH } = window


class Settings extends PureComponent {
    static propTypes = {
    }
    constructor() {
        super();
        var ConfigPath = APPDATA_PATH.replaceAll("\\", "/") + '/poi-plugin-sink-alert/'
        var ConfigData
        this.SheepAlertFlag = ''
        this.FullScreenAlertFlag = ''
        this.RecommendBattleTypeFlag = ''

        if (fs.existsSync(ConfigPath)) {
            if (fs.existsSync(ConfigPath + 'config.json')) {
                ConfigData = JSON.parse(fs.readFileSync(ConfigPath + 'config.json', { encoding: 'utf8', flag: 'r' }));
                this.SheepAlertFlag = ConfigData.SheepAlert
                this.FullScreenAlertFlag = ConfigData.FullScreenAlert
                this.RecommendBattleTypeFlag = ConfigData.RecommendBattleType
            }
            this.forceUpdate()
        } else {
            fs.mkdirSync(ConfigPath);
            fs.writeFile(ConfigPath + 'config.json',
                '{"SheepAlert":"true"'
                + ',"FullScreenAlert":"true"'
                + ',"RecommendBattleType":"true"'
                + ',"Version":"1.0.0"'
                + '}', err => { });
            this.SheepAlertFlag = "true"
            this.FullScreenAlertFlag = "true"
            this.RecommendBattleTypeFlag = "true"
        }
    }

    state = { result: "" };
    HandleButtonChange = e => {
        if (e.target.id == 'poi-plugin-sink-alert-settings-SheepAlert') {
            if (this.SheepAlertFlag == "") {
                this.SheepAlertFlag = "true"
            }
            else {
                this.SheepAlertFlag = ""
            }
        }
        else if (e.target.id == 'poi-plugin-sink-alert-settings-FullScreenAlert') {
            if (this.FullScreenAlertFlag == "") {
                this.FullScreenAlertFlag = "true"
            }
            else {
                this.FullScreenAlertFlag = ""
            }
        }
        else if (e.target.id == 'poi-plugin-sink-alert-settings-RecommendBattleType') {
            if (this.RecommendBattleTypeFlag == "") {
                this.RecommendBattleTypeFlag = "true"
            }
            else {
                this.RecommendBattleTypeFlag = ""
            }
        }
        var ConfigPath = APPDATA_PATH.replaceAll("\\", "/") + '/poi-plugin-sink-alert/'
        if (fs.existsSync(ConfigPath)) {
            fs.writeFile(ConfigPath + 'config.json',
                '{"SheepAlert":"' + this.SheepAlertFlag
                + '","FullScreenAlert":"' + this.FullScreenAlertFlag
                + '","RecommendBattleType":"' + this.RecommendBattleTypeFlag
                + '","Version":"1.0.0"'
                + '}', err => { });
        } else {
            fs.mkdirSync(ConfigPath);
            fs.writeFile(ConfigPath + 'config.json',
                '{"SheepAlert":"true"'
                + ',"FullScreenAlert":"true"'
                + ',"RecommendBattleType":"true"'
                + ',"Version":"1.0.0"'
                + '}', err => { });
            this.SheepAlertFlag = "true"
            this.FullScreenAlertFlag = "true"
            this.RecommendBattleTypeFlag = "true"
        }
        this.forceUpdate()
    }

    render() {
        return (
            <div
                id="poi-plugin-sink-alert-settings"
                style={{
                    display: 'grid',
                    gridTemplate: 'auto/2fr 6fr 10fr',
                    marginBottom: '1.8em',
                    alignItems: 'stretch',
                }}
            >
                <Checkbox
                    id="poi-plugin-sink-alert-settings-SheepAlert"
                    onChange={this.HandleButtonChange}
                    checked={this.SheepAlertFlag}
                />
                <Tooltip
                    content="大破後把進擊按鈕遮起來"
                    position={Position.BOTTOM}
                >
                    <div>{"羊羊版大破警告"}</div>
                </Tooltip>
                <br />
                <Checkbox
                    id="poi-plugin-sink-alert-settings-FullScreenAlert"
                    onChange={this.HandleButtonChange}
                    checked={this.FullScreenAlertFlag}
                />

                <Tooltip
                    content="大破後跳出全屏警告，無法點擊背景關閉"
                    position={Position.BOTTOM}
                >
                    <div>{"全屏版大破警告"}</div>
                </Tooltip>
                <br />
                <Checkbox
                    id="poi-plugin-sink-alert-settings-RecommendBattleType"
                    onChange={this.HandleButtonChange}
                    checked={this.RecommendBattleTypeFlag}
                />
                <Tooltip
                    content="把不建議選的陣型遮起來"
                    position={Position.BOTTOM}
                >
                    <div>{"海域建議陣型"}</div>
                </Tooltip>
            </div>
        )
    }
}

export { Settings }
