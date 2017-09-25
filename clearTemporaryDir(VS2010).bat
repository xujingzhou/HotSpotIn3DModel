rem clear the temporary directory for VS2010. Added by Johnny Xu,2017/8/2

@echo off 

set curdir=%~dp0
cd /d %curdir%
 
del /q/a/f/s *.db
del /q/a/f/s *.pdb
del /q/a/f/s *.ilk
del /q/a/f/s *.sdf

for /f "delims=" %%i in ('dir /ad /b /s ".vs" "Win32" "ipch" "GeneratedFiles"') do (
	
	rd /s /q "%%i"
	echo deleted "%%i"
)

for /f "delims=" %%i in ('dir /b /s "common\Release" ') do (
	
	del /s /a /q "%%i"
	rd /s /q "%%i"
	echo "%%i"
)

rd /s /q "ipch" "common\Release" "common\Debug"

echo clear work has finished!

pause
