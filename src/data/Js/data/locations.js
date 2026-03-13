'use strict';
/**
 * locations.js — src/data/JS/data/locations.js
 * Alle TLC-Standorte aus dem offiziellen Spiel-JSON.
 * Koordinaten: longitude=X, latitude=Y
 */

const ZONES = [
  { id:'z1', label:'Zone 1 — Known World', lonMin:-30, lonMax:180, latMin:-100, latMax:100 },
];

const LOCATION_TYPES = {
  Hanger:        { color:'#00a8e8', size:'md', icon:'Indicator_Bunker',          label:'Hangar / Dock'      },
  Cave:          { color:'#4a9aaa', size:'sm', icon:'Indicator_Cave',            label:'Cave'               },
  Habitat:       { color:'#00d4aa', size:'md', icon:'Indicator_CrateStack',      label:'Habitat Node'       },
  RefuelOutpost: { color:'#ff8040', size:'sm', icon:'Indicator_GasPump',         label:'Refuel Outpost'     },
  SeedVault:     { color:'#60e060', size:'sm', icon:'Indicator_GrowRoom',        label:'Seed Reserve'       },
  NDNS:          { color:'#40e060', size:'sm', icon:'Indicator_GrowthContainer', label:'NDNS Node'          },
  Maze:          { color:'#ff6baa', size:'md', icon:'Indicator_Maze',            label:'Transposium / Maze' },
  OilRig:        { color:'#c04000', size:'md', icon:'Indicator_OilRig',          label:'Oil Rig'            },
  NavBeacon:     { color:'#f0c040', size:'lg', icon:'Indicator_Radio',           label:'Navigation Beacon'  },
  Rocket:        { color:'#a0a0ff', size:'lg', icon:'Indicator_Rocket',          label:'Rocket Platform'    },
  RockySpire:    { color:'#aaaaaa', size:'sm', icon:'Indicator_Rocky',           label:'Rocky Spire'        },
  Ruin:          { color:'#8060a0', size:'sm', icon:'Indicator_Ruin',            label:'Underwater Ruin'    },
  Lazarus:       { color:'#e060e0', size:'lg', icon:'Indicator_Scanner',         label:'Lazarus Complex'    },
  HeliosReserve: { color:'#f0c040', size:'sm', icon:'Indicator_SolarPanel',      label:'Helios Reserve'     },
};

function _loc(raw, zone, hidden) {
  return {
    id:          raw.gameid || raw.id,
    name:        raw.name,
    type:        raw.type,
    gx:          raw.longitude,
    gy:          raw.latitude,
    zone:        zone,
    hidden:      hidden,
    info:        raw.description || raw.info || '',
    gameid:      raw.gameid || '',
    radarRadius: raw.radarRadius  || null,
    flags:       raw.flags        || null,
    underwater:  raw.underwaterLoot || false,
    primary:     raw.primaryNumbers   || null,
    secondary:   raw.secondaryNumbers || null,
    /* ── Predefined default values ​​for nodeData ───────────────────
     *    {
     *      name:        'Stationsname',
     *      longitude:   45,          // X-Koordinate
     *      latitude:    12,          // Y-Koordinate
     *      type:        'Hanger',    // Siehe Typliste unten
     *      gameid:      'MeineStation_01',
     *      radarRadius: 30,          // Radar-Reichweite in Spieleinheiten (optional)
     *
     *      // ── Beschreibung (String oder Array) ─────────────────────────────
     *      info: 'Einzelne Beschreibung',
     *      // oder:
     *      info: [
     *        'Erster Info-Punkt.',
     *        'Zweiter Info-Punkt.',
     *        'Dritter Info-Punkt.',
     *      ],
     *
     *      // ── Standardwerte (werden beim ersten Laden einmalig gesetzt) ─────
     *      defaults: {
     *        color: '#ff6b35',
     *        visited: true,
     *        notes: [
     *          'Erste Notiz',
     *          'Zweite Notiz',
     *        ],
     *        resources: [
     *          { icon: '⛽', label: 'Diesel pump',    value: '3x'       },
     *          { icon: '🔋', label: 'Charging station',    value: '2x'       },
     *          { icon: '💧', label: 'water tank',     value: '1x'       },
     *          { icon: '🛏', label: 'sleeping area',  value: 'available'},
     *          { icon: '🔧', label: 'Workshop',      value: 'available'},
     *        ],
     *        tanks: {
     *          battery: { count: 2, current: 0 },   // battery  — 6000 kW/Tank
     *          oil:     { count: 1, current: 0 },   // oil        — 2000 L/Tank
     *          diesel:  { count: 3, current: 0 },   // diesel    — 2000 L/Tank
     *          petrol:  { count: 1, current: 0 },   // petrol    — 2000 L/Tank
     *          oxygen:  { count: 2, current: 0 },   // oxygen— 12000 L/Tank
     *          methane: { count: 1, current: 0 },   // methane    — 9000 L/Tank
     *          co2:     { count: 1, current: 0 },   // co2       — 9000 L/Tank
     *          water:   { count: 2, current: 0 },   // water — 2000 L/Tank
     *        },
     *      },  
    *        enemies: [
    *         { category:'Hazards',       name:'Sentinel Mine', count:  3},
    *         { category:'Small Enemies', name:'Sweetheart',    count:  8},
    *         { category:'Small Enemies', name:'Mosquito',      count:  0},
    *         { category:'Small Enemies', name:'Green Crawler', count:  0},
    *         { category:'Small Enemies', name:'Night Crawler', count:  0},
    *         { category:'Small Enemies', name:'Pink Slime',    count:  1},
    *         { category:'Small Enemies', name:'Red Slime',     count:  0},
    *         { category:'Large Enemies', name:'Roller Boi',    count:  0},
    *         { category:'Large Enemies', name:'Laser Bob',     count: 0 },
    *         { category:'Large Enemies', name:'Talon Shark',   count: 0 },
    *         { category:'Large Enemies', name:'Angel',         count: 0 },
    *         { category:'Large Enemies', name:'Arch Angel',    count: 0 },
    *       ],
     *    }
     *    ```
     * ──────────────────────────────────────────────────────────────── */
    defaults:    raw.defaults || null,
    enemies:     raw.enemies   || [],
  };
}

const _r = [
  {
    name:'Sanctuary 37',            
    longitude:11,  
    latitude:8,   
    type:'Hanger',        
    gameid:'SanctuaryDock37',
    info:[
      'Starting point — first dock the player enters.',
      'The "EXO Standard" paint can can be found here.'
    ],
    defaults: {
      visited: true,
      notes: ['Try to reach level 7 before leaving the dock.'],
      resources: [      
        {label: 'Lumimid',    value: '4x'},
        {label: 'Cyclone',    value: '3x'},
        {label: 'Batteries',    value: '5x'},
        {label: 'Disel Tank',    value: '1x'},
      ],
      tanks: { 
        battery: { count: 5, current: 4580}, 
        diesel:  { count: 1, current: 2000} 
      },
    },
    enemies: [
      { category:'Hazards',       name:'Sentinel Mine', count:  3},
      { category:'Small Enemies', name:'Sweetheart',    count:  8},
      { category:'Small Enemies', name:'Pink Slime',    count:  2},
      { category:'Small Enemies', name:'Red Slime',     count:  0},
    ],
  },

  {
    name:'Habitat Node 06-3.5',     
    longitude:23,  
    latitude:3,   
    type:'Habitat',       
    gameid:'HabitatNode06',
    info:[
      "Habitat Node 06-3.5 is a habitat platform.",
      'The "Tricolor Run" paint can can be found here.'
    ],
    defaults: {
      notes:[],
    },
    enemies: [
      { category:'Hazards',       name:'Sentinel Mine', count:  15},
      { category:'Small Enemies', name:'Pink Slime',    count:  5},
    ],
  },
  
  {
    name:'Navigation Beacon 49',    
    longitude:33,  
    latitude:6,   
    type:'NavBeacon',     
    gameid:'NavigationBeacon49',   
    radarRadius:27,
    info:["Navigation Beacon 49 is the first navigation beacon.",'The "Sea Dragon" paint can can be found here.','The "VHS Wave" paint can can be found here.'],
    defaults: {
      notes:   [''],
      resources: [      
        
      ],
      tanks: { 
        battery: { count: 0, current: 0 },
        oil:     { count: 0, current: 0 },  
        diesel:  { count: 0, current: 0 },   
        petrol:  { count: 0, current: 0 },  
        oxygen:  { count: 0, current: 0 },   
        methane: { count: 0, current: 0 },  
        co2:     { count: 0, current: 0 },   
        water:   { count: 0, current: 0 },  
      },
    },
    enemies: [
      { category:'Hazards',       name:'Sentinel Mine', count:  0},
      { category:'Small Enemies', name:'Sweetheart',    count:  0},
      { category:'Small Enemies', name:'Mosquito',      count:  0},
      { category:'Small Enemies', name:'Green Crawler', count:  0},
      { category:'Small Enemies', name:'Night Crawler', count:  0},
      { category:'Small Enemies', name:'Pink Slime',    count:  0},
      { category:'Small Enemies', name:'Red Slime',     count:  0},
      { category:'Large Enemies', name:'Roller Boi',    count:  0},
      { category:'Large Enemies', name:'Laser Bob',     count:  0},
      { category:'Large Enemies', name:'Talon Shark',   count:  0},
      { category:'Large Enemies', name:'Angel',         count:  0},
      { category:'Large Enemies', name:'Arch Angel',    count:  0},
    ],
  },
  
  {
    name:'Lazarus Complex',         
    longitude:69,  
    latitude:-2,  
    type:'Lazarus',       
    gameid:'LazarusComplex',       
    radarRadius:31,    
    info:["Lazarus Complex is a human growth facility.",'The "Ink Strip" paint can can be found here.','The "Rexwreck" paint can can be found here.'
      ,'The "Salt Bloom" paint can can be found here.','The "Sea Raid" paint can can be found here.','The "Tide Girl" paint can can be found here.'
    ],
    defaults: {
      notes:   [''],
      resources: [      
        
      ],
      tanks: { 
        battery: { count: 0, current: 0 },
        oil:     { count: 0, current: 0 },  
        diesel:  { count: 0, current: 0 },   
        petrol:  { count: 0, current: 0 },  
        oxygen:  { count: 0, current: 0 },   
        methane: { count: 0, current: 0 },  
        co2:     { count: 0, current: 0 },   
        water:   { count: 0, current: 0 },  
      },
    },
    enemies: [
      { category:'Hazards',       name:'Sentinel Mine', count:  0},
      { category:'Small Enemies', name:'Sweetheart',    count:  0},
      { category:'Small Enemies', name:'Mosquito',      count:  0},
      { category:'Small Enemies', name:'Green Crawler', count:  0},
      { category:'Small Enemies', name:'Night Crawler', count:  0},
      { category:'Small Enemies', name:'Pink Slime',    count:  0},
      { category:'Small Enemies', name:'Red Slime',     count:  0},
      { category:'Large Enemies', name:'Roller Boi',    count:  0},
      { category:'Large Enemies', name:'Laser Bob',     count:  0},
      { category:'Large Enemies', name:'Talon Shark',   count:  0},
      { category:'Large Enemies', name:'Angel',         count:  0},
      { category:'Large Enemies', name:'Arch Angel',    count:  0},
    ],
  },
  
  {
    name:'Norfolk Grave',           
    longitude:60,  
    latitude:-41, 
    type:'Ruin',          
    gameid:'NorfolkGrave',    
    info:"Norfolk Grave is an underwater ruin",
    defaults: {
      notes:   [''],
      resources: [      
        
      ],
      tanks: { 
        battery: { count: 0, current: 0 },
        oil:     { count: 0, current: 0 },  
        diesel:  { count: 0, current: 0 },   
        petrol:  { count: 0, current: 0 },  
        oxygen:  { count: 0, current: 0 },   
        methane: { count: 0, current: 0 },  
        co2:     { count: 0, current: 0 },   
        water:   { count: 0, current: 0 },  
      },
    },
    enemies: [
      { category:'Hazards',       name:'Sentinel Mine', count:  0},
      { category:'Small Enemies', name:'Sweetheart',    count:  0},
      { category:'Small Enemies', name:'Mosquito',      count:  0},
      { category:'Small Enemies', name:'Green Crawler', count:  0},
      { category:'Small Enemies', name:'Night Crawler', count:  0},
      { category:'Small Enemies', name:'Pink Slime',    count:  0},
      { category:'Small Enemies', name:'Red Slime',     count:  0},
      { category:'Large Enemies', name:'Roller Boi',    count:  0},
      { category:'Large Enemies', name:'Laser Bob',     count:  0},
      { category:'Large Enemies', name:'Talon Shark',   count:  0},
      { category:'Large Enemies', name:'Angel',         count:  0},
      { category:'Large Enemies', name:'Arch Angel',    count:  0},
    ],
  },
  
  {
    name:'Navigation Beacon 15',    
    longitude:69,  
    latitude:-53, 
    type:'NavBeacon',     
    gameid:'NavigationBeacon15',   
    radarRadius:30,    
    info:["Navigation Beacon 15 is another navigation beacon",'The "Captain Giggle" paint can can be found here.','The "Patrol" paint can can be found here.'],
    defaults: {
      notes:   [''],
      resources: [      
        
      ],
      tanks: { 
        battery: { count: 0, current: 0 },
        oil:     { count: 0, current: 0 },  
        diesel:  { count: 0, current: 0 },   
        petrol:  { count: 0, current: 0 },  
        oxygen:  { count: 0, current: 0 },   
        methane: { count: 0, current: 0 },  
        co2:     { count: 0, current: 0 },   
        water:   { count: 0, current: 0 },  
      },
    },
    enemies: [
      { category:'Hazards',       name:'Sentinel Mine', count:  0},
      { category:'Small Enemies', name:'Sweetheart',    count:  0},
      { category:'Small Enemies', name:'Mosquito',      count:  0},
      { category:'Small Enemies', name:'Green Crawler', count:  0},
      { category:'Small Enemies', name:'Night Crawler', count:  0},
      { category:'Small Enemies', name:'Pink Slime',    count:  0},
      { category:'Small Enemies', name:'Red Slime',     count:  0},
      { category:'Large Enemies', name:'Roller Boi',    count:  0},
      { category:'Large Enemies', name:'Laser Bob',     count:  0},
      { category:'Large Enemies', name:'Talon Shark',   count:  0},
      { category:'Large Enemies', name:'Angel',         count:  0},
      { category:'Large Enemies', name:'Arch Angel',    count:  0},
    ],
  },
  
  {
    name:'Seed Vault Prometheus',   
    longitude:81,  
    latitude:-66, 
    type:'SeedVault',     
    gameid:'SeedVaultA',    
    info:["Seed Vault Prometheus is a seed vault",'The "Confuse The Sea" paint can can be found here.'],
    defaults: {
      notes:   [''],
      resources: [      
        
      ],
      tanks: { 
        battery: { count: 0, current: 0 },
        oil:     { count: 0, current: 0 },  
        diesel:  { count: 0, current: 0 },   
        petrol:  { count: 0, current: 0 },  
        oxygen:  { count: 0, current: 0 },   
        methane: { count: 0, current: 0 },  
        co2:     { count: 0, current: 0 },   
        water:   { count: 0, current: 0 },  
      },
    },
    enemies: [
      { category:'Hazards',       name:'Sentinel Mine', count:  0},
      { category:'Small Enemies', name:'Sweetheart',    count:  0},
      { category:'Small Enemies', name:'Mosquito',      count:  0},
      { category:'Small Enemies', name:'Green Crawler', count:  0},
      { category:'Small Enemies', name:'Night Crawler', count:  0},
      { category:'Small Enemies', name:'Pink Slime',    count:  0},
      { category:'Small Enemies', name:'Red Slime',     count:  0},
      { category:'Large Enemies', name:'Roller Boi',    count:  0},
      { category:'Large Enemies', name:'Laser Bob',     count:  0},
      { category:'Large Enemies', name:'Talon Shark',   count:  0},
      { category:'Large Enemies', name:'Angel',         count:  0},
      { category:'Large Enemies', name:'Arch Angel',    count:  0},
    ],
  },
  
  {
    name:'Helios Reserve Orion',    
    longitude:53,  
    latitude:9,   
    type:'HeliosReserve', 
    gameid:'HeliosReserveA',    
    info:["Helios Reserve Orion is a power platform with both solar and wind power",'The "Senyera Run" paint can can be found here.'],
    defaults: {
      notes:   [''],
      resources: [      
        
      ],
      tanks: { 
        battery: { count: 0, current: 0 },
        oil:     { count: 0, current: 0 },  
        diesel:  { count: 0, current: 0 },   
        petrol:  { count: 0, current: 0 },  
        oxygen:  { count: 0, current: 0 },   
        methane: { count: 0, current: 0 },  
        co2:     { count: 0, current: 0 },   
        water:   { count: 0, current: 0 },  
      },
    },
    enemies: [
      { category:'Hazards',       name:'Sentinel Mine', count:  0},
      { category:'Small Enemies', name:'Sweetheart',    count:  0},
      { category:'Small Enemies', name:'Mosquito',      count:  0},
      { category:'Small Enemies', name:'Green Crawler', count:  0},
      { category:'Small Enemies', name:'Night Crawler', count:  0},
      { category:'Small Enemies', name:'Pink Slime',    count:  0},
      { category:'Small Enemies', name:'Red Slime',     count:  0},
      { category:'Large Enemies', name:'Roller Boi',    count:  0},
      { category:'Large Enemies', name:'Laser Bob',     count:  0},
      { category:'Large Enemies', name:'Talon Shark',   count:  0},
      { category:'Large Enemies', name:'Angel',         count:  0},
      { category:'Large Enemies', name:'Arch Angel',    count:  0},
    ],
  },
  
  {
    name:'Refuel Outpost Gamma',    
    longitude:47,  
    latitude:-7,  
    type:'RefuelOutpost', 
    gameid:'RefuelOutpostA',  
    primaryNumbers:'19',    
    info:["Refuel Outpost Gamma is a fuel depot with both diesel and petrol",'The "Checker Run" paint can can be found here.'],
    defaults: {
      notes:   [''],
      resources: [      
        
      ],
      tanks: { 
        battery: { count: 0, current: 0 },
        oil:     { count: 0, current: 0 },  
        diesel:  { count: 0, current: 0 },   
        petrol:  { count: 0, current: 0 },  
        oxygen:  { count: 0, current: 0 },   
        methane: { count: 0, current: 0 },  
        co2:     { count: 0, current: 0 },   
        water:   { count: 0, current: 0 },  
      },
    },
    enemies: [
      { category:'Hazards',       name:'Sentinel Mine', count:  0},
      { category:'Small Enemies', name:'Sweetheart',    count:  0},
      { category:'Small Enemies', name:'Mosquito',      count:  0},
      { category:'Small Enemies', name:'Green Crawler', count:  0},
      { category:'Small Enemies', name:'Night Crawler', count:  0},
      { category:'Small Enemies', name:'Pink Slime',    count:  0},
      { category:'Small Enemies', name:'Red Slime',     count:  0},
      { category:'Large Enemies', name:'Roller Boi',    count:  0},
      { category:'Large Enemies', name:'Laser Bob',     count:  0},
      { category:'Large Enemies', name:'Talon Shark',   count:  0},
      { category:'Large Enemies', name:'Angel',         count:  0},
      { category:'Large Enemies', name:'Arch Angel',    count:  0},
    ],
  },
  
  {
    name:'Black Vein Station',      
    longitude:49,  
    latitude:-70, 
    type:'OilRig',        
    gameid:'BlackVeinStation', 
    flags:'exo',    
    info:["Black Vein Station is an oil rig that can mine infinite oil",'The "Drowned City" paint can can be found here.','The "Sunburst Panel" paint can can be found here.'],
    defaults: {
      notes:   [''],
      resources: [      
        
      ],
      tanks: { 
        battery: { count: 0, current: 0 },
        oil:     { count: 0, current: 0 },  
        diesel:  { count: 0, current: 0 },   
        petrol:  { count: 0, current: 0 },  
        oxygen:  { count: 0, current: 0 },   
        methane: { count: 0, current: 0 },  
        co2:     { count: 0, current: 0 },   
        water:   { count: 0, current: 0 },  
      },
    },
    enemies: [
      { category:'Hazards',       name:'Sentinel Mine', count:  0},
      { category:'Small Enemies', name:'Sweetheart',    count:  0},
      { category:'Small Enemies', name:'Mosquito',      count:  0},
      { category:'Small Enemies', name:'Green Crawler', count:  0},
      { category:'Small Enemies', name:'Night Crawler', count:  0},
      { category:'Small Enemies', name:'Pink Slime',    count:  0},
      { category:'Small Enemies', name:'Red Slime',     count:  0},
      { category:'Large Enemies', name:'Roller Boi',    count:  0},
      { category:'Large Enemies', name:'Laser Bob',     count:  0},
      { category:'Large Enemies', name:'Talon Shark',   count:  0},
      { category:'Large Enemies', name:'Angel',         count:  0},
      { category:'Large Enemies', name:'Arch Angel',    count:  0},
    ],
  },
  
  {
    name:'Hampton Grave',           
    longitude:102, 
    latitude:19,  
    type:'Ruin',          
    gameid:'HamptonGrave',    
    info:"Hampton Grave is an underwater ruin",
    defaults: {
      notes:   [''],
      resources: [      
        
      ],
      tanks: { 
        battery: { count: 0, current: 0 },
        oil:     { count: 0, current: 0 },  
        diesel:  { count: 0, current: 0 },   
        petrol:  { count: 0, current: 0 },  
        oxygen:  { count: 0, current: 0 },   
        methane: { count: 0, current: 0 },  
        co2:     { count: 0, current: 0 },   
        water:   { count: 0, current: 0 },  
      },
    },
    enemies: [
      { category:'Hazards',       name:'Sentinel Mine', count:  0},
      { category:'Small Enemies', name:'Sweetheart',    count:  0},
      { category:'Small Enemies', name:'Mosquito',      count:  0},
      { category:'Small Enemies', name:'Green Crawler', count:  0},
      { category:'Small Enemies', name:'Night Crawler', count:  0},
      { category:'Small Enemies', name:'Pink Slime',    count:  0},
      { category:'Small Enemies', name:'Red Slime',     count:  0},
      { category:'Large Enemies', name:'Roller Boi',    count:  0},
      { category:'Large Enemies', name:'Laser Bob',     count:  0},
      { category:'Large Enemies', name:'Talon Shark',   count:  0},
      { category:'Large Enemies', name:'Angel',         count:  0},
      { category:'Large Enemies', name:'Arch Angel',    count:  0},
    ],
  },
  
  {
    name:'Exodus Station',          
    longitude:125, 
    latitude:47,  
    type:'Rocket',        
    gameid:'ExodusStation',
    info:["Exodus Station is a rocket launch platform",'The "Exodus Stamp" paint can can be found here.'],
    defaults: {
      notes:   [''],
      resources: [      
        
      ],
      tanks: { 
        battery: { count: 0, current: 0 },
        oil:     { count: 0, current: 0 },  
        diesel:  { count: 0, current: 0 },   
        petrol:  { count: 0, current: 0 },  
        oxygen:  { count: 0, current: 0 },   
        methane: { count: 0, current: 0 },  
        co2:     { count: 0, current: 0 },   
        water:   { count: 0, current: 0 },  
      },
    },
    enemies: [
      { category:'Hazards',       name:'Sentinel Mine', count:  0},
      { category:'Small Enemies', name:'Sweetheart',    count:  0},
      { category:'Small Enemies', name:'Mosquito',      count:  0},
      { category:'Small Enemies', name:'Green Crawler', count:  0},
      { category:'Small Enemies', name:'Night Crawler', count:  0},
      { category:'Small Enemies', name:'Pink Slime',    count:  0},
      { category:'Small Enemies', name:'Red Slime',     count:  0},
      { category:'Large Enemies', name:'Roller Boi',    count:  0},
      { category:'Large Enemies', name:'Laser Bob',     count:  0},
      { category:'Large Enemies', name:'Talon Shark',   count:  0},
      { category:'Large Enemies', name:'Angel',         count:  0},
      { category:'Large Enemies', name:'Arch Angel',    count:  0},
    ],
  },
  
  {
    name:'The Last Listener Station',
    longitude:115,
    latitude:11,  
    type:'NavBeacon',     
    gameid:'TheLastListener',      
    radarRadius:9,    
    info:["The Last Listener Station is a navigation beacon",'The "High Volt" paint can can be found here.'],
    defaults: {
      notes:   [''],
      resources: [      
        
      ],
      tanks: { 
        battery: { count: 0, current: 0 },
        oil:     { count: 0, current: 0 },  
        diesel:  { count: 0, current: 0 },   
        petrol:  { count: 0, current: 0 },  
        oxygen:  { count: 0, current: 0 },   
        methane: { count: 0, current: 0 },  
        co2:     { count: 0, current: 0 },   
        water:   { count: 0, current: 0 },  
      },
    },
    enemies: [
      { category:'Hazards',       name:'Sentinel Mine', count:  0},
      { category:'Small Enemies', name:'Sweetheart',    count:  0},
      { category:'Small Enemies', name:'Mosquito',      count:  0},
      { category:'Small Enemies', name:'Green Crawler', count:  0},
      { category:'Small Enemies', name:'Night Crawler', count:  0},
      { category:'Small Enemies', name:'Pink Slime',    count:  0},
      { category:'Small Enemies', name:'Red Slime',     count:  0},
      { category:'Large Enemies', name:'Roller Boi',    count:  0},
      { category:'Large Enemies', name:'Laser Bob',     count:  0},
      { category:'Large Enemies', name:'Talon Shark',   count:  0},
      { category:'Large Enemies', name:'Angel',         count:  0},
      { category:'Large Enemies', name:'Arch Angel',    count:  0},
    ],
  },
  
  {
    name:'Habitat Node 03-12.3',    
    longitude:97,  
    latitude:15,  
    type:'Habitat',       
    gameid:'HabitatNode03',    
    info:"Habitat Node 03-12.3 is a habitat platform",
    defaults: {
      notes:   [''],
      resources: [      
        
      ],
      tanks: { 
        battery: { count: 0, current: 0 },
        oil:     { count: 0, current: 0 },  
        diesel:  { count: 0, current: 0 },   
        petrol:  { count: 0, current: 0 },  
        oxygen:  { count: 0, current: 0 },   
        methane: { count: 0, current: 0 },  
        co2:     { count: 0, current: 0 },   
        water:   { count: 0, current: 0 },  
      },
    },
    enemies: [
      { category:'Hazards',       name:'Sentinel Mine', count:  0},
      { category:'Small Enemies', name:'Sweetheart',    count:  0},
      { category:'Small Enemies', name:'Mosquito',      count:  0},
      { category:'Small Enemies', name:'Green Crawler', count:  0},
      { category:'Small Enemies', name:'Night Crawler', count:  0},
      { category:'Small Enemies', name:'Pink Slime',    count:  0},
      { category:'Small Enemies', name:'Red Slime',     count:  0},
      { category:'Large Enemies', name:'Roller Boi',    count:  0},
      { category:'Large Enemies', name:'Laser Bob',     count:  0},
      { category:'Large Enemies', name:'Talon Shark',   count:  0},
      { category:'Large Enemies', name:'Angel',         count:  0},
      { category:'Large Enemies', name:'Arch Angel',    count:  0},
    ],
  },
  
  {
    name:'Habitat Node 09-4',       
    longitude:82,  
    latitude:16,  
    type:'Habitat',       
    gameid:'HabitatNode09',  
    underwaterLoot:true,    
    info:[
      "Habitat Node 09-4 is a habitat platform also known as Shark Base", 
      "Also has two underwater loot rooms the later being at 120m.",
      'The "North Home" paint can can be found here.'
    ],
    defaults: {
      notes:   [''],
      resources: [      
        
      ],
      tanks: { 
        battery: { count: 0, current: 0 },
        oil:     { count: 0, current: 0 },  
        diesel:  { count: 0, current: 0 },   
        petrol:  { count: 0, current: 0 },  
        oxygen:  { count: 0, current: 0 },   
        methane: { count: 0, current: 0 },  
        co2:     { count: 0, current: 0 },   
        water:   { count: 0, current: 0 },  
      },
    },
    enemies: [
      { category:'Hazards',       name:'Sentinel Mine', count:  0},
      { category:'Small Enemies', name:'Sweetheart',    count:  0},
      { category:'Small Enemies', name:'Mosquito',      count:  0},
      { category:'Small Enemies', name:'Green Crawler', count:  0},
      { category:'Small Enemies', name:'Night Crawler', count:  0},
      { category:'Small Enemies', name:'Pink Slime',    count:  0},
      { category:'Small Enemies', name:'Red Slime',     count:  0},
      { category:'Large Enemies', name:'Roller Boi',    count:  0},
      { category:'Large Enemies', name:'Laser Bob',     count:  0},
      { category:'Large Enemies', name:'Talon Shark',   count:  0},
      { category:'Large Enemies', name:'Angel',         count:  0},
      { category:'Large Enemies', name:'Arch Angel',    count:  0},
    ],
  },
  
  {
    name:'Habitat Node 08-16',      
    longitude:130, 
    latitude:21,  
    type:'Habitat',       
    gameid:'HabitatNode08' ,   
    info:["Habitat Node 08-16 is a habitat platform",'The "Shapes Only" paint can can be found here.'],
    defaults: {
      notes:   [''],
      resources: [      
        
      ],
      tanks: { 
        battery: { count: 0, current: 0 },
        oil:     { count: 0, current: 0 },  
        diesel:  { count: 0, current: 0 },   
        petrol:  { count: 0, current: 0 },  
        oxygen:  { count: 0, current: 0 },   
        methane: { count: 0, current: 0 },  
        co2:     { count: 0, current: 0 },   
        water:   { count: 0, current: 0 },  
      },
    },
    enemies: [
      { category:'Hazards',       name:'Sentinel Mine', count:  0},
      { category:'Small Enemies', name:'Sweetheart',    count:  0},
      { category:'Small Enemies', name:'Mosquito',      count:  0},
      { category:'Small Enemies', name:'Green Crawler', count:  0},
      { category:'Small Enemies', name:'Night Crawler', count:  0},
      { category:'Small Enemies', name:'Pink Slime',    count:  0},
      { category:'Small Enemies', name:'Red Slime',     count:  0},
      { category:'Large Enemies', name:'Roller Boi',    count:  0},
      { category:'Large Enemies', name:'Laser Bob',     count:  0},
      { category:'Large Enemies', name:'Talon Shark',   count:  0},
      { category:'Large Enemies', name:'Angel',         count:  0},
      { category:'Large Enemies', name:'Arch Angel',    count:  0},
    ],
  },
  
  {
    name:'Habitat Node 14-7',       
    longitude:104, 
    latitude:50,  
    type:'Habitat',       
    gameid:'HabitatNode14',    
    info:["Habitat Node 14-7 is a habitat platform",'The "Last Leaf" paint can can be found here.'],
    defaults: {
      notes:   [''],
      resources: [      
        
      ],
      tanks: { 
        battery: { count: 0, current: 0 },
        oil:     { count: 0, current: 0 },  
        diesel:  { count: 0, current: 0 },   
        petrol:  { count: 0, current: 0 },  
        oxygen:  { count: 0, current: 0 },   
        methane: { count: 0, current: 0 },  
        co2:     { count: 0, current: 0 },   
        water:   { count: 0, current: 0 },  
      },
    },
    enemies: [
      { category:'Hazards',       name:'Sentinel Mine', count:  0},
      { category:'Small Enemies', name:'Sweetheart',    count:  0},
      { category:'Small Enemies', name:'Mosquito',      count:  0},
      { category:'Small Enemies', name:'Green Crawler', count:  0},
      { category:'Small Enemies', name:'Night Crawler', count:  0},
      { category:'Small Enemies', name:'Pink Slime',    count:  0},
      { category:'Small Enemies', name:'Red Slime',     count:  0},
      { category:'Large Enemies', name:'Roller Boi',    count:  0},
      { category:'Large Enemies', name:'Laser Bob',     count:  0},
      { category:'Large Enemies', name:'Talon Shark',   count:  0},
      { category:'Large Enemies', name:'Angel',         count:  0},
      { category:'Large Enemies', name:'Arch Angel',    count:  0},
    ],
  },
  
  {
    name:'Nomads Tower',            
    longitude:74,  
    latitude:-31, 
    type:'Hanger',        
    gameid:'NomadsTower',    
    underwaterLoot:true,    
    info:["Nomads Tower is a tower",'The "Outer Rim" paint can can be found here.'],
    defaults: {
      notes:   [''],
      resources: [      
        
      ],
      tanks: { 
        battery: { count: 0, current: 0 },
        oil:     { count: 0, current: 0 },  
        diesel:  { count: 0, current: 0 },   
        petrol:  { count: 0, current: 0 },  
        oxygen:  { count: 0, current: 0 },   
        methane: { count: 0, current: 0 },  
        co2:     { count: 0, current: 0 },   
        water:   { count: 0, current: 0 },  
      },
    },
    enemies: [
      { category:'Hazards',       name:'Sentinel Mine', count:  0},
      { category:'Small Enemies', name:'Sweetheart',    count:  0},
      { category:'Small Enemies', name:'Mosquito',      count:  0},
      { category:'Small Enemies', name:'Green Crawler', count:  0},
      { category:'Small Enemies', name:'Night Crawler', count:  0},
      { category:'Small Enemies', name:'Pink Slime',    count:  0},
      { category:'Small Enemies', name:'Red Slime',     count:  0},
      { category:'Large Enemies', name:'Roller Boi',    count:  0},
      { category:'Large Enemies', name:'Laser Bob',     count:  0},
      { category:'Large Enemies', name:'Talon Shark',   count:  0},
      { category:'Large Enemies', name:'Angel',         count:  0},
      { category:'Large Enemies', name:'Arch Angel',    count:  0},
    ],
  },
  
  {
    name:'Refuel Outpost Theta',    
    longitude:84,  
    latitude:-45, 
    type:'RefuelOutpost', 
    gameid:'RefuelOutpostC', 
    flags:'exo', 
    primaryNumbers:'23', 
    secondaryNumbers:'2,3',    
    info:["Refuel Outpost Theta is a fuel depot",'The "Pink Bone" paint can can be found here.'],
    defaults: {
      notes:   [''],
      resources: [      
        
      ],
      tanks: { 
        battery: { count: 0, current: 0 },
        oil:     { count: 0, current: 0 },  
        diesel:  { count: 0, current: 0 },   
        petrol:  { count: 0, current: 0 },  
        oxygen:  { count: 0, current: 0 },   
        methane: { count: 0, current: 0 },  
        co2:     { count: 0, current: 0 },   
        water:   { count: 0, current: 0 },  
      },
    },
    enemies: [
      { category:'Hazards',       name:'Sentinel Mine', count:  0},
      { category:'Small Enemies', name:'Sweetheart',    count:  0},
      { category:'Small Enemies', name:'Mosquito',      count:  0},
      { category:'Small Enemies', name:'Green Crawler', count:  0},
      { category:'Small Enemies', name:'Night Crawler', count:  0},
      { category:'Small Enemies', name:'Pink Slime',    count:  0},
      { category:'Small Enemies', name:'Red Slime',     count:  0},
      { category:'Large Enemies', name:'Roller Boi',    count:  0},
      { category:'Large Enemies', name:'Laser Bob',     count:  0},
      { category:'Large Enemies', name:'Talon Shark',   count:  0},
      { category:'Large Enemies', name:'Angel',         count:  0},
      { category:'Large Enemies', name:'Arch Angel',    count:  0},
    ],
  },
  
  {
    name:'Habitat Node 05-14.5',    
    longitude:91,  
    latitude:-57, 
    type:'Habitat',       
    gameid:'HabitatNode-05-14.5', 
    underwaterLoot:true,    
    info:["Habitat Node 05-14.5 is a habitat platform",'The "Night Shift" paint can can be found here.'],
    defaults: {
      notes:   [''],
      resources: [      
        
      ],
      tanks: { 
        battery: { count: 0, current: 0 },
        oil:     { count: 0, current: 0 },  
        diesel:  { count: 0, current: 0 },   
        petrol:  { count: 0, current: 0 },  
        oxygen:  { count: 0, current: 0 },   
        methane: { count: 0, current: 0 },  
        co2:     { count: 0, current: 0 },   
        water:   { count: 0, current: 0 },  
      },
    },
    enemies: [
      { category:'Hazards',       name:'Sentinel Mine', count:  0},
      { category:'Small Enemies', name:'Sweetheart',    count:  0},
      { category:'Small Enemies', name:'Mosquito',      count:  0},
      { category:'Small Enemies', name:'Green Crawler', count:  0},
      { category:'Small Enemies', name:'Night Crawler', count:  0},
      { category:'Small Enemies', name:'Pink Slime',    count:  0},
      { category:'Small Enemies', name:'Red Slime',     count:  0},
      { category:'Large Enemies', name:'Roller Boi',    count:  0},
      { category:'Large Enemies', name:'Laser Bob',     count:  0},
      { category:'Large Enemies', name:'Talon Shark',   count:  0},
      { category:'Large Enemies', name:'Angel',         count:  0},
      { category:'Large Enemies', name:'Arch Angel',    count:  0},
    ],
  },
  
  {
    name:'Central Warehouse Alpha', 
    longitude:66,  
    latitude:23,  
    type:'Hanger',        
    gameid:'DepotA',    
    info:"Central Warehouse Alpha is a warehouse with lots of loot and hostiles",
    defaults: {
      notes:   [''],
      resources: [      
        
      ],
      tanks: { 
        battery: { count: 0, current: 0 },
        oil:     { count: 0, current: 0 },  
        diesel:  { count: 0, current: 0 },   
        petrol:  { count: 0, current: 0 },  
        oxygen:  { count: 0, current: 0 },   
        methane: { count: 0, current: 0 },  
        co2:     { count: 0, current: 0 },   
        water:   { count: 0, current: 0 },  
      },
    },
    enemies: [
      { category:'Hazards',       name:'Sentinel Mine', count:  0},
      { category:'Small Enemies', name:'Sweetheart',    count:  0},
      { category:'Small Enemies', name:'Mosquito',      count:  0},
      { category:'Small Enemies', name:'Green Crawler', count:  0},
      { category:'Small Enemies', name:'Night Crawler', count:  0},
      { category:'Small Enemies', name:'Pink Slime',    count:  0},
      { category:'Small Enemies', name:'Red Slime',     count:  0},
      { category:'Large Enemies', name:'Roller Boi',    count:  0},
      { category:'Large Enemies', name:'Laser Bob',     count:  0},
      { category:'Large Enemies', name:'Talon Shark',   count:  0},
      { category:'Large Enemies', name:'Angel',         count:  0},
      { category:'Large Enemies', name:'Arch Angel',    count:  0},
    ],
  },
  
  {
    name:'Navigation Beacon 32',    
    longitude:109, 
    latitude:35,  
    type:'NavBeacon',     
    gameid:'NavigationBeacon32',   
    radarRadius:29,    
    info:["Navigation Beacon 32 is a navigation beacon",'The "Beat Tag" paint can can be found here.','The "Goofy Fins" paint can can be found here.'],
    defaults: {
      notes:   [''],
      resources: [      
        
      ],
      tanks: { 
        battery: { count: 0, current: 0 },
        oil:     { count: 0, current: 0 },  
        diesel:  { count: 0, current: 0 },   
        petrol:  { count: 0, current: 0 },  
        oxygen:  { count: 0, current: 0 },   
        methane: { count: 0, current: 0 },  
        co2:     { count: 0, current: 0 },   
        water:   { count: 0, current: 0 },  
      },
    },
    enemies: [
      { category:'Hazards',       name:'Sentinel Mine', count:  0},
      { category:'Small Enemies', name:'Sweetheart',    count:  0},
      { category:'Small Enemies', name:'Mosquito',      count:  0},
      { category:'Small Enemies', name:'Green Crawler', count:  0},
      { category:'Small Enemies', name:'Night Crawler', count:  0},
      { category:'Small Enemies', name:'Pink Slime',    count:  0},
      { category:'Small Enemies', name:'Red Slime',     count:  0},
      { category:'Large Enemies', name:'Roller Boi',    count:  0},
      { category:'Large Enemies', name:'Laser Bob',     count:  0},
      { category:'Large Enemies', name:'Talon Shark',   count:  0},
      { category:'Large Enemies', name:'Angel',         count:  0},
      { category:'Large Enemies', name:'Arch Angel',    count:  0},
    ],
  },
  
  {
    name:'Salem Grave',             
    longitude:108, 
    latitude:55,  
    type:'Ruin',          
    gameid:'SalemGrave',    
    info:"Salem Grave is an underwater ruin",
    defaults: {
      notes:   [''],
      resources: [      
        
      ],
      tanks: { 
        battery: { count: 0, current: 0 },
        oil:     { count: 0, current: 0 },  
        diesel:  { count: 0, current: 0 },   
        petrol:  { count: 0, current: 0 },  
        oxygen:  { count: 0, current: 0 },   
        methane: { count: 0, current: 0 },  
        co2:     { count: 0, current: 0 },   
        water:   { count: 0, current: 0 },  
      },
    },
    enemies: [
      { category:'Hazards',       name:'Sentinel Mine', count:  0},
      { category:'Small Enemies', name:'Sweetheart',    count:  0},
      { category:'Small Enemies', name:'Mosquito',      count:  0},
      { category:'Small Enemies', name:'Green Crawler', count:  0},
      { category:'Small Enemies', name:'Night Crawler', count:  0},
      { category:'Small Enemies', name:'Pink Slime',    count:  0},
      { category:'Small Enemies', name:'Red Slime',     count:  0},
      { category:'Large Enemies', name:'Roller Boi',    count:  0},
      { category:'Large Enemies', name:'Laser Bob',     count:  0},
      { category:'Large Enemies', name:'Talon Shark',   count:  0},
      { category:'Large Enemies', name:'Angel',         count:  0},
      { category:'Large Enemies', name:'Arch Angel',    count:  0},
    ],
  },
  
  {
    name:'Helios Reserve Lyra',     
    longitude:120, 
    latitude:28,  
    type:'HeliosReserve', 
    gameid:'HeliosReserve24',    
    info:["Helios Reserve Lyra is a power platform",'The "Catalan Modemisme" paint can can be found here.'],
    defaults: {
      notes:   [''],
      resources: [      
        
      ],
      tanks: { 
        battery: { count: 0, current: 0 },
        oil:     { count: 0, current: 0 },  
        diesel:  { count: 0, current: 0 },   
        petrol:  { count: 0, current: 0 },  
        oxygen:  { count: 0, current: 0 },   
        methane: { count: 0, current: 0 },  
        co2:     { count: 0, current: 0 },   
        water:   { count: 0, current: 0 },  
      },
    },
    enemies: [
      { category:'Hazards',       name:'Sentinel Mine', count:  0},
      { category:'Small Enemies', name:'Sweetheart',    count:  0},
      { category:'Small Enemies', name:'Mosquito',      count:  0},
      { category:'Small Enemies', name:'Green Crawler', count:  0},
      { category:'Small Enemies', name:'Night Crawler', count:  0},
      { category:'Small Enemies', name:'Pink Slime',    count:  0},
      { category:'Small Enemies', name:'Red Slime',     count:  0},
      { category:'Large Enemies', name:'Roller Boi',    count:  0},
      { category:'Large Enemies', name:'Laser Bob',     count:  0},
      { category:'Large Enemies', name:'Talon Shark',   count:  0},
      { category:'Large Enemies', name:'Angel',         count:  0},
      { category:'Large Enemies', name:'Arch Angel',    count:  0},
    ],
  },
  
  {
    name:'Dover Grave',             
    longitude:137, 
    latitude:35,  
    type:'Ruin',          
    gameid:'DoverGrave',    
    info:"Dover Grave is an underwater ruin",
    defaults: {
      notes:   [''],
      resources: [      
        
      ],
      tanks: { 
        battery: { count: 0, current: 0 },
        oil:     { count: 0, current: 0 },  
        diesel:  { count: 0, current: 0 },   
        petrol:  { count: 0, current: 0 },  
        oxygen:  { count: 0, current: 0 },   
        methane: { count: 0, current: 0 },  
        co2:     { count: 0, current: 0 },   
        water:   { count: 0, current: 0 },  
      },
    },
    enemies: [
      { category:'Hazards',       name:'Sentinel Mine', count:  0},
      { category:'Small Enemies', name:'Sweetheart',    count:  0},
      { category:'Small Enemies', name:'Mosquito',      count:  0},
      { category:'Small Enemies', name:'Green Crawler', count:  0},
      { category:'Small Enemies', name:'Night Crawler', count:  0},
      { category:'Small Enemies', name:'Pink Slime',    count:  0},
      { category:'Small Enemies', name:'Red Slime',     count:  0},
      { category:'Large Enemies', name:'Roller Boi',    count:  0},
      { category:'Large Enemies', name:'Laser Bob',     count:  0},
      { category:'Large Enemies', name:'Talon Shark',   count:  0},
      { category:'Large Enemies', name:'Angel',         count:  0},
      { category:'Large Enemies', name:'Arch Angel',    count:  0},
    ],
  },
  
  {
    name:'Refuel Outpost Delta',    
    longitude:93,  
    latitude:39,  
    type:'RefuelOutpost', 
    gameid:'RefuelOutpostB', 
    underwaterLoot:true, 
    primaryNumbers:'6', 
    secondaryNumbers:'3,4,5',    
    info:"Refuel Outpost Delta is a fuel depot",
    defaults: {
      notes:   [''],
      resources: [      
        
      ],
      tanks: { 
        battery: { count: 0, current: 0 },
        oil:     { count: 0, current: 0 },  
        diesel:  { count: 0, current: 0 },   
        petrol:  { count: 0, current: 0 },  
        oxygen:  { count: 0, current: 0 },   
        methane: { count: 0, current: 0 },  
        co2:     { count: 0, current: 0 },   
        water:   { count: 0, current: 0 },  
      },
    },
    enemies: [
      { category:'Hazards',       name:'Sentinel Mine', count:  0},
      { category:'Small Enemies', name:'Sweetheart',    count:  0},
      { category:'Small Enemies', name:'Mosquito',      count:  0},
      { category:'Small Enemies', name:'Green Crawler', count:  0},
      { category:'Small Enemies', name:'Night Crawler', count:  0},
      { category:'Small Enemies', name:'Pink Slime',    count:  0},
      { category:'Small Enemies', name:'Red Slime',     count:  0},
      { category:'Large Enemies', name:'Roller Boi',    count:  0},
      { category:'Large Enemies', name:'Laser Bob',     count:  0},
      { category:'Large Enemies', name:'Talon Shark',   count:  0},
      { category:'Large Enemies', name:'Angel',         count:  0},
      { category:'Large Enemies', name:'Arch Angel',    count:  0},
    ],
  },
  
  {
    name:'Lincoln Grave',           
    longitude:80,  
    latitude:4,   
    type:'Ruin',          
    gameid:'LincolnGrave',    
    info:"Lincoln Grave is an underwater ruin",
    defaults: {
      notes:   [''],
      resources: [      
        
      ],
      tanks: { 
        battery: { count: 0, current: 0 },
        oil:     { count: 0, current: 0 },  
        diesel:  { count: 0, current: 0 },   
        petrol:  { count: 0, current: 0 },  
        oxygen:  { count: 0, current: 0 },   
        methane: { count: 0, current: 0 },  
        co2:     { count: 0, current: 0 },   
        water:   { count: 0, current: 0 },  
      },
    },
    enemies: [
      { category:'Hazards',       name:'Sentinel Mine', count:  0},
      { category:'Small Enemies', name:'Sweetheart',    count:  0},
      { category:'Small Enemies', name:'Mosquito',      count:  0},
      { category:'Small Enemies', name:'Green Crawler', count:  0},
      { category:'Small Enemies', name:'Night Crawler', count:  0},
      { category:'Small Enemies', name:'Pink Slime',    count:  0},
      { category:'Small Enemies', name:'Red Slime',     count:  0},
      { category:'Large Enemies', name:'Roller Boi',    count:  0},
      { category:'Large Enemies', name:'Laser Bob',     count:  0},
      { category:'Large Enemies', name:'Talon Shark',   count:  0},
      { category:'Large Enemies', name:'Angel',         count:  0},
      { category:'Large Enemies', name:'Arch Angel',    count:  0},
    ],
  },
  
  {
    name:'Helios Reserve Gemini',   
    longitude:61,  
    latitude:-26, 
    type:'HeliosReserve', 
    gameid:'HeliosReserveC',    
    info:["Helios Reserve Gemini is a power platform",'The "Dead Mark" paint can can be found here.'],
    defaults: {
      notes:   [''],
      resources: [      
        
      ],
      tanks: { 
        battery: { count: 0, current: 0 },
        oil:     { count: 0, current: 0 },  
        diesel:  { count: 0, current: 0 },   
        petrol:  { count: 0, current: 0 },  
        oxygen:  { count: 0, current: 0 },   
        methane: { count: 0, current: 0 },  
        co2:     { count: 0, current: 0 },   
        water:   { count: 0, current: 0 },  
      },
    },
    enemies: [
      { category:'Hazards',       name:'Sentinel Mine', count:  0},
      { category:'Small Enemies', name:'Sweetheart',    count:  0},
      { category:'Small Enemies', name:'Mosquito',      count:  0},
      { category:'Small Enemies', name:'Green Crawler', count:  0},
      { category:'Small Enemies', name:'Night Crawler', count:  0},
      { category:'Small Enemies', name:'Pink Slime',    count:  0},
      { category:'Small Enemies', name:'Red Slime',     count:  0},
      { category:'Large Enemies', name:'Roller Boi',    count:  0},
      { category:'Large Enemies', name:'Laser Bob',     count:  0},
      { category:'Large Enemies', name:'Talon Shark',   count:  0},
      { category:'Large Enemies', name:'Angel',         count:  0},
      { category:'Large Enemies', name:'Arch Angel',    count:  0},
    ],
  },
  
  {
    name:'Winston Grave',           
    longitude:27,  
    latitude:-12, 
    type:'Ruin',          
    gameid:'WinstonGrave',    
    info:"Winston Grave is an underwater ruin",
    defaults: {
      notes:   [''],
      resources: [      
        
      ],
      tanks: { 
        battery: { count: 0, current: 0 },
        oil:     { count: 0, current: 0 },  
        diesel:  { count: 0, current: 0 },   
        petrol:  { count: 0, current: 0 },  
        oxygen:  { count: 0, current: 0 },   
        methane: { count: 0, current: 0 },  
        co2:     { count: 0, current: 0 },   
        water:   { count: 0, current: 0 },  
      },
    },
    enemies: [
      { category:'Hazards',       name:'Sentinel Mine', count:  0},
      { category:'Small Enemies', name:'Sweetheart',    count:  0},
      { category:'Small Enemies', name:'Mosquito',      count:  0},
      { category:'Small Enemies', name:'Green Crawler', count:  0},
      { category:'Small Enemies', name:'Night Crawler', count:  0},
      { category:'Small Enemies', name:'Pink Slime',    count:  0},
      { category:'Small Enemies', name:'Red Slime',     count:  0},
      { category:'Large Enemies', name:'Roller Boi',    count:  0},
      { category:'Large Enemies', name:'Laser Bob',     count:  0},
      { category:'Large Enemies', name:'Talon Shark',   count:  0},
      { category:'Large Enemies', name:'Angel',         count:  0},
      { category:'Large Enemies', name:'Arch Angel',    count:  0},
    ],
  },
  
  {
    name:'Brighton Grave',          
    longitude:58,  
    latitude:-14, 
    type:'Ruin',          
    gameid:'BrightonGrave',    
    info:"Brighton Grave is an underwater ruin",
    defaults: {
      notes:   [''],
      resources: [      
        
      ],
      tanks: { 
        battery: { count: 0, current: 0 },
        oil:     { count: 0, current: 0 },  
        diesel:  { count: 0, current: 0 },   
        petrol:  { count: 0, current: 0 },  
        oxygen:  { count: 0, current: 0 },   
        methane: { count: 0, current: 0 },  
        co2:     { count: 0, current: 0 },   
        water:   { count: 0, current: 0 },  
      },
    },
    enemies: [
      { category:'Hazards',       name:'Sentinel Mine', count:  0},
      { category:'Small Enemies', name:'Sweetheart',    count:  0},
      { category:'Small Enemies', name:'Mosquito',      count:  0},
      { category:'Small Enemies', name:'Green Crawler', count:  0},
      { category:'Small Enemies', name:'Night Crawler', count:  0},
      { category:'Small Enemies', name:'Pink Slime',    count:  0},
      { category:'Small Enemies', name:'Red Slime',     count:  0},
      { category:'Large Enemies', name:'Roller Boi',    count:  0},
      { category:'Large Enemies', name:'Laser Bob',     count:  0},
      { category:'Large Enemies', name:'Talon Shark',   count:  0},
      { category:'Large Enemies', name:'Angel',         count:  0},
      { category:'Large Enemies', name:'Arch Angel',    count:  0},
    ],
  },
  
  {
    name:'Habitat Node 04-7',       
    longitude:82,  
    latitude:-15, 
    type:'Habitat',       
    gameid:'HabitatNode04', 
    underwaterLoot:true,    
    info:["Habitat Node 04-7 is a habitat platform",'The "Bubble Octo" paint can can be found here.'],
    defaults: {
      notes:   [''],
      resources: [      
        
      ],
      tanks: { 
        battery: { count: 0, current: 0 },
        oil:     { count: 0, current: 0 },  
        diesel:  { count: 0, current: 0 },   
        petrol:  { count: 0, current: 0 },  
        oxygen:  { count: 0, current: 0 },   
        methane: { count: 0, current: 0 },  
        co2:     { count: 0, current: 0 },   
        water:   { count: 0, current: 0 },  
      },
    },
    enemies: [
      { category:'Hazards',       name:'Sentinel Mine', count:  0},
      { category:'Small Enemies', name:'Sweetheart',    count:  0},
      { category:'Small Enemies', name:'Mosquito',      count:  0},
      { category:'Small Enemies', name:'Green Crawler', count:  0},
      { category:'Small Enemies', name:'Night Crawler', count:  0},
      { category:'Small Enemies', name:'Pink Slime',    count:  0},
      { category:'Small Enemies', name:'Red Slime',     count:  0},
      { category:'Large Enemies', name:'Roller Boi',    count:  0},
      { category:'Large Enemies', name:'Laser Bob',     count:  0},
      { category:'Large Enemies', name:'Talon Shark',   count:  0},
      { category:'Large Enemies', name:'Angel',         count:  0},
      { category:'Large Enemies', name:'Arch Angel',    count:  0},
    ],
  },
  

  {
    name:'Habitat Node 01-2.5',     
    longitude:68,  
    latitude:-78, 
    type:'Habitat',       
    gameid:'HabitatNode01',    
    info:["Habitat Node 01-2.5 is a habitat platform",'The "Last Circus" paint can can be found here.'],
    defaults: {
      notes:   [''],
      resources: [      
        
      ],
      tanks: { 
        battery: { count: 0, current: 0 },
        oil:     { count: 0, current: 0 },  
        diesel:  { count: 0, current: 0 },   
        petrol:  { count: 0, current: 0 },  
        oxygen:  { count: 0, current: 0 },   
        methane: { count: 0, current: 0 },  
        co2:     { count: 0, current: 0 },   
        water:   { count: 0, current: 0 },  
      },
    },
    enemies: [
      { category:'Hazards',       name:'Sentinel Mine', count:  0},
      { category:'Small Enemies', name:'Sweetheart',    count:  0},
      { category:'Small Enemies', name:'Mosquito',      count:  0},
      { category:'Small Enemies', name:'Green Crawler', count:  0},
      { category:'Small Enemies', name:'Night Crawler', count:  0},
      { category:'Small Enemies', name:'Pink Slime',    count:  0},
      { category:'Small Enemies', name:'Red Slime',     count:  0},
      { category:'Large Enemies', name:'Roller Boi',    count:  0},
      { category:'Large Enemies', name:'Laser Bob',     count:  0},
      { category:'Large Enemies', name:'Talon Shark',   count:  0},
      { category:'Large Enemies', name:'Angel',         count:  0},
      { category:'Large Enemies', name:'Arch Angel',    count:  0},
    ],
  },
  
  {
    name:'York Grave',              
    longitude:85,  
    latitude:-75, 
    type:'Ruin',          
    gameid:'YorkGrave',    
    info:"York Grave is an underwater ruin",
    defaults: {
      notes:   [''],
      resources: [      
        
      ],
      tanks: { 
        battery: { count: 0, current: 0 },
        oil:     { count: 0, current: 0 },  
        diesel:  { count: 0, current: 0 },   
        petrol:  { count: 0, current: 0 },  
        oxygen:  { count: 0, current: 0 },   
        methane: { count: 0, current: 0 },  
        co2:     { count: 0, current: 0 },   
        water:   { count: 0, current: 0 },  
      },
    },
    enemies: [
      { category:'Hazards',       name:'Sentinel Mine', count:  0},
      { category:'Small Enemies', name:'Sweetheart',    count:  0},
      { category:'Small Enemies', name:'Mosquito',      count:  0},
      { category:'Small Enemies', name:'Green Crawler', count:  0},
      { category:'Small Enemies', name:'Night Crawler', count:  0},
      { category:'Small Enemies', name:'Pink Slime',    count:  0},
      { category:'Small Enemies', name:'Red Slime',     count:  0},
      { category:'Large Enemies', name:'Roller Boi',    count:  0},
      { category:'Large Enemies', name:'Laser Bob',     count:  0},
      { category:'Large Enemies', name:'Talon Shark',   count:  0},
      { category:'Large Enemies', name:'Angel',         count:  0},
      { category:'Large Enemies', name:'Arch Angel',    count:  0},
    ],
  },
  
  {
    name:'Habitat Node 02-23',      
    longitude:47,  
    latitude:-49, 
    type:'Habitat',       
    gameid:'HabitatNode02', 
    flags:'rhino, fahrt',    
    info:["Habitat Node 02-23 is a habitat platform",'The "Old Flag" paint can can be found here.'],
    defaults: {
      notes:   [''],
      resources: [      
        
      ],
      tanks: { 
        battery: { count: 0, current: 0 },
        oil:     { count: 0, current: 0 },  
        diesel:  { count: 0, current: 0 },   
        petrol:  { count: 0, current: 0 },  
        oxygen:  { count: 0, current: 0 },   
        methane: { count: 0, current: 0 },  
        co2:     { count: 0, current: 0 },   
        water:   { count: 0, current: 0 },  
      },
    },
    enemies: [
      { category:'Hazards',       name:'Sentinel Mine', count:  0},
      { category:'Small Enemies', name:'Sweetheart',    count:  0},
      { category:'Small Enemies', name:'Mosquito',      count:  0},
      { category:'Small Enemies', name:'Green Crawler', count:  0},
      { category:'Small Enemies', name:'Night Crawler', count:  0},
      { category:'Small Enemies', name:'Pink Slime',    count:  0},
      { category:'Small Enemies', name:'Red Slime',     count:  0},
      { category:'Large Enemies', name:'Roller Boi',    count:  0},
      { category:'Large Enemies', name:'Laser Bob',     count:  0},
      { category:'Large Enemies', name:'Talon Shark',   count:  0},
      { category:'Large Enemies', name:'Angel',         count:  0},
      { category:'Large Enemies', name:'Arch Angel',    count:  0},
    ],
  },
  
  {
    name:'Helios Reserve Draco',    
    longitude:62,  
    latitude:-64, 
    type:'HeliosReserve', 
    gameid:'HeliosReserveD', 
    flags:'exo', 
    primaryNumbers:'2', 
    secondaryNumbers:'1,3,4,2,5,6,6,7,12,6',    
    info:[
      "Helios Reserve Draco is a power platform",
      'The "Abyss Hands" paint can be found here'
    ],
    defaults: {
      notes:   [''],
      resources: [      
        
      ],
      tanks: { 
        battery: { count: 0, current: 0 },
        oil:     { count: 0, current: 0 },  
        diesel:  { count: 0, current: 0 },   
        petrol:  { count: 0, current: 0 },  
        oxygen:  { count: 0, current: 0 },   
        methane: { count: 0, current: 0 },  
        co2:     { count: 0, current: 0 },   
        water:   { count: 0, current: 0 },  
      },
    },
    enemies: [
      { category:'Hazards',       name:'Sentinel Mine', count:  0},
      { category:'Small Enemies', name:'Sweetheart',    count:  0},
      { category:'Small Enemies', name:'Mosquito',      count:  0},
      { category:'Small Enemies', name:'Green Crawler', count:  0},
      { category:'Small Enemies', name:'Night Crawler', count:  0},
      { category:'Small Enemies', name:'Pink Slime',    count:  0},
      { category:'Small Enemies', name:'Red Slime',     count:  0},
      { category:'Large Enemies', name:'Roller Boi',    count:  0},
      { category:'Large Enemies', name:'Laser Bob',     count:  0},
      { category:'Large Enemies', name:'Talon Shark',   count:  0},
      { category:'Large Enemies', name:'Angel',         count:  0},
      { category:'Large Enemies', name:'Arch Angel',    count:  0},
    ],
  },
  
  {
    name:'Sanctuary Dock 12',       
    longitude:88,  
    latitude:27,  
    type:'Hanger',        
    gameid:'SanctuaryDock12',    
    info:"Sanctuary Dock 12 is another docking area",
    defaults: {
      notes:   [''],
      resources: [      
        
      ],
      tanks: { 
        battery: { count: 0, current: 0 },
        oil:     { count: 0, current: 0 },  
        diesel:  { count: 0, current: 0 },   
        petrol:  { count: 0, current: 0 },  
        oxygen:  { count: 0, current: 0 },   
        methane: { count: 0, current: 0 },  
        co2:     { count: 0, current: 0 },   
        water:   { count: 0, current: 0 },  
      },
    },
    enemies: [
      { category:'Hazards',       name:'Sentinel Mine', count:  0},
      { category:'Small Enemies', name:'Sweetheart',    count:  0},
      { category:'Small Enemies', name:'Mosquito',      count:  0},
      { category:'Small Enemies', name:'Green Crawler', count:  0},
      { category:'Small Enemies', name:'Night Crawler', count:  0},
      { category:'Small Enemies', name:'Pink Slime',    count:  0},
      { category:'Small Enemies', name:'Red Slime',     count:  0},
      { category:'Large Enemies', name:'Roller Boi',    count:  0},
      { category:'Large Enemies', name:'Laser Bob',     count:  0},
      { category:'Large Enemies', name:'Talon Shark',   count:  0},
      { category:'Large Enemies', name:'Angel',         count:  0},
      { category:'Large Enemies', name:'Arch Angel',    count:  0},
    ],
  },
  
  {
    name:'NDNS Node 29,-2',         
    longitude:29,  
    latitude:-2,  
    type:'NDNS',          
    gameid:'GrowthContainer02', 
    primaryNumbers:'2',    
    info:"NDNS Node 29, -2 is a NDNS Node. (Improperly named as 55,-2)",
    defaults: {
      notes:   [''],
      resources: [      
        
      ],
      tanks: { 
        battery: { count: 0, current: 0 },
        oil:     { count: 0, current: 0 },  
        diesel:  { count: 0, current: 0 },   
        petrol:  { count: 0, current: 0 },  
        oxygen:  { count: 0, current: 0 },   
        methane: { count: 0, current: 0 },  
        co2:     { count: 0, current: 0 },   
        water:   { count: 0, current: 0 },  
      },
    },
    enemies: [
      { category:'Hazards',       name:'Sentinel Mine', count:  0},
      { category:'Small Enemies', name:'Sweetheart',    count:  0},
      { category:'Small Enemies', name:'Mosquito',      count:  0},
      { category:'Small Enemies', name:'Green Crawler', count:  0},
      { category:'Small Enemies', name:'Night Crawler', count:  0},
      { category:'Small Enemies', name:'Pink Slime',    count:  0},
      { category:'Small Enemies', name:'Red Slime',     count:  0},
      { category:'Large Enemies', name:'Roller Boi',    count:  0},
      { category:'Large Enemies', name:'Laser Bob',     count:  0},
      { category:'Large Enemies', name:'Talon Shark',   count:  0},
      { category:'Large Enemies', name:'Angel',         count:  0},
      { category:'Large Enemies', name:'Arch Angel',    count:  0},
    ],
  },
  
  {
    name:'NDNS Node 55,-2',         
    longitude:55,  
    latitude:-2,  
    type:'NDNS',          
    gameid:'GrowthContainer01', 
    primaryNumbers:'1',    
    info:"NDNS Node 55, -2 is a NDNS Node",
    defaults: {
      notes:   [''],
      resources: [      
        
      ],
      tanks: { 
        battery: { count: 0, current: 0 },
        oil:     { count: 0, current: 0 },  
        diesel:  { count: 0, current: 0 },   
        petrol:  { count: 0, current: 0 },  
        oxygen:  { count: 0, current: 0 },   
        methane: { count: 0, current: 0 },  
        co2:     { count: 0, current: 0 },   
        water:   { count: 0, current: 0 },  
      },
    },
    enemies: [
      { category:'Hazards',       name:'Sentinel Mine', count:  0},
      { category:'Small Enemies', name:'Sweetheart',    count:  0},
      { category:'Small Enemies', name:'Mosquito',      count:  0},
      { category:'Small Enemies', name:'Green Crawler', count:  0},
      { category:'Small Enemies', name:'Night Crawler', count:  0},
      { category:'Small Enemies', name:'Pink Slime',    count:  0},
      { category:'Small Enemies', name:'Red Slime',     count:  0},
      { category:'Large Enemies', name:'Roller Boi',    count:  0},
      { category:'Large Enemies', name:'Laser Bob',     count:  0},
      { category:'Large Enemies', name:'Talon Shark',   count:  0},
      { category:'Large Enemies', name:'Angel',         count:  0},
      { category:'Large Enemies', name:'Arch Angel',    count:  0},
    ],
  },
  
  {
    name:'NDNS Node 70,14',         
    longitude:70,  
    latitude:14,  
    type:'NDNS',          
    gameid:'GrowthContainer10', 
    primaryNumbers:'10',    
    info:"NDNS Node 70, 14 is a NDNS Node",
    defaults: {
      notes:   [''],
      resources: [      
        
      ],
      tanks: { 
        battery: { count: 0, current: 0 },
        oil:     { count: 0, current: 0 },  
        diesel:  { count: 0, current: 0 },   
        petrol:  { count: 0, current: 0 },  
        oxygen:  { count: 0, current: 0 },   
        methane: { count: 0, current: 0 },  
        co2:     { count: 0, current: 0 },   
        water:   { count: 0, current: 0 },  
      },
    },
    enemies: [
      { category:'Hazards',       name:'Sentinel Mine', count:  0},
      { category:'Small Enemies', name:'Sweetheart',    count:  0},
      { category:'Small Enemies', name:'Mosquito',      count:  0},
      { category:'Small Enemies', name:'Green Crawler', count:  0},
      { category:'Small Enemies', name:'Night Crawler', count:  0},
      { category:'Small Enemies', name:'Pink Slime',    count:  0},
      { category:'Small Enemies', name:'Red Slime',     count:  0},
      { category:'Large Enemies', name:'Roller Boi',    count:  0},
      { category:'Large Enemies', name:'Laser Bob',     count:  0},
      { category:'Large Enemies', name:'Talon Shark',   count:  0},
      { category:'Large Enemies', name:'Angel',         count:  0},
      { category:'Large Enemies', name:'Arch Angel',    count:  0},
    ],
  },
  
  {
    name:'NDNS Node 84,-2',         
    longitude:84,  
    latitude:-2,  
    type:'NDNS',          
    gameid:'GrowthContainer04', 
    primaryNumbers:'4',    
    info:"NDNS Node 84, -2 is a NDNS Node",
    defaults: {
      notes:   [''],
      resources: [      
        
      ],
      tanks: { 
        battery: { count: 0, current: 0 },
        oil:     { count: 0, current: 0 },  
        diesel:  { count: 0, current: 0 },   
        petrol:  { count: 0, current: 0 },  
        oxygen:  { count: 0, current: 0 },   
        methane: { count: 0, current: 0 },  
        co2:     { count: 0, current: 0 },   
        water:   { count: 0, current: 0 },  
      },
    },
    enemies: [
      { category:'Hazards',       name:'Sentinel Mine', count:  0},
      { category:'Small Enemies', name:'Sweetheart',    count:  0},
      { category:'Small Enemies', name:'Mosquito',      count:  0},
      { category:'Small Enemies', name:'Green Crawler', count:  0},
      { category:'Small Enemies', name:'Night Crawler', count:  0},
      { category:'Small Enemies', name:'Pink Slime',    count:  0},
      { category:'Small Enemies', name:'Red Slime',     count:  0},
      { category:'Large Enemies', name:'Roller Boi',    count:  0},
      { category:'Large Enemies', name:'Laser Bob',     count:  0},
      { category:'Large Enemies', name:'Talon Shark',   count:  0},
      { category:'Large Enemies', name:'Angel',         count:  0},
      { category:'Large Enemies', name:'Arch Angel',    count:  0},
    ],
  },
  
  {
    name:'NDNS Node 70,-17',        
    longitude:70,  
    latitude:-17, 
    type:'NDNS',          
    gameid:'GrowthContainer07', 
    primaryNumbers:'7',    
    info:"NDNS Node 70, -17 is a NDNS Node",
    defaults: {
      notes:   [''],
      resources: [      
        
      ],
      tanks: { 
        battery: { count: 0, current: 0 },
        oil:     { count: 0, current: 0 },  
        diesel:  { count: 0, current: 0 },   
        petrol:  { count: 0, current: 0 },  
        oxygen:  { count: 0, current: 0 },   
        methane: { count: 0, current: 0 },  
        co2:     { count: 0, current: 0 },   
        water:   { count: 0, current: 0 },  
      },
    },
    enemies: [
      { category:'Hazards',       name:'Sentinel Mine', count:  0},
      { category:'Small Enemies', name:'Sweetheart',    count:  0},
      { category:'Small Enemies', name:'Mosquito',      count:  0},
      { category:'Small Enemies', name:'Green Crawler', count:  0},
      { category:'Small Enemies', name:'Night Crawler', count:  0},
      { category:'Small Enemies', name:'Pink Slime',    count:  0},
      { category:'Small Enemies', name:'Red Slime',     count:  0},
      { category:'Large Enemies', name:'Roller Boi',    count:  0},
      { category:'Large Enemies', name:'Laser Bob',     count:  0},
      { category:'Large Enemies', name:'Talon Shark',   count:  0},
      { category:'Large Enemies', name:'Angel',         count:  0},
      { category:'Large Enemies', name:'Arch Angel',    count:  0},
    ],
  },
  
  {
    name:'NDNS Node 70,-42',        
    longitude:70,  
    latitude:-42, 
    type:'NDNS',          
    gameid:'GrowthContainer08', 
    primaryNumbers:'8',    
    info:"NDNS Node 70, -42 is a NDNS Node",
    defaults: {
      notes:   [''],
      resources: [      
        
      ],
      tanks: { 
        battery: { count: 0, current: 0 },
        oil:     { count: 0, current: 0 },  
        diesel:  { count: 0, current: 0 },   
        petrol:  { count: 0, current: 0 },  
        oxygen:  { count: 0, current: 0 },   
        methane: { count: 0, current: 0 },  
        co2:     { count: 0, current: 0 },   
        water:   { count: 0, current: 0 },  
      },
    },
    enemies: [
      { category:'Hazards',       name:'Sentinel Mine', count:  0},
      { category:'Small Enemies', name:'Sweetheart',    count:  0},
      { category:'Small Enemies', name:'Mosquito',      count:  0},
      { category:'Small Enemies', name:'Green Crawler', count:  0},
      { category:'Small Enemies', name:'Night Crawler', count:  0},
      { category:'Small Enemies', name:'Pink Slime',    count:  0},
      { category:'Small Enemies', name:'Red Slime',     count:  0},
      { category:'Large Enemies', name:'Roller Boi',    count:  0},
      { category:'Large Enemies', name:'Laser Bob',     count:  0},
      { category:'Large Enemies', name:'Talon Shark',   count:  0},
      { category:'Large Enemies', name:'Angel',         count:  0},
      { category:'Large Enemies', name:'Arch Angel',    count:  0},
    ],
  },

  {
    name:'NDNS Node 70,-82',        
    longitude:70,  
    latitude:-82, 
    type:'NDNS',          
    gameid:'GrowthContainer09', 
    primaryNumbers:'9',    
    info:"NDNS Node 70, -82 is a NDNS Node",
    defaults: {
      notes:   [''],
      resources: [      
        
      ],
      tanks: { 
        battery: { count: 0, current: 0 },
        oil:     { count: 0, current: 0 },  
        diesel:  { count: 0, current: 0 },   
        petrol:  { count: 0, current: 0 },  
        oxygen:  { count: 0, current: 0 },   
        methane: { count: 0, current: 0 },  
        co2:     { count: 0, current: 0 },   
        water:   { count: 0, current: 0 },  
      },
    },
    enemies: [
      { category:'Hazards',       name:'Sentinel Mine', count:  0},
      { category:'Small Enemies', name:'Sweetheart',    count:  0},
      { category:'Small Enemies', name:'Mosquito',      count:  0},
      { category:'Small Enemies', name:'Green Crawler', count:  0},
      { category:'Small Enemies', name:'Night Crawler', count:  0},
      { category:'Small Enemies', name:'Pink Slime',    count:  0},
      { category:'Small Enemies', name:'Red Slime',     count:  0},
      { category:'Large Enemies', name:'Roller Boi',    count:  0},
      { category:'Large Enemies', name:'Laser Bob',     count:  0},
      { category:'Large Enemies', name:'Talon Shark',   count:  0},
      { category:'Large Enemies', name:'Angel',         count:  0},
      { category:'Large Enemies', name:'Arch Angel',    count:  0},
    ],
  },
];

const _h = [
  {
    name:'Habitat Node 10-4',       
    longitude:30,  
    latitude:-31, 
    type:'Habitat',    
    gameid:'HabitatNode10',    
    info:"Habitat Node 10-4 is a habitat platform",
    defaults: {
      notes:   [''],
      resources: [      
        
      ],
      tanks: { 
        battery: { count: 0, current: 0 },
        oil:     { count: 0, current: 0 },  
        diesel:  { count: 0, current: 0 },   
        petrol:  { count: 0, current: 0 },  
        oxygen:  { count: 0, current: 0 },   
        methane: { count: 0, current: 0 },  
        co2:     { count: 0, current: 0 },   
        water:   { count: 0, current: 0 },  
      },
    },
    enemies: [
      { category:'Hazards',       name:'Sentinel Mine', count:  0},
      { category:'Small Enemies', name:'Sweetheart',    count:  0},
      { category:'Small Enemies', name:'Mosquito',      count:  0},
      { category:'Small Enemies', name:'Green Crawler', count:  0},
      { category:'Small Enemies', name:'Night Crawler', count:  0},
      { category:'Small Enemies', name:'Pink Slime',    count:  0},
      { category:'Small Enemies', name:'Red Slime',     count:  0},
      { category:'Large Enemies', name:'Roller Boi',    count:  0},
      { category:'Large Enemies', name:'Laser Bob',     count:  0},
      { category:'Large Enemies', name:'Talon Shark',   count:  0},
      { category:'Large Enemies', name:'Angel',         count:  0},
      { category:'Large Enemies', name:'Arch Angel',    count:  0},
    ],
  },

  
  {
    name:'Seed Reserve 06',         
    longitude:99,  
    latitude:-9,  
    type:'SeedVault',  
    gameid:'SeedReserve_06',    
    info:"Seed Reserve 06 is an underwater seed reserve",
    defaults: {
      notes:   [''],
      resources: [      
        
      ],
      tanks: { 
        battery: { count: 0, current: 0 },
        oil:     { count: 0, current: 0 },  
        diesel:  { count: 0, current: 0 },   
        petrol:  { count: 0, current: 0 },  
        oxygen:  { count: 0, current: 0 },   
        methane: { count: 0, current: 0 },  
        co2:     { count: 0, current: 0 },   
        water:   { count: 0, current: 0 },  
      },
    },
    enemies: [
      { category:'Hazards',       name:'Sentinel Mine', count:  0},
      { category:'Small Enemies', name:'Sweetheart',    count:  0},
      { category:'Small Enemies', name:'Mosquito',      count:  0},
      { category:'Small Enemies', name:'Green Crawler', count:  0},
      { category:'Small Enemies', name:'Night Crawler', count:  0},
      { category:'Small Enemies', name:'Pink Slime',    count:  0},
      { category:'Small Enemies', name:'Red Slime',     count:  0},
      { category:'Large Enemies', name:'Roller Boi',    count:  0},
      { category:'Large Enemies', name:'Laser Bob',     count:  0},
      { category:'Large Enemies', name:'Talon Shark',   count:  0},
      { category:'Large Enemies', name:'Angel',         count:  0},
      { category:'Large Enemies', name:'Arch Angel',    count:  0},
    ],
  },
  
  {
    name:'Seed Reserve 17',         
    longitude:42,  
    latitude:-29, 
    type:'SeedVault',  
    gameid:'SeedReserve_17',    
    info:"Seed Reserve 17 is an underwater seed reserve",
    defaults: {
      notes:   [''],
      resources: [      
        
      ],
      tanks: { 
        battery: { count: 0, current: 0 },
        oil:     { count: 0, current: 0 },  
        diesel:  { count: 0, current: 0 },   
        petrol:  { count: 0, current: 0 },  
        oxygen:  { count: 0, current: 0 },   
        methane: { count: 0, current: 0 },  
        co2:     { count: 0, current: 0 },   
        water:   { count: 0, current: 0 },  
      },
    },
    enemies: [
      { category:'Hazards',       name:'Sentinel Mine', count:  0},
      { category:'Small Enemies', name:'Sweetheart',    count:  0},
      { category:'Small Enemies', name:'Mosquito',      count:  0},
      { category:'Small Enemies', name:'Green Crawler', count:  0},
      { category:'Small Enemies', name:'Night Crawler', count:  0},
      { category:'Small Enemies', name:'Pink Slime',    count:  0},
      { category:'Small Enemies', name:'Red Slime',     count:  0},
      { category:'Large Enemies', name:'Roller Boi',    count:  0},
      { category:'Large Enemies', name:'Laser Bob',     count:  0},
      { category:'Large Enemies', name:'Talon Shark',   count:  0},
      { category:'Large Enemies', name:'Angel',         count:  0},
      { category:'Large Enemies', name:'Arch Angel',    count:  0},
    ],
  },
  
  {
    name:'Seed Reserve 18',         
    longitude:93,  
    latitude:-78, 
    type:'SeedVault',  
    gameid:'SeedReserve_18',
    info:"Seed Reserve 18 is an underwater seed reserve",
    defaults: {
      notes:   [''],
      resources: [      
        
      ],
      tanks: { 
        battery: { count: 0, current: 0 },
        oil:     { count: 0, current: 0 },  
        diesel:  { count: 0, current: 0 },   
        petrol:  { count: 0, current: 0 },  
        oxygen:  { count: 0, current: 0 },   
        methane: { count: 0, current: 0 },  
        co2:     { count: 0, current: 0 },   
        water:   { count: 0, current: 0 },  
      },
    },
    enemies: [
      { category:'Hazards',       name:'Sentinel Mine', count:  0},
      { category:'Small Enemies', name:'Sweetheart',    count:  0},
      { category:'Small Enemies', name:'Mosquito',      count:  0},
      { category:'Small Enemies', name:'Green Crawler', count:  0},
      { category:'Small Enemies', name:'Night Crawler', count:  0},
      { category:'Small Enemies', name:'Pink Slime',    count:  0},
      { category:'Small Enemies', name:'Red Slime',     count:  0},
      { category:'Large Enemies', name:'Roller Boi',    count:  0},
      { category:'Large Enemies', name:'Laser Bob',     count:  0},
      { category:'Large Enemies', name:'Talon Shark',   count:  0},
      { category:'Large Enemies', name:'Angel',         count:  0},
      { category:'Large Enemies', name:'Arch Angel',    count:  0},
    ],
  },
  
  {
    name:'Seed Reserve 19',         
    longitude:66,  
    latitude:33,  
    type:'SeedVault',  
    gameid:'SeedReserve_19', 
    info:"Seed Reserve 19 is an underwater seed reserve",
    defaults: {
      notes:   [''],
      resources: [      
        
      ],
      tanks: { 
        battery: { count: 0, current: 0 },
        oil:     { count: 0, current: 0 },  
        diesel:  { count: 0, current: 0 },   
        petrol:  { count: 0, current: 0 },  
        oxygen:  { count: 0, current: 0 },   
        methane: { count: 0, current: 0 },  
        co2:     { count: 0, current: 0 },   
        water:   { count: 0, current: 0 },  
      },
    },
    enemies: [
      { category:'Hazards',       name:'Sentinel Mine', count:  0},
      { category:'Small Enemies', name:'Sweetheart',    count:  0},
      { category:'Small Enemies', name:'Mosquito',      count:  0},
      { category:'Small Enemies', name:'Green Crawler', count:  0},
      { category:'Small Enemies', name:'Night Crawler', count:  0},
      { category:'Small Enemies', name:'Pink Slime',    count:  0},
      { category:'Small Enemies', name:'Red Slime',     count:  0},
      { category:'Large Enemies', name:'Roller Boi',    count:  0},
      { category:'Large Enemies', name:'Laser Bob',     count:  0},
      { category:'Large Enemies', name:'Talon Shark',   count:  0},
      { category:'Large Enemies', name:'Angel',         count:  0},
      { category:'Large Enemies', name:'Arch Angel',    count:  0},
    ],
  },
  
  {
    name:'NDNS Node 110,-2',        
    longitude:110, 
    latitude:-2,  
    type:'NDNS',       
    gameid:'GrowthContainer05', 
    primaryNumbers:'5',    
    info:"NDNS Node 110, -2 is a NDNS Node",
    defaults: {
      notes:   [''],
      resources: [      
        
      ],
      tanks: { 
        battery: { count: 0, current: 0 },
        oil:     { count: 0, current: 0 },  
        diesel:  { count: 0, current: 0 },   
        petrol:  { count: 0, current: 0 },  
        oxygen:  { count: 0, current: 0 },   
        methane: { count: 0, current: 0 },  
        co2:     { count: 0, current: 0 },   
        water:   { count: 0, current: 0 },  
      },
    },
    enemies: [
      { category:'Hazards',       name:'Sentinel Mine', count:  0},
      { category:'Small Enemies', name:'Sweetheart',    count:  0},
      { category:'Small Enemies', name:'Mosquito',      count:  0},
      { category:'Small Enemies', name:'Green Crawler', count:  0},
      { category:'Small Enemies', name:'Night Crawler', count:  0},
      { category:'Small Enemies', name:'Pink Slime',    count:  0},
      { category:'Small Enemies', name:'Red Slime',     count:  0},
      { category:'Large Enemies', name:'Roller Boi',    count:  0},
      { category:'Large Enemies', name:'Laser Bob',     count:  0},
      { category:'Large Enemies', name:'Talon Shark',   count:  0},
      { category:'Large Enemies', name:'Angel',         count:  0},
      { category:'Large Enemies', name:'Arch Angel',    count:  0},
    ],
  },
  
  {
    name:'NDNS Node 150,-2',        
    longitude:150, 
    latitude:-2,  
    type:'NDNS',       
    gameid:'GrowthContainer06', 
    primaryNumbers:'6',    
    info:"NDNS Node 150, -2 is a NDNS Node",
    defaults: {
      notes:   [''],
      resources: [      
        
      ],
      tanks: { 
        battery: { count: 0, current: 0 },
        oil:     { count: 0, current: 0 },  
        diesel:  { count: 0, current: 0 },   
        petrol:  { count: 0, current: 0 },  
        oxygen:  { count: 0, current: 0 },   
        methane: { count: 0, current: 0 },  
        co2:     { count: 0, current: 0 },   
        water:   { count: 0, current: 0 },  
      },
    },
    enemies: [
      { category:'Hazards',       name:'Sentinel Mine', count:  0},
      { category:'Small Enemies', name:'Sweetheart',    count:  0},
      { category:'Small Enemies', name:'Mosquito',      count:  0},
      { category:'Small Enemies', name:'Green Crawler', count:  0},
      { category:'Small Enemies', name:'Night Crawler', count:  0},
      { category:'Small Enemies', name:'Pink Slime',    count:  0},
      { category:'Small Enemies', name:'Red Slime',     count:  0},
      { category:'Large Enemies', name:'Roller Boi',    count:  0},
      { category:'Large Enemies', name:'Laser Bob',     count:  0},
      { category:'Large Enemies', name:'Talon Shark',   count:  0},
      { category:'Large Enemies', name:'Angel',         count:  0},
      { category:'Large Enemies', name:'Arch Angel',    count:  0},
    ],
  },
  
  {
    name:'NDNS Node -10,-2',        
    longitude:-10, 
    latitude:-2,  
    type:'NDNS',       
    gameid:'GrowthContainer03', 
    primaryNumbers:'3',    
    info:"NDNS Node -10, -2 is a NDNS Node",
    defaults: {
      notes:   [''],
      resources: [      
        
      ],
      tanks: { 
        battery: { count: 0, current: 0 },
        oil:     { count: 0, current: 0 },  
        diesel:  { count: 0, current: 0 },   
        petrol:  { count: 0, current: 0 },  
        oxygen:  { count: 0, current: 0 },   
        methane: { count: 0, current: 0 },  
        co2:     { count: 0, current: 0 },   
        water:   { count: 0, current: 0 },  
      },
    },
    enemies: [
      { category:'Hazards',       name:'Sentinel Mine', count:  0},
      { category:'Small Enemies', name:'Sweetheart',    count:  0},
      { category:'Small Enemies', name:'Mosquito',      count:  0},
      { category:'Small Enemies', name:'Green Crawler', count:  0},
      { category:'Small Enemies', name:'Night Crawler', count:  0},
      { category:'Small Enemies', name:'Pink Slime',    count:  0},
      { category:'Small Enemies', name:'Red Slime',     count:  0},
      { category:'Large Enemies', name:'Roller Boi',    count:  0},
      { category:'Large Enemies', name:'Laser Bob',     count:  0},
      { category:'Large Enemies', name:'Talon Shark',   count:  0},
      { category:'Large Enemies', name:'Angel',         count:  0},
      { category:'Large Enemies', name:'Arch Angel',    count:  0},
    ],
  },
  
  {
    name:'NDNS Node 70,38',         
    longitude:70,  
    latitude:38,  
    type:'NDNS',       
    gameid:'GrowthContainer11', 
    primaryNumbers:'11',  
    info:"NDNS Node 70, 38 is a NDNS Node",
    defaults: {
      notes:   [''],
      resources: [      
        
      ],
      tanks: { 
        battery: { count: 0, current: 0 },
        oil:     { count: 0, current: 0 },  
        diesel:  { count: 0, current: 0 },   
        petrol:  { count: 0, current: 0 },  
        oxygen:  { count: 0, current: 0 },   
        methane: { count: 0, current: 0 },  
        co2:     { count: 0, current: 0 },   
        water:   { count: 0, current: 0 },  
      },
    },
    enemies: [
      { category:'Hazards',       name:'Sentinel Mine', count:  0},
      { category:'Small Enemies', name:'Sweetheart',    count:  0},
      { category:'Small Enemies', name:'Mosquito',      count:  0},
      { category:'Small Enemies', name:'Green Crawler', count:  0},
      { category:'Small Enemies', name:'Night Crawler', count:  0},
      { category:'Small Enemies', name:'Pink Slime',    count:  0},
      { category:'Small Enemies', name:'Red Slime',     count:  0},
      { category:'Large Enemies', name:'Roller Boi',    count:  0},
      { category:'Large Enemies', name:'Laser Bob',     count:  0},
      { category:'Large Enemies', name:'Talon Shark',   count:  0},
      { category:'Large Enemies', name:'Angel',         count:  0},
      { category:'Large Enemies', name:'Arch Angel',    count:  0},
    ],
  },
  
  {
    name:'NDNS Node 70,78',         
    longitude:70,  
    latitude:78,  
    type:'NDNS',       
    gameid:'GrowthContainer12', 
    primaryNumbers:'12',    
    info:"NDNS Node 70, 78 is a NDNS Node",
    defaults: {
      notes:   [''],
      resources: [      
        
      ],
      tanks: { 
        battery: { count: 0, current: 0 },
        oil:     { count: 0, current: 0 },  
        diesel:  { count: 0, current: 0 },   
        petrol:  { count: 0, current: 0 },  
        oxygen:  { count: 0, current: 0 },   
        methane: { count: 0, current: 0 },  
        co2:     { count: 0, current: 0 },   
        water:   { count: 0, current: 0 },  
      },
    },
    enemies: [
      { category:'Hazards',       name:'Sentinel Mine', count:  0},
      { category:'Small Enemies', name:'Sweetheart',    count:  0},
      { category:'Small Enemies', name:'Mosquito',      count:  0},
      { category:'Small Enemies', name:'Green Crawler', count:  0},
      { category:'Small Enemies', name:'Night Crawler', count:  0},
      { category:'Small Enemies', name:'Pink Slime',    count:  0},
      { category:'Small Enemies', name:'Red Slime',     count:  0},
      { category:'Large Enemies', name:'Roller Boi',    count:  0},
      { category:'Large Enemies', name:'Laser Bob',     count:  0},
      { category:'Large Enemies', name:'Talon Shark',   count:  0},
      { category:'Large Enemies', name:'Angel',         count:  0},
      { category:'Large Enemies', name:'Arch Angel',    count:  0},
    ],
  },
  
  {
    name:'Habitat Node 38-98',      
    longitude:8,   
    latitude:-38, 
    type:'Habitat',    
    gameid:'HabitatNode-38-98',    
    info:[
      "Habitat Node 38-98 is a habitat platform",
      "The final location for the Mother quest line",
      'The "Playtime" paint can can be found here'
    ],
    defaults: {
      notes:   [''],
      resources: [      
        
      ],
      tanks: { 
        battery: { count: 0, current: 0 },
        oil:     { count: 0, current: 0 },  
        diesel:  { count: 0, current: 0 },   
        petrol:  { count: 0, current: 0 },  
        oxygen:  { count: 0, current: 0 },   
        methane: { count: 0, current: 0 },  
        co2:     { count: 0, current: 0 },   
        water:   { count: 0, current: 0 },  
      },
    },
    enemies: [
      { category:'Hazards',       name:'Sentinel Mine', count:  0},
      { category:'Small Enemies', name:'Sweetheart',    count:  0},
      { category:'Small Enemies', name:'Mosquito',      count:  0},
      { category:'Small Enemies', name:'Green Crawler', count:  0},
      { category:'Small Enemies', name:'Night Crawler', count:  0},
      { category:'Small Enemies', name:'Pink Slime',    count:  0},
      { category:'Small Enemies', name:'Red Slime',     count:  0},
      { category:'Large Enemies', name:'Roller Boi',    count:  0},
      { category:'Large Enemies', name:'Laser Bob',     count:  0},
      { category:'Large Enemies', name:'Talon Shark',   count:  0},
      { category:'Large Enemies', name:'Angel',         count:  0},
      { category:'Large Enemies', name:'Arch Angel',    count:  0},
    ],
  },
  
  {
    name:'Unlisted Tower',          
    longitude:113, 
    latitude:-21, 
    type:'RockySpire', 
    gameid:'UnlistedTower', 
    underwaterLoot:true,    
    info:["Unlisted Tower",'The "Krakon" paint can can be found here.'],
    defaults: {
      notes:   [''],
      resources: [      
        
      ],
      tanks: { 
        battery: { count: 0, current: 0 },
        oil:     { count: 0, current: 0 },  
        diesel:  { count: 0, current: 0 },   
        petrol:  { count: 0, current: 0 },  
        oxygen:  { count: 0, current: 0 },   
        methane: { count: 0, current: 0 },  
        co2:     { count: 0, current: 0 },   
        water:   { count: 0, current: 0 },  
      },
    },
    enemies: [
      { category:'Hazards',       name:'Sentinel Mine', count:  0},
      { category:'Small Enemies', name:'Sweetheart',    count:  0},
      { category:'Small Enemies', name:'Mosquito',      count:  0},
      { category:'Small Enemies', name:'Green Crawler', count:  0},
      { category:'Small Enemies', name:'Night Crawler', count:  0},
      { category:'Small Enemies', name:'Pink Slime',    count:  0},
      { category:'Small Enemies', name:'Red Slime',     count:  0},
      { category:'Large Enemies', name:'Roller Boi',    count:  0},
      { category:'Large Enemies', name:'Laser Bob',     count:  0},
      { category:'Large Enemies', name:'Talon Shark',   count:  0},
      { category:'Large Enemies', name:'Angel',         count:  0},
      { category:'Large Enemies', name:'Arch Angel',    count:  0},
    ],
  },
  
  {
    name:'Quarantine Stack Amen',   
    longitude:147, 
    latitude:-38, 
    type:'RockySpire', 
    gameid:'QuarantineStackAmen',    
    info:["Quarantine Stack Amen is a quarantine stack",'The "Rust Tag" paint can can be found here','The "Ammonite" paint can be found here','"Power Triode 336" can be Scanned here'],
    defaults: {
      notes:   [''],
      resources: [      
        
      ],
      tanks: { 
        battery: { count: 0, current: 0 },
        oil:     { count: 0, current: 0 },  
        diesel:  { count: 0, current: 0 },   
        petrol:  { count: 0, current: 0 },  
        oxygen:  { count: 0, current: 0 },   
        methane: { count: 0, current: 0 },  
        co2:     { count: 0, current: 0 },   
        water:   { count: 0, current: 0 },  
      },
    },
    enemies: [
      { category:'Hazards',       name:'Sentinel Mine', count:  0},
      { category:'Small Enemies', name:'Sweetheart',    count:  0},
      { category:'Small Enemies', name:'Mosquito',      count:  0},
      { category:'Small Enemies', name:'Green Crawler', count:  0},
      { category:'Small Enemies', name:'Night Crawler', count:  0},
      { category:'Small Enemies', name:'Pink Slime',    count:  0},
      { category:'Small Enemies', name:'Red Slime',     count:  0},
      { category:'Large Enemies', name:'Roller Boi',    count:  0},
      { category:'Large Enemies', name:'Laser Bob',     count:  0},
      { category:'Large Enemies', name:'Talon Shark',   count:  0},
      { category:'Large Enemies', name:'Angel',         count:  0},
      { category:'Large Enemies', name:'Arch Angel',    count:  0},
    ],
  },
  
  {
    name:'Quarantine Stack Aurora', 
    longitude:160, 
    latitude:-38, 
    type:'RockySpire', 
    gameid:'QuarantineStackAurora',    
    info:["Quarantine Stack Aurora is a quarantine stack",'The "Rust Tag" paint can can be found here','The "Leaf Wall" paint can be found here','"Power Triode 268" can be Scanned here'],
    defaults: {
      notes:   [''],
      resources: [      
        
      ],
      tanks: { 
        battery: { count: 0, current: 0 },
        oil:     { count: 0, current: 0 },  
        diesel:  { count: 0, current: 0 },   
        petrol:  { count: 0, current: 0 },  
        oxygen:  { count: 0, current: 0 },   
        methane: { count: 0, current: 0 },  
        co2:     { count: 0, current: 0 },   
        water:   { count: 0, current: 0 },  
      },
    },
    enemies: [
      { category:'Hazards',       name:'Sentinel Mine', count:  0},
      { category:'Small Enemies', name:'Sweetheart',    count:  0},
      { category:'Small Enemies', name:'Mosquito',      count:  0},
      { category:'Small Enemies', name:'Green Crawler', count:  0},
      { category:'Small Enemies', name:'Night Crawler', count:  0},
      { category:'Small Enemies', name:'Pink Slime',    count:  0},
      { category:'Small Enemies', name:'Red Slime',     count:  0},
      { category:'Large Enemies', name:'Roller Boi',    count:  0},
      { category:'Large Enemies', name:'Laser Bob',     count:  0},
      { category:'Large Enemies', name:'Talon Shark',   count:  0},
      { category:'Large Enemies', name:'Angel',         count:  0},
      { category:'Large Enemies', name:'Arch Angel',    count:  0},
    ],
  },
  
  {
    name:'Quarantine Stack Chorus', 
    longitude:147, 
    latitude:-32, 
    type:'RockySpire', 
    gameid:'QuarantineStackChorus',    
    info:["Quarantine Stack Chorus is a quarantine stack",'The "Rust Tag" paint can can be found here','The "Leaf Wall" paint can be found here','"Power Triode 108" can be Scanned here'],
    defaults: {
      notes:   [''],
      resources: [      
        
      ],
      tanks: { 
        battery: { count: 0, current: 0 },
        oil:     { count: 0, current: 0 },  
        diesel:  { count: 0, current: 0 },   
        petrol:  { count: 0, current: 0 },  
        oxygen:  { count: 0, current: 0 },   
        methane: { count: 0, current: 0 },  
        co2:     { count: 0, current: 0 },   
        water:   { count: 0, current: 0 },  
      },
    },
    enemies: [
      { category:'Hazards',       name:'Sentinel Mine', count:  0},
      { category:'Small Enemies', name:'Sweetheart',    count:  0},
      { category:'Small Enemies', name:'Mosquito',      count:  0},
      { category:'Small Enemies', name:'Green Crawler', count:  0},
      { category:'Small Enemies', name:'Night Crawler', count:  0},
      { category:'Small Enemies', name:'Pink Slime',    count:  0},
      { category:'Small Enemies', name:'Red Slime',     count:  0},
      { category:'Large Enemies', name:'Roller Boi',    count:  0},
      { category:'Large Enemies', name:'Laser Bob',     count:  0},
      { category:'Large Enemies', name:'Talon Shark',   count:  0},
      { category:'Large Enemies', name:'Angel',         count:  0},
      { category:'Large Enemies', name:'Arch Angel',    count:  0},
    ],
  },
  
  {
    name:'Quarantine Stack Dawn',   
    longitude:150, 
    latitude:-46, 
    type:'RockySpire', 
    gameid:'QuarantineStackDawn',    
    info:["Quarantine Stack Dawn is a quarantine stack",'The "Rust Tag" paint can can be found here','The "Leaf Wall" paint can be found here','"Power Triode 437" can be Scanned here'],
    defaults: {
      notes:   [''],
      resources: [      
        
      ],
      tanks: { 
        battery: { count: 0, current: 0 },
        oil:     { count: 0, current: 0 },  
        diesel:  { count: 0, current: 0 },   
        petrol:  { count: 0, current: 0 },  
        oxygen:  { count: 0, current: 0 },   
        methane: { count: 0, current: 0 },  
        co2:     { count: 0, current: 0 },   
        water:   { count: 0, current: 0 },  
      },
    },
    enemies: [
      { category:'Hazards',       name:'Sentinel Mine', count:  0},
      { category:'Small Enemies', name:'Sweetheart',    count:  0},
      { category:'Small Enemies', name:'Mosquito',      count:  0},
      { category:'Small Enemies', name:'Green Crawler', count:  0},
      { category:'Small Enemies', name:'Night Crawler', count:  0},
      { category:'Small Enemies', name:'Pink Slime',    count:  0},
      { category:'Small Enemies', name:'Red Slime',     count:  0},
      { category:'Large Enemies', name:'Roller Boi',    count:  0},
      { category:'Large Enemies', name:'Laser Bob',     count:  0},
      { category:'Large Enemies', name:'Talon Shark',   count:  0},
      { category:'Large Enemies', name:'Angel',         count:  0},
      { category:'Large Enemies', name:'Arch Angel',    count:  0},
    ],
  },
  
  {
    name:'Transposium',             
    longitude:112, 
    latitude:22,  
    type:'Maze',       
    gameid:'Maze1',    
    info:"Transposium is a maze puzzle location",
    defaults: {
      notes:   [''],
    },
    enemies: [
      { category:'Hazards',       name:'Sentinel Mine', count:  0},
      { category:'Small Enemies', name:'Sweetheart',    count:  0},
      { category:'Small Enemies', name:'Mosquito',      count:  0},
      { category:'Small Enemies', name:'Green Crawler', count:  0},
      { category:'Small Enemies', name:'Night Crawler', count:  0},
      { category:'Small Enemies', name:'Pink Slime',    count:  0},
      { category:'Small Enemies', name:'Red Slime',     count:  0},
      { category:'Large Enemies', name:'Roller Boi',    count:  0},
      { category:'Large Enemies', name:'Laser Bob',     count:  0},
      { category:'Large Enemies', name:'Talon Shark',   count:  0},
      { category:'Large Enemies', name:'Angel',         count:  0},
      { category:'Large Enemies', name:'Arch Angel',    count:  0},
    ],
  },
];

const _l = [
  
  {
    name:'Seed Reserve 01', 
    longitude:59,  
    latitude:10,  
    type:'SeedVault', 
    gameid:'SeedReserve_01',    
    info:"Seed Reserve 01 is an underwater seed reserve",
    defaults: {
      notes:   [''],
    }
  },
  
  {
    name:'Seed Reserve 02', 
    longitude:28,  
    latitude:-12, 
    type:'SeedVault', 
    gameid:'SeedReserve_02',    
    info:"Seed Reserve 02 is an underwater seed reserve",
    defaults: {
      notes:   [''],
    }
  },
  
  {
    name:'Seed Reserve 03', 
    longitude:118, 
    latitude:13,  
    type:'SeedVault', 
    gameid:'SeedReserve_03',    
    info:"Seed Reserve 03 is an underwater seed reserve",
    defaults: {
      notes:   [''],
    }
  },
  
  {
    name:'Seed Reserve 04', 
    longitude:57,  
    latitude:-14, 
    type:'SeedVault', 
    gameid:'SeedReserve_04',    
    info:"Seed Reserve 04 is an underwater seed reserve",
    defaults: {
      notes:   [''],
    }
  },
  
  {
    name:'Seed Reserve 05', 
    longitude:80,  
    latitude:-52, 
    type:'SeedVault', 
    gameid:'SeedReserve_05',    
    info:"Seed Reserve 05 is an underwater seed reserve",
    defaults: {
      notes:   [''],
    }
  },
  
  {
    name:'Seed Reserve 07', 
    longitude:111, 
    latitude:53,  
    type:'SeedVault', 
    gameid:'SeedReserve_07',    
    info:"Seed Reserve 07 is an underwater seed reserve",
    defaults: {
      notes:   [''],
    }
  },
  
  {
    name:'Seed Reserve 08', 
    longitude:57,  
    latitude:-41, 
    type:'SeedVault', 
    gameid:'SeedReserve_08',    
    info:"Seed Reserve 08 is an underwater seed reserve",
    defaults: {
      notes:   [''],
    }
  },
  
  {
    name:'Seed Reserve 09', 
    longitude:16,  
    latitude:15,  
    type:'SeedVault', 
    gameid:'SeedReserve_09',    
    info:"Seed Reserve 09 is an underwater seed reserve",
    defaults: {
      notes:   [''],
    }
  },
  
  {
    name:'Seed Reserve 10', 
    longitude:90,  
    latitude:51,  
    type:'SeedVault', 
    gameid:'SeedReserve_10',    
    info:"Seed Reserve 10 is an underwater seed reserve",
    defaults: {
      notes:   [''],
    }
  },
  
  {
    name:'Seed Reserve 11', 
    longitude:70,  
    latitude:-68, 
    type:'SeedVault', 
    gameid:'SeedReserve_11',    
    info:"Seed Reserve 11 is an underwater seed reserve",
    defaults: {
      notes:   [''],
    }
  },
  
  {
    name:'Seed Reserve 12', 
    longitude:79,  
    latitude:-6,  
    type:'SeedVault', 
    gameid:'SeedReserve_12',    
    info:"Seed Reserve 12 is an underwater seed reserve",
    defaults: {
      notes:   [''],
    }
  },
  
  {
    name:'Seed Reserve 13', 
    longitude:52,  
    latitude:-56, 
    type:'SeedVault', 
    gameid:'SeedReserve_13',    
    info:"Seed Reserve 13 is an underwater seed reserve",
    defaults: {
      notes:   [''],
    }
  },
  
  {
    name:'Seed Reserve 14', 
    longitude:40,  
    latitude:17,  
    type:'SeedVault', 
    gameid:'SeedReserve_14',    
    info:"Seed Reserve 14 is an underwater seed reserve",
    defaults: {
      notes:   [''],
    }
  },
  
  {
    name:'Seed Reserve 15', 
    longitude:96,  
    latitude:30,  
    type:'SeedVault', 
    gameid:'SeedReserve_15',    
    info:"Seed Reserve 15 is an underwater seed reserve",
    defaults: {
      notes:   [''],
    }
  },
  
  {
    name:'Seed Reserve 16', 
    longitude:87,  
    latitude:-36, 
    type:'SeedVault', 
    gameid:'SeedReserve_16',    
    info:"Seed Reserve 16 is an underwater seed reserve",
    defaults: {
      notes:   [''],
    }
  },
  
  {
    name:'Seed Reserve 20', 
    longitude:126, 
    latitude:35,  
    type:'SeedVault', 
    gameid:'SeedReserve_20',    
    info:"Seed Reserve 20 is an underwater seed reserve",
    defaults: {
      notes:   [''],
    }
  },
];

const _c = [
  
  {
    name:'Twin Tide',     
    longitude:110, 
    latitude:28,  
    type:'Cave', 
    gameid:'Cave07', 
    info:['Entrance at: 97m depth','Maximum diving depth at: 103m'],    
    defaults: {
      notes:   [''],
    },
    enemies: [
      { category:'Hazards',       name:'Sentinel Mine', count:  0},
      { category:'Small Enemies', name:'Sweetheart',    count:  0},
      { category:'Small Enemies', name:'Mosquito',      count:  0},
      { category:'Small Enemies', name:'Green Crawler', count:  0},
      { category:'Small Enemies', name:'Night Crawler', count:  0},
      { category:'Small Enemies', name:'Pink Slime',    count:  0},
      { category:'Small Enemies', name:'Red Slime',     count:  0},
      { category:'Large Enemies', name:'Roller Boi',    count:  0},
      { category:'Large Enemies', name:'Laser Bob',     count:  0},
      { category:'Large Enemies', name:'Talon Shark',   count:  0},
      { category:'Large Enemies', name:'Angel',         count:  0},
      { category:'Large Enemies', name:'Arch Angel',    count:  0},
    ],
  },
  
  {
    name:'North Lantern', 
    longitude:55,  
    latitude:-82, 
    type:'Cave', 
    gameid:'Cave04', 
    info:['Entrance at: 66m depth','Maximum diving depth at: 93m'],    
    defaults: {
      notes:   [''],
    },
    enemies: [
      { category:'Hazards',       name:'Sentinel Mine', count:  0},
      { category:'Small Enemies', name:'Sweetheart',    count:  0},
      { category:'Small Enemies', name:'Mosquito',      count:  0},
      { category:'Small Enemies', name:'Green Crawler', count:  0},
      { category:'Small Enemies', name:'Night Crawler', count:  0},
      { category:'Small Enemies', name:'Pink Slime',    count:  0},
      { category:'Small Enemies', name:'Red Slime',     count:  0},
      { category:'Large Enemies', name:'Roller Boi',    count:  0},
      { category:'Large Enemies', name:'Laser Bob',     count:  0},
      { category:'Large Enemies', name:'Talon Shark',   count:  0},
      { category:'Large Enemies', name:'Angel',         count:  0},
      { category:'Large Enemies', name:'Arch Angel',    count:  0},
    ],
  },
  
  {
    name:'Grey Mouth',    
    longitude:110, 
    latitude:4,   
    type:'Cave', 
    gameid:'Cave02', 
    info:['Entrance at: 200m depth','Maximum diving depth at: 200m'],    
    defaults: {
      notes:   [''],
    },
    enemies: [
      { category:'Hazards',       name:'Sentinel Mine', count:  0},
      { category:'Small Enemies', name:'Sweetheart',    count:  0},
      { category:'Small Enemies', name:'Mosquito',      count:  0},
      { category:'Small Enemies', name:'Green Crawler', count:  0},
      { category:'Small Enemies', name:'Night Crawler', count:  0},
      { category:'Small Enemies', name:'Pink Slime',    count:  0},
      { category:'Small Enemies', name:'Red Slime',     count:  0},
      { category:'Large Enemies', name:'Roller Boi',    count:  0},
      { category:'Large Enemies', name:'Laser Bob',     count:  0},
      { category:'Large Enemies', name:'Talon Shark',   count:  0},
      { category:'Large Enemies', name:'Angel',         count:  0},
      { category:'Large Enemies', name:'Arch Angel',    count:  0},
    ],
  },
  
  {
    name:'South Echo',    
    longitude:75,  
    latitude:38,  
    type:'Cave', 
    gameid:'Cave05', 
    info:['Entrance at: 94m depth','Maximum diving depth at: 94m'],    
    defaults: {
      notes:   [''],
    },
    enemies: [
      { category:'Hazards',       name:'Sentinel Mine', count:  0},
      { category:'Small Enemies', name:'Sweetheart',    count:  0},
      { category:'Small Enemies', name:'Mosquito',      count:  0},
      { category:'Small Enemies', name:'Green Crawler', count:  0},
      { category:'Small Enemies', name:'Night Crawler', count:  0},
      { category:'Small Enemies', name:'Pink Slime',    count:  0},
      { category:'Small Enemies', name:'Red Slime',     count:  0},
      { category:'Large Enemies', name:'Roller Boi',    count:  0},
      { category:'Large Enemies', name:'Laser Bob',     count:  0},
      { category:'Large Enemies', name:'Talon Shark',   count:  0},
      { category:'Large Enemies', name:'Angel',         count:  0},
      { category:'Large Enemies', name:'Arch Angel',    count:  0},
    ],
  },
  
  {
    name:'Deep Silence',  
    longitude:49,  
    latitude:-20, 
    type:'Cave', 
    gameid:'Cave06', 
    info:['Entrance at: 110m depth','Maximum diving depth at: 170m'],    
    defaults: {
      notes:   [''],
    },
    enemies: [
      { category:'Hazards',       name:'Sentinel Mine', count:  0},
      { category:'Small Enemies', name:'Sweetheart',    count:  0},
      { category:'Small Enemies', name:'Mosquito',      count:  0},
      { category:'Small Enemies', name:'Green Crawler', count:  0},
      { category:'Small Enemies', name:'Night Crawler', count:  0},
      { category:'Small Enemies', name:'Pink Slime',    count:  0},
      { category:'Small Enemies', name:'Red Slime',     count:  0},
      { category:'Large Enemies', name:'Roller Boi',    count:  0},
      { category:'Large Enemies', name:'Laser Bob',     count:  0},
      { category:'Large Enemies', name:'Talon Shark',   count:  0},
      { category:'Large Enemies', name:'Angel',         count:  0},
      { category:'Large Enemies', name:'Arch Angel',    count:  0},
    ],
  },
  
  {
    name:'Far Horizon',   
    longitude:134, 
    latitude:55,  
    type:'Cave', 
    gameid:'Cave03', 
    info:['Entrance at: 137m depth','Maximum diving depth at: 170m'],    
    defaults: {
      notes:   [''],
    },
    enemies: [
      { category:'Hazards',       name:'Sentinel Mine', count:  0},
      { category:'Small Enemies', name:'Sweetheart',    count:  0},
      { category:'Small Enemies', name:'Mosquito',      count:  0},
      { category:'Small Enemies', name:'Green Crawler', count:  0},
      { category:'Small Enemies', name:'Night Crawler', count:  0},
      { category:'Small Enemies', name:'Pink Slime',    count:  0},
      { category:'Small Enemies', name:'Red Slime',     count:  0},
      { category:'Large Enemies', name:'Roller Boi',    count:  0},
      { category:'Large Enemies', name:'Laser Bob',     count:  0},
      { category:'Large Enemies', name:'Talon Shark',   count:  0},
      { category:'Large Enemies', name:'Angel',         count:  0},
      { category:'Large Enemies', name:'Arch Angel',    count:  0},
    ],
  },
  
  {
    name:'First Whisper', 
    longitude:9,   
    latitude:5,   
    type:'Cave', 
    gameid:'Cave01', 
    info:['Entrance at: 80m depth','Maximum diving depth at: 80m'],    
    defaults: {
      notes:   [''],
    },
    enemies: [
      { category:'Hazards',       name:'Sentinel Mine', count:  0},
      { category:'Small Enemies', name:'Sweetheart',    count:  0},
      { category:'Small Enemies', name:'Mosquito',      count:  0},
      { category:'Small Enemies', name:'Green Crawler', count:  0},
      { category:'Small Enemies', name:'Night Crawler', count:  0},
      { category:'Small Enemies', name:'Pink Slime',    count:  0},
      { category:'Small Enemies', name:'Red Slime',     count:  0},
      { category:'Large Enemies', name:'Roller Boi',    count:  0},
      { category:'Large Enemies', name:'Laser Bob',     count:  0},
      { category:'Large Enemies', name:'Talon Shark',   count:  0},
      { category:'Large Enemies', name:'Angel',         count:  0},
      { category:'Large Enemies', name:'Arch Angel',    count:  0},
    ],
  },
];

const LOCATIONS = [
  ..._r.map(x => _loc(x,'z1',false)),
  ..._h.map(x => _loc(x,'z1',true)),
  ..._l.map(x => _loc(x,'z1',false)),
  ..._c.map(x => _loc(x,'z1',false)),
];

window.TLC_ZONES          = ZONES;
window.TLC_LOCATION_TYPES = LOCATION_TYPES;
window.TLC_LOCATIONS      = LOCATIONS;
window.TLC_LOC_BY_ID      = (id) => LOCATIONS.find(l => l.id === id || l.gameid === id);
window.TLC_LOCS_FOR_ZONE  = (zoneId) => LOCATIONS.filter(l => l.zone === zoneId);
