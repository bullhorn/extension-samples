// NG
import { Injectable } from '@angular/core';
// Vendor
import { AppBridge } from 'novo-elements';
import { EntityTypes } from '@bullhorn/bullhorn-types';
// APP
import { AppBridgeService } from './appBridge.service';
import { SearchResponse } from '../interfaces/bullhorn';

/**
 * Provides simple methods for calling Bullhorn rest endpoints via app bridge.
 */
@Injectable()
export class HttpService {
  private MAX_RECORDS_TO_RETURN = 500;

  constructor(private appBridgeService: AppBridgeService) {}

  /**
   * Handles errors and unwraps nested response from App Bridge
   *
   * The AppBridge returns a response that wraps the server response:
   * {
   *     data: { <http server response> },
   *     error: { <any post-robot errors> }
   * }
   *
   * A null response means that AppBridge did not connect and the call failed.
   *
   * @param response the server response wrapped in a post-robot response from AppBridge
   * @param resolve  the resolve method to call if successful
   * @param reject   the reject method to call if unsuccessful
   */
  private static handleAppBridgeResponse(response: any, resolve: (any) => void, reject: (any) => void): void {
    if (!response) {
      reject(response);
    } else if (response.error) {
      reject(response.error);
    } else if (response.data) {
      resolve(response.data);
    } else {
      resolve(response);
    }
  }

  /**
   * Performs a bullhorn /entity call to get an entity by ID using appBridge
   */
  getEntity(entityType: EntityTypes, entityId: number, fields: string = '*', meta: string = 'off'): Promise<any> {
    return new Promise((resolve, reject) => {
      this.appBridgeService.execute((appBridge: AppBridge) => {
        appBridge.httpGET(`entity/${entityType}/${entityId}?fields=${fields}&meta=${meta}`).then((response: any) => {
          HttpService.handleAppBridgeResponse(response, resolve, reject);
        }).catch((error: Error) => {
          reject(error);
        });
      });
    });
  }

  /**
   * Performs a bullhorn /entity update call to update an entity using appBridge
   */
  updateEntity(entityType: EntityTypes, entityId: number, body: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.appBridgeService.execute((appBridge: AppBridge) => {
        appBridge.httpPOST(`entity/${entityType}/${entityId}`, body).then((response: any) => {
          HttpService.handleAppBridgeResponse(response, resolve, reject);
        }).catch((error: Error) => {
          reject(error);
        });
      });
    });
  }

  /**
   * Performs a bullhorn /lookup/expanded lookup call to get entities for the picker
   */
  lookup(query: string, entityType: EntityTypes): Promise<any> {
    return new Promise((resolve, reject) => {
      this.appBridgeService.execute((appBridge: AppBridge) => {
        appBridge.httpGET(`lookup/expanded?count=20&start=0&entity=${entityType}&filter=${query}`).then((response: any) => {
          HttpService.handleAppBridgeResponse(response, resolve, reject);
        }).catch((error: Error) => {
          reject(error);
        });
      });
    });
  }

  /**
   * Returns an object that contains the requested settings as properties
   *
   * @param settings - comma separated list of settings to get from Bullhorn for the current user
   */
  getSettings(settings: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.appBridgeService.execute((appBridge: AppBridge) => {
        appBridge.httpGET(`settings/${settings}`).then((response: any) => {
          HttpService.handleAppBridgeResponse(response, resolve, reject);
        }).catch((error: Error) => {
          reject(error);
        });
      });
    });
  }

  /**
   * Performs a bullhorn /search or /query call through the appBridge.
   *
   * If the entity is indexed using Lucene, then a /search call will be made. If non-indexed, then /query will be used.
   * If there are more records than can be returns (total > count) then makes follow on calls until the count or
   * total has been reached, whichever comes first. If a small count is provided, follow-on calls will not be made.
   */
  search(entityType: EntityTypes,
         query: string,
         fields: string = '*',
         meta: string = 'off',
         count: number = 100,
         sort: string = '-dateAdded'): Promise<any> {
    return new Promise((resolve, reject) => {
      this.appBridgeService.execute(async (appBridge: AppBridge) => {
        const postData: any = { query, fields, meta, count, sort, start: 0 };
        const searchEndpoint: string = EntityTypes.isSearchable(entityType.toString()) ? 'search' : 'query';

        const searchResponse: { data: SearchResponse, error: any } = await appBridge.httpPOST(`${searchEndpoint}/${entityType}`, postData);
        let onePull = searchResponse.data;

        // If the user provided a count that is small, don't make multiple calls
        while (this.shouldPullMoreRecords(onePull, count)) {
          postData.start = onePull.data.length;
          const nextSearchResponse: { data: SearchResponse, error: any } = await appBridge.httpPOST(
            `${searchEndpoint}/${entityType}`, postData).catch(error => reject(error));
          const nextPull = nextSearchResponse.data;
          nextPull.data.push(...onePull.data);
          onePull = nextPull;
        }
        HttpService.handleAppBridgeResponse(onePull, resolve, reject);
      });
    });
  }

  private shouldPullMoreRecords(searchResponse: SearchResponse, max: number): boolean {
    let total = searchResponse.total;
    let start = searchResponse.start;
    const count = searchResponse.count;
    const maxTotal = Math.min(max, this.MAX_RECORDS_TO_RETURN);

    // Don't pull more if we already have the maximum requested
    if (total >= maxTotal) {
      return false;
    }

    // Handle missing values
    if (start == null) {
      start = 0;
    }
    if (total == null) {
      total = count;
    }

    const nextStart = start + count;
    const nextEnd = Math.min(nextStart + maxTotal, total);
    if (nextStart < total && count !== 0 && nextStart < maxTotal) {
      console.log(`--> Follow On Find(${nextStart} - ${nextEnd})`);
      return true;
    }
    return false;
  }
}
