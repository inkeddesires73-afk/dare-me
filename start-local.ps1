$projectFolder = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location -LiteralPath $projectFolder
Write-Host "Dare Me körs på http://localhost:8765"
python -m http.server 8765
