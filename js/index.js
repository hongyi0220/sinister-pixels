'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var App = function (_React$Component) {
   _inherits(App, _React$Component);

   function App(props) {
      _classCallCheck(this, App);

      var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

      _this.state = {
         table: { content: [],
            width: null,
            height: null,
            playerPosition: null,
            playerStats: null,
            caves: [],
            boss: null,
            dungeonLevel: 1
         },
         screen: { yCoord: 0 },
         music: _this.aSoundOf('music'),
         startScreen: true
      };
      _this.makeTable = _this.makeTable.bind(_this);
      _this.makeBox = _this.makeBox.bind(_this);
      _this.makeCaves = _this.makeCaves.bind(_this);
      _this.isEdgeCell = _this.isEdgeCell.bind(_this);
      _this.generatePlayer = _this.generatePlayer.bind(_this);
      _this.movePlayer = _this.movePlayer.bind(_this);
      _this.connectCaves = _this.connectCaves.bind(_this);
      _this.findEdgeCells = _this.findEdgeCells.bind(_this);
      _this.hasCave = _this.hasCave.bind(_this);
      _this.generateEnemies = _this.generateEnemies.bind(_this);
      _this.aNumberBetween = _this.aNumberBetween.bind(_this);
      _this.avgOf = _this.avgOf.bind(_this);
      _this.findEmptyCells = _this.findEmptyCells.bind(_this);
      _this.randomNumericElementsFromArray = _this.randomNumericElementsFromArray.bind(_this);
      _this.generatePotions = _this.generatePotions.bind(_this);
      _this.generateLoot = _this.generateLoot.bind(_this);
      _this.generateBoss = _this.generateBoss.bind(_this);
      _this.generatePortal = _this.generatePortal.bind(_this);
      _this.generateNewLevel = _this.generateNewLevel.bind(_this);
      _this.findPlayerCoords = _this.findPlayerCoords.bind(_this);
      _this.aSoundOf = _this.aSoundOf.bind(_this);
      _this.toggleMusic = _this.toggleMusic.bind(_this);
      _this.unmountStartScreen = _this.unmountStartScreen.bind(_this);
      _this.scrollToPlayerPosition = _this.scrollToPlayerPosition.bind(_this);
      _this.handleButtonClick = _this.handleButtonClick.bind(_this);
      return _this;
   }

   App.prototype.scrollToPlayerPosition = function scrollToPlayerPosition() {
      var state = _extends({}, this.state);
      window.scrollTo(0, state.screen.yCoord);
   };

   App.prototype.unmountStartScreen = function unmountStartScreen() {
      this.setState({ startScreen: false });
   };

   App.prototype.handleButtonClick = function handleButtonClick() {
      this.unmountStartScreen();
      this.scrollToPlayerPosition();
   };

   App.prototype.toggleMusic = function toggleMusic(e) {
      var music = this.state.music;
      if (e.target.checked) {
         if (typeof music.loop == 'boolean') music.loop = true;else {
            music.addEventListener('ended', function () {
               music.currentTime = 0;
               music.play();
            }, false);
         }
         music.play();
      } else {
         music.pause();
         music.currentTime = 0;
      }
   };

   App.prototype.generateNewLevel = function generateNewLevel() {
      var table = _extends({}, this.state.table);
      table.dungeonLevel += 1;
      table.caves = [];
      this.setState({ table: table });
      this.makeTable(50, 100);
      this.makeCaves(8, 12, 0.015);
      this.connectCaves();
      this.generatePlayer('old');
      this.generatePortal();
      this.generateEnemies(40);
      this.generatePotions(30);
      this.generateBoss(2);
      this.movePlayer();
   };

   App.prototype.makeTable = function makeTable(width, height) {
      var state = _extends({}, this.state);
      for (var i = 0; i < width * height; i++) {
         state.table.content[i] = {
            wall: true,
            player: false,
            enemy: false,
            currentEnemy: null,
            boss: false,
            portal: false,
            potion: false,
            loot: false,
            fog: true,
            clear: false,
            blurry: false,
            blurrier: false,
            blurriest: false
         };
      }state.table.width = width;
      state.table.height = height;
      this.setState({ state: state });
   };

   App.prototype.isEdgeCell = function isEdgeCell(cellIndex, width) {
      var leftEdgeCell = cellIndex % width === 0;
      var rightEdgeCell = (cellIndex + 1) % width === 0;
      return {
         leftEdgeCell: leftEdgeCell,
         rightEdgeCell: rightEdgeCell
      };
   };
   // This finds the cellIndexes on edges of a cave

   App.prototype.findEdgeCells = function findEdgeCells(from, width, height) {
      var table = _extends({}, this.state.table);
      var right = [];
      var bottom = [];
      for (var i = 0; i < height; i++) {
         right.push(from + (width - 1) + table.width * i);
      }
      for (var i = 0; i < width; i++) {
         bottom.push(from + i + table.width * (height - 1));
      }
      return {
         right: right,
         bottom: bottom
      };
   };
   // This finds the distance of the nearest cell
   // in the direction, given a cellIndex

   App.prototype.hasCave = function hasCave(edgeCell) {
      var table = _extends({}, this.state.table);
      var cells = table.content;
      var inEast = function inEast(edgeCell) {
         var distToEastEdge = function distToEastEdge(from) {
            var numOfRows = function () {
               var x = 0;
               while (table.width * x - 1 < from) {
                  x++;
               }
               return x;
            }();
            return table.width * numOfRows - from - 1;
         };
         var dist = distToEastEdge(edgeCell);
         for (var i = 1; i < dist; i++) {
            if (cells[edgeCell + i] && !cells[edgeCell + i].wall) {
               return { distance: i };
            }
         }
         return false;
      };
      var inSouth = function inSouth(edgeCell) {
         var distToSouthEdge = function distToSouthEdge(from) {
            var numOfRows = function () {
               var x = 0;
               while (from + table.width * x - 1 < cells.length - 1) {
                  x++;
               }
               return x - 1;
            }();
            return numOfRows;
         };
         var dist = distToSouthEdge(edgeCell);
         for (var i = 1; i < dist; i++) {
            if (cells[edgeCell + table.width * i] && !cells[edgeCell + table.width * i].wall) {
               return { distance: i };
            }
         }
         return false;
      };
      return {
         inEast: inEast(edgeCell),
         inSouth: inSouth(edgeCell)
      };
   };

   App.prototype.connectCaves = function connectCaves() {
      var _this2 = this;

      var table = _extends({}, this.state.table);
      var cells = table.content;
      table.caves.forEach(function (cave) {
         var rightEdgeCells = _this2.findEdgeCells(cave.from, cave.caveWidth, cave.caveHeight).right;
         rightEdgeCells = rightEdgeCells.filter(function (edgeCell) {
            return _this2.hasCave(edgeCell).inEast;
         });
         var randomEastEdgeCell = rightEdgeCells[Math.floor(Math.random() * rightEdgeCells.length)];
         var foundEastCave = _this2.hasCave(randomEastEdgeCell).inEast;
         var distanceToEast = foundEastCave.distance;
         if (foundEastCave) {
            for (var i = 1; i < distanceToEast; i++) {
               table.content[randomEastEdgeCell + i].wall = false;
            }
         }

         var bottomEdgeCells = _this2.findEdgeCells(cave.from, cave.caveWidth, cave.caveHeight).bottom;
         bottomEdgeCells = bottomEdgeCells.filter(function (edgeCell) {
            return _this2.hasCave(edgeCell).inSouth;
         });
         var randomSouthEdgeCell = bottomEdgeCells[Math.floor(Math.random() * bottomEdgeCells.length)];
         var foundSouthCave = _this2.hasCave(randomSouthEdgeCell).inSouth;
         var distanceToSouth = foundSouthCave.distance;
         if (foundSouthCave) {
            for (var i = 1; i < distanceToSouth; i++) {
               table.content[randomSouthEdgeCell + table.width * i].wall = false;
            }
         }
      });
      this.setState({ table: table });
   };

   // This converts walls into caves

   App.prototype.aNumberBetween = function aNumberBetween(min, max) {
      var randomNumInRange = function randomNumInRange() {
         return Math.floor(Math.random() * (max - min + 1) + min);
      };
      return randomNumInRange();
   };

   App.prototype.makeBox = function makeBox(topLeftIndexOfBox, boxWidth, boxHeight, frequency, pushTo) {
      var _this3 = this;

      var table = _extends({}, this.state.table);
      var cells = table.content;
      // Checks to see if a box is going to be cut off
      // because it's close to the right edge
      var anyLeftEdgeCells = function anyLeftEdgeCells(topLeftIndexOfBox) {
         for (var i = 1; i < boxWidth; i++) {
            if (_this3.isEdgeCell(topLeftIndexOfBox + i, table.width).leftEdgeCell) return true;
         }
         return false;
      };
      // Conditions to meet to generate a box
      if (pushTo === 'caves') {
         if ( // Is current cell on the right edge
         !this.isEdgeCell(topLeftIndexOfBox, table.width).rightEdgeCell && !anyLeftEdgeCells(topLeftIndexOfBox) && cells[topLeftIndexOfBox] &&
         // Is current cell a wall
         cells[topLeftIndexOfBox].wall && frequency &&
         // These conditions prevent boxes next to each other from sticking togther
         cells[topLeftIndexOfBox - 1] && cells[topLeftIndexOfBox - 1].wall && cells[topLeftIndexOfBox - 1 + table.width * Math.ceil((boxHeight - 1) / 2)] && cells[topLeftIndexOfBox - 1 + table.width * Math.ceil((boxHeight - 1) / 2)].wall && cells[topLeftIndexOfBox - 1 + table.width * (boxHeight - 1)] && cells[topLeftIndexOfBox - 1 + table.width * (boxHeight - 1)].wall && cells[topLeftIndexOfBox + (boxWidth - 1) + 1] && cells[topLeftIndexOfBox + (boxWidth - 1) + 1].wall &&
         // These prevent boxes on top of each other from sticking together
         cells[topLeftIndexOfBox - table.width] && cells[topLeftIndexOfBox - table.width].wall && cells[topLeftIndexOfBox + Math.ceil((boxWidth - 1) / 2) - table.width] && cells[topLeftIndexOfBox + Math.ceil((boxWidth - 1) / 2) - table.width].wall && cells[topLeftIndexOfBox + (boxWidth - 1) - table.width] && cells[topLeftIndexOfBox + (boxWidth - 1) - table.width].wall &&
         // Is current cell valid
         cells[topLeftIndexOfBox] &&
         // Is top-right corner of cave a valid cell
         cells[topLeftIndexOfBox + (boxWidth - 1)] &&
         // This prevents boxes from overlapping each other
         cells[topLeftIndexOfBox + Math.ceil((boxWidth - 1) / 2) + table.width * Math.ceil((boxHeight - 1) / 2)] && cells[topLeftIndexOfBox + Math.ceil((boxWidth - 1) / 2) + table.width * Math.ceil((boxHeight - 1) / 2)].wall &&
         // Is top-right corner of box currently a wall
         cells[topLeftIndexOfBox + (boxWidth - 1)].wall &&
         // Is bottom-left corner of box a valid cell
         cells[topLeftIndexOfBox + table.width * (boxHeight - 1)] &&
         // Is bottom-right corner of box a valid cell
         cells[topLeftIndexOfBox + (boxWidth - 1) + table.width * (boxHeight - 1)]) {
            table[pushTo].push({ from: topLeftIndexOfBox, caveWidth: boxWidth, caveHeight: boxHeight });
            for (var j = 0; j < boxWidth; j++) {
               table.content[topLeftIndexOfBox + j].wall = false;
               for (var k = 1; k < boxHeight; k++) {
                  table.content[topLeftIndexOfBox + j + table.width * k].wall = false;
               }
            }
         }
      } else if (pushTo === 'boss') {
         for (var j = 0; j < boxWidth; j++) {

            table.content[topLeftIndexOfBox + j].wall = false;
            if (j === 0) table.content[topLeftIndexOfBox + j][pushTo] = 'top-left';else if (j === 1) table.content[topLeftIndexOfBox + j][pushTo] = 'top-right';

            for (var k = 1; k < boxHeight; k++) {

               table.content[topLeftIndexOfBox + j + table.width * k].wall = false;
               if (j === 0) table.content[topLeftIndexOfBox + j + table.width * k][pushTo] = 'bottom-left';else if (j === 1) table.content[topLeftIndexOfBox + j + table.width * k][pushTo] = 'bottom-right';
            }
         }
      }
   };

   App.prototype.makeCaves = function makeCaves(minLength, maxLength, freq) {
      var min = minLength;
      var max = maxLength;
      var table = _extends({}, this.state.table);
      for (var i = 0; i < table.content.length; i++) {
         var caveWidth = this.aNumberBetween(min, max);
         var caveHeight = this.aNumberBetween(min, max);
         var cells = table.content;
         var frequency = Math.random() < freq;
         this.makeBox(i, caveWidth, caveHeight, frequency, 'caves');
      }
      this.setState({ table: table });
   };

   App.prototype.randomNumericElementsFromArray = function randomNumericElementsFromArray(array, quantity, no_neighbors_opt_) {
      var table = _extends({}, this.state.table);
      array = array.map(function (e) {
         return Number(e);
      });
      var elements = [];
      var getRandomElement = function getRandomElement(array) {
         var randomElement = Math.floor(Math.random() * array.length);
         return array[randomElement];
      };
      for (var i = 0; i < quantity; i++) {
         var randomElement = getRandomElement(array);
         elements.push(randomElement);
         // This prevents duplicate selection of random empty cell
         var elementIndex = array.indexOf(randomElement);
         array.splice(elementIndex, 1);

         // This returns cells with no neighboring cells
         if (arguments[2] == 'no-neighbors') {
            var rightElementIndex = array.indexOf(randomElement + 1);
            array.splice(rightElementIndex, 1);
            var leftElementIndex = array.indexOf(randomElement - 1);
            array.splice(leftElementIndex, 1);
            var topElementIndex = array.indexOf(randomElement - table.width);
            array.splice(topElementIndex, 1);

            var topRightElementIndex = array.indexOf(randomElement + 1 - table.width);
            array.splice(topRightElementIndex, 1);

            var topLeftElementIndex = array.indexOf(randomElement - 1 - table.width);
            array.splice(topLeftElementIndex, 1);

            var bottomElementIndex = array.indexOf(randomElement + table.width);
            array.splice(bottomElementIndex, 1);

            var bottomRightElementIndex = array.indexOf(randomElement + 1 + table.width);
            array.splice(bottomRightElementIndex, 1);

            var bottomLeftElementIndex = array.indexOf(randomElement - 1 + table.width);
            array.splice(bottomLeftElementIndex, 1);
         }
      }
      if (quantity > 1) return elements;
      if (quantity === 1) return elements[0];
   };

   App.prototype.findEmptyCells = function findEmptyCells() {
      var table = _extends({}, this.state.table);
      var emptyCells = table.content.map(function (cell, i) {
         if (!cell.wall && !cell.player && !cell.enemy && !cell.loot && !cell.boss && !cell.potion && !cell.portal) return i;
      }).filter(function (e) {
         return Number.isInteger(e);
      });
      return emptyCells;
   };

   App.prototype.generatePlayer = function generatePlayer(newOrOld) {
      var table = _extends({}, this.state.table);
      // Find empty cells
      var emptyCells = this.findEmptyCells();
      // Pick a random empty cell
      if (!emptyCells.length) throw new Error('No empty cell to generate player');
      var randomCellIndex = this.randomNumericElementsFromArray(emptyCells, 1);

      table.content[randomCellIndex].player = true;
      table.content[randomCellIndex].fog = false;
      if (newOrOld === 'new') table.playerStats = { health: 45,
         level: 1,
         xp: 0,
         strength: 0.5,
         weapon: { name: 'Sturdy Stick',
            damage: { min: 5, max: 8 }
         },
         xpCap: 50

      };else if (newOrOld === 'old') table.playerStats = table.playerStats;
      table.playerPosition = randomCellIndex;
      this.findPlayerCoords(randomCellIndex, 20);
      this.setState({ table: table });
   };

   App.prototype.generatePortal = function generatePortal() {
      var table = _extends({}, this.state.table);
      var emptyCells = this.findEmptyCells();
      if (!emptyCells.length) throw new Error('No empty cell to generate portal');
      var randomCellIndex = this.randomNumericElementsFromArray(emptyCells, 1);
      if (!randomCellIndex) throw new Error('Invalid index returned from function "randomNumericElementsFromArray"');
      table.content[randomCellIndex].portal = true;
   };

   App.prototype.generateEnemies = function generateEnemies(numberOfEnemies) {
      var _this4 = this;

      var table = _extends({}, this.state.table);
      var emptyCells = this.findEmptyCells();
      if (!emptyCells.length) throw new Error('No empty cell to generate enemies');
      var randomCellIndexes = this.randomNumericElementsFromArray(emptyCells, numberOfEnemies, 'no-neighbors');
      var damage = 4 + table.dungeonLevel * 3;
      var health = 15 + table.dungeonLevel * 5;
      randomCellIndexes.forEach(function (index) {
         if (table.content[index]) table.content[index].enemy = { health: _this4.aNumberBetween(health - 5, health + 5), damage: _this4.aNumberBetween(damage - 5, damage + 5) };
      });
   };

   App.prototype.generatePotions = function generatePotions(numberOfPotions) {
      var table = _extends({}, this.state.table);
      var potionSize = this.aNumberBetween(2, 3) * 10;
      var emptyCells = this.findEmptyCells();
      if (!emptyCells.length) throw new Error('No empty cell to generate potions');
      var randomCellIndexes = this.randomNumericElementsFromArray(emptyCells, numberOfPotions, 'no-neighbors');
      randomCellIndexes.forEach(function (index) {
         if (table.content[index]) table.content[index].potion = potionSize;
      });
   };

   App.prototype.generateLoot = function generateLoot(destinationIndex, rarity, dropChance) {
      var content = _extends({}, this.state.table.content);
      var loot = {
         basic: [{ name: 'Wooden Club', damage: { min: 8, max: 12 } }, { name: 'Weathered Knife', damage: { min: 5, max: 16 } }, { name: 'Distressed Axe', damage: { min: 11, max: 13 } }, { name: 'Tangled Flail', damage: { min: 3, max: 29 } }, { name: 'Long Sword', damage: { min: 15, max: 20 } }],
         pro: [{ name: 'Spiked Club', damage: { min: 22, max: 24 } }, { name: 'Serrated Machete', damage: { min: 22, max: 29 } }, { name: 'Battle Axe', damage: { min: 15, max: 33 } }, { name: 'Spiked Skull Flail', damage: { min: 6, max: 59 } }, { name: 'Samurai Sword', damage: { min: 30, max: 45 } }],
         rare: [{ name: 'Stranger Things™ Spiked Bat', damage: { min: 40, max: 49 } }, { name: 'Freddy Krueger\'s Glove', damage: { min: 1, max: 120 } }, { name: 'Hattori Hanzo Katana Sword', damage: { min: 60, max: 100 } }, { name: 'Lightsaber', damage: { min: 110, max: 120 } }, { name: 'Shaun\'s Cricket Bat', damage: { min: 1, max: 395 } }]
      };
      var getRandomItem = function getRandomItem(rarity) {
         var length = loot[rarity].length;
         var index = Math.floor(Math.random() * length + 1);
         return loot[rarity][index];
      };
      dropChance = Number(dropChance);
      if (typeof dropChance != 'number') throw new Error('dropChance has to be a number');
      content[destinationIndex].loot = Math.random() < dropChance ? getRandomItem(rarity) : false;
      this.setState({ content: content });
   };

   App.prototype.generateBoss = function generateBoss(bossWidth) {
      var table = _extends({}, this.state.table);
      var cells = table.content;
      var emptyCells = this.findEmptyCells();
      if (!emptyCells.length) throw new Error('No empty cell to generate potions');
      var emptyBoxesStartingIndexes = emptyCells.filter(function (cell, i) {
         var anyOccupiedCells = function anyOccupiedCells(from, length) {
            var height = length;
            for (var i = 0; i < height; i++) {

               for (var j = 0; j < length; j++) {
                  if (cells[from + j + table.width * i] && (cells[from + j + table.width * i].wall || cells[from + j + table.width * i].enemy || cells[from + j + table.width * i].player || cells[from + j + table.width * i].loot || cells[from + j + table.width * i].potion || cells[from + j + table.width * i].portal)) return true;
               }
            }
            return false;
         };
         if (!anyOccupiedCells(cell, bossWidth)) return cell;
      });
      var bossPositionIndex = this.randomNumericElementsFromArray(emptyBoxesStartingIndexes, 1, 'no-neighbors');
      var damage = 50 + table.playerStats.level * 4;
      if (table.dungeonLevel % 3 === 0) {
         this.makeBox(bossPositionIndex, bossWidth, bossWidth, true, 'boss');
         table.boss = { from: bossPositionIndex, width: bossWidth, health: 500, damage: this.aNumberBetween(damage - 10, damage + 10) };
         table.boss.health += 25 * table.playerStats.level;
      } else table.boss = null;
      this.setState({ table: table });
   };

   App.prototype.findPlayerCoords = function findPlayerCoords(playerIndex, cellWidth) {
      var state = _extends({}, this.state);
      var numOfRows = Math.floor(playerIndex / state.table.width) + 1;
      var viewportHeight = document.documentElement.clientHeight || window.innerHeight;
      state.screen.yCoord = numOfRows * cellWidth - viewportHeight / 2;
      this.setState({ state: state });
   };

   App.prototype.aSoundOf = function aSoundOf(soundName) {
      var _this5 = this;

      var weaponSoundUrls = ['https://raw.githubusercontent.com/hongyi0220/assets/master/dungeon-crawler-assets/sound/weapon/swing.wav', 'https://raw.githubusercontent.com/hongyi0220/assets/master/dungeon-crawler-assets/sound/weapon/swing2.wav', 'https://raw.githubusercontent.com/hongyi0220/assets/master/dungeon-crawler-assets/sound/weapon/swing3.wav'];
      var potionSoundUrls = ['https://raw.githubusercontent.com/hongyi0220/assets/master/dungeon-crawler-assets/sound/potion/bottle.wav', 'https://raw.githubusercontent.com/hongyi0220/assets/master/dungeon-crawler-assets/sound/potion/bubble.wav', 'https://raw.githubusercontent.com/hongyi0220/assets/master/dungeon-crawler-assets/sound/potion/bubble2.wav', 'https://raw.githubusercontent.com/hongyi0220/assets/master/dungeon-crawler-assets/sound/potion/bubble3.wav'];
      var doorSoundUrls = ['https://raw.githubusercontent.com/hongyi0220/assets/master/dungeon-crawler-assets/sound/door/door.wav'];
      var monsterSoundUrls = ['https://raw.githubusercontent.com/hongyi0220/assets/master/dungeon-crawler-assets/sound/monster/mnstr1.wav', 'https://raw.githubusercontent.com/hongyi0220/assets/master/dungeon-crawler-assets/sound/monster/mnstr2.wav', 'https://raw.githubusercontent.com/hongyi0220/assets/master/dungeon-crawler-assets/sound/monster/mnstr3.wav', 'https://raw.githubusercontent.com/hongyi0220/assets/master/dungeon-crawler-assets/sound/monster/mnstr4.wav'];
      var bossSoundUrls = ['https://raw.githubusercontent.com/hongyi0220/assets/master/dungeon-crawler-assets/sound/monster/burp.wav'];
      var backgroundMusicUrls = ['https://raw.githubusercontent.com/hongyi0220/assets/master/dungeon-crawler-assets/music/dungeongroove_loop_low.ogg'];
      var lootSoundUrls = ['https://raw.githubusercontent.com/hongyi0220/assets/master/dungeon-crawler-assets/sound/weapon/metal-small2.wav', 'https://raw.githubusercontent.com/hongyi0220/assets/master/dungeon-crawler-assets/sound/weapon/metal-small3.wav'];
      var levelUpUrls = ['https://raw.githubusercontent.com/hongyi0220/assets/master/dungeon-crawler-assets/sound/level-up/chipquest.wav'];
      var playerDeathUrls = ['https://raw.githubusercontent.com/hongyi0220/assets/master/dungeon-crawler-assets/sound/p1-death/die1.wav', 'https://raw.githubusercontent.com/hongyi0220/assets/master/dungeon-crawler-assets/sound/p1-death/die2.wav'];
      var pickASound = function pickASound(urlArray) {
         var soundArray = [];
         urlArray.forEach(function (url, i) {
            soundArray.push(new Audio(url));
         });
         return soundArray[_this5.aNumberBetween(0, urlArray.length - 1)];
      };
      var urlArray = {
         weapon: weaponSoundUrls,
         potion: potionSoundUrls,
         door: doorSoundUrls,
         monster: monsterSoundUrls,
         boss: bossSoundUrls,
         music: backgroundMusicUrls,
         loot: lootSoundUrls,
         levelUp: levelUpUrls,
         dying: playerDeathUrls
      };
      return pickASound(urlArray[soundName]);
   };

   App.prototype.movePlayer = function movePlayer(e) {
      var _this6 = this;

      var state = _extends({}, this.state);
      var table = _extends({}, this.state.table);
      var playerIndex = table.playerPosition;
      var playerStats = table.playerStats;
      var strength = playerStats.strength;
      var playerMinDmg = playerStats.weapon.damage.min * strength;
      var playerMaxDmg = playerStats.weapon.damage.max * strength;
      var playerDmg = this.aNumberBetween(playerMinDmg, playerMaxDmg);
      var boss = table.boss;
      var cells = table.content;
      var to = function (index) {
         return {
            s: index + table.width,
            s2: index + table.width * 2,
            s3: index + table.width * 3,
            s4: index + table.width * 4,
            s5: index + table.width * 5,
            s6: index + table.width * 6,
            n: index - table.width,
            n2: index - table.width * 2,
            n3: index - table.width * 3,
            n4: index - table.width * 4,
            n5: index - table.width * 5,
            n6: index - table.width * 6,
            w: index - 1,
            w2: index - 1 * 2,
            w3: index - 1 * 3,
            w4: index - 1 * 4,
            w5: index - 1 * 5,
            w6: index - 1 * 6,
            e: index + 1,
            e2: index + 1 * 2,
            e3: index + 1 * 3,
            e4: index + 1 * 4,
            e5: index + 1 * 5,
            e6: index + 1 * 6
         };
      }(playerIndex);

      // Sight-radius
      var blurryTilesIndexes = function () {
         var clearTiles = [playerIndex, to.n, to.n - 1, to.n + 1, to.s, to.s - 1, to.s + 1, to.w, to.e];
         var blurryTiles = [to.n2, to.n2 - 1, to.n2 - 2, to.n2 + 1, to.n2 + 2, to.s2, to.s2 - 1, to.s2 - 2, to.s2 + 1, to.s2 + 2, to.w2, to.w2 - table.width, to.w2 + table.width, to.e2, to.e2 - table.width, to.e2 + table.width];
         var blurrierTiles = [to.n3, to.n3 - 1, to.n3 - 2, to.n3 - 3, to.n3 + 1, to.n3 + 2, to.n3 + 3, to.s3, to.s3 - 1, to.s3 - 2, to.s3 - 3, to.s3 + 1, to.s3 + 2, to.s3 + 3, to.w3, to.w3 - table.width * 1, to.w3 - table.width * 2, to.w3 + table.width * 1, to.w3 + table.width * 2, to.e3, to.e3 - table.width * 1, to.e3 - table.width * 2, to.e3 + table.width * 1, to.e3 + table.width * 2];
         var blurriestTiles = [to.n4, to.n4 - 1, to.n4 - 2, to.n4 + 1, to.n4 + 2, to.n5, to.n5 - 1, to.n5 + 1, to.n6, to.s4, to.s4 - 1, to.s4 - 2, to.s4 + 1, to.s4 + 2, to.s5, to.s5 - 1, to.s5 + 1, to.s6, to.w4, to.w4 - table.width * 1, to.w4 - table.width * 2, to.w4 + table.width * 1, to.w4 + table.width * 2, to.w5, to.w5 - table.width, to.w5 + table.width, to.w6, to.e4, to.e4 - table.width * 1, to.e4 - table.width * 2, to.e4 + table.width * 1, to.e4 + table.width * 2, to.e5, to.e5 - table.width, to.e5 + table.width, to.e6];
         // This gets rid of all edge tiles so sight-radius doesn't bleed out weird when player is on edges
         var anyEdgeCells = function () {
            clearTiles = clearTiles.filter(function (tileIndex) {
               return !_this6.isEdgeCell(tileIndex).leftEdgeCell && !_this6.isEdgeCell(tileIndex, table.width).rightEdgeCell;
            });
            blurryTiles = blurryTiles.filter(function (tileIndex) {
               return !_this6.isEdgeCell(tileIndex).leftEdgeCell && !_this6.isEdgeCell(tileIndex, table.width).rightEdgeCell;
            });
            blurrierTiles = blurrierTiles.filter(function (tileIndex) {
               return !_this6.isEdgeCell(tileIndex).leftEdgeCell && !_this6.isEdgeCell(tileIndex, table.width).rightEdgeCell;
            });
            blurriestTiles = blurriestTiles.filter(function (tileIndex) {
               return !_this6.isEdgeCell(tileIndex).leftEdgeCell && !_this6.isEdgeCell(tileIndex, table.width).rightEdgeCell;
            });
         }();

         return {
            clear: clearTiles,
            blurry: blurryTiles,
            blurrier: blurrierTiles,
            blurriest: blurriestTiles
         };
      }();

      var convertKeyToDirection = function convertKeyToDirection(key) {
         if (key === 'ArrowDown') return to.s;
         if (key === 'ArrowUp') return to.n;
         if (key === 'ArrowLeft') return to.w;
         if (key === 'ArrowRight') return to.e;
      };

      if (!e) this.setState({ table: table });
      var act = function act(keycode) {

         // Walk
         if (cells[convertKeyToDirection(keycode)] && !cells[convertKeyToDirection(keycode)].wall && !cells[convertKeyToDirection(keycode)].enemy && !cells[convertKeyToDirection(keycode)].potion && !cells[convertKeyToDirection(keycode)].loot && !cells[convertKeyToDirection(keycode)].boss && !cells[convertKeyToDirection(keycode)].portal) {

            if (e.key === 'ArrowUp') window.scrollTo(0, state.screen.yCoord -= 20);else if (e.key === 'ArrowDown') window.scrollTo(0, state.screen.yCoord += 20);

            // Lighten tiles where player will be
            Object.keys(blurryTilesIndexes).forEach(function (key) {
               blurryTilesIndexes[key].forEach(function (tileIndex) {
                  if (cells[tileIndex]) {
                     cells[tileIndex][key] = true;
                     cells[tileIndex].fog = false;
                  } else return;
               });
            });
            cells[playerIndex].player = false;
            if (keycode === 'ArrowUp') cells[convertKeyToDirection(keycode)].player = 'back';else if (keycode === 'ArrowDown') cells[convertKeyToDirection(keycode)].player = 'front';else if (keycode === 'ArrowLeft') cells[convertKeyToDirection(keycode)].player = 'left';else if (keycode === 'ArrowRight') cells[convertKeyToDirection(keycode)].player = 'right';
            table.playerPosition = convertKeyToDirection(keycode);
         }
         // Attack, receive damage and drop loot
         else if (cells[convertKeyToDirection(keycode)] && cells[convertKeyToDirection(keycode)].enemy) {
               table.currentEnemy = cells[convertKeyToDirection(keycode)].enemy;
               _this6.aSoundOf('weapon').play();
               cells[convertKeyToDirection(keycode)].enemy.health -= playerDmg;
               if (cells[convertKeyToDirection(keycode)].enemy.health <= 0) {
                  table.currentEnemy = null;
                  _this6.aSoundOf('monster').play();
                  var xp = 20 + table.dungeonLevel * 5;
                  cells[convertKeyToDirection(keycode)].enemy = false;
                  playerStats.xp += _this6.aNumberBetween(xp - 5, xp + 5);
                  // Level up
                  if (playerStats.xp >= table.playerStats.xpCap) {
                     _this6.aSoundOf('levelUp').play();
                     playerStats.level++;
                     playerStats.xp = 0;
                     playerStats.strength += 0.2;
                     playerStats.health += 20;
                     playerStats.xpCap += playerStats.xpCap * playerStats.level;
                  }
                  // Drop chance for different levels of items
                  if (Math.random() < 0.1) _this6.generateLoot(convertKeyToDirection(keycode), 'basic', 1);else if (Math.random() < 0.01) _this6.generateLoot(convertKeyToDirection(keycode), 'pro', 1);
               } else if (cells[convertKeyToDirection(keycode)].enemy) playerStats.health -= cells[convertKeyToDirection(keycode)].enemy.damage;
               // Player dies
               if (playerStats.health <= 0) {
                  _this6.aSoundOf('dying').play();
                  playerStats.health = 0;
                  cells[playerIndex].player = false;
                  table.playerPosition = null;
               }
            }
            // Consume potion
            else if (cells[convertKeyToDirection(keycode)] && cells[convertKeyToDirection(keycode)].potion) {
                  _this6.aSoundOf('potion').play();
                  playerStats.health += cells[convertKeyToDirection(keycode)].potion;
                  cells[convertKeyToDirection(keycode)].potion = false;
               }
               // Equip dropped weapon
               else if (cells[convertKeyToDirection(keycode)] && cells[convertKeyToDirection(keycode)].loot) {
                     _this6.aSoundOf('loot').play();
                     playerStats.weapon = cells[convertKeyToDirection(keycode)].loot;
                     cells[convertKeyToDirection(keycode)].loot = false;
                  }
                  // Deal damage to and receive damage from boss
                  else if (cells[convertKeyToDirection(keycode)] && cells[convertKeyToDirection(keycode)].boss) {
                        boss.health -= playerDmg;
                        if (boss.health <= 0) {
                           _this6.aSoundOf('boss');
                           cells[boss.from].boss = false;
                           cells[boss.from + boss.width - 1].boss = false;
                           cells[boss.from + table.width].boss = false;
                           cells[boss.from + boss.width - 1 + table.width].boss = false;
                           table.boss = null;
                           _this6.generateLoot(convertKeyToDirection(keycode), 'rare', 0.001);
                        } else if (boss.health) playerStats.health -= boss.damage;
                        if (playerStats.health <= 0) {
                           playerStats.health = 0;
                           cells[playerIndex].player = false;
                        }
                     }
                     // Take portal to new level
                     else if (cells[convertKeyToDirection(keycode)] && cells[convertKeyToDirection(keycode)].portal) {
                           _this6.aSoundOf('door').play();
                           _this6.generateNewLevel();
                        }
      };

      act(e.key);
      e.preventDefault();
      this.setState({ state: state });

      this.setState({ table: table });
   };

   App.prototype.avgOf = function avgOf(a, b, decimal) {
      return Number(((a + b) / 2).toFixed(decimal));
   };

   App.prototype.componentWillMount = function componentWillMount() {

      this.makeTable(50, 100);
      this.makeCaves(8, 12, 0.015);
      this.connectCaves();
      this.generatePlayer('new');
      this.generatePortal();
      this.generateEnemies(40);
      this.generatePotions(30);
      document.addEventListener('keydown', this.movePlayer);
   };

   App.prototype.componentDidMount = function componentDidMount() {
      var state = _extends({}, this.state);
      // This prevents screen from scrolling with mousewheel or trackpad
      window.onwheel = function (e) {
         return e.preventDefault();
      };
   };
   // Display player info when start screen is off

   App.prototype.render = function render() {
      return React.createElement(
         'div',
         { className: 'container' },
         this.state.startScreen ? null : React.createElement(Info, { table: this.state.table, avgOf: this.avgOf }),
         React.createElement(
            'div',
            { className: 'app' },
            React.createElement(Table, { table: this.state.table }),
            React.createElement(Fog, { table: this.state.table })
         ),
         this.state.startScreen ? React.createElement(StartScreen, { state: this.state, toggleMusic: this.toggleMusic, handleButtonClick: this.handleButtonClick }) : null
      );
   };

   return App;
}(React.Component);

var Table = function Table(props) {
   var table = props.table;
   var cells = table.content;
   var tableWidth = table.width;
   var tableHeight = table.height;
   // This is a template for making table-cells
   var dummyArray = function dummyArray(length) {
      var dummy = new Array(length);
      for (var i = 0; i < length; i++) {
         dummy[i] = null;
      }return dummy;
   };
   return React.createElement(
      'div',
      { className: 'table' },
      dummyArray(tableHeight).map(function (row, i) {
         var rowIndex = i;
         return React.createElement(
            'tr',
            null,
            dummyArray(tableWidth).map(function (col, i) {
               var cellIndex = rowIndex * tableWidth + i;
               return React.createElement('td', { className: 'cell' + function () {
                     if (cells[cellIndex].player === 'front') return ' player-front';else if (cells[cellIndex].player === 'back') return ' player-back';else if (cells[cellIndex].player === 'left') return ' player-left';else if (cells[cellIndex].player === 'right') return ' player-right';else if (cells[cellIndex].enemy) return ' enemy';else if (cells[cellIndex].potion) return ' potion';else if (cells[cellIndex].loot) return ' loot';else if (cells[cellIndex].boss === 'top-left') return ' boss-top-left';else if (cells[cellIndex].boss === 'top-right') return ' boss-top-right';else if (cells[cellIndex].boss === 'bottom-left') return ' boss-bottom-left';else if (cells[cellIndex].boss === 'bottom-right') return ' boss-bottom-right';else if (cells[cellIndex].portal) return ' portal';else return '';
                  }(), id: cellIndex, style: { background: cells[cellIndex].wall ? 'url("https://raw.githubusercontent.com/hongyi0220/assets/master/dungeon-crawler-assets/wall.png") center/100%' : 'url("https://raw.githubusercontent.com/hongyi0220/assets/master/dungeon-crawler-assets/dirt.png") center/100%' } });
            })
         );
      })
   );
};

var Fog = function Fog(props) {
   var table = props.table;
   var cells = table.content;
   var tableWidth = table.width;
   var tableHeight = table.height;
   // This is template for making table-cells
   var dummyArray = function dummyArray(length) {
      var dummy = new Array(length);
      for (var i = 0; i < length; i++) {
         dummy[i] = null;
      }return dummy;
   };
   return React.createElement(
      'div',
      { className: 'fog' },
      dummyArray(tableHeight).map(function (row, i) {
         var rowIndex = i;
         return React.createElement(
            'tr',
            null,
            dummyArray(tableWidth).map(function (col, i) {
               var cellIndex = rowIndex * tableWidth + i;
               return React.createElement('td', { className: 'cell' + function () {
                     if (cells[cellIndex].clear) return ' clear';else if (cells[cellIndex].blurry) return ' blurry';else if (cells[cellIndex].blurrier) return ' blurrier';else if (cells[cellIndex].blurriest) return ' blurriest';else return '';
                  }(), id: 'f' + cellIndex, style: { background: cells[cellIndex].fog ? 'rgba(0,0,0,1)' : 'rgba(255,255,255,0)' } });
            })
         );
      })
   );
};

var Info = function Info(props) {
   var tableWidth = props.table.width;
   var health = props.table.playerStats.health;
   var level = props.table.playerStats.level;
   var weapon = props.table.playerStats.weapon.name;
   var xp = props.table.playerStats.xp;
   var minDamage = props.table.playerStats.weapon.damage.min;
   var maxDamage = props.table.playerStats.weapon.damage.max;
   var strength = props.table.playerStats.strength;
   var xpCap = props.table.playerStats.xpCap;
   var avgOf = props.avgOf;
   var dungeonLevel = props.table.dungeonLevel;
   var boss = props.table.boss;
   var currentEnemy = props.table.currentEnemy;

   return React.createElement(
      'div',
      { className: 'info', style: { width: tableWidth * 20 + 'px' } },
      React.createElement(
         'span',
         { className: 'stats' },
         'Health: ' + health,
         '   ',
         'Level: ' + level,
         '   ',
         'XP to Lvl: ' + (xpCap - xp),
         React.createElement('br', null),
         'Weapon: ' + weapon,
         '   ',
         'Weapon Damage: ' + minDamage + '-' + maxDamage,
         React.createElement('br', null),
         'Average Damage Dealt: ' + avgOf(minDamage * strength, maxDamage * strength, 2),
         React.createElement('br', null),
         'Dungeon Level: ' + dungeonLevel,
         '   ',
         currentEnemy ? 'Tormented Soul: ' + currentEnemy.health : '',
         '   ',
         boss ? 'Boss Health: ' + boss.health : ''
      )
   );
};

var StartScreen = function StartScreen(props) {
   var state = props.state;
   var table = state.table;
   var viewportHeight = document.documentElement.clientHeight || window.innerHeight;
   var infoHeight = 130;
   var toggleMusic = props.toggleMusic;
   var handleButtonClick = props.handleButtonClick;
   return React.createElement(
      'div',
      { className: 'start-screen', style: { height: viewportHeight + 'px' } },
      React.createElement(
         'p',
         { className: 'title' },
         'Sinister Pixels: A Dungeon Crawler'
      ),
      React.createElement(
         'div',
         { className: 'controls' },
         React.createElement(
            'button',
            { type: 'button', onClick: handleButtonClick },
            'Start Game'
         ),
         '  ',
         React.createElement(
            'label',
            { 'for': 'music' },
            'Music ',
            React.createElement('input', { type: 'checkbox', id: 'music', onClick: toggleMusic })
         )
      ),
      React.createElement(
         'p',
         { className: 'footer' },
         'Created By YH'
      )
   );
};

ReactDOM.render(React.createElement(App, null), document.getElementById('app'));