param(
  [string]$HostName = "37.44.245.86",
  [int]$Port = 65002,
  [string]$Username = "u826712707",
  [string]$RepoUrl = "https://github.com/brontolano/asy-syifaa-.git"
)

$ErrorActionPreference = "Stop"
Import-Module Posh-SSH

if (-not $env:HOSTINGER_PASSWORD) {
  throw "Set env HOSTINGER_PASSWORD dulu. Contoh: `$env:HOSTINGER_PASSWORD='your-password'"
}

$sec = ConvertTo-SecureString $env:HOSTINGER_PASSWORD -AsPlainText -Force
$cred = New-Object System.Management.Automation.PSCredential($Username, $sec)
$session = New-SSHSession -ComputerName $HostName -Port $Port -Credential $cred -AcceptKey

$remote = @'
set -e
BASE=/home/__USERNAME__/domains/asy-syifaa.com/public_html
SRC=/home/__USERNAME__/deploy/asy-syifaa-github
REPO_URL="__REPO_URL__"

mkdir -p /home/__USERNAME__/deploy
if [ -d \"$SRC/.git\" ]; then
  git -C \"$SRC\" fetch --all --prune
  git -C \"$SRC\" reset --hard origin/main
else
  rm -rf \"$SRC\"
  git clone \"$REPO_URL\" \"$SRC\"
fi

HASH=\$(git -C \"$SRC\" rev-parse --short HEAD)
DATE=\$(date '+%Y-%m-%d %H:%M:%S')

echo "Deploy commit: \$HASH at \$DATE"

# keep existing rendered pages unless you want template overwrite
cp \"$BASE/web/index.php\" \"$BASE/index.php\"

echo DONE
'@

$remote = $remote.Replace("__USERNAME__", $Username).Replace("__REPO_URL__", $RepoUrl)

$result = Invoke-SSHCommand -SessionId $session.SessionId -Command $remote -TimeOut 120000
$result.Output | ForEach-Object { Write-Host $_ }
Remove-SSHSession -SessionId $session.SessionId | Out-Null
