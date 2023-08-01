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
        name: `${Server} Statistics`,
        namespace: `ertucuk`,
        script: "Ertu.js",
        watch: false,
        exec_mode: "cluster",
        max_memory_restart: "2G",
        cwd: "./Server/Ertu-Main/Statistics",
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
        script: "ertu.js",
        watch: false,
        exec_mode: "cluster",
        max_memory_restart: "2G",
        cwd: "./Server/Ertu-Security/SecurityOne",
      },
      {
        name: `${Server} GuardTwo`,
        namespace: `ertucuk`,
        script: "ertu.js",
        watch: false,
        exec_mode: "cluster",
        max_memory_restart: "2G",
        cwd: "./Server/Ertu-Security/SecurityTwo",
      },
      {
        name: `${Server} GuardThree`,
        namespace: `ertucuk`,
        script: "ertu.js",
        watch: false,
        exec_mode: "cluster",
        max_memory_restart: "2G",
        cwd: "./Server/Ertu-Security/SecurityThree",
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
  