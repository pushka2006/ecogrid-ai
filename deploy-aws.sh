#!/bin/bash
set -e

echo "============================================================"
echo " EcoGrid AI — AWS S3 One-Line CloudShell Deployer"
echo "============================================================"

# Clone or update if not already inside the repo
if [ -f "package.json" ]; then
  echo "Already inside project directory."
elif [ -d "ecogrid-ai" ]; then
  cd ecogrid-ai
  git pull
elif [ -d "ecogrid-app" ]; then
  cd ecogrid-app
else
  git clone https://github.com/pushka2006/ecogrid-ai.git
  cd ecogrid-ai
fi

# If repository contains a subfolder named ecogrid-app, enter it
if [ -d "ecogrid-app" ]; then
  cd ecogrid-app
fi

echo "[1/4] Installing dependencies & building production export..."
export STATIC_EXPORT=true
npm ci || npm install
npm run build

echo "[2/4] Identifying AWS Account & Region..."
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
REGION="ap-south-1"
BUCKET="ecogrid-ai-${ACCOUNT_ID}-${REGION}"

echo "[3/4] Provisioning S3 Bucket: ${BUCKET} in ${REGION}..."
aws s3 mb "s3://${BUCKET}" --region "${REGION}" 2>/dev/null || true

# Configure static website hosting
aws s3api put-public-access-block --bucket "${BUCKET}" --public-access-block-configuration "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false" 2>/dev/null || true
aws s3api put-bucket-website --bucket "${BUCKET}" --website-configuration '{"IndexDocument":{"Suffix":"index.html"},"ErrorDocument":{"Key":"404.html"}}' 2>/dev/null || true

cat << 'EOF' > /tmp/s3-policy.json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::BUCKET_PLACEHOLDER/*"
    }
  ]
}
EOF
sed -i "s/BUCKET_PLACEHOLDER/${BUCKET}/g" /tmp/s3-policy.json
aws s3api put-bucket-policy --bucket "${BUCKET}" --policy file:///tmp/s3-policy.json 2>/dev/null || true

echo "[4/4] Syncing build assets to S3..."
aws s3 sync out/ "s3://${BUCKET}/" --delete

echo ""
echo "============================================================"
echo " ECOGRID AI DEPLOYMENT COMPLETE!"
echo " Live Website Endpoint:"
echo " http://${BUCKET}.s3-website.${REGION}.amazonaws.com"
echo "============================================================"
