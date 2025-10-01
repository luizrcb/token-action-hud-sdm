/**
 * Module-based constants
 */
export const MODULE = {
  ID: "token-action-hud-sdm",
};

/**
 * Core module
 */
export const CORE_MODULE = {
  ID: "token-action-hud-core",
};

/**
 * Core module version required by the system module
 */
export const REQUIRED_CORE_MODULE_VERSION = "2.0.16";

/**
 * Action types
 */
export const ACTION_TYPE = {
  ability: "Ability",
  save: "Save",
  attack: "Attack",
  roll: "Roll",
  item: "Item",
  damage: "Damage",
  power: "Power",
  heroDice: "Hero Dice",
};

/**
 * Groups
 */
export const GROUP = {
  abilities: { id: "abilities", name: "Abilities", type: "system" },
  saves: { id: "saves", name: "Saves", type: "system" },
  attacks: { id: "attacks", name: "Attacks", type: "system" },
  player: { id: "player", name: "Player", type: "system" },
  npc: { id: "npc", name: "NPC", type: "system" },
  //armor: { id: "armor", name: "Armor", type: "system" },
  album: {
    id: "power_album",
    name: "Album of Power",
    type: "system",
  },
  weapon: { id: "weapon", name: "Weapon", type: "system" },
 //  ward: { id: "ward", name: "Ward", type: "system" },
  power: { id: "power", name: "Power", type: "system" },

  combat: { id: "combat", name: "tokenActionHud.combat", type: "system" },
  token: { id: "token", name: "tokenActionHud.token", type: "system" },
};

/**
 * Item types
 */
export const ITEM_TYPE = {
  power_album: { groupId: "power_album" },
  // armor: { groupId: "armor" },
  power: { groupId: "power" },
  // ward: { groupId: "ward" },
  weapon: { groupId: "weapon" },
};
