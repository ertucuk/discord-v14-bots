const { Server } = require('./Global/Settings/System');
module.exports = {

    apps: [
      {
        name: `${Server} Voucher`,
        namespace: `ertucuk`,
        script: "Ertu.js",
        watch: false,
        exec_mode: "cluster",
        max_memory_restart: "2G",
        cwd: "./Server/Ertu-Main/Registery",
      },
      {
        name: `${Server} Welcomes`,
        namespace: `ertucuk`,
        script: "ertu.js",
        watch: false,
        exec_mode: "cluster",
        max_memory_restart: "2G",
        cwd: "./Server/Ertu-Welcome/",
      },
      {
        name: `${Server} GuardOne`,
        namespace: `ertucuk`,
        script: "main.js",
        watch: false,
        exec_mode: "cluster",
        max_memory_restart: "2G",
        cwd: "./Server/Ertu-Guard/Guard",
      },
      {
        name: `${Server} GuardTwo`,
        namespace: `ertucuk`,
        script: "main.js",
        watch: false,
        exec_mode: "cluster",
        max_memory_restart: "2G",
        cwd: "./Server/Ertu-Guard/GuardTwo",
      },
      {
        name: `${Server} GuardThree`,
        namespace: `ertucuk`,
        script: "main.js",
        watch: false,
        exec_mode: "cluster",
        max_memory_restart: "2G",
        cwd: "./Server/Ertu-Guard/GuardThree",
      },
      {
        name: `${Server} Moderation`,
        namespace: `ertucuk`,
        script: "Ertu.js",
        watch: false,
        exec_mode: "cluster",
        max_memory_restart: "2G",
        cwd: "./Server/Ertu-Main/Supervisor",
      },
    ]
  };

  //  {
  //   name: Settings.Server + "-Welcomes",
  //   namespace: "Vante",
  //   script: 'Vante.js',
  //   watch: false,
  //   exec_mode: "cluster",
  //   max_memory_restart: "2G",
  //   cwd: "./Vante-Bots/Vante-Welcomes",
  //   args: ["--color", "--watch"]
  // },
  