$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
& node run.mjs preview-product
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
