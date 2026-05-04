Add-Type -AssemblyName System.Drawing

$sourceFile = Get-ChildItem -LiteralPath "C:\Users\owner\Downloads" -Filter "*17_50_19.png" | Select-Object -First 1
if (-not $sourceFile) {
  throw "Source sprite sheet was not found in Downloads."
}
$sourcePath = $sourceFile.FullName
$outDir = Join-Path (Get-Location) "assets\sprites"
$sourceDir = Join-Path (Get-Location) "assets\source"
New-Item -ItemType Directory -Force -Path $outDir, $sourceDir | Out-Null

function Save-Crop {
  param(
    [System.Drawing.Bitmap]$Source,
    [string]$Name,
    [int]$X,
    [int]$Y,
    [int]$W,
    [int]$H,
    [int]$Pad = 18
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
  $dy = [int](256 - $dh - 14)

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

  $path = Join-Path $outDir "$Name.png"
  $canvas.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $canvas.Dispose()
}

function Save-Placeholder {
  param([string]$Name, [string]$Text, [System.Drawing.Color]$Color)
  $bmp = New-Object System.Drawing.Bitmap 256, 256, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.Clear([System.Drawing.Color]::Transparent)
  $brush = New-Object System.Drawing.SolidBrush $Color
  $g.FillEllipse($brush, 38, 42, 180, 180)
  $font = New-Object System.Drawing.Font "Yu Gothic UI", 20, ([System.Drawing.FontStyle]::Bold)
  $textBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::White)
  $format = New-Object System.Drawing.StringFormat
  $format.Alignment = [System.Drawing.StringAlignment]::Center
  $format.LineAlignment = [System.Drawing.StringAlignment]::Center
  $rect = New-Object System.Drawing.RectangleF 22, 88, 212, 80
  $g.DrawString($Text, $font, $textBrush, $rect, $format)
  $g.Dispose()
  $bmp.Save((Join-Path $outDir "$Name.png"), [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose()
}

$src = [System.Drawing.Bitmap]::FromFile($sourcePath)

$crops = @(
  @("rider_a_idle", 22, 78, 132, 250), @("rider_a_attack", 170, 104, 216, 215), @("rider_a_damage", 397, 117, 107, 204),
  @("rider_b_idle", 553, 93, 122, 232), @("rider_b_attack", 686, 95, 208, 225), @("rider_b_damage", 888, 115, 100, 208),
  @("rider_c_idle", 1040, 83, 129, 242), @("rider_c_attack", 1182, 103, 211, 218), @("rider_c_damage", 1391, 117, 101, 205),
  @("monster_a_idle", 22, 454, 165, 202), @("monster_a_attack", 179, 460, 219, 195), @("monster_a_damage", 400, 472, 120, 182),
  @("monster_b_idle", 532, 462, 163, 192), @("monster_b_attack", 685, 431, 224, 224), @("monster_b_damage", 878, 470, 107, 186),
  @("monster_c_idle", 1043, 450, 157, 207), @("monster_c_attack", 1213, 417, 196, 245), @("monster_c_damage", 1395, 458, 102, 195),
  @("enemy_idle", 38, 760, 438, 238), @("enemy_attack", 496, 711, 474, 289), @("enemy_damage", 1054, 748, 434, 247)
)

foreach ($crop in $crops) {
  Save-Crop $src $crop[0] $crop[1] $crop[2] $crop[3] $crop[4]
}

Save-Placeholder "placeholder_rider" "RIDER" ([System.Drawing.Color]::FromArgb(255, 46, 89, 139))
Save-Placeholder "placeholder_monster" "OTOMON" ([System.Drawing.Color]::FromArgb(255, 192, 84, 38))
Save-Placeholder "placeholder_enemy" "ENEMY" ([System.Drawing.Color]::FromArgb(255, 61, 43, 43))

$bg = New-Object System.Drawing.Bitmap 1280, 720, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($bg)
$g.Clear([System.Drawing.Color]::FromArgb(255, 201, 224, 190))
$sky = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
  (New-Object System.Drawing.Rectangle 0, 0, 1280, 720),
  [System.Drawing.Color]::FromArgb(255, 151, 207, 233),
  [System.Drawing.Color]::FromArgb(255, 245, 230, 189),
  [System.Drawing.Drawing2D.LinearGradientMode]::Vertical
)
$g.FillRectangle($sky, 0, 0, 1280, 720)
$hill = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 105, 157, 98))
$g.FillEllipse($hill, -170, 390, 900, 300)
$g.FillEllipse($hill, 560, 380, 900, 310)
$ground = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 176, 151, 104))
$g.FillRectangle($ground, 0, 560, 1280, 160)
$g.Dispose()
$bg.Save((Join-Path $sourceDir "battle_bg.png"), [System.Drawing.Imaging.ImageFormat]::Png)
$bg.Dispose()
$src.Dispose()
