
/**
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 02/08/24
 */

import APIClient from '../lib/ApiClient';
import { ListResponse, PostResponse, PutResponse, DeleteResponse } from '@/types/apiTypes';
import {InItem} from "@/models/Item";
import {InventoryItem} from "@/models/InventoryItem";
import {InWorkOrder} from "@/models/WorkOrder";


export interface InMaintenanceDashboard {
    preventive_maintenance: number;
    corrective_maintenance: number;
    predictive_maintenance: number;
}


class Dashboard {
    async maintenanceDashboard(): Promise<ListResponse<InMaintenanceDashboard>> {
        return await APIClient.get('maintenance_dashboard');
    }
}

export { Dashboard };