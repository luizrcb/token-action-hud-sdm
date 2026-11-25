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
      this.actors = !this.actor ? this.#getActors() : [this.actor]
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

    #getActors () {
      const allowedTypes = ['character', 'npc', 'caravan']
      const actors = canvas.tokens.controlled
        .filter((token) => token.actor)
        .map((token) => token.actor)
      if (actors.every((actor) => allowedTypes.includes(actor.type))) {
        return actors
      } else {
        return []
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
      this.#buildFeatureRolls()
      this.#buildConsumables()
      this.#buildLights()
      this.#buildForms()
      this.#buildItemActions()
      this.#buildCounters()
      this.#buildEffects()
      this.#buildWallet()
      this.#buildPet()
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
      this.#buildFeatureRolls()
      this.#buildConsumables()
      this.#buildLights()
      this.#buildForms()
      this.#buildItemActions()
      this.#buildCounters()
      this.#buildEffects()
      this.#buildWallet()
      this.#buildPet()
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

      // Same colors as the character sheet (V2): each attack takes the color of its configured ability
      const abilityIconColor = Object.fromEntries(CONFIG.SDM.abilitiesKeys.map((key, i) => [key, CONFIG.SDM.abilityColors[i]]))
      const system = this.actor.system ?? {}
      const color = (attack, fallback) =>
        abilityIconColor[system[attack]?.default_ability || fallback] ?? abilityIconColor[fallback]
      const groupData = { id: 'attacks', type: 'system' }
      const actions = [
        {
          id: `${this.actor.id}-melee`,
          name: coreModule.api.Utils.i18n('SDM.AttackMelee'),
          icon1:
            `<i class="fa-solid fa-sword ${color('melee', 'str')}"></i>`,
          listName: 'Attack: Melee',
          encodedValue: 'attack|melee'
        },
        {
          id: `${this.actor.id}-ranged`,
          name: coreModule.api.Utils.i18n('SDM.AttackRanged'),
          icon1: `<i class="fa-solid fa-gun ${color('ranged', 'agi')}"></i>`,
          listName: 'Attack: Ranged',
          encodedValue: 'attack|ranged'
        },
        {
          id: `${this.actor.id}-fantascience`,
          name: coreModule.api.Utils.i18n('SDM.AttackFantascience'),
          icon1: `<i class="fa-solid fa-hat-wizard ${color('fantascience', 'cha')}"></i>`,
          listName: 'Attack: Fantascience',
          encodedValue: 'attack|fantascience'
        },
        {
          id: `${this.actor.id}-oldtech`,
          name: coreModule.api.Utils.i18n('SDM.AttackOldtech'),
          icon1: `<i class="fa-solid fa-gamepad ${color('oldtech', 'tho')}"></i>`,
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
      const bloodDice = this.actor.system.blood_dice
      const touristDice = this.actor.system.tourist_dice
      const isDefeated = this.actor.statuses?.has('dead')
      const groupData = { id: 'player', type: 'system' }

      const actions = [
        {
          id: `${this.actor.id}-hero-dice`,
          name: `${Utils.toPascalCase(
            coreModule.api.Utils.i18n('SDM.HeroDicePl')
          )}: ${heroDice.value}/${heroDice.max}`,
          icon1: '<i class="fa-solid fa-dice-d6"></i>',
          tooltip: Utils.toPascalCase(
            coreModule.api.Utils.i18n('SDM.HeroDicePl')
          ),
          listName: 'Other: Hero Dice',
          encodedValue: 'heroichealing|heroichealing'
        },
        {
          id: `${this.actor.id}-reaction`,
          name: coreModule.api.Utils.i18n('SDM.Reaction'),
          icon1: '<i class="fa-solid fa-masks-theater sky"></i>',
          listName: 'Other: Reaction',
          encodedValue: 'reaction|reaction'
        },
        {
          id: `${this.actor.id}-corruption`,
          name: coreModule.api.Utils.i18n('SDM.Corruption'),
          icon1: '<i class="fa-solid fa-biohazard violet"></i>',
          listName: 'Other: Corruption',
          encodedValue: 'corruption|corruption'
        },
        {
          id: `${this.actor.id}-defeat`,
          name: coreModule.api.Utils.i18n('SDM.Defeat'),
          icon1: '<i class="fa-solid fa-skull"></i>',
          listName: 'Other: Defeat',
          encodedValue: 'defeat|defeat'
        },
        {
          id: `${this.actor.id}-groupChase`,
          name: coreModule.api.Utils.i18n('SDM.GroupChase'),
          icon1: '<i class="fa-solid fa-gauge-high pumpkin"></i>',
          listName: 'Other: Group Chase',
          encodedValue: 'groupChase|groupChase'
        }
      ]

      const rest = this.#restAction()
      if (rest) actions.push(rest)

      if (isDefeated) {
        actions.push({
          id: `${this.actor.id}-relife`,
          name: coreModule.api.Utils.i18n('SDM.Relife'),
          icon1: '<i class="fa-solid fa-kit-medical blood"></i>',
          listName: 'Other: relife',
          encodedValue: 'relife|relife'
        })
      }

      if (bloodDice.enabled) {
        actions.unshift(
          {
            id: `${this.actor.id}-blood-dice`,
            name: `${Utils.toPascalCase(
              coreModule.api.Utils.i18n('SDM.BloodDicePl')
            )}: ${bloodDice.value}/${bloodDice.max}`,
            icon1: '<i class="fa-solid fa-dice-d6 blood"></i>',
            tooltip: Utils.toPascalCase(
              coreModule.api.Utils.i18n('SDM.BloodDicePl')
            ),
            listName: 'Other: Blood Dice',
            encodedValue: 'bloodDiceRoll|bloodDiceRoll'
          }
        )
      }

      if (touristDice.enabled) {
        actions.unshift(
          {
            id: `${this.actor.id}-tourist-dice`,
            name: `${Utils.toPascalCase(
              coreModule.api.Utils.i18n('SDM.TouristDicePl')
            )}: ${touristDice.value}/${touristDice.max}`,
            icon1: '<i class="fa-solid fa-dice-d6 pine"></i>',
            tooltip: Utils.toPascalCase(
              coreModule.api.Utils.i18n('SDM.TouristDicePl')
            ),
            listName: 'Other: Tourist Dice',
            encodedValue: 'touristDiceRoll|touristDiceRoll'
          }
        )
      }

      this.addActions(actions, groupData)
    }

    async #buildNPCombatActions () {
      const attackGroup = { id: 'attacks', type: 'system' }
      const attackActions = [
        {
          id: `${this.actor.id}-attack`,
          name: game.i18n.format('SDM.RollType', {
            type: coreModule.api.Utils.i18n('SDM.Attack')
          }),
          tooltip: game.i18n.format('SDM.RollType', {
            type: coreModule.api.Utils.i18n('SDM.Attack')
          }),
          // Same icon as the NPC sheet (V2)
          icon1: '<i class="fa-solid fa-sword lime"></i>',
          listName: 'attack: Attack Roll',
          encodedValue: 'attack|attack'
        },
        {
          id: `${this.actor.id}-damage`,
          name: game.i18n.format('SDM.RollType', {
            type: coreModule.api.Utils.i18n('SDM.Damage')
          }),
          tooltip: game.i18n.format('SDM.RollType', {
            type: coreModule.api.Utils.i18n('SDM.Damage')
          }),
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
          name: game.i18n.format('SDM.RollType', {
            type: coreModule.api.Utils.i18n('SDM.FieldSaveTarget')
          }),
          tooltip: game.i18n.format('SDM.SavingThrowRoll', {
            ability: coreModule.api.Utils.i18n('TYPES.Actor.npc')
          }),
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
          name: game.i18n.format('SDM.RollType', {
            type: coreModule.api.Utils.i18n('SDM.Morale')
          }),
          icon1: '<i class="fa-solid fa-person-running rust"></i>',
          listName: 'Other: Morale',
          encodedValue: 'rollNPCMorale|rollNPCMorale'
        }
      ]

      const rest = this.#restAction()
      if (rest) actions.push(rest)

      this.addActions(actions, groupData)
    }

    async #buildPet () {
      if (this.items.size === 0) return

      const groupData = { id: 'pet', type: 'system' }
      const itemList = Array.from(this.items.values())
      const petItems = itemList.filter(
        (i) => i.system.type === 'pet'
      )

      if (!petItems.length) return

      // Get actions
      const actions = petItems.map((item) => {
        return {
          id: item.id,
          name: item.getDefaultTitle(),
          img: coreModule.api.Utils.getImage(item),
          tooltip: item.getInventoryTitle(),
          listName: `openPetSheet: ${item.id}`,
          encodedValue: ['openPetSheet', item.id].join(this.delimiter)
        }
      })

      this.addActions(actions, groupData)
    }

    async #buildCaravanActions () {
      this.#buildCounters()
      this.#buildEffects()
      this.#buildPet()
      this.#buildWallet()
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
          // Run out, unless the item still rolls its damage when run out
          const runOutItem = resources === 'run_out' && !itemData.system.works_when_run_out

          // The system's row markers (WTF 1.12+): single use, lit, a hallmark upgrade to choose
          const markers = this.#sdmApi?.items?.markers?.(itemData) ?? {}
          const icon1 =
            (status === 'notched'
              ? '<i class="fa fa-hammer"></i>'
              : status === 'broken'
                ? '<i class="fa fa-ban"></i>'
                : '') +
            (markers.singleUse ? '<i class="fa-solid fa-hourglass-end"></i>' : '') +
            (markers.lit ? '<i class="fa-solid fa-fire-flame-curved"></i>' : '') +
            (markers.form ? '<i class="fa-solid fa-paw"></i>' : '') +
            (markers.upgrade ? '<i class="fa-solid fa-star"></i>' : '')
          const icon2 =
            resources === 'running_low'
              ? '<i class="fa-solid fa-battery-quarter"></i>'
              : resources === 'run_out'
                ? '<i class="fa-solid fa-battery-empty"></i>'
                : ''
          const icon3 =
            itemData.system.readied || (itemData.type === 'trait' || itemData.type === 'burden')
              ? '<i class="fa fa-shield"></i>'
              : ''

          const cssClass = `${brokenItem || runOutItem ? 'disabled' : ''} ${
            itemData.system.readied || (itemData.type === 'trait' || itemData.type === 'burden') ? 'active' : ''
          }`

          return {
            id,
            name,
            img: coreModule.api.Utils.getImage(itemData),
            icon1,
            icon2,
            icon3,
            cssClass,
            tooltip: itemData.getInventoryTitle(),
            listName,
            encodedValue
          }
        })

        // TAH Core method to add actions to the action list
        this.addActions(actions, groupData)
      }
    }

    /** The system's API for the features below (WTF 1.11.0+); null on older versions. */
    get #sdmApi () {
      const api = game.system?.api ?? game.sdm?.api
      return api?.items && api?.lights && api?.counters ? api : null
    }

    /** Rest (one week), from the system's rest API. */
    #restAction () {
      const api = game.system?.api ?? game.sdm?.api
      if (typeof api?.rest !== 'function') return null
      return {
        id: `${this.actor.id}-rest`,
        name: coreModule.api.Utils.i18n('SDM.Rest.Title'),
        icon1: '<i class="fa-solid fa-bed"></i>',
        tooltip: coreModule.api.Utils.i18n('SDM.Rest.Tooltip'),
        listName: 'Other: Rest',
        encodedValue: ['rest', 'rest'].join(this.delimiter)
      }
    }

    /**
     * Rolls that item features add (a sword with the album feature, an album with the weapon
     * feature…): listed in the weapon / power album groups next to the subtype rolls.
     */
    async #buildFeatureRolls () {
      if (!this.items?.size) return
      const groups = { damage: 'weapon', power_album: 'power_album' }
      const actionsByGroup = { weapon: [], power_album: [] }
      for (const [itemId, item] of this.items) {
        if (item.type !== 'gear') continue
        const system = item.system
        const has = (feature) => !!system.features?.has?.(feature)
        const kinds = []
        if (system.type !== 'weapon' && has('weapon') && system.weapon?.damage?.base) kinds.push('damage')
        if (system.type !== 'power_album' && has('album') && (system.powers?.length ?? 0) > 0) kinds.push('power_album')
        for (const kind of kinds) {
          const blocked = system.status === 'broken' || system.resources === 'run_out'
          const label = coreModule.api.Utils.i18n(kind === 'damage' ? 'SDM.Damage' : 'SDM.PowerAlbum')
          actionsByGroup[groups[kind]].push({
            id: `${itemId}-${kind}`,
            name: item.getNameTitle(),
            img: coreModule.api.Utils.getImage(item),
            icon1: kind === 'damage' ? '<i class="fa-solid fa-sword"></i>' : '<i class="fa-solid fa-book"></i>',
            icon3: system.readied ? '<i class="fa fa-shield"></i>' : '',
            cssClass: `${blocked ? 'disabled' : ''} ${system.readied ? 'active' : ''}`,
            tooltip: game.i18n.format('SDM.RollType', { type: label }),
            listName: `${label}: ${item.name}`,
            encodedValue: ['itemRoll', `${kind}:${itemId}`].join(this.delimiter)
          })
        }
      }
      for (const [groupId, actions] of Object.entries(actionsByGroup)) {
        if (actions.length) this.addActions(actions, { id: groupId, type: 'system' })
      }
    }

    /** Consumables: Use (restores life / abilities, applies effects; the system asks what). Readied ones only. */
    async #buildConsumables () {
      const api = this.#sdmApi
      if (!api || !this.items?.size) return
      const actions = []
      for (const [itemId, item] of this.items) {
        // Only readied: a packed item takes an action to ready first
        if (!api.items.isUsable(item) || !item.system?.readied) continue
        const blocked = !!api.items.useBlockedReason(item)
        const resources = item.system.resources
        actions.push({
          id: `${itemId}-use`,
          name: item.getNameTitle(),
          img: coreModule.api.Utils.getImage(item),
          icon1: '<i class="fa-solid fa-hand-holding-medical"></i>',
          icon2:
            resources === 'running_low'
              ? '<i class="fa-solid fa-battery-quarter"></i>'
              : resources === 'run_out'
                ? '<i class="fa-solid fa-battery-empty"></i>'
                : '',
          cssClass: blocked ? 'disabled' : '',
          // What Use does (the system's own tooltip), else the item's
          tooltip: api.items.describeUse?.(item) ?? item.getInventoryTitle(),
          listName: `Use: ${item.name}`,
          encodedValue: ['useItem', itemId].join(this.delimiter)
        })
      }
      if (actions.length) this.addActions(actions, { id: 'consumables', type: 'system' })
    }

    /**
     * Item actions besides rolls and Use, as the system's right-click menu: usage roll, ±1 charge,
     * recharge, recharge with a hero die, animate / deanimate (or ask), a hallmark's upgrade.
     */
    async #buildItemActions () {
      const api = this.#sdmApi
      if (typeof api?.items?.actions !== 'function' || !this.items?.size) return
      const actions = []
      for (const [itemId, item] of this.items) {
        for (const action of api.items.actions(item)) {
          actions.push({
            id: `${itemId}-${action.id}`,
            name: item.name,
            img: coreModule.api.Utils.getImage(item),
            icon1: `<i class="${action.icon}"></i>`,
            tooltip: action.label,
            listName: `${action.label}: ${item.name}`,
            encodedValue: ['itemAction', `${itemId}:${action.id}`].join(this.delimiter)
          })
        }
      }
      if (actions.length) this.addActions(actions, { id: 'itemActions', type: 'system' })
    }

    /** Light: items that can light (click to light / put out) and a power's light (put out). */
    async #buildLights () {
      const api = this.#sdmApi
      if (!api) return
      // The GM can turn item lights off (Core Rules settings)
      try {
        if (game.settings.get('sdm', 'enableItemLights') === false) return
      } catch {}
      const actions = api.lights.items(this.actor).map((item) => {
        const lit = api.lights.isLit(item)
        return {
          id: `${item.id}-light`,
          name: item.name,
          img: coreModule.api.Utils.getImage(item),
          icon1: '<i class="fa-solid fa-fire-flame-curved"></i>',
          cssClass: lit ? 'toggle active' : 'toggle',
          tooltip: coreModule.api.Utils.i18n(lit ? 'SDM.Light.PutOut' : 'SDM.Light.Light'),
          listName: `Light: ${item.name}`,
          encodedValue: ['light', item.id].join(this.delimiter)
        }
      })
      const lit = api.lights.litEffect(this.actor)
      if (lit && !lit.getFlag('sdm', 'light')?.itemId) {
        actions.unshift({
          id: `${this.actor.id}-power-light`,
          name: lit.name,
          img: lit.img,
          icon1: '<i class="fa-solid fa-fire-flame-curved"></i>',
          cssClass: 'toggle active',
          tooltip: coreModule.api.Utils.i18n('SDM.Light.PutOut'),
          listName: `Light: ${lit.name}`,
          encodedValue: ['light', 'effect'].join(this.delimiter)
        })
      }
      if (actions.length) this.addActions(actions, { id: 'lights', type: 'system' })
    }

    /** Forms (WTF 1.12+): end the current form, or take one of the forms available. */
    async #buildForms () {
      const forms = this.#sdmApi?.forms
      if (!forms) return
      const i18n = coreModule.api.Utils.i18n
      const current = forms.current(this.actor)
      const actions = current
        ? [{
            id: `${this.actor.id}-form-end`,
            name: current.name,
            img: current.img || current.effect?.img,
            icon1: '<i class="fa-solid fa-paw"></i>',
            cssClass: 'toggle active',
            tooltip: game.i18n.format('SDM.Form.EndNamed', { form: current.name }),
            listName: `${i18n('SDM.Form.End')}: ${current.name}`,
            encodedValue: ['form', 'end'].join(this.delimiter)
          }]
        : forms.available(this.actor).map((effect) => ({
          id: `${effect.id}-form`,
          name: effect.name,
          img: effect.img,
          icon1: '<i class="fa-solid fa-paw"></i>',
          cssClass: 'toggle',
          tooltip: game.i18n.format('SDM.Form.TakeNamed', { form: effect.name }),
          listName: `${i18n('SDM.Form.Take')}: ${effect.name}`,
          encodedValue: ['form', effect.uuid].join(this.delimiter)
        }))
      if (actions.length) this.addActions(actions, { id: 'forms', type: 'system' })
    }

    /** Counters of the actor and of its items: click +1, right-click −1. */
    async #buildCounters () {
      const api = this.#sdmApi
      if (!api) return
      // The GM can turn counters off (Core Rules settings)
      try {
        if (game.settings.get('sdm', 'enableCounters') === false) return
      } catch {}
      const actions = []
      const add = (doc, docKey, img) => {
        for (const counter of api.counters.get(doc)) {
          const max = counter.max !== null && counter.max !== undefined ? `/${counter.max}` : ''
          actions.push({
            id: `${docKey}-counter-${counter.key}`,
            name: `${counter.label} ${counter.value}${max}`,
            img,
            icon1: '<i class="fa-solid fa-hashtag"></i>',
            tooltip: game.i18n.format('SDM.Counter.RowHint', { label: counter.label }),
            listName: `Counter: ${counter.label}`,
            encodedValue: ['counter', `${docKey}:${counter.key}`].join(this.delimiter)
          })
        }
      }
      add(this.actor, 'actor', null)
      for (const [itemId, item] of this.items ?? []) add(item, itemId, coreModule.api.Utils.getImage(item))
      if (actions.length) this.addActions(actions, { id: 'counters', type: 'system' })
    }

    async #buildWallet () {
      if (this.items.size === 0) return
      const groupData = { id: 'wallet', type: 'system' }
      const itemList = Array.from(this.items.values())
      const currencyItems = itemList.filter(
        (i) => i.system.size.unit === 'cash'
      )
      // Get actions
      const actions = currencyItems.map((item) => {
        return {
          id: item.id,
          name: item.getDefaultTitle(),
          img: coreModule.api.Utils.getImage(item),
          tooltip: item.getInventoryTitle(),
          listName: `TransferCash: ${item.id}`,
          encodedValue: ['transferCash', item.id].join(this.delimiter)
        }
      })

      this.addActions(actions, groupData)
    }

    async #buildEffects () {
      const temporary = { id: 'effectstemp', type: 'system' }
      const permanent = { id: 'effectsperm', type: 'system' }

      const effects = this.actor.getAllEffects()

      effects.forEach((eff) => {
        let group = temporary
        if (eff.isTemporary === false) {
          group = permanent
        }

        const source = foundry.utils.fromUuidSync(eff.origin)?.name || ''

        this.addActions(
          [
            {
              id: 'ef' + this.actor.id + eff.name,
              name: eff.name,
              img: eff.img,
              tooltip: `${eff.name}: ${source}`,
              cssClass: eff.disabled ? 'toggle' : 'togle active',
              encodedValue: ['effects', eff.id].join(this.delimiter)
            }
          ],
          group
        )
      })
    }
  }
})
