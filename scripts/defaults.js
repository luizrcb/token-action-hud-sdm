import { GROUP } from "./constants.js";

/**
 * Default layout and groups
 */
export let DEFAULTS = null;

Hooks.once("tokenActionHudCoreApiReady", async (coreModule) => {
  const groups = GROUP;
  Object.values(groups).forEach((group) => {
    group.name = coreModule.api.Utils.i18n(group.name);
    group.listName = `Group: ${coreModule.api.Utils.i18n(
      group.listName ?? group.name
    )}`;
  });
  const groupsArray = Object.values(groups);
  DEFAULTS = {
    layout: [
      {
        nestId: "abilities",
        id: "abilities",
        name: coreModule.api.Utils.i18n("SDM.FieldAbilitiesPl"),
        groups: [{ ...groups.abilities, nestId: "abilities_abilities" }],
      },
      {
        nestId: "saves",
        id: "saves",
        name: coreModule.api.Utils.i18n("SDM.FieldSavePl"),
        groups: [{ ...groups.saves, nestId: "saves_saves" }],
      },
      {
        nestId: "attacks",
        id: "attacks",
        name: coreModule.api.Utils.i18n("SDM.FieldAttackPl"),
        groups: [{ ...groups.attacks, nestId: "attacks_attacks" }],
      },
      {
        nestId: "other",
        id: "other",
        name: coreModule.api.Utils.i18n("SDM.FieldOther"),
        groups: [
          { ...groups.player, nestId: "other_player" },
          { ...groups.npc, nestId: "other_npc" },
        ],
      },
      {
        nestId: "inventory",
        id: "inventory",
        name: coreModule.api.Utils.i18n("SDM.TabInventory"),
        groups: [
          { ...groups.album, nestId: "inventory_album" },
          //{ ...groups.armor, nestId: "inventory_armor" },
          { ...groups.power, nestId: "inventory_power" },
          //{ ...groups.ward, nestId: "inventory_ward" },
          { ...groups.weapon, nestId: "inventory_weapon" },
        ],
      },
      // {
      //   nestId: "utility",
      //   id: "utility",
      //   name: coreModule.api.Utils.i18n("tokenActionHud.utility"),
      //   groups: [
      //     { ...groups.combat, nestId: "utility_combat" },
      //     { ...groups.token, nestId: "utility_token" },
      //     { ...groups.utility, nestId: "utility_utility" },
      //   ],
      // },
    ],
    groups: groupsArray,
  };
});
