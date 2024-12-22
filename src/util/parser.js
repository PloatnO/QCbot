/**
 * Minecraft-protocol version: 1.50.0
 *
 * Minecraft Version: 1.20.4 (Basically support 1.20.5 and 1.20.6)
 *
 * Language File Version: 1.21.1
 *
 * ChatParser Version: 1.47
 *		
 * Update:
 *   - Fix Color and format
 *
 * Knowns Issues:
 *	 - Invalid Emojis (as i know PrismarineJS fixing...)
 *   - Spawnpoint Number
 *
 * Report Issue: https://code.chipmunk.land/Yaode_owo/Minecraft-protocol-1.20.4-chat-parser/issues/new
 */


 const lang = require("../data/en_us.json"); // translate message

 function simplify(data) {
   try {
     if (data === undefined || data === null) return undefined;
     if (typeof data !== "object") return data;
     function transform(value, type) {
     if (type === 'compound') {
         return Object.keys(value).reduce(function (acc, key) {
           acc[key] = simplify(value[key]);
           return acc;
         }, {});
       }
       if (type === 'list') {
         return value.value.map(function (v) {
           return transform(v, value.type);
         });
       }
       return value;
     }
     return transform(data.value, data.type);
   } catch (e) {
   console.log(e);
     return '*** An unexpected error occurred while processing the component ***';
   // return '*** When is component is sus ***';
   }
 }
 
 function FixEmptyKeys(obj) {
   if (Array.isArray(obj)) {
     return obj.map(FixEmptyKeys);
     } else if (typeof obj === 'object' && obj !== null) {
     const newObj = {};
     for (const key in obj) {
       const newKey = key === '' ? 'text' : key;
       newObj[newKey] = FixEmptyKeys(obj[key]);
     }
     return newObj;
   }
   return obj;
 }
 
 function processNBTComponent(data) {
   try {
     if (data === undefined || data === null) return undefined;
     if (typeof data !== "object") return data;
     return FixEmptyKeys(simplify(data));
   } catch (e) {
     console.log(e);
     return '*** An unexpected error occurred while processing the component ***';
   }
 }
 
 function VaildText(comp) {
     return (typeof comp === "string" && comp !== "") ||
         (typeof comp.text === "string" && comp.text !== "") ||
         (typeof comp.keybind === "string" && comp.keybind !== "") ||
         (typeof comp.translate === "string" && comp.translate !== "") ||
         (typeof comp.extra === "object" && Array.isArray(comp.extra));
 }
 
 function parseMinecraftColor(color) {
   if (typeof color === 'string' && ansiMap[color] && !color.startsWith('#')) {
   return { color: ansiMap[color], have: true };
   } else if (typeof color === 'string' && color.startsWith('#')) {
     const hexRegex = /#?([a-fA-F\d]{2})([a-fA-F\d]{2})([a-fA-F\d]{2})/;
     const hexCodes = hexRegex.exec(color);
     if (hexCodes) {
       const red = parseInt(hexCodes[1], 16);
       const green = parseInt(hexCodes[2], 16);
       const blue = parseInt(hexCodes[3], 16);
       return { color: `\u001b[38;2;${red};${green};${blue}m`, have: true };
     }
   } else {
     return { color: '', have: false };
   }
 }
 
 function parseMinecraftFormat(format) {
   let result = '';
   if (!format) return { format: '', have: false };
   if (format.bold === 1) result += ansiMap['bold'];
   if (format.italic === 1) result += ansiMap['italic'];
   if (format.underlined === 1) result += ansiMap['underlined'];
   if (format.strikethrough === 1) result += ansiMap['strikethrough'];
   if (format.obfuscated === 1) result += ansiMap['obfuscated'];
   return result !== '' ? { format: result, have: true } : { format: '', have: false };
 }
 
 function inject(bot) {
 let title = {
   type: NaN, // This is custom
   fadeIn: NaN,
   stay: NaN,
   fadeOut: NaN,
     jsonMsg: {
     message: undefined,
     subMessage: undefined
   },
     withColor: {
       message: undefined,
     subMessage: undefined
     },
     withoutColor: {
       message: undefined,
     subMessage: undefined
     },
 };
 
 
 bot.on('end', () => {
   title = {};
 });
 
 
 bot.on('set_title_text', (packet) => {
     const parsedTitleText = processNBTComponent(packet.text);
   title = {
     ...title,
     type: 0,
     jsonMsg: {
     message: parsedTitleText
     },
     withColor: {
     message: parseMinecraftMessage(parsedTitleText)
     },
     withoutColor: {
     message: parseMinecraftMessageNoColor(parsedTitleText)
     },
   }
   
     bot.emit('custom_title', title.withColor.message, title, packet);
   bot.emit('custom_allMessage', 'title', title.message, title, packet);
   
   title = {
     ...title,
     type: NaN,
     jsonMsg: {
     message: undefined
     },
     withColor: {
     message: undefined
     },
     withoutColor: {
     message: undefined
     },
   }
 });
 
 bot.on('set_title_subtitle', (packet) => {
   const parsedSubTitleText = processNBTComponent(packet.text);
   title = {
     ...title,
     type: 1,
     jsonMsg: {
     subMessage: parsedSubTitleText
     },
     withColor: {
     subMessage: parseMinecraftMessage(parsedSubTitleText)
     },
     withoutColor: {
     subMessage: parseMinecraftMessageNoColor(parsedSubTitleText)
     },
   }
     
     bot.emit('custom_title', title.withColor.subMessage, title, packet);
   bot.emit('custom_allMessage', 'title', title.withColor.subMessage, title, packet);
   
   title = {
     ...title,
     type: NaN,
     jsonMsg: {
     subMessage: undefined
     },
     withColor: {
     subMessage: undefined
     },
     withoutColor: {
     subMessage: undefined
     },
   }
 });
 
 bot.on('set_title_time', (packet) => {
   title = {
     ...title,
     type: 2,
     fadeIn: packet.fadeIn,
     stay: packet.stay,
     fadeOut: packet.fadeOut,
   }
     
     bot.emit('custom_title', undefined, title, packet);
   bot.emit('custom_allMessage', 'title', undefined, title, packet);
 });
 
 bot.on('boss_bar', (packet) => {
   const bossBar = {
   uuid: packet.entityUUID,
     action: packet.action,
   health: NaN,
   color: NaN,
   dividers: NaN,
   flags: NaN,
   
     jsonMsg: {
     message: undefined
   },
     withColor: {
       message: undefined
     },
     withoutColor: {
       message: undefined
     },
   }
 
   switch (bossBar.action) {
     case 0: { // bossBar visible true || bossBar player botName
     const parsedBossBarMessage = processNBTComponent(packet.title)
     bossBar.withoutColor.message = parseMinecraftMessageNoColor(parsedBossBarMessage);
     bossBar.withColor.message = parseMinecraftMessage(parsedBossBarMessage);
     bossBar.jsonMsg.message = parsedBossBarMessage;
     
     bossBar.health = packet.health;
     bossBar.color = packet.color;
     bossBar.dividers = packet.dividers;
     bossBar.flags = packet.flags;
   }
   break;
 
   case 1: // bossBar remove || bossBar visible false || bossBar player !botName
   break;
   
   case 2: // bossBar set max || bossBar set value, 1 mean full
     bossBar.health = packet.health;
   break;
   
   case 3: { // bossBar set name
     const parsedBossBarMessage = processNBTComponent(packet.title)
     bossBar.withoutColor.message = parseMinecraftMessageNoColor(parsedBossBarMessage);
     bossBar.withColor.message = parseMinecraftMessage(parsedBossBarMessage);
     bossBar.jsonMsg.message = parsedBossBarMessage;
   }
   break;
   
   case 4:
     bossBar.color = packet.color; // bossBar set color
     bossBar.dividers = packet.dividers; // bossBar set style 
   break;
   
   case 5: // wither, ender dragon etc... , chayapak found it
       bossBar.flags = packet.flags;
   break;
   
   default:
     console.log(packet);
   break;
   }
 
     bot.emit('custom_bossBar', bossBar.withColor.message, bossBar, packet);
   bot.emit('custom_allMessage', 'bossBar', bossBar.withColor.message, bossBar, packet);
 });
 
 bot.on('action_bar', (packet) => {
     const parsedText = processNBTComponent(packet.text);
   
     const actionBar = {
       jsonMsg: {
       message: parsedText
     },
       withColor: {
         message: parseMinecraftMessage(parsedText)
       },
       withoutColor: {
         message: parseMinecraftMessageNoColor(parsedText)
       },
     };	
   
     bot.emit('custom_actionBar', actionBar.withColor.message, actionBar, packet);
     bot.emit('custom_allMessage', 'actionBar', actionBar.message, actionBar, packet);
 });
 
 
 bot.on('system_chat', (packet) => {
   if (packet.isActionBar) return;
   const parsedContent = processNBTComponent(packet.content);
   
   const systemChat = {
     jsonMsg: {
     message: parsedContent
   },
     withColor: {
       message: parseMinecraftMessage(parsedContent)
     },
     withoutColor: {
       message: parseMinecraftMessageNoColor(parsedContent)
     },
   };
 
   bot.emit('custom_systemChat', systemChat.withColor.message, systemChat, packet);
   bot.emit('custom_allMessage', 'systemChat', systemChat.withColor.message, systemChat, packet);
 });
 
 bot.on('profileless_chat', (packet) => { // kinda player_chat
   const parsedMessage = processNBTComponent(packet.message);
   const parsedName = processNBTComponent(packet.name);
   const parsedTarget = processNBTComponent(packet.target);
   
   const profilelessChat = {
   type: packet.type,
 
   jsonMsg: {
     message: undefined,
     formattedMessage: parsedMessage,
     senderName: parsedName,
     targetName: parsedTarget
   },
     withColor: {
     message: undefined,
     formattedMessage: parseMinecraftMessage(parsedMessage),
     senderName: parseMinecraftMessage(parsedName),
     targetName: parseMinecraftMessage(parsedTarget)
     },
   withoutColor: {
     message: undefined,
     formattedMessage: parseMinecraftMessageNoColor(parsedMessage),
     senderName: parseMinecraftMessageNoColor(parsedName),
     targetName: parseMinecraftMessageNoColor(parsedTarget)
   },
   };
 
   switch (profilelessChat.type) {
     case 0: // normal profileless chat message
     profilelessChat.withColor.message = parseMinecraftMessage({ "translate": "chat.type.text", "with": [ parsedName, parsedMessage ]});
     profilelessChat.withoutColor.message = parseMinecraftMessageNoColor({ "translate": "chat.type.text", "with": [ parsedName, parsedMessage ]});
     profilelessChat.jsonMsg.message = { "translate": "chat.type.text", "with": [ parsedName, parsedMessage ]};
     break;
   case 1: // /me
     profilelessChat.withColor.message = parseMinecraftMessage({ "translate": "chat.type.emote", "with": [ parsedName, parsedMessage ]});
     profilelessChat.withoutColor.message = parseMinecraftMessageNoColor({ "translate": "chat.type.emote", "with": [ parsedName, parsedMessage ]});
     profilelessChat.jsonMsg.message = { "translate": "chat.type.emote", "with": [ parsedName, parsedMessage ]}
     break;
     case 2: // player /tell
       profilelessChat.withColor.message = parseMinecraftMessage({ translate: "commands.message.display.incoming", with: [ parsedName, parsedMessage ], color: "gray", italic: true });
     profilelessChat.withoutColor.message = parseMinecraftMessageNoColor({ translate: "commands.message.display.incoming", with: [ parsedName, parsedMessage ], color: "gray", italic: true });
     profilelessChat.jsonMsg.message = { translate: "commands.message.display.incoming", with: [ parsedName, parsedMessage ], color: "gray", italic: true }
       break;custom_playerChator.message = parseMinecraftMessageNoColor({ translate: "commands.message.display.outgoing", with: [ parsedTarget, parsedMessage ], color: "gray", italic: true });
     profilelessChat.jsonMsg.message = { translate: "commands.message.display.outgoing", with: [ parsedTarget, parsedMessage ], color: "gray", italic: true }
     break;
     case 4: // player chat
     profilelessChat.withColor.message = parseMinecraftMessage(parsedMessage);
     profilelessChat.withoutColor.message = parseMinecraftMessageNoColor(parsedMessage);
     profilelessChat.jsonMsg.message = parsedMessage
       break;
     case 5: // /say
       profilelessChat.withColor.message = parseMinecraftMessage({ translate: 'chat.type.announcement', with: [ parsedName, parsedMessage ]});
     profilelessChat.withoutColor.message = parseMinecraftMessageNoColor({ translate: 'chat.type.announcement', with: [ parsedName, parsedMessage ]});
     profilelessChat.jsonMsg.message = { translate: 'chat.type.announcement', with: [ parsedName, parsedMessage ]}
       break;
     case 6: // player /teammsg
       profilelessChat.withColor.message = parseMinecraftMessage({ translate: 'chat.type.team.text', with: [ parsedTarget, parsedName, parsedMessage ]});
     profilelessChat.withoutColor.message = parseMinecraftMessageNoColor({ translate: 'chat.type.team.text', with: [ parsedTarget, parsedName, parsedMessage ]});
     profilelessChat.jsonMsg.message = { translate: 'chat.type.team.text', with: [ parsedTarget, parsedName, parsedMessage ]}
       break;
   case 7: // you /teammsg
       profilelessChat.withColor.message = parseMinecraftMessage({ translate: 'chat.type.team.sent', with: [ parsedTarget, parsedName, parsedMessage ]});
     profilelessChat.withoutColor.message = parseMinecraftMessageNoColor({ translate: 'chat.type.team.sent', with: [ parsedTarget, parsedName, parsedMessage ]});
     profilelessChat.jsonMsg.message = { translate: 'chat.type.team.sent', with: [ parsedTarget, parsedName, parsedMessage ]}
   break;
     default:
       console.log(`Unknown profilelessChat packet. Type: ${profilelessChat.type}`);
     console.log(packet);
       break;
   }
   
   bot.emit('custom_profilelessChat', profilelessChat.withColor.message, profilelessChat, packet);
   bot.emit('custom_allMessage', 'profilelessChat', profilelessChat.withColor.message, profilelessChat, packet);
 })
 
 bot.on('player_chat', (packet) => { // player chat
   const parsedMessage = processNBTComponent(packet.unsignedChatContent);
   const parsedName = processNBTComponent(packet.networkName);
   const parsedTarget = processNBTComponent(packet.networkTargetName);
   
   const playerChat = {
   type: packet.type,
   plainMessage: packet.plainMessage,
   senderUuid: packet.senderUuid,
   
   jsonMsg: {
     message: undefined,
     unsignedChatContent: parsedMessage,
     senderName: parsedName,
     targetName: parsedTarget
   },
     withColor: {
     message: undefined,
     unsignedChatContent: parseMinecraftMessage(parsedMessage),
     senderName: parseMinecraftMessage(parsedName),
     targetName: parseMinecraftMessage(parsedTarget)
     },
   withoutColor: {
     message: undefined,
     unsignedChatContent: parseMinecraftMessageNoColor(parsedMessage),
     senderName: parseMinecraftMessageNoColor(parsedName),
     targetName: parseMinecraftMessageNoColor(parsedTarget)
   },
   };
 
   switch (playerChat.type) { // vanish off
     case 0: // normal vanilla chat message
     playerChat.withColor.message = parseMinecraftMessage({ "translate": "chat.type.text", "with": [ parsedName, playerChat.plainMessage ]});
     playerChat.withoutColor.message = parseMinecraftMessageNoColor({ "translate": "chat.type.text", "with": [ parsedName, playerChat.plainMessage ]});
     playerChat.jsonMsg.message = { "translate": "chat.type.text", "with": [ parsedName, playerChat.plainMessage ]};
     break;
   case 1: // /minecraft:me
     playerChat.withColor.message = parseMinecraftMessage({ "translate": "chat.type.emote", "with": [ parsedName, playerChat.plainMessage ]});
     playerChat.withoutColor.message = parseMinecraftMessageNoColor({ "translate": "chat.type.emote", "with": [ parsedName, playerChat.plainMessage ]});
     playerChat.jsonMsg.message = { "translate": "chat.type.emote", "with": [ parsedName, playerChat.plainMessage ]}
     break;
     case 2: // player /minecraft:tell
       playerChat.withColor.message = parseMinecraftMessage({ translate: "commands.message.display.incoming", with: [ parsedName, playerChat.plainMessage ], color: "gray", italic: true });
     playerChat.withoutColor.message = parseMinecraftMessageNoColor({ translate: "commands.message.display.incoming", with: [ parsedName, playerChat.plainMessage ], color: "gray", italic: true });
     playerChat.jsonMsg.message = { translate: "commands.message.display.incoming", with: [ parsedName, playerChat.plainMessage ], color: "gray", italic: true }
       break;
   case 3: // you /minecraft:tell
     playerChat.withColor.message = parseMinecraftMessage({ translate: "commands.message.display.outgoing", with: [ parsedTarget, playerChat.plainMessage ], color: "gray", italic: true });
     playerChat.withoutColor.message = parseMinecraftMessageNoColor({ translate: "commands.message.display.outgoing", with: [ parsedTarget, playerChat.plainMessage ], color: "gray", italic: true });
     playerChat.jsonMsg.message = { translate: "commands.message.display.outgoing", with: [ parsedTarget, playerChat.plainMessage ], color: "gray", italic: true }
     break;
     case 4: // player chat
     playerChat.withColor.message = parseMinecraftMessage(parsedMessage);
     playerChat.withoutColor.message = parseMinecraftMessageNoColor(parsedMessage);
     playerChat.jsonMsg.message = parsedMessage
       break;
   case 5: // /say
       playerChat.withColor.message = parseMinecraftMessage({ translate: 'chat.type.announcement', with: [ parsedName, playerChat.plainMessage ]});
     playerChat.withoutColor.message = parseMinecraftMessageNoColor({ translate: 'chat.type.announcement', with: [ parsedName, playerChat.plainMessage ]});
     playerChat.jsonMsg.message = { translate: 'chat.type.announcement', with: [ parsedName, playerChat.plainMessage ]}
       break;
     case 6: // player /minecraft:teammsg || /teammsg
       playerChat.withColor.message = parseMinecraftMessage({ translate: 'chat.type.team.text', with: [ parsedTarget, parsedName, playerChat.plainMessage ]});
     playerChat.withoutColor.message = parseMinecraftMessageNoColor({ translate: 'chat.type.team.text', with: [ parsedTarget, parsedName, playerChat.plainMessage ]});
     playerChat.jsonMsg.message = { translate: 'chat.type.team.text', with: [ parsedTarget, parsedName, playerChat.plainMessage ]}
       break;
   case 7: // you /minecraft:teammsg || /teammsg
       playerChat.withColor.message = parseMinecraftMessage({ translate: 'chat.type.team.sent', with: [ parsedTarget, parsedName, playerChat.plainMessage ]});
       playerChat.withoutColor.message = parseMinecraftMessageNoColor({ translate: 'chat.type.team.sent', with: [ parsedTarget, parsedName, playerChat.plainMessage ]});
     playerChat.jsonMsg.message = { translate: 'chat.type.team.sent', with: [ parsedTarget, parsedName, playerChat.plainMessage ]}
   break;
     default:
       console.log(`Unknown player_chat packet. Type: ${playerChat.type}`);
     console.log(packet);
       break;
   }
   
   bot.emit('custom_playerChat', playerChat.withColor.message, playerChat, packet);
   bot.emit('custom_allMessage', 'playerChat', playerChat.withColor.message, playerChat, packet)
 });
 
 };
 
 const ansiMap = {
     '§0': '\x1B[30m',
     '§1': '\x1B[34m',
     '§2': '\x1B[32m',
     '§3': '\x1B[36m',
     '§4': '\x1B[31m',
     '§5': '\x1B[35m',
     '§6': '\x1B[33m',
     '§7': '\x1B[37m',
     '§8': '\x1B[90m',
     '§9': '\x1B[94m',
     '§a': '\x1B[92m',
     '§b': '\x1B[96m',
     '§c': '\x1B[91m',
     '§d': '\x1B[95m',
     '§e': '\x1B[93m',
     '§f': '\x1B[97m',
     black: '\x1B[30m',
     dark_blue: '\x1B[34m',
     dark_green: '\x1B[32m',
     dark_aqua: '\x1B[36m',
     dark_red: '\x1B[31m',
     dark_purple: '\x1B[35m',
     gold: '\x1B[33m',
     gray: '\x1B[37m',
     dark_gray: '\x1B[90m',
     blue: '\x1B[94m',
     green: '\x1B[92m',
     aqua: '\x1B[96m',
     red: '\x1B[91m',
     light_purple: '\x1B[95m',
     yellow: '\x1B[93m',
     white: '\x1B[97m',
   
     '§l': '\x1B[1m',
     '§o': '\x1B[3m',
     '§n': '\x1B[4m',
     '§m': '\x1B[9m',
     '§k': '\x1B[5m',
     '§r': '\x1B[0m',
     bold: '\x1B[1m',
     italic: '\x1B[3m',
     underlined: '\x1B[4m',
     strikethrough: '\x1B[9m',
     obfuscated: '\x1B[5m',
     reset: '\x1B[0m',
 };
 
 function parseMinecraftMessage(component) {
   if (component === undefined || component === null) return undefined;
   if (typeof component !== "object") return component;
   function extractText(comp, prevColor = { color: '', have: false }, prevFormat = { format: '', have: false }) {
     let text = '';
   
   let shouldReset = false;
   let NowColor = parseMinecraftColor(comp?.color);
   let NowFormat = parseMinecraftFormat(comp);
   
   if (VaildText(comp)) { // Idk, but it work atleast.
     if (NowColor.have || prevColor.have) {
       if (NowColor.have) {
         text += NowColor.color;
         shouldReset = true;
       } else if (prevColor.have) {
         text += prevColor.color;
       } else {
         text += ansiMap['white'];
       }
     }
     if (NowFormat.have || prevFormat.have) {
       if (NowFormat.have) {
             text += NowFormat.format
             shouldReset = true;
       } else if (prevFormat.have) {
         prevFormat.format;
       }
     }
   }
   
   if (typeof comp.text === 'string' || typeof comp.text === 'number') {
       text += comp.text;
     }
   if (typeof comp === 'string' || typeof comp === 'number') {
     text += comp;
     }
   if (typeof comp.keybind === 'string' || typeof comp.keybind === 'number') {
     text += lang[comp.keybind] || comp.keybind;
   }
 
   if (comp.translate) {
     let translateString = lang[comp.translate] || comp.translate;
     let DefaultTranslateString = lang[comp.translate] || comp.translate;
     let DefaultMsg = false;
     let fallbackMsg = false;
     if (comp.fallback && !lang[comp.translate]) fallbackMsg = true;
 
     if (comp.with && !fallbackMsg) {
       const withArgs = comp.with.map(arg => extractText(arg, NowColor.have ? NowColor : prevColor, NowFormat.have ? NowFormat : prevFormat) + `${VaildText(comp) ? NowFormat.have ? NowFormat.format : "" : ""}${VaildText(comp) ? NowColor.have ? NowColor.color : "" : ""}`);
       let usedReplacements = 0;
       translateString = translateString.replace(/thing__placeholder__/g, 'default_thing__placeholder__');
 
       translateString = translateString.replace(/%s/g, (match, offset, string) => {
         if (offset > 0 && string[offset - 1] === '%') {
           return 's';
         }
         
         if (usedReplacements < withArgs.length) {
           if (translateString.length + withArgs[usedReplacements].length > 32768) return '\x1B[91m*** Component has too many placeholders ***\x1B[0m';  // Prevent translate crash
           return `thing__placeholder__${usedReplacements++}`;
         }
 
         DefaultMsg = true;
         return "%s";
       });
 
       translateString = translateString.replace(/%(-?\d+)\$s/g, (match, index, stringindex, string) => {
         const argIndex = parseInt(index, 10) - 1;
         
         if (argIndex < 0 || argIndex >= withArgs.length) {
           DefaultMsg = true;
           return match;
         }
 
         if (stringindex > 0 && string[stringindex - 1] === '%') {
           return match;
         }
         if (translateString.length + withArgs[argIndex].length > 32768) return '\x1B[91m*** Component has too many placeholders ***\x1B[0m';  // Prevent translate crash
         return `thing__placeholder__${argIndex}`;
       });
 
       for (let i = 0; i < withArgs.length; i++) {
         if (translateString.length + withArgs[i].length > 32768) return '\x1B[91m*** Component has too many placeholders ***\x1B[0m';  // Prevent translate crash
         translateString = translateString.replace(new RegExp(`thing__placeholder__${i}`, 'g'), (match) => {
           const formattedArg = withArgs[i];
           return formattedArg;
         });
       }
       translateString = translateString.replace(/default_thing__placeholder__/g, 'thing__placeholder__');
     }
     
     if (DefaultMsg) {
       text += DefaultTranslateString;
     } else if (fallbackMsg) {
       text += comp.fallback;
     } else  {
       text += translateString;
     }
   }
   
     if (comp.extra) {
     if (!Array.isArray(comp.extra)) comp.extra = [comp.extra]
       comp.extra.forEach(subComp => {
         text += extractText(subComp, NowColor.have ? NowColor : prevColor, NowFormat.have ? NowFormat : prevFormat) + `${VaildText(comp) ? NowFormat.have ? NowFormat.format : "" : ""}${VaildText(comp) ? NowColor.have ? NowColor.color : "" : ""}`;
     });
   }
   
   if (shouldReset) {
     text += ansiMap['reset']
   }
 
   return text;
   }
   
   return extractText(component);
 }
 
 function parseMinecraftMessageNoColor(component) {
   if (component === undefined || component === null) return undefined;
   if (typeof component !== "object") return component;
   
   function extractText(comp) {
     let text = '';
 
   if (typeof comp.text === 'string' || typeof comp.text === 'number') {
       text += comp.text;
     }
   if (typeof comp === 'string' || typeof comp === 'number') {
     return comp;
     }
   if (typeof comp.keybind === 'string' || typeof comp.keybind === 'number') {
     text += lang[comp.keybind] || comp.keybind
   }
   
   if (comp.translate) {
     let translateString = lang[comp.translate] || comp.translate;
     let DefaultTranslateString = lang[comp.translate] || comp.translate;
     let DefaultMsg = false;
     let fallbackMsg = false;
     if (comp.fallback && !lang[comp.translate]) fallbackMsg = true;
     
     if (comp.with && !fallbackMsg) {
       const withArgs = comp.with.map(arg => extractText(arg));
       let usedReplacements = 0;
 
       translateString = translateString.replace(/thing__placeholder__/g, 'default_thing__placeholder__');
       translateString = translateString.replace(/%s/g, (match, offset, string) => {
         if (offset > 0 && string[offset - 1] === '%') {
           return 's';
         }
 
         if (usedReplacements < withArgs.length) {
           if (translateString.length + withArgs[usedReplacements].length > 32768) return '*** Component has too many placeholders ***';  // Prevent translate crash
           return `thing__placeholder__${usedReplacements++}`;
         }
 
         DefaultMsg = true;
         return "%s";
       });
 
       translateString = translateString.replace(/%(-?\d+)\$s/g, (match, index, stringindex, string) => {
         const argIndex = parseInt(index, 10) - 1;
         
         if (argIndex < 0 || argIndex >= withArgs.length) {
           DefaultMsg = true;
           return match;
         }
 
         if (stringindex > 0 && string[stringindex - 1] === '%') {
           return match;
         }
         
         if (translateString.length + withArgs[argIndex].length > 32768) return '*** Component has too many placeholders ***';  // Prevent translate crash
         return `thing__placeholder__${argIndex}`;
       });
 
       for (let i = 0; i < withArgs.length; i++) {
         if (translateString.length + withArgs[i].length > 32768) return '*** Component has too many placeholders ***';  // Prevent translate crash
         translateString = translateString.replace(new RegExp(`thing__placeholder__${i}`, 'g'), (match) => {
           const formattedArg = withArgs[i];
           return formattedArg;
         });
       }
       translateString = translateString.replace(/default_thing__placeholder__/g, 'thing__placeholder__');
     }
     
     if (DefaultMsg) {
       text += DefaultTranslateString;
     } else if (fallbackMsg) {
       text += comp.fallback;
     } else  {
       text += translateString;
     }
   }
   
     if (comp.extra) {
     if (!Array.isArray(comp.extra)) comp.extra = [comp.extra]
       comp.extra.forEach(subComp => {
         text += extractText(subComp);
       });
     }
 
     return text;
   }
   
   return extractText(component);
 }
 
 function cboutput(component) {
   if (component === undefined || component === null) return undefined;
   if (typeof component !== "object") return component;
   
   function extractText(comp, prevColor = { color: '', have: false }, prevFormat = { format: '', have: false }) {
     let text = '';
   
   let shouldReset = false;
   let NowColor = parseMinecraftColor(comp?.color);
   let NowFormat = parseMinecraftFormat(comp);
   
   if ((comp || comp !== "") && (comp.text || comp.text !== "")) {		
     text += NowColor.have ? NowColor.color : prevColor.have ? prevColor.color : ansiMap['white'];
     if (NowFormat.have || prevFormat.have) {
       text += NowFormat.have ? NowFormat.format : prevFormat.format;
       shouldReset = true;
     };
   }
 
   if (typeof comp.text === 'string' || typeof comp.text === 'number') {
       text += comp.text;
     }
   if (typeof comp === 'string' || typeof comp === 'number') {
     text += comp;
     }
   
     if (comp.extra) {
     if (!Array.isArray(comp.extra)) comp.extra = [comp.extra]
       comp.extra.forEach(subComp => {
         text += extractText(subComp, NowColor.have === true ? NowColor : prevColor, NowFormat.have === true ? NowFormat : prevFormat);
     });
   }
   
   if (shouldReset) {
     text += ansiMap['reset']
   } else {
         text += prevColor.color || ansiMap['white'];
         text += prevFormat.format || '';
   }
   
   return text;
   }
   
   return extractText(component);
 }
 
 function cboutputNoColor(component) {
   if (component === undefined || component === null) return undefined;
   if (typeof component !== "object") return component;
   
   function extractText(comp) {
     let text = '';
 
   if (typeof comp.text === 'string' || typeof comp.text === 'number') {
       text += comp.text;
     }
   if (typeof comp === 'string' || typeof comp === 'number') {
     text += comp;
     }
   
     if (comp.extra) {
     if (!Array.isArray(comp.extra)) comp.extra = [comp.extra]
       comp.extra.forEach(subComp => {
         text += extractText(subComp);
     });
   }
   return text;
   }
   
   return extractText(component);
 }
 
 module.exports = { inject, parseMinecraftMessage, parseMinecraftMessageNoColor, cboutput, cboutputNoColor, simplify, FixEmptyKeys, processNBTComponent, ansiMap };