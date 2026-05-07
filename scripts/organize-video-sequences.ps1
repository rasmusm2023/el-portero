param(
  [string]$Root = "public\assets\videos",
  [string[]]$Sequences = @("hero-sequence", "events-sequence"),
  [switch]$GenerateMp4 = $true
)

$ErrorActionPreference = "Stop"

function Ensure-Dir([string]$Path) {
  if (-not (Test-Path -LiteralPath $Path)) {
    New-Item -ItemType Directory -Path $Path | Out-Null
  }
}

function Get-ClipIndex([string]$Name) {
  if ($Name -match '^clip-(\d+)$') { return [int]$Matches[1] }
  return $null
}

function Get-MaxClipIndex([string]$SequencePath) {
  if (-not (Test-Path -LiteralPath $SequencePath)) { return 0 }
  $max = 0
  Get-ChildItem -LiteralPath $SequencePath -Directory |
    ForEach-Object {
      $idx = Get-ClipIndex $_.Name
      if ($idx -ne $null -and $idx -gt $max) { $max = $idx }
    }
  return $max
}

function Normalize-ExistingClipFolder([string]$ClipFolder) {
  if (-not (Test-Path -LiteralPath $ClipFolder)) { return }

  $webm = Get-ChildItem -LiteralPath $ClipFolder -File -Filter "*.webm" -ErrorAction SilentlyContinue | Select-Object -First 1
  $mp4  = Get-ChildItem -LiteralPath $ClipFolder -File -Filter "*.mp4"  -ErrorAction SilentlyContinue | Select-Object -First 1
  $webp = Get-ChildItem -LiteralPath $ClipFolder -File -Filter "*.webp" -ErrorAction SilentlyContinue | Select-Object -First 1

  if ($webm -and $webm.Name -ne "video.webm") {
    Rename-Item -LiteralPath $webm.FullName -NewName "video.webm"
  }
  if ($mp4 -and $mp4.Name -ne "video.mp4") {
    Rename-Item -LiteralPath $mp4.FullName -NewName "video.mp4"
  }
  if ($webp -and $webp.Name -ne "poster.webp") {
    Rename-Item -LiteralPath $webp.FullName -NewName "poster.webp"
  }
}

function Convert-WebmToMp4([string]$WebmPath, [string]$Mp4Path) {
  if (Test-Path -LiteralPath $Mp4Path) { return }

  # map audio optionally (0:a?) so clips without audio still convert
  $args = @(
    "-y",
    "-i", $WebmPath,
    "-map", "0:v:0",
    "-map", "0:a?",
    "-c:v", "libx264",
    "-crf", "23",
    "-preset", "medium",
    "-pix_fmt", "yuv420p",
    "-movflags", "+faststart",
    "-c:a", "aac",
    "-b:a", "128k",
    $Mp4Path
  )

  & ffmpeg @args | Out-Null
  if ($LASTEXITCODE -ne 0) {
    throw "ffmpeg failed converting `"$WebmPath`" -> `"$Mp4Path`""
  }
}

function Ensure-Poster([string]$ClipFolder) {
  $poster = Join-Path $ClipFolder "poster.webp"
  if (Test-Path -LiteralPath $poster) { return }

  $webm = Join-Path $ClipFolder "video.webm"
  if (-not (Test-Path -LiteralPath $webm)) {
    $mp4 = Join-Path $ClipFolder "video.mp4"
    if (Test-Path -LiteralPath $mp4) {
      $webm = $mp4
    } else {
      return
    }
  }

  $args = @(
    "-y",
    "-ss", "00:00:01",
    "-i", $webm,
    "-frames:v", "1",
    "-vf", "scale=1280:-2",
    $poster
  )
  & ffmpeg @args | Out-Null
}

Ensure-Dir $Root

foreach ($seq in $Sequences) {
  $sequencePath = Join-Path $Root $seq
  Ensure-Dir $sequencePath

  # Normalize existing clip-* folders
  Get-ChildItem -LiteralPath $sequencePath -Directory -ErrorAction SilentlyContinue |
    Where-Object { $_.Name -match '^clip-\d+$' } |
    ForEach-Object { Normalize-ExistingClipFolder $_.FullName }

  $clipsToUse = Join-Path $sequencePath "clips-to-use"
  if (Test-Path -LiteralPath $clipsToUse) {
    $max = Get-MaxClipIndex $sequencePath
    $webms = Get-ChildItem -LiteralPath $clipsToUse -File -Filter "*.webm" | Sort-Object Name
    foreach ($f in $webms) {
      $max += 1
      $clipFolder = Join-Path $sequencePath ("clip-$max")
      Ensure-Dir $clipFolder
      $targetWebm = Join-Path $clipFolder "video.webm"

      Move-Item -LiteralPath $f.FullName -Destination $targetWebm

      if ($GenerateMp4) {
        $targetMp4 = Join-Path $clipFolder "video.mp4"
        Convert-WebmToMp4 $targetWebm $targetMp4
      }
    }
  }

  # Ensure poster for clip-1 only
  $clip1 = Join-Path $sequencePath "clip-1"
  if (Test-Path -LiteralPath $clip1) {
    Normalize-ExistingClipFolder $clip1
    Ensure-Poster $clip1
  }
}

Write-Host "Done organizing video sequences under $Root"

