// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { Construct } from 'constructs';
import * as twinmaker from 'aws-cdk-lib/aws-iottwinmaker';

type ComponentsProps = {
  workspace: twinmaker.CfnWorkspace;
  timestreamReaderArn: string;
};

export class Components extends Construct {
  constructor(scope: Construct, id: string, props: ComponentsProps) {
    super(scope, id);
    const { workspace, timestreamReaderArn } = props;
    this.node.addDependency(workspace);

    const timestreamComponent = new twinmaker.CfnComponentType(this, 'TimeStreamComponent', {
      workspaceId: workspace.workspaceId,
      componentTypeId: 'com.example.timestream-telemetry',
      functions: {
        dataReader: {
          implementedBy: {
            lambda: {
              arn: timestreamReaderArn,
            },
          },
        },
      },
      propertyDefinitions: {
        telemetryAssetType: {
          dataType: {
            type: 'STRING',
          },
          isExternalId: false,
          isStoredExternally: false,
          isTimeSeries: false,
          isRequiredInEntity: true,
        },
        telemetryAssetId: {
          dataType: {
            type: 'STRING',
          },
          isExternalId: false,
          isStoredExternally: false,
          isTimeSeries: false,
          isRequiredInEntity: true,
        },
      },
    });

    const alarmComponent = new twinmaker.CfnComponentType(this, 'AlarmComponent', {
      workspaceId: workspace.workspaceId,
      componentTypeId: 'energykit.turbine.telemetry.alarm',
      extendsFrom: ['com.example.timestream-telemetry', 'com.amazon.iottwinmaker.alarm.basic'],
      propertyDefinitions: {
        telemetryAssetType: {
          defaultValue: {
            stringValue: 'Alarm',
          },
        },
      },
      functions: {
        dataReader: {
          implementedBy: {
            lambda: {
              arn: timestreamReaderArn,
            },
          },
        },
      },
    });
    alarmComponent.addDependsOn(timestreamComponent);

    const spaceComponent = new twinmaker.CfnComponentType(this, 'SpaceComponent', {
      workspaceId: workspace.workspaceId,
      componentTypeId: 'aws.energykit.wind.space',
      propertyDefinitions: {
        position: { dataType: { nestedType: { type: 'DOUBLE' }, type: 'LIST' } },
        rotation: { dataType: { nestedType: { type: 'DOUBLE' }, type: 'LIST' } },
        bounds: { dataType: { nestedType: { type: 'DOUBLE' }, type: 'LIST' } },
        parent_space: { dataType: { type: 'RELATIONSHIP' } },
      },
    });

    const turbineComponent = new twinmaker.CfnComponentType(this, 'TurbineComponent', {
      workspaceId: workspace.workspaceId,
      componentTypeId: 'aws.energykit.wind.turbine.telemetry',
      extendsFrom: ['com.example.timestream-telemetry'],
      propertyDefinitions: {
        telemetryAssetType: {
          defaultValue: { stringValue: 'Telemetry' },
        },
        temp: {
          dataType: { type: 'DOUBLE' },
          isTimeSeries: true,
          isStoredExternally: true,
        },
        vibration: {
          dataType: { type: 'DOUBLE' },
          isTimeSeries: true,
          isStoredExternally: true,
        },
        rpm: {
          dataType: { type: 'DOUBLE' },
          isTimeSeries: true,
          isStoredExternally: true,
        },
        alarm_status: {
          dataType: { type: 'STRING' },
          isTimeSeries: true,
          isStoredExternally: true,
        },
      },
    });

  }}