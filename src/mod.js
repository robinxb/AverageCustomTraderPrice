"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const modConfig = require("../config/config.json");
const traderIds = [
    "54cb50c76803fa8b248b4571",
    "54cb57776803fa99248b456e",
    "58330581ace78e27b8b10cee",
    "5935c25fb3acc3127c3d8cd9",
    "5a7c2eca46aef81a7ca2145d",
    "5ac3b934156ae10c4430e83c",
    "5c0647fdd443bc2504c2d371"
];
class Mod {
    tables;
    logger;
    lotusModInstalled;
    applyTradersChange() {
        for (let i in modConfig['traders']) {
            const name = modConfig['traders'][i];
            if (this.tables.traders[name]) {
                this.logger.info("AAAA" + name);
                for (let ll in this.tables.traders[name].base.loyaltyLevels) {
                    // get avg buy price for each traders at this LL
                    let accumCoef = 0;
                    for (let i in traderIds) {
                        const id = traderIds[i];
                        accumCoef += this.tables.traders[id].base.loyaltyLevels[ll].buy_price_coef;
                    }
                    const avg = Math.round(accumCoef / traderIds.length);
                    this.tables.traders[name].base.loyaltyLevels[ll].buy_price_coef = avg;
                }
            }
        }
    }
    postDBLoad(container) {
        this.logger = container.resolve("WinstonLogger");
        this.tables = container.resolve("DatabaseServer").getTables();
        this.applyTradersChange();
    }
}
module.exports = { mod: new Mod() };
//# sourceMappingURL=mod.js.map