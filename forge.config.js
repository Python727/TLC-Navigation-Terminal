
module.exports = {
  packagerConfig: {
    icon: './src/data/Images/tlcmap',
    asar: true
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'tlcmap',
        icon: './src/data/Images/tlcmap.ico',
        setupIcon: './src/data/Images/tlcmap.ico'
      }
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
  ],
  extraResources: [
    {
      from: 'src/defaults',
      to: 'assets'
    }
  ],
  asarUnpack: [
  "**/assets/**"
  ],
};
