import type { DependencyContainer } from "tsyringe";

import type { ILogger } from "@spt-aki/models/spt/utils/ILogger";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import type { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod";
import type { IDatabaseTables } from "@spt-aki/models/spt/server/IDatabaseTables";
const modConfig = require("../config/config.json");

const traderIds = [
    "54cb50c76803fa8b248b4571",
    "54cb57776803fa99248b456e",
    "58330581ace78e27b8b10cee",
    "5935c25fb3acc3127c3d8cd9",
    "5a7c2eca46aef81a7ca2145d",
    "5ac3b934156ae10c4430e83c",
    "5c0647fdd443bc2504c2d371"
]

class Mod implements IPostDBLoadMod
{
    private tables: IDatabaseTables;
    logger: ILogger;
    lotusModInstalled: boolean;

    private applyTradersChange() {
        for (let i in modConfig['traders']) {
            const name = modConfig['traders'][i]
            if (this.tables.traders[name]) {
                for (let ll in this.tables.traders[name].base.loyaltyLevels){
                    // get avg buy price for each traders at this LL
                    let accumCoef = 0
                    for (let i in traderIds) {
                        const id = traderIds[i]
                        accumCoef += this.tables.traders[id].base.loyaltyLevels[ll].buy_price_coef
                    }
                    const avg = Math.round(accumCoef / traderIds.length)
                    this.tables.traders[name].base.loyaltyLevels[ll].buy_price_coef = avg
                }
            }
        }
    }

    postDBLoad(container: DependencyContainer): void
    {
        this.logger = container.resolve("WinstonLogger");
        this.tables = container.resolve<DatabaseServer>("DatabaseServer").getTables();
        this.applyTradersChange()
    }
}

module.exports = { mod: new Mod() }