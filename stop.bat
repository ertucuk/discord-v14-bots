echo off
color d
cls
:a
pm2 stop ecosystem.config.js
goto a