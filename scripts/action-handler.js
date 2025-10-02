// System Module Imports
import { ACTION_TYPE, ITEM_TYPE } from './constants.js'
import { Utils } from './utils'

export let ActionHandler = null

Hooks.once('tokenActionHudCoreApiReady', async (coreModule) => {
  /**
   * Extends Token Action HUD Core's ActionHandler class and builds system-defined actions for the HUD
   */
  ActionHandler = class ActionHandler extends coreModule.api.ActionHandler {
    /**
     * Build system actions
     * Called by Token Action HUD Core
     * @override
     * @param {array} groupIds
     */ a
    async buildSystemActions (groupIds) {
      // Set actor and token variables
      this.actors = !this.actor ? this._getActors() : [this.actor]
      this.actorType = this.actor?.type

      // Set items variable
      if (this.actor) {
        let items = this.actor.items
        items = coreModule.api.Utils.sortItemsByName(items)
        this.items = items
      }

      if (this.actorType === 'character') {
        this.#buildCharacterActions()
      } else if (this.actorType === 'npc') {
        this.#buildNPCActions()
      } else if (this.actorType === 'caravan') {
        this.#buildCaravanActions()
      }
    }

    /**
     * Build character actions
     * @private
     */
    #buildCharacterActions () {
      this.#buildAbilities()
      this.#buildSaves()
      this.#buildAttacks()
      this.#buildCharacterOther()
      this.#buildInventory()
      this.#buildEffects()
    }

    /**
     * Build NPC Actions
     * @private
     * @returns {object}
     */
    #buildNPCActions () {
      this.#buildNPCombatActions()
      this.#buildNPCOther()
      this.#buildInventory()
      this.#buildEffects()
    }

    async #buildAbilities () {
      if (!this.actor) return

      // const abilities = data.abilities;
      const groupData = { id: 'abilities', type: 'system' }
      const actions = [
        {
          id: `${this.actor.id}-str`,
          name: coreModule.api.Utils.i18n('SDM.AbilityStrAbbr').toUpperCase(),
          tooltip: coreModule.api.Utils.i18n('SDM.AbilityStr'),
          listName: 'Ability: Strength',
          encodedValue: 'ability|str'
        },
        {
          id: `${this.actor.id}-end`,
          name: coreModule.api.Utils.i18n('SDM.AbilityEndAbbr').toUpperCase(),
          tooltip: coreModule.api.Utils.i18n('SDM.AbilityEnd'),
          listName: 'Ability: Endurance',
          encodedValue: 'ability|end'
        },
        {
          id: `${this.actor.id}-agi`,
          name: coreModule.api.Utils.i18n('SDM.AbilityAgiAbbr').toUpperCase(),
          tooltip: coreModule.api.Utils.i18n('SDM.AbilityAgi'),
          listName: 'Ability: Agility',
          encodedValue: 'ability|agi'
        },
        {
          id: `${this.actor.id}-cha`,
          name: coreModule.api.Utils.i18n('SDM.AbilityChaAbbr').toUpperCase(),
          tooltip: coreModule.api.Utils.i18n('SDM.AbilityCha'),
          listName: 'Ability: Charisma',
          encodedValue: 'ability|cha'
        },
        {
          id: `${this.actor.id}-aur`,
          name: coreModule.api.Utils.i18n('SDM.AbilityAurAbbr').toUpperCase(),
          tooltip: coreModule.api.Utils.i18n('SDM.AbilityAur'),
          listName: 'Ability: Aura',
          encodedValue: 'ability|aur'
        },
        {
          id: `${this.actor.id}-tho`,
          name: coreModule.api.Utils.i18n('SDM.AbilityThoAbbr').toUpperCase(),
          tooltip: coreModule.api.Utils.i18n('SDM.AbilityTho'),
          listName: 'Ability: Thought',
          encodedValue: 'ability|tho'
        }
      ]
      this.addActions(actions, groupData)
    }

    async #buildSaves () {
      if (!this.actor) return

      // const abilities = data.abilities;
      const groupData = { id: 'saves', type: 'system' }
      const actions = [
        {
          id: `${this.actor.id}-save-str`,
          name: coreModule.api.Utils.i18n('SDM.AbilityStrAbbr').toUpperCase(),
          icon1: '<i class="fa-solid fa-hand-fist rust"></i>',
          tooltip: game.i18n.format('SDM.SavingThrowRoll', {
            ability: coreModule.api.Utils.i18n('SDM.AbilityStr')
          }),
          listName: 'Save: Strength',
          encodedValue: 'save|str'
        },
        {
          id: `${this.actor.id}-save-end`,
          name: coreModule.api.Utils.i18n('SDM.AbilityEndAbbr').toUpperCase(),
          icon1: '<i class="fa-solid fa-heartbeat pumpkin"></i>',
          tooltip: game.i18n.format('SDM.SavingThrowRoll', {
            ability: coreModule.api.Utils.i18n('SDM.AbilityEnd')
          }),
          listName: 'Save: Endurance',
          encodedValue: 'save|end'
        },
        {
          id: `${this.actor.id}-save-agi`,
          name: coreModule.api.Utils.i18n('SDM.AbilityAgiAbbr').toUpperCase(),
          icon1: '<i class="fa-solid fa-person-running amber"></i>',
          tooltip: game.i18n.format('SDM.SavingThrowRoll', {
            ability: coreModule.api.Utils.i18n('SDM.AbilityAgi')
          }),
          listName: 'Save: Agility',
          encodedValue: 'save|agi'
        },
        {
          id: `${this.actor.id}-save-cha`,
          name: coreModule.api.Utils.i18n('SDM.AbilityChaAbbr').toUpperCase(),
          icon1: '<i class="fa-solid fa-clover sky"></i>',
          tooltip: game.i18n.format('SDM.SavingThrowRoll', {
            ability: coreModule.api.Utils.i18n('SDM.AbilityCha')
          }),
          listName: 'Save: Charisma',
          encodedValue: 'save|cha'
        },
        {
          id: `${this.actor.id}-save-aur`,
          name: coreModule.api.Utils.i18n('SDM.AbilityAurAbbr').toUpperCase(),
          icon1: '<i class="fa-solid fa-splotch azure"></i>',
          tooltip: game.i18n.format('SDM.SavingThrowRoll', {
            ability: coreModule.api.Utils.i18n('SDM.AbilityAur')
          }),
          listName: 'Save: Aura',
          encodedValue: 'save|aur'
        },
        {
          id: `${this.actor.id}-save-tho`,
          name: coreModule.api.Utils.i18n('SDM.AbilityThoAbbr').toUpperCase(),
          icon1: '<i class="fa-solid fa-cloud royal"></i>',
          tooltip: game.i18n.format('SDM.SavingThrowRoll', {
            ability: coreModule.api.Utils.i18n('SDM.AbilityTho')
          }),
          listName: 'Save: Thought',
          encodedValue: 'save|tho'
        }
      ]
      this.addActions(actions, groupData)
    }

    async #buildAttacks () {
      if (!this.actor) return

      // const abilities = data.abilities;
      const groupData = { id: 'attacks', type: 'system' }
      const actions = [
        {
          id: `${this.actor.id}-melee`,
          name: coreModule.api.Utils.i18n('SDM.AttackMelee'),
          icon1: '<i class="melee-attack lime" style="width: 12px; height: 12px; margin-top: 3px; padding: 0"></i>',
          listName: 'Attack: Melee',
          encodedValue: 'attack|melee'
        },
        {
          id: `${this.actor.id}-ranged`,
          name: coreModule.api.Utils.i18n('SDM.AttackRanged'),
          icon1: '<i class="fa-solid fa-gun pine"></i>',
          listName: 'Attack: Ranged',
          encodedValue: 'attack|ranged'
        },
        {
          id: `${this.actor.id}-fantascience`,
          name: coreModule.api.Utils.i18n('SDM.AttackFantascience'),
          icon1: '<i class="fa-solid fa-hat-wizard heart"></i>',
          listName: 'Attack: Fantascience',
          encodedValue: 'attack|fantascience'
        },
        {
          id: `${this.actor.id}-oldtech`,
          name: coreModule.api.Utils.i18n('SDM.AttackOldtech'),
          icon1: '<i class="fa-solid fa-gamepad plum"></i>',
          listName: 'Attack: Oldtech',
          encodedValue: 'attack|oldtech'
        }
      ]
      this.addActions(actions, groupData)
    }

    async #buildCharacterOther () {
      if (!this.actor) return

      // const data = this.actor.system;
      const heroDice = this.actor.system.hero_dice
      const groupData = { id: 'player', type: 'system' }

      const actions = [
        {
          id: `${this.actor.id}-reaction`,
          name: coreModule.api.Utils.i18n('SDM.Reaction'),
          icon1: '<i class="fa-solid fa-masks-theater sky"></i>',
          listName: 'Other: Reaction',
          encodedValue: 'reaction|reaction'
        },
        {
          id: `${this.actor.id}-hero-dice`,
          name: `${Utils.toPascalCase(coreModule.api.Utils.i18n('SDM.HeroDice'))}: ${heroDice.value}/${heroDice.max}`,
          icon1: '<i class="fa-solid fa-dice-d6"></i>',
          tooltip: Utils.toPascalCase(coreModule.api.Utils.i18n('SDM.HeroDice')),
          listName: 'Other: Hero Dice',
          encodedValue: 'heroichealing|heroichealing'
        }
      ]

      this.addActions(actions, groupData)
    }

    async #buildNPCombatActions () {
      const attackGroup = { id: 'attacks', type: 'system' }
      const attackActions = [
        {
          id: `${this.actor.id}-attack`,
          name: game.i18n.format('SDM.RollType', { type: coreModule.api.Utils.i18n('SDM.Attack') }),
          tooltip: game.i18n.format('SDM.RollType', { type: coreModule.api.Utils.i18n('SDM.Attack') }),
          icon1: '<i class="melee-attack lime" style="width: 12px; height: 12px; margin-top: 3px; padding: 0"></i>',
          listName: 'attack: Attack Roll',
          encodedValue: 'attack|attack'
        },
        {
          id: `${this.actor.id}-damage`,
          name: game.i18n.format('SDM.RollType', { type: coreModule.api.Utils.i18n('SDM.Damage') }),
          tooltip: game.i18n.format('SDM.RollType', { type: coreModule.api.Utils.i18n('SDM.Damage') }),
          icon1: '<i class="fa-solid fa-explosion azure"></i>',
          listName: 'Damage: rollNPCDamage',
          encodedValue: 'rollNPCDamage|rollNPCDamage'
        }
      ]

      this.addActions(attackActions, attackGroup)

      const savesGroup = { id: 'saves', type: 'system' }
      const saveActions = [
        {
          id: `${this.actor.id}-save`,
          name: game.i18n.format('SDM.RollType', { type: coreModule.api.Utils.i18n('SDM.FieldSaveTarget') }),
          tooltip: game.i18n.format('SDM.SavingThrowRoll', { ability: coreModule.api.Utils.i18n('TYPES.Actor.npc') }),
          icon1: '<i class="fa fa-shield-cat plum"></i>',
          listName: 'attack: Attack Roll',
          encodedValue: 'save|npc'
        }
      ]

      this.addActions(saveActions, savesGroup)
    }

    async #buildNPCOther () {
      if (!this.actor) return

      const groupData = { id: 'npc', type: 'system' }

      const actions = [
        {
          id: `${this.actor.id}-morale`,
          name: game.i18n.format('SDM.RollType', { type: coreModule.api.Utils.i18n('SDM.Morale') }),
          icon1: '<i class="fa-solid fa-person-running rust"></i>',
          listName: 'Other: Morale',
          encodedValue: 'rollNPCMorale|rollNPCMorale'
        }
      ]

      this.addActions(actions, groupData)
    }

    async #buildCaravanActions () {
      this.#buildEffects()
      const groupData = { id: 'caravan', type: 'system' }

      const actions = [
        {
          id: `${this.actor.id}-consume-supply`,
          name: coreModule.api.Utils.i18n('SDM.ConsumeSupply'),
          icon1: '<i class="fa fa-sack-xmark"></i>',
          listName: 'Other: Consume Supplies',
          encodedValue: 'consumeSupplies|consumeSupplies'
        }
      ]

      this.addActions(actions, groupData)
    }

    /**
     * Build inventory
     * @private
     */
    async #buildInventory () {
      if (this.items.size === 0) return

      const actionTypeId = 'item'
      const inventoryMap = new Map()

      for (const [itemId, itemData] of this.items) {
        const system = itemData.system
        const type = system.type
        const typeMap = inventoryMap.get(type) ?? new Map()
        typeMap.set(itemId, itemData)
        inventoryMap.set(type, typeMap)
      }

      for (const [type, typeMap] of inventoryMap) {
        const groupId = ITEM_TYPE[type]?.groupId

        if (!groupId) continue

        const groupData = { id: groupId, type: 'system' }

        // Get actions
        const actions = [...typeMap].map(([itemId, itemData]) => {
          const id = itemId
          const name = itemData.getNameTitle()
          const actionTypeName = coreModule.api.Utils.i18n(
            ACTION_TYPE[actionTypeId]
          )
          const listName = `${
            actionTypeName ? `${actionTypeName}: ` : ''
          }${name}`
          const encodedValue = [actionTypeId, id].join(this.delimiter)
          const status = itemData.system.status
          const resources = itemData.system.resources

          const brokenItem = status === 'broken'
          const runOutItem = resources === 'run_out'

          const icon1 =
            status === 'notched'
              ? '<i class="fa fa-hammer"></i>'
              : status === 'broken'
                ? '<i class="fa fa-ban"></i>'
                : ''
          const icon2 =
            resources === 'running_low'
              ? '<i class="fa-solid fa-battery-quarter"></i>'
              : resources === 'run_out'
                ? '<i class="fa-solid fa-battery-empty"></i>'
                : ''
          const icon3 = (itemData.system.readied || itemData.type === 'trait')
            ? '<i class="fa fa-shield"></i>'
            : ''

          return {
            id,
            name,
            img: coreModule.api.Utils.getImage(itemData),
            icon1,
            icon2,
            icon3,
            cssClass: brokenItem || runOutItem ? 'disabled' : '',
            tooltip: itemData.getInventoryTitle(),
            listName,
            encodedValue
          }
        })

        // TAH Core method to add actions to the action list
        this.addActions(actions, groupData)
      }
    }

    async #buildEffects () {
      const temporary = { id: 'effectstemp', type: 'system' }
      const permanent = { id: 'effectsperm', type: 'system' }
      let effects = Array.from(this.actor.effects)
      const items = Array.from(this.actor.items.filter(it => ['edge', 'hindrance', 'ability'].includes(it.type)))
      items.forEach(item => {
        const _eff = Array.from(item.effects)
        if (_eff.length > 0) {
          const mergedEffects = [...new Set([...effects, ..._eff])]
          effects = mergedEffects
        }
      })
      effects.forEach(eff => {
        let group = temporary
        if (eff.isTemporary === false) {
          group = permanent
        }

        this.addActions([{
          id: 'ef' + eff.name,
          name: eff.name,
          img: eff.img,
          cssClass: eff.disabled ? 'toggle' : 'togle active',
          encodedValue: ['effects', eff.id].join(this.delimiter)

        }], group)
      })
    }
  }
})
