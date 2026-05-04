Add-Type -AssemblyName System.Drawing

$sourceFile = Get-ChildItem -LiteralPath "C:\Users\owner\Downloads" -Filter "*.png" |
  Where-Object { $_.Length -eq 2086886 } |
  Select-Object -First 1
if (-not $sourceFile) {
  throw "岩龍・パラサイト.png was not found in Downloads."
}

$outDir = Join-Path (Get-Location) "assets\sprites"
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

function Save-Crop {
  param(
    [System.Drawing.Bitmap]$Source,
    [string]$Name,
    [int]$X,
    [int]$Y,
    [int]$W,
    [int]$H,
    [int]$Pad = 10
  )

  $canvas = New-Object System.Drawing.Bitmap 256, 256, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $g = [System.Drawing.Graphics]::FromImage($canvas)
  $g.Clear([System.Drawing.Color]::Transparent)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

  $scale = [Math]::Min((256 - ($Pad * 2)) / $W, (256 - ($Pad * 2)) / $H)
  $dw = [int]($W * $scale)
  $dh = [int]($H * $scale)
  $dx = [int]((256 - $dw) / 2)
  $dy = [int](256 - $dh - 10)

  $srcRect = New-Object System.Drawing.Rectangle $X, $Y, $W, $H
  $dstRect = New-Object System.Drawing.Rectangle $dx, $dy, $dw, $dh
  $g.DrawImage($Source, $dstRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
  $g.Dispose()

  for ($py = 0; $py -lt 256; $py++) {
    for ($px = 0; $px -lt 256; $px++) {
      $c = $canvas.GetPixel($px, $py)
      if ($c.R -gt 225 -and $c.G -gt 225 -and $c.B -gt 220) {
        $canvas.SetPixel($px, $py, [System.Drawing.Color]::FromArgb(0, $c.R, $c.G, $c.B))
      }
    }
  }

  $canvas.Save((Join-Path $outDir "$Name.png"), [System.Drawing.Imaging.ImageFormat]::Png)
  $canvas.Dispose()
}

$src = [System.Drawing.Bitmap]::FromFile($sourceFile.FullName)

$crops = @(
  @("rock_enemy_idle", 52, 112, 374, 326),
  @("rock_enemy_attack", 472, 120, 548, 318),
  @("rock_enemy_damage", 1054, 164, 446, 270),
  @("parasite_enemy_idle", 26, 640, 424, 284),
  @("parasite_enemy_attack", 486, 636, 548, 302),
  @("parasite_enemy_damage", 1116, 674, 402, 254)
)

foreach ($crop in $crops) {
  Save-Crop $src $crop[0] $crop[1] $crop[2] $crop[3] $crop[4]
}

$src.Dispose()
