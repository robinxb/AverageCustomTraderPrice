import type { DependencyContainer } from "tsyringe";

import type { ILogger } from "@spt-aki/models/spt/utils/ILogger";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import type { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod";
import type { IDatabaseTables } from "@spt-aki/models/spt/server/IDatabaseTables";
import type { IPreAkiLoadMod } from "@spt-aki/models/external/IPreAkiLoadMod";
import { PreAkiModLoader } from "@spt-aki/loaders/PreAkiModLoader";

const traderIds = [
    "54cb50c76803fa8b248b4571",
    "54cb57776803fa99248b456e",
    "58330581ace78e27b8b10cee",
    "5935c25fb3acc3127c3d8cd9",
    "5a7c2eca46aef81a7ca2145d",
    "5ac3b934156ae10c4430e83c",
    "5c0647fdd443bc2504c2d371"
]

class Mod implements IPostDBLoadMod, IPreAkiLoadMod
{
    private container: DependencyContainer;
    private tables: IDatabaseTables;
    logger: ILogger;
    lotusModInstalled: boolean;

    preAkiLoad(container: DependencyContainer): void {
        this.logger = container.resolve<ILogger>("WinstonLogger");
        const preAkiModLoader = container.resolve<PreAkiModLoader>("PreAkiModLoader");
        const activeMods = preAkiModLoader.getImportedModDetails();
        for (const modname in activeMods) {
            if (modname.includes("Lotus") && activeMods[modname].author == "Lunnayaluna") {
                this.lotusModInstalled = true;
                break;
            }
        }
        if (!this.lotusModInstalled) {
            this.logger.error("Cannot find lotus mod! This mod will not change anything!")
        }
    }

    private applyLotusChange() {
        for (let ll in this.tables.traders['lotus'].base.loyaltyLevels){
            // get avg buy price for each traders at this LL
            let accumCoef = 0
            for (let i in traderIds) {
                const id = traderIds[i]
                accumCoef += this.tables.traders[id].base.loyaltyLevels[ll].buy_price_coef
            }
            const avg = Math.round(accumCoef / traderIds.length)
            this.tables.traders['lotus'].base.loyaltyLevels[ll].buy_price_coef = avg
        }
        
        
    }

    postDBLoad(container: DependencyContainer): void
    {
        if (!this.lotusModInstalled) {
            return;
        }
        this.container = container;
        this.tables = container.resolve<DatabaseServer>("DatabaseServer").getTables();
        this.applyLotusChange()
    }
}

module.exports = { mod: new Mod() }