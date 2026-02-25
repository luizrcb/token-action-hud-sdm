/**
 * Module-based constants
 */
export const MODULE = {
  ID: 'token-action-hud-sdm'
}

/**
 * Core module
 */
export const CORE_MODULE = {
  ID: 'token-action-hud-core'
}

/**
 * Core module version required by the system module
 */
export const REQUIRED_CORE_MODULE_VERSION = '2.0.16'

/**
 * Action types
 */
export const ACTION_TYPE = {
  ability: 'Ability',
  save: 'Save',
  attack: 'Attack',
  roll: 'Roll',
  item: 'Item',
  damage: 'Damage',
  power: 'Power',
  heroDice: 'Hero Dice'
}

/**
 * Groups
 */
export const GROUP = {
  abilities: { id: 'abilities', name: 'SDM.FieldAbilitiesPl', type: 'system' },
  saves: { id: 'saves', name: 'SDM.FieldSavePl', type: 'system' },
  attacks: { id: 'attacks', name: 'SDM.FieldAttackPl', type: 'system' },
  pet: { id: 'pet', name: 'TYPES.Item.pet', type: 'system' },
  player: { id: 'player', name: 'TYPES.Actor.character', type: 'system' },
  npc: { id: 'npc', name: 'TYPES.Actor.npc', type: 'system' },
  caravan: { id: 'caravan', name: 'TYPES.Actor.caravan', type: 'system' },
  effectsperm: { id: 'effectsperm', name: 'SDM.Effect.Passive', type: 'system' },
  effectstemp: { id: 'effectstemp', name: 'SDM.Effect.Temporary', type: 'system' },
  album: {
    id: 'power_album',
    name: 'TYPES.Item.power_album',
    type: 'system'
  },
  weapon: { id: 'weapon', name: 'TYPES.Item.weapon', type: 'system' },
  power: { id: 'power', name: 'TYPES.Item.power', type: 'system' },
  wallet: { id: 'wallet', name: 'SDM.FieldWealth', type: 'system' },
  combat: { id: 'combat', name: 'tokenActionHud.combat', type: 'system' },
  token: { id: 'token', name: 'tokenActionHud.token', type: 'system' }
}

/**
 * Item types
 */
export const ITEM_TYPE = {
  power_album: { groupId: 'power_album' },
  power: { groupId: 'power' },
  weapon: { groupId: 'weapon' }
}
