"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    container;
    tables;
    logger;
    lotusModInstalled;
    preAkiLoad(container) {
        this.logger = container.resolve("WinstonLogger");
        const preAkiModLoader = container.resolve("PreAkiModLoader");
        const activeMods = preAkiModLoader.getImportedModDetails();
        for (const modname in activeMods) {
            if (modname.includes("Lotus") && activeMods[modname].author == "Lunnayaluna") {
                this.lotusModInstalled = true;
                break;
            }
        }
        if (!this.lotusModInstalled) {
            this.logger.error("Cannot find lotus mod! This mod will not change anything!");
        }
    }
    applyLotusChange() {
        for (let ll in this.tables.traders['lotus'].base.loyaltyLevels) {
            // get avg buy price for each traders at this LL
            let accumCoef = 0;
            for (let i in traderIds) {
                const id = traderIds[i];
                accumCoef += this.tables.traders[id].base.loyaltyLevels[ll].buy_price_coef;
            }
            const avg = Math.round(accumCoef / traderIds.length);
            this.tables.traders['lotus'].base.loyaltyLevels[ll].buy_price_coef = avg;
            this.logger.info(`Set avg BPC to ${avg}`);
        }
    }
    postDBLoad(container) {
        if (!this.lotusModInstalled) {
            return;
        }
        this.container = container;
        this.tables = container.resolve("DatabaseServer").getTables();
        this.applyLotusChange();
    }
}
module.exports = { mod: new Mod() };
//# sourceMappingURL=mod.js.map