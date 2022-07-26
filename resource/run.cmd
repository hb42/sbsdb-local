@echo off
set ELECTRON_NO_ATTACH_CONSOLE=true
start "SBSDB" "%~dp0SBSDB.exe"

rem Alternativ start als Admin-User
rem runas /user:v998dpve\a%username:~1,7% "%~dp0SBSDB.exe"
