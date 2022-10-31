/* eslint-disable camelcase */
import {
    CreateShortUrlSelectAdapter,
} from '@/store/types/adapters/createShortUrlAdapter';

export class CreateShortUrlPageAdapter {
    constructor(
        public createShortUrlSelectAdapter: CreateShortUrlSelectAdapter = new CreateShortUrlSelectAdapter(),
    ) {}
}
