import { GROUP } from './constants.js'

/**
 * Default layout and groups
 */
export let DEFAULTS = null

Hooks.once('tokenActionHudCoreApiReady', async (coreModule) => {
  const groups = GROUP
  Object.values(groups).forEach((group) => {
    group.name = coreModule.api.Utils.i18n(group.name)
    group.listName = `Group: ${coreModule.api.Utils.i18n(
      group.listName ?? group.name
    )}`
  })
  const groupsArray = Object.values(groups)
  DEFAULTS = {
    layout: [
      {
        nestId: 'abilities',
        id: 'abilities',
        settings: {
          image: 'icons/skills/social/intimidation-impressing.webp',
        },
        name: coreModule.api.Utils.i18n('SDM.FieldAbilitiesPl'),
        groups: [{ ...groups.abilities, nestId: 'abilities_abilities' }]
      },
      {
        nestId: 'saves',
        id: 'saves',
        settings: {
          image: 'icons/skills/melee/shield-block-gray-orange.webp'
        },
        name: coreModule.api.Utils.i18n('SDM.FieldSavePl'),
        groups: [{ ...groups.saves, nestId: 'saves_saves' }]
      },
      {
        nestId: 'attacks',
        id: 'attacks',
        settings: {
          image: 'icons/skills/melee/weapons-crossed-swords-teal.webp',
        },
        name: coreModule.api.Utils.i18n('SDM.FieldAttackPl'),
        groups: [{ ...groups.attacks, nestId: 'attacks_attacks' }]
      },
      {
        nestId: 'other',
        id: 'other',
        settings: {
          image: 'icons/magic/symbols/clover-luck-white-green.webp',
        },
        name: coreModule.api.Utils.i18n('SDM.FieldOther'),
        groups: [
          { ...groups.player, nestId: 'other_player' },
          { ...groups.caravan, nestId: 'other_caravan' },
          { ...groups.npc, nestId: 'other_npc' }
        ]
      },
      {
        nestId: 'inventory',
        id: 'inventory',
        name: coreModule.api.Utils.i18n('SDM.TabInventory'),
        settings: {
          image: 'icons/containers/chest/chest-simple-box-red.webp'
        },
        groups: [
          { ...groups.album, nestId: 'inventory_album' },
          { ...groups.power, nestId: 'inventory_power' },
          { ...groups.weapon, nestId: 'inventory_weapon' }
        ]
      },
      {
        nestId: 'wallet',
        id: 'wallet',
        name: coreModule.api.Utils.i18n('SDM.FieldWealth'),
        settings: {
          image: 'icons/containers/bags/coinpouch-simple-leather-silver-brown.webp'
        },
        groups: [
          { ...groups.wallet, nestId: 'wallet_wallet' }
        ]
      },
      {
        nestId: 'effects',
        id: 'effects',
        name: coreModule.api.Utils.i18n('SDM.TabEffects'),
        settings: {
          image: 'icons/magic/symbols/symbol-lightning-bolt.webp'
        },
        groups: [
          { ...groups.effectsperm, nestId: 'effects_effectsperm' },
          { ...groups.effectstemp, nestId: 'effects_effectstemp' }
        ]
      }
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
    groups: groupsArray
  }
})
