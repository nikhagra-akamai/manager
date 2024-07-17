import { Grid, Paper, styled } from '@mui/material';
import React from 'react';

import CloudPulseIcon from 'src/assets/icons/entityIcons/cv_overview.svg';
import { CircleProgress } from 'src/components/CircleProgress';
import { ErrorState } from 'src/components/ErrorState/ErrorState';
import { Placeholder } from 'src/components/Placeholder/Placeholder';
import { useCloudPulseDashboardByIdQuery } from 'src/queries/cloudpulse/dashboards';
import { useResourcesQuery } from 'src/queries/cloudpulse/resources';
import {
  useCloudPulseJWEtokenQuery,
  useGetCloudPulseMetricDefinitionsByServiceType,
} from 'src/queries/cloudpulse/services';

import { getUserPreferenceObject } from '../Utils/UserPreference';
import { removeObjectReference } from '../Utils/utils';
import { CloudPulseWidget } from '../Widget/CloudPulseWidget';
import {
  all_interval_options,
  getInSeconds,
  getIntervalIndex,
} from '../Widget/components/CloudPulseIntervalSelect';

import type { CloudPulseWidgetProperties } from '../Widget/CloudPulseWidget';
import type {
  AvailableMetrics,
  Dashboard,
  JWETokenPayLoad,
  TimeDuration,
  Widgets,
} from '@linode/api-v4';

export interface DashboardProperties {
  dashboardId: number;
  duration: TimeDuration;
  manualRefreshTimeStamp?: number | undefined;
  region?: string;
  resources: string[];
  savePref?: boolean;
}

const StyledErrorState = styled(Placeholder, {
  label: 'StyledErrorState',
})({
  height: '100%',
});

export const CloudPulseDashboard = (props: DashboardProperties) => {
  const getJweTokenPayload = () => {
    return {
      resource_id: resources?.map((resource) => String(resource.id)) ?? [],
    } as JWETokenPayLoad;
  };

  const getCloudPulseGraphProperties = (widget: Widgets) => {
    const graphProp: CloudPulseWidgetProperties = {} as CloudPulseWidgetProperties;
    graphProp.widget = { ...widget };
    if (props.savePref) {
      setPrefferedWidgetPlan(graphProp.widget);
    }
    graphProp.serviceType = dashboard?.service_type ?? '';
    graphProp.resourceIds = props.resources;
    graphProp.duration = props.duration;
    graphProp.unit = widget.unit ? widget.unit : '%';
    graphProp.ariaLabel = widget.label;
    graphProp.errorLabel = 'Error While loading data';
    graphProp.timeStamp = props.manualRefreshTimeStamp!;

    return graphProp;
  };

  const setPrefferedWidgetPlan = (widgetObj: Widgets) => {
    const widgetPreferences = getUserPreferenceObject().widgets;
    if (widgetPreferences && widgetPreferences[widgetObj.label]) {
      const pref = widgetPreferences[widgetObj.label];
      widgetObj.size = pref.size;
      widgetObj.aggregate_function = pref.aggregateFunction;
      widgetObj.time_granularity = { ...pref.timeGranularity };
    }
  };

  const getTimeGranularity = (scrapeInterval: string) => {
    const scrapeIntervalValue = getInSeconds(scrapeInterval);
    const index = getIntervalIndex(scrapeIntervalValue);
    return index < 0 ? all_interval_options[0] : all_interval_options[index];
  };

  const { data: dashboard } = useCloudPulseDashboardByIdQuery(
    props.dashboardId!,
    props.savePref
  );

  const { data: resources } = useResourcesQuery(
    dashboard && dashboard.service_type ? true : false,
    dashboard ? dashboard.service_type : undefined!,
    {},
    {}
  );

  const {
    data: metricDefinitions,
    isLoading,
  } = useGetCloudPulseMetricDefinitionsByServiceType(
    dashboard ? dashboard!.service_type : undefined!,
    dashboard && dashboard!.service_type !== undefined ? true : false
  );

  const {
    data: jweToken,
    isError: isJweTokenError,
  } = useCloudPulseJWEtokenQuery(
    dashboard ? dashboard.service_type! : undefined!,
    getJweTokenPayload(),
    resources && dashboard ? true : false
  );

  if (isJweTokenError) {
    return (
      <Paper style={{ height: '100%' }}>
        <StyledErrorState title="Failed to get jwe token" />
      </Paper>
    );
  }

  if (dashboard && dashboard.service_type && isLoading) {
    return <CircleProgress />;
  }

  if (dashboard && dashboard.service_type && isLoading) {
    return <ErrorState errorText={'Error loading metric definitions'} />;
  }

  const RenderWidgets = () => {
    if (dashboard !== undefined) {
      if (
        dashboard.service_type &&
        props.resources &&
        props.resources.length > 0 &&
        jweToken?.token &&
        resources
      ) {
        // maintain a copy
        const newDashboard: Dashboard = removeObjectReference(dashboard);
        return (
          <Grid columnSpacing={1} container item rowSpacing={2} xs={12}>
            {{ ...newDashboard }.widgets.map((element, index) => {
              if (element) {
                const availMetrics = metricDefinitions?.data.find(
                  (availMetrics: AvailableMetrics) =>
                    element.label === availMetrics.label
                );
                const cloudPulseWidgetProperties = getCloudPulseGraphProperties(
                  {
                    ...element,
                  }
                );

                if (
                  availMetrics &&
                  !cloudPulseWidgetProperties.widget.time_granularity
                ) {
                  cloudPulseWidgetProperties.widget.time_granularity = getTimeGranularity(
                    availMetrics.scrape_interval
                  );
                }
                return (
                  <CloudPulseWidget
                    key={element.label}
                    {...cloudPulseWidgetProperties}
                    authToken={jweToken?.token}
                    availableMetrics={availMetrics}
                    resources={resources}
                    savePref={props.savePref}
                  />
                );
              } else {
                return <React.Fragment key={index}></React.Fragment>;
              }
            })}{' '}
          </Grid>
        );
      } else {
        return renderPlaceHolder(
          'Select Service Type, Region and Resource to visualize metrics'
        );
      }
    } else {
      return renderPlaceHolder(
        'No visualizations are available at this moment. Create Dashboards to list here.'
      );
    }
  };

  const StyledPlaceholder = styled(Placeholder, {
    label: 'StyledPlaceholder',
  })({
    flex: 'auto',
  });

  const renderPlaceHolder = (subtitle: string) => {
    return (
      <Paper>
        <StyledPlaceholder icon={CloudPulseIcon} subtitle={subtitle} title="" />
      </Paper>
    );
  };

  return <RenderWidgets />;
};
