param (
    [string]$BucketName = "",
    [string]$Region = "ap-south-1",
    [switch]$CreateCloudFront = $false
)

$ErrorActionPreference = "Stop"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host " EcoGrid AI — AWS One-Click Deployer      " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# 1. Verify AWS Authentication
Write-Host "`n[1/5] Checking AWS Authentication..." -ForegroundColor Yellow
try {
    $callerIdentityJson = aws sts get-caller-identity --output json 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Error "AWS CLI is not authenticated. Please run 'aws login' or configure your credentials using 'aws configure'."
    }
    $caller = $callerIdentityJson | ConvertFrom-Json
    $accountId = $caller.Account
    Write-Host "  Authenticated as Account: $accountId ($($caller.Arn))" -ForegroundColor Green
} catch {
    Write-Host "  Authentication Error: $_" -ForegroundColor Red
    Write-Host "  Please complete AWS sign-in in your browser or run 'aws login', then rerun this script." -ForegroundColor Yellow
    exit 1
}

# 2. Determine Bucket Name
if (-not $BucketName) {
    $BucketName = "ecogrid-ai-$accountId-$Region"
}
Write-Host "`n[2/5] Target S3 Bucket: $BucketName (Region: $Region)" -ForegroundColor Yellow

# 3. Build Next.js Static Export
Write-Host "`n[3/5] Building Next.js Static Production Export..." -ForegroundColor Yellow
$env:STATIC_EXPORT = "true"
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Error "Build failed. Aborting deployment."
}
Write-Host "  Build completed successfully! Assets located in ./out" -ForegroundColor Green

# 4. Create & Configure S3 Bucket
Write-Host "`n[4/5] Provisioning S3 Bucket and Website Hosting..." -ForegroundColor Yellow
$bucketExists = $false
try {
    aws s3api head-bucket --bucket $BucketName 2>$null
    if ($LASTEXITCODE -eq 0) {
        $bucketExists = $true
        Write-Host "  Bucket $BucketName already exists. Reusing it." -ForegroundColor Green
    }
} catch {
    $bucketExists = $false
}

if (-not $bucketExists) {
    Write-Host "  Creating bucket $BucketName in $Region..." -ForegroundColor Cyan
    if ($Region -eq "us-east-1") {
        aws s3api create-bucket --bucket $BucketName --region $Region
    } else {
        aws s3api create-bucket --bucket $BucketName --region $Region --create-bucket-configuration LocationConstraint=$Region
    }
}

# Disable Block Public Access for static website hosting
Write-Host "  Configuring public access for web hosting..." -ForegroundColor Cyan
aws s3api put-public-access-block --bucket $BucketName --public-access-block-configuration "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"

# Configure website endpoint
aws s3api put-bucket-website --bucket $BucketName --website-configuration '{\"IndexDocument\":{\"Suffix\":\"index.html\"},\"ErrorDocument\":{\"Key\":\"404.html\"}}'

# Apply read policy
$policy = @"
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::$BucketName/*"
    }
  ]
}
"@
$policy | Out-File -FilePath "./bucket-policy.json" -Encoding utf8
aws s3api put-bucket-policy --bucket $BucketName --policy file://bucket-policy.json
Remove-Item -Path "./bucket-policy.json" -Force

# 5. Sync Assets to S3
Write-Host "`n[5/5] Uploading static assets to S3..." -ForegroundColor Yellow
aws s3 sync ./out "s3://$BucketName" --delete --cache-control "max-age=31536000,public" --exclude "*.html"
aws s3 sync ./out "s3://$BucketName" --delete --cache-control "max-age=0,no-cache,no-store,must-revalidate" --include "*.html"

$WebsiteUrl = "http://$BucketName.s3-website.$Region.amazonaws.com"

Write-Host "`n=======================================================" -ForegroundColor Green
Write-Host " DEPLOYMENT SUCCESSFUL!" -ForegroundColor Green
Write-Host " EcoGrid AI is live on AWS:" -ForegroundColor Green
Write-Host " $WebsiteUrl" -ForegroundColor Cyan
Write-Host "=======================================================" -ForegroundColor Green
