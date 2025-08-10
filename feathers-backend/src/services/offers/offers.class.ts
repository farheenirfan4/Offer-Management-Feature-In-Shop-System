// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../declarations'
import type { Offers, OffersData, OffersPatch, OffersQuery } from './offers.schema'

export type { Offers, OffersData, OffersPatch, OffersQuery }

export interface OffersParams extends KnexAdapterParams<OffersQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class OffersService<ServiceParams extends Params = OffersParams> extends KnexService<
  Offers,
  OffersData,
  OffersParams,
  OffersPatch
> {}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('postgresqlClient'),
    name: 'offers'
  }
}
