import { API_ROOT } from '../constants';
import Request, { setHeaders, setMethod, setURL } from '../request';
import {
  MetricDefinitions,
  MonitorServiceType,
  ServiceTypesList,
} from './types';
import { ResourcePage as Page } from 'src/types';

/**
 * getCloudViewServiceTypes
 *
 * Returns list of CloudView Service Types with details.
 *
 */
export const getCloudViewServiceTypes = () =>
  Request<ServiceTypesList>(
    setURL(
      `http://blr-lhv95n.bangalore.corp.akamai.com:9000/v4/monitor/services`
    ),
    setMethod('GET'),
    setHeaders({
      Authorization: 'Bearer vagrant',
    })
  );

export const getMonitorServiceTypeInformationByServiceType = (
  serviceType: string
) =>
  Request<MonitorServiceType>(
    setURL(`${API_ROOT}/monitor/services/${serviceType}`),
    setMethod('GET')
  );

export const getMetricDefinitionsByServiceType = (serviceType: string) => {
  return Request<Page<MetricDefinitions>>(
    // setURL(`${API_ROOT}/monitor/services/${serviceType}/metricDefinitions`),
    setURL(
      `http://blr-lhv95n.bangalore.corp.akamai.com:9000/v4/monitor/services/${serviceType}/metric-definitions`
    ),
    setMethod('GET'),
    setHeaders({
      Authorization: 'Bearer vagrant',
    })
  );
};