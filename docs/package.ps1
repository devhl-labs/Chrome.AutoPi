$root = Resolve-Path -Path "$PSScriptRoot/.."

$manifest = (Get-Content "$root\manifest.json" -Raw) | ConvertFrom-Json

$version = $manifest.PSObject.Properties.Where({$_.Name -eq "version"}).Value

Compress-Archive -Path @("$root\src", "$root\manifest.json") -DestinationPath "$root\bin\V$version.zip"
