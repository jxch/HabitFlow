# build-docker-enhanced.ps1

param(
    [string]$Registry = "jxch",
    [string]$ImageName = "habit",
    [string]$Directory = ".",
    [switch]$NoPush,
    [ValidateSet("auto", "force", "none")]
    [string]$Proxy = "auto",
    [switch]$Help
)

if ($Help) {
    Write-Host @"
用法: .\build-docker.ps1 [参数]

参数:
  -Registry <string>    Docker 镜像仓库前缀 (默认: jxch)
  -ImageName <string>   镜像名称 (默认: habit)
  -Directory <string>   项目目录路径 (默认: . 当前目录)
  -NoPush               只构建不推送
  -Proxy <string>       代理模式: auto|force|none (默认: auto)
                        auto: 自动检测是否需要代理
                        force: 强制使用 proxychains
                        none: 不使用代理
  -Help                 显示帮助信息

示例:
  .\build-docker.ps1                                    # 当前目录
  .\build-docker.ps1 -Directory "C:\Projects\myapp"     # 指定目录
  .\build-docker.ps1 -Directory "..\another-project"    # 相对路径
  .\build-docker.ps1 -Proxy force                       # 强制使用代理
  .\build-docker.ps1 -Proxy none                        # 不使用代理
  .\build-docker.ps1 -Registry myregistry -ImageName myapp -Directory ".\projects\app1"
  .\build-docker.ps1 -NoPush -Proxy force -Directory "D:\workspace\vue-app"
"@
    exit 0
}

# 解析并验证目录路径
$targetDirectory = Resolve-Path $Directory -ErrorAction SilentlyContinue
if (-not $targetDirectory) {
    Write-Host "错误: 指定的目录不存在: $Directory" -ForegroundColor Red
    exit 1
}

$targetDirectory = $targetDirectory.Path
Write-Host "目标目录: $targetDirectory" -ForegroundColor Blue

# 检查目标目录是否存在 package.json
$packageJsonPath = Join-Path $targetDirectory "package.json"
if (-not (Test-Path $packageJsonPath)) {
    Write-Host "错误: 在目录 '$targetDirectory' 下未找到 package.json 文件" -ForegroundColor Red
    exit 1
}

# 检查目标目录是否存在 Dockerfile
$dockerfilePath = Join-Path $targetDirectory "Dockerfile"
if (-not (Test-Path $dockerfilePath)) {
    Write-Host "错误: 在目录 '$targetDirectory' 下未找到 Dockerfile 文件" -ForegroundColor Red
    exit 1
}

# 读取 package.json 中的版本号
try {
    $packageJson = Get-Content -Path $packageJsonPath -Raw | ConvertFrom-Json
    $version = $packageJson.version
    $name = $packageJson.name

    Write-Host "`n项目信息:" -ForegroundColor Blue
    Write-Host "  名称: $name" -ForegroundColor White
    Write-Host "  版本: $version" -ForegroundColor White
    Write-Host "  路径: $targetDirectory" -ForegroundColor White
} catch {
    Write-Host "错误: 无法读取或解析 package.json" -ForegroundColor Red
    Write-Host "错误详情: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 如果用户没有指定 ImageName，尝试从 package.json 中获取
if ($ImageName -eq "habit" -and $name) {
    $ImageName = $name
    Write-Host "从 package.json 中读取镜像名称: $ImageName" -ForegroundColor Cyan
}

# 检查是否需要使用代理
function Test-NeedProxy {
    # 检查是否在中国大陆（通过常见的网络环境判断）
    try {
        # 尝试访问 Docker Hub
        $testResult = Test-NetConnection registry-1.docker.io -Port 443 -InformationLevel Quiet -WarningAction SilentlyContinue
        return -not $testResult
    } catch {
        return $true
    }
}

# 确定代理策略
$useProxyCommand = $false

switch ($Proxy) {
    "force" {
        $useProxyCommand = $true
        Write-Host "代理策略: 强制使用代理" -ForegroundColor Magenta
    }
    "none" {
        $useProxyCommand = $false
        Write-Host "代理策略: 不使用代理" -ForegroundColor White
    }
    "auto" {
        Write-Host "代理策略: 自动检测..." -ForegroundColor Cyan
        if (Test-NeedProxy) {
            $useProxyCommand = $true
            Write-Host "检测结果: 需要使用代理" -ForegroundColor Yellow
        } else {
            $useProxyCommand = $false
            Write-Host "检测结果: 网络连接正常，不使用代理" -ForegroundColor Green
        }
    }
}

# 如果需要使用代理，检查 proxychains 是否可用
if ($useProxyCommand) {
    try {
        $null = Get-Command proxychains -ErrorAction Stop
        Write-Host "代理工具: proxychains 可用" -ForegroundColor Green
    } catch {
        Write-Host "错误: 需要使用代理但未找到 proxychains 命令" -ForegroundColor Red
        Write-Host "请安装 proxychains 或使用 -Proxy none 参数" -ForegroundColor Yellow
        exit 1
    }
}

# 生成时间戳标签
$timestamp = Get-Date -Format 'yyyyMMddHHmm'

# 构建标签列表
$imageTags = @(
    "$Registry/${ImageName}:$version",
    "$Registry/${ImageName}:$timestamp",
    "$Registry/${ImageName}:latest"
)

# 保存当前目录
$originalDirectory = Get-Location

# 切换到目标目录
Set-Location $targetDirectory

try {
    # 构建 docker buildx 命令
    $buildArgs = @(
        "docker", "buildx", "build",
        "--platform=linux/arm64,linux/amd64"
    )

    # 添加所有标签
    foreach ($tag in $imageTags) {
        $buildArgs += "-t", $tag
    }

    # 添加构建上下文（当前目录，因为已经切换到目标目录）
    $buildArgs += "."

    # 如果不是 NoPush 模式，添加 --push
    if (-not $NoPush) {
        $buildArgs += "--push"
    }

    # 构建最终执行命令
    if ($useProxyCommand) {
        $finalCommand = @("proxychains") + $buildArgs
        $commandPrefix = "proxychains "
    } else {
        $finalCommand = $buildArgs
        $commandPrefix = ""
    }

    # 显示构建信息
    Write-Host "`n" + "=" * 60 -ForegroundColor Blue
    Write-Host "开始构建 Docker 镜像" -ForegroundColor Blue
    Write-Host "=" * 60 -ForegroundColor Blue

    Write-Host "`n构建配置:" -ForegroundColor Cyan
    Write-Host "  工作目录: $targetDirectory" -ForegroundColor Gray
    Write-Host "  仓库: $Registry" -ForegroundColor Gray
    Write-Host "  镜像: $ImageName" -ForegroundColor Gray
    Write-Host "  版本: $version" -ForegroundColor Gray
    Write-Host "  时间戳: $timestamp" -ForegroundColor Gray

    Write-Host "`n构建标签:" -ForegroundColor Cyan
    foreach ($tag in $imageTags) {
        Write-Host "  - $tag" -ForegroundColor Gray
    }

    Write-Host "`n构建选项:" -ForegroundColor Cyan
    if ($NoPush) {
        Write-Host "  模式: 仅构建 (不推送)" -ForegroundColor Yellow
    } else {
        Write-Host "  模式: 构建并推送" -ForegroundColor Green
    }

    if ($useProxyCommand) {
        Write-Host "  网络: 使用代理 (proxychains)" -ForegroundColor Magenta
    } else {
        Write-Host "  网络: 直连" -ForegroundColor White
    }

    Write-Host "  平台: linux/arm64, linux/amd64" -ForegroundColor Gray

    Write-Host "`n执行命令:" -ForegroundColor White
    Write-Host "$commandPrefix$($buildArgs -join ' ')" -ForegroundColor Gray
    Write-Host "在目录: $targetDirectory" -ForegroundColor Gray

    # 确认执行
    Write-Host "`n按任意键开始构建，或 Ctrl+C 取消..." -ForegroundColor Yellow
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

    Write-Host "`n开始执行..." -ForegroundColor Blue

    # 记录开始时间
    $startTime = Get-Date

    # 执行构建
    if ($useProxyCommand) {
        & proxychains @buildArgs
    } else {
        & @buildArgs
    }

    # 计算耗时
    $endTime = Get-Date
    $duration = $endTime - $startTime

    # 检查结果
    Write-Host "`n" + "=" * 60 -ForegroundColor Blue
    if ($LASTEXITCODE -eq 0) {
        Write-Host "构建完成! ✓" -ForegroundColor Green
        Write-Host "耗时: $($duration.ToString('mm\:ss'))" -ForegroundColor Cyan

        if (-not $NoPush) {
            Write-Host "镜像已推送到仓库" -ForegroundColor Green
        }

        Write-Host "`n成功构建的标签:" -ForegroundColor White
        foreach ($tag in $imageTags) {
            Write-Host "  ✓ $tag" -ForegroundColor Green
        }

        Write-Host "`n使用方法:" -ForegroundColor Cyan
        Write-Host "  docker run -d -p 8080:80 $($imageTags[2])" -ForegroundColor Gray

    } else {
        Write-Host "构建失败! ✗" -ForegroundColor Red
        Write-Host "退出码: $LASTEXITCODE" -ForegroundColor Red
        Write-Host "耗时: $($duration.ToString('mm\:ss'))" -ForegroundColor Cyan

        # 恢复目录后再退出
        Set-Location $originalDirectory
        exit $LASTEXITCODE
    }

    Write-Host "=" * 60 -ForegroundColor Blue

} finally {
    # 恢复原始目录
    Set-Location $originalDirectory
}