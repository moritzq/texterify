import * as localforage from "localforage";
import { observable } from "mobx";
import { create, persist } from "mobx-persist";
import { APIUtils } from "../api/v1/APIUtils";
import { IPlanIDS } from "../types/IPlan";
import { DEFAULT_PAGE_SIZE } from "../ui/Config";

export interface IProject {
    id: string;
    attributes: IProjectAttributes;
    relationships: any;
    type: string;
}

interface IProjectAttributes {
    id: string;
    name: string;
    description: string;
    current_user_role?: string;
    current_user_role_source?: string;
    enabled_features: IFeature[];
    all_features: { [k in IFeature]: IPlanIDS[] };
}

export type IFeature =
    | "FEATURE_VALIDATIONS"
    | "FEATURE_KEY_HISTORY"
    | "FEATURE_EXPORT_HIERARCHY"
    | "FEATURE_POST_PROCESSING"
    | "FEATURE_PROJECT_ACTIVITY"
    | "FEATURE_TAG_MANAGEMENT"
    | "FEATURE_ADVANCED_PERMISSION_SYSTEM"
    | "FEATURE_OTA"
    | "FEATURE_HTML_EDITOR"
    | "FEATURE_TEMPLATES"
    | "FEATURE_PROJECT_GROUPS"
    | "FEATURE_MACHINE_TRANSLATIONS";

export interface IOrganization {
    id: string;
    attributes: IOrganizationAttributes;
    relationships: any;
    type: string;
}

interface IOrganizationAttributes {
    id: string;
    name: string;
    current_user_role?: string;
    trial_ends_at: string;
    trial_active: boolean;
    enabled_features: IFeature[];
    all_features: { [k in IFeature]: IPlanIDS[] };
}

class DashboardStore {
    @observable currentProject: IProject = null;
    @observable currentProjectIncluded: any = null;
    @observable currentOrganization?: IOrganization = null;
    @observable @persist sidebarMinimized: boolean;
    @observable @persist keysPerPage = DEFAULT_PAGE_SIZE;
    @observable hydrationFinished = false;

    getOrganizationId = (organizationId?: string) => {
        return (this.getProjectOrganization() && this.getProjectOrganization().id) || organizationId;
    };

    getOrganizationName = () => {
        if (this.getProjectOrganization()) {
            return this.getProjectOrganization().attributes.name;
        } else {
            return this.currentOrganization ? this.currentOrganization.attributes.name : "Organization";
        }
    };

    getProjectOrganization = () => {
        return (
            this.currentProject &&
            APIUtils.getIncludedObject(this.currentProject.relationships.organization.data, this.currentProjectIncluded)
        );
    };

    getCurrentRole = () => {
        return this.currentProject && this.currentProject.attributes.current_user_role;
    };

    getCurrentOrganizationRole = () => {
        return this.currentOrganization && this.currentOrganization.attributes.current_user_role;
    };

    featureEnabled(feature: IFeature) {
        return this.currentProject?.attributes.enabled_features.includes(feature);
    }
}

const hydrate: any = create({
    storage: localforage
});

const dashboardStore: DashboardStore = new DashboardStore();

hydrate("dashboardStore", dashboardStore)
    .then(() => {
        console.log("Hydrated from store successfully.");
        dashboardStore.hydrationFinished = true;
    })
    .catch((error: any) => {
        console.error("Error while hydrating:", error);
        dashboardStore.hydrationFinished = true;
    });

export { dashboardStore };
