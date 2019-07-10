// NG
import { Injectable } from '@angular/core';
// Vendor
import { OptionsService } from 'novo-elements';
import { EntityTypes } from '@bullhorn/bullhorn-types';
// App
import { HttpService } from './http.service';

/**
 * Provides the lookup calls for entity pickers through app bridge for Bullhorn extensions.
 */
@Injectable()
export class ExtensionOptionsService extends OptionsService {

  constructor(private httpService: HttpService) {
    super();
  }

  /**
   * Returns the getOptions function that is used by the picker.
   */
  private getOptionsFunc(entity: EntityTypes): any {
    return (query: string) => {
      return this.getOptions(query, entity);
    };
  }

  /**
   * Performs the lookup call through app bridge to lookup entities with the given picker text.
   */
  getOptions(query: string, entity: EntityTypes): any {
    return new Promise((resolve, reject) => {
      if (query && query.length) {
        this.httpService.lookup(query, entity).then((results) => {
          resolve(results);
        }, reject);
      } else {
        resolve([]);
      }
    });
  }

  getOptionsConfig(http: any, field: any, config: { token?: string; restUrl?: string; military?: boolean; settings?: any }) {
    const entity: EntityTypes = field.optionsType;
    switch (entity) {
      case 'Candidate':
        return {
          format: '$firstName $lastName',
          type: field.type,
          enableInfiniteScroll: false,
          options: this.getOptionsFunc(entity),
        };
      case 'JobOrder':
        return {
          format: '$id: $title',
          type: field.type,
          enableInfiniteScroll: false,
          options: this.getOptionsFunc(entity),
        };
    }
  }
}
