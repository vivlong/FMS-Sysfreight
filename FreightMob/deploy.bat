@echo on

xcopy /y/e/s www \\192.168.0.230\wwwroot\mobileapp\www
copy /y index.html \\192.168.0.230\wwwroot\mobileapp\
copy /y update.json \\192.168.0.230\wwwroot\mobileapp\
copy /y FreightApp.apk \\192.168.0.230\wwwroot\mobileapp\FreightApp.apk
del FreightApp.apk /f /q

pause 