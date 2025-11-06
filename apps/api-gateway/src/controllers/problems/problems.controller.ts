import { MICROSERVICES, PROBLEMS } from '@leetcode/constants';
import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('problems')
export class ProblemsController {
    constructor(@Inject(MICROSERVICES.PROBLEMS_SERVICE) private client: ClientProxy) {}

    @Get()
    getProblems() {
        return this.client.send(PROBLEMS.FIND_ALL, {});
    }
}
