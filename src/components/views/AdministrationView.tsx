'use client';

import React, { useState } from 'react';
import {
  Settings,
  ShieldCheck,
  Cloud,
  Cpu,
  Database,
  Radio,
  Server,
  Terminal,
  Activity,
  CheckCircle2,
  Copy,
} from 'lucide-react';
import { UserRole } from '@/lib/types';

interface AdministrationViewProps {
  userRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  isAwsCloudMode: boolean;
  onToggleCloudMode: () => void;
}

export const AdministrationView: React.FC<AdministrationViewProps> = ({
  userRole,
  onRoleChange,
  isAwsCloudMode,
  onToggleCloudMode,
}) => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'cdk' | 'cloudwatch' | 'rbac'>('architecture');
  const [copiedCode, setCopiedCode] = useState(false);

  const cdkCodeSnippet = `// AWS CDK TypeScript Stack for EcoGrid AI
import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iot from 'aws-cdk-lib/aws-iot';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as sns from 'aws-cdk-lib/aws-sns';

export class EcoGridAiStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 1. S3 Storage for Waste Imagery & CSV Telemetry
    const telemetryBucket = new s3.Bucket(this, 'EcoGridAssetsBucket', {
      versioned: true,
      encryption: s3.BucketEncryption.S3_MANAGED,
      lifecycleRules: [{ expiration: cdk.Duration.days(90) }],
    });

    // 2. DynamoDB Single Table for Telemetry & State
    const ecoTable = new dynamodb.Table(this, 'EcoGridRegistryTable', {
      partitionKey: { name: 'PK', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'SK', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });

    // 3. SNS Urgent Notification Topic
    const alertTopic = new sns.Topic(this, 'EcoGridOverflowAlertTopic');

    // 4. Lambda: Computer Vision & Anomaly Engine
    const analyticsFn = new lambda.Function(this, 'EcoGridAnalyticsHandler', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambda/dist'),
      environment: {
        TABLE_NAME: ecoTable.tableName,
        BUCKET_NAME: telemetryBucket.bucketName,
        BEDROCK_MODEL_ID: 'anthropic.claude-3-5-sonnet-20241022-v2:0',
        SNS_TOPIC_ARN: alertTopic.topicArn,
      },
    });

    ecoTable.grantReadWriteData(analyticsFn);
    telemetryBucket.grantReadWrite(analyticsFn);
    alertTopic.grantPublish(analyticsFn);

    // 5. REST API Gateway
    const api = new apigateway.LambdaRestApi(this, 'EcoGridApiGateway', {
      handler: analyticsFn,
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
    });

    // 6. EventBridge Scheduled Rule for Periodic Energy Spikes Check (Every 15 mins)
    new events.Rule(this, 'PeriodicAnomalySchedule', {
      schedule: events.Schedule.rate(cdk.Duration.minutes(15)),
      targets: [new targets.LambdaFunction(analyticsFn)],
    });
  }
}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(cdkCodeSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gray-100 text-gray-800 flex items-center justify-center">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">
              Administration & AWS Cloud Architecture
            </h2>
            <p className="text-xs text-gray-500 font-medium">
              Manage system permissions, inspect serverless topology, and review CloudWatch health
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'architecture' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500'
            }`}
          >
            Cloud Topology
          </button>
          <button
            onClick={() => setActiveTab('cdk')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'cdk' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500'
            }`}
          >
            AWS CDK IaC
          </button>
          <button
            onClick={() => setActiveTab('cloudwatch')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'cloudwatch' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500'
            }`}
          >
            CloudWatch Logs
          </button>
          <button
            onClick={() => setActiveTab('rbac')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'rbac' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500'
            }`}
          >
            RBAC Access
          </button>
        </div>
      </div>

      {/* Tab 1: Architecture Blueprint */}
      {activeTab === 'architecture' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs">
            <h3 className="text-sm font-bold text-gray-900 mb-1">
              Production AWS Serverless Architecture
            </h3>
            <p className="text-xs text-gray-500 mb-6">
              Low-cost, highly scalable microservices architecture adhering to the AWS Well-Architected Framework
            </p>

            {/* Architecture Node Map */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Node 1: Ingestion */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-xs space-y-2">
                <div className="flex items-center gap-2 text-emerald-700 font-bold">
                  <Radio className="w-4 h-4" />
                  <span>1. Ingestion Layer</span>
                </div>
                <p className="text-gray-600">
                  <strong>AWS IoT Core:</strong> MQTT broker receiving ultrasonic telemetry from bins and Modbus smart meter pulses.
                </p>
                <p className="text-gray-600">
                  <strong>Amazon API Gateway:</strong> Authenticated REST endpoints with Cognito Authorizer for dashboard clients.
                </p>
              </div>

              {/* Node 2: Compute & AI */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-xs space-y-2">
                <div className="flex items-center gap-2 text-blue-700 font-bold">
                  <Cpu className="w-4 h-4" />
                  <span>2. Processing & AI</span>
                </div>
                <p className="text-gray-600">
                  <strong>AWS Lambda:</strong> Event-driven serverless functions executing 2-opt TSP routing and 3-sigma energy anomaly detection.
                </p>
                <p className="text-gray-600">
                  <strong>Amazon Bedrock:</strong> Foundation Model API (Claude 3.5 Sonnet / Titan) for vision classification & grounded conversational assistant.
                </p>
              </div>

              {/* Node 3: Storage & Events */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-xs space-y-2">
                <div className="flex items-center gap-2 text-amber-700 font-bold">
                  <Database className="w-4 h-4" />
                  <span>3. Persistence & Alerts</span>
                </div>
                <p className="text-gray-600">
                  <strong>Amazon DynamoDB:</strong> Single-table design for bin states, energy logs, and driver itineraries.
                </p>
                <p className="text-gray-600">
                  <strong>Amazon S3:</strong> Encrypted object storage for waste imagery and downloadable CSV reports.
                </p>
                <p className="text-gray-600">
                  <strong>Amazon SNS / EventBridge:</strong> Push SMS/Email notifications on 90%+ bin overflow.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: CDK IaC Code */}
      {activeTab === 'cdk' && (
        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-gray-900">AWS CDK Infrastructure as Code (TypeScript)</h3>
              <p className="text-xs text-gray-500">Deployable AWS Cloud Development Kit stack definition</p>
            </div>
            <button
              onClick={handleCopyCode}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center gap-1.5"
            >
              {copiedCode ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Copied!' : 'Copy CDK Code'}</span>
            </button>
          </div>

          <pre className="p-4 rounded-2xl bg-gray-950 text-emerald-400 font-mono text-xs overflow-x-auto leading-relaxed">
            {cdkCodeSnippet}
          </pre>
        </div>
      )}

      {/* Tab 3: CloudWatch Logs */}
      {activeTab === 'cloudwatch' && (
        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
              <Activity className="w-4 h-4" />
              <span>Live Amazon CloudWatch Operational Stream</span>
            </div>
            <span className="text-[10px] font-mono text-gray-400">log-group:/aws/lambda/EcoGridAnalytics</span>
          </div>

          <div className="space-y-2 font-mono text-xs">
            <div className="p-2.5 rounded-xl bg-gray-900 text-gray-200 flex items-start gap-2">
              <span className="text-emerald-400">[INFO]</span>
              <span>2026-10-10T05:14:22Z - IoT rule triggered on topic ecogrid/bins/B-12/telemetry. Fill Level: 92%</span>
            </div>
            <div className="p-2.5 rounded-xl bg-gray-900 text-gray-200 flex items-start gap-2">
              <span className="text-rose-400">[WARN]</span>
              <span>2026-10-10T05:14:23Z - Bin B-12 threshold exceeded (&gt;90%). Auto-dispatched SNS notification to Collection Team.</span>
            </div>
            <div className="p-2.5 rounded-xl bg-gray-900 text-gray-200 flex items-start gap-2">
              <span className="text-emerald-400">[INFO]</span>
              <span>2026-10-10T05:14:25Z - Bedrock model anthropic.claude-3-5-sonnet invoked. Input tokens: 412, Latency: 840ms.</span>
            </div>
            <div className="p-2.5 rounded-xl bg-gray-900 text-gray-200 flex items-start gap-2">
              <span className="text-emerald-400">[INFO]</span>
              <span>2026-10-10T05:14:30Z - 2-Opt TSP route re-computed for 5 stops. Solved in 14ms. Estimated fuel saved: 3.8L.</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: RBAC */}
      {activeTab === 'rbac' && (
        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs">
          <h3 className="text-sm font-bold text-gray-900 mb-1">Role-Based Access Control (RBAC)</h3>
          <p className="text-xs text-gray-500 mb-4">
            Select an active persona to preview permissions across the EcoGrid platform:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(['Admin', 'Facility Manager', 'Collection Team', 'Analyst'] as UserRole[]).map((r) => (
              <div
                key={r}
                onClick={() => onRoleChange(r)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  userRole === r
                    ? 'border-emerald-500 bg-emerald-50/70 text-emerald-950 ring-1 ring-emerald-500'
                    : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold">{r}</span>
                  {userRole === r && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                </div>
                <p className="text-xs text-gray-500">
                  {r === 'Admin' && 'Unrestricted access to all views, AWS CDK IaC, and API key management.'}
                  {r === 'Facility Manager' && 'Authorized to review building anomalies, adjust HVAC schedules, and view tariffs.'}
                  {r === 'Collection Team' && 'Access restricted to collection routing, driving manifests, and bin empty checkoffs.'}
                  {r === 'Analyst' && 'ESG reporting, carbon conversion audits, and CSV data exports.'}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
