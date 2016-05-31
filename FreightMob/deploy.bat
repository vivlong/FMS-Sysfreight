@echo on
set target="\\192.168.0.230\wwwroot\app\fms\basic"
xcopy /y/e/s www %target%\www
pause 
copy /y index.html %target%
copy /y update.json %target%
copy /y AppFms.apk %target%\AppFms.apk
del AppFms.apk /f /q
pause 