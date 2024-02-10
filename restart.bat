echo off
color d
cls
:a
pm2 restart ecosystem.config.js
goto a