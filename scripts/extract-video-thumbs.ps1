param(
  [Parameter(Mandatory = $true)]
  [string]$SequencePath,
  [Parameter(Mandatory = $true)]
  [string]$OutDir,
  [int[]]$Clips = @()
)

$ErrorActionPreference = "Stop"

function Ensure-Dir([string]$Path) {
  if (-not (Test-Path -LiteralPath $Path)) {
    New-Item -ItemType Directory -Force -Path $Path | Out-Null
  }
}

Ensure-Dir $OutDir

if ($Clips.Count -eq 0) {
  $Clips = Get-ChildItem -LiteralPath $SequencePath -Directory |
    Where-Object { $_.Name -match '^clip-\d+$' } |
    ForEach-Object { [int]($_.Name -replace 'clip-','') } |
    Sort-Object
}

foreach ($c in $Clips) {
  $clipFolder = Join-Path $SequencePath ("clip-$c")
  if (-not (Test-Path -LiteralPath $clipFolder)) { continue }

  $mp4 = Join-Path $clipFolder "video.mp4"
  $webm = Join-Path $clipFolder "video.webm"
  $src = if (Test-Path -LiteralPath $mp4) { $mp4 } elseif (Test-Path -LiteralPath $webm) { $webm } else { $null }
  if (-not $src) { continue }

  $out = Join-Path $OutDir ("clip-$c.png")

  & ffmpeg -y -hide_banner -loglevel error -ss 00:00:01 -i $src -frames:v 1 -vf "scale=640:-2" $out | Out-Null
}

Write-Host "Wrote thumbs to $OutDir"

