@echo off
setlocal enabledelayedexpansion

REM Batch convert all jpg/jpeg/png in this folder to WebP
for %%i in (*.jpg *.jpeg *.png) do (
    echo Converting: %%i
    cwebp -q 60 "%%i" -o "%%~ni.webp"
)

echo.
echo ✅ Conversion complete! All JPG/PNG converted to WebP.
pause
