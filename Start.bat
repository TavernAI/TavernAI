cmd /c PowerShell -ExecutionPolicy  Unrestricted -Command " {dir | Unblock-File}"
cmd /c PowerShell -ExecutionPolicy  Unrestricted -NoExit -Command "& {.\Start.ps1}"
Pause
