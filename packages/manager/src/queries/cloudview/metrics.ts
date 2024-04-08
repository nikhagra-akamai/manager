import { APIError, CloudViewMetricsRequest, CloudViewMetricsResponse, Widgets, getCloudViewMetrics } from "@linode/api-v4";
import { queryKey } from "../preferences";
import { useQuery } from '@tanstack/react-query';

export const useCloudViewMetricsQuery = (serviceType:string, 
    request:CloudViewMetricsRequest, changer:any, widget:Widgets) => {

        return useQuery<CloudViewMetricsResponse, APIError[]>(
            [queryKey, serviceType, request, changer, widget], //querykey and dashboardId makes this uniquely identifiable
            () => getCloudViewMetrics(serviceType, request),
            {
                enabled: true,                                
            }
        );

}