import { Injectable } from '@nestjs/common';
import { Repository } from 'src/repositories/repository';

@Injectable()
export class MetricTrackingImplementService {
    constructor(private readonly model: Repository) { }
}
