import { Injectable } from '@nestjs/common';
import { PrismaService } from '@leetcode/database';
import { CreateProblemDto } from '@leetcode/types';

@Injectable()
export class ProblemsService {
    constructor(private readonly prisma: PrismaService) {}

    async create(dto: CreateProblemDto) {
        const { problemTags, problemCompanies, testCases, ...problemData } = dto;

        return this.prisma.problem.create({
            data: {
                ...problemData,

                // ===== Problem Tags =====
                ...(problemTags?.length
                    ? {
                          problemTags: {
                              create: problemTags.map((tag) => ({
                                  tag: {
                                      connect: { id: tag.tagId },
                                  },
                              })),
                          },
                      }
                    : {}),

                // ===== Problem Companies =====
                ...(problemCompanies?.length
                    ? {
                          problemCompanies: {
                              create: problemCompanies.map((company) => ({
                                  company: {
                                      connect: { id: company.companyId },
                                  },
                                  frequency: company.frequency ?? 1,
                                  lastAskedDate: company.lastAskedDate
                                      ? new Date(company.lastAskedDate)
                                      : undefined,
                              })),
                          },
                      }
                    : {}),

                // ===== Test Cases =====
                ...(testCases?.length
                    ? {
                          testCases: {
                              create: testCases.map((t) => ({
                                  input: t.input,
                                  expectedOutput: t.expectedOutput,
                                  isSample: t.isSample ?? false,
                                  isActive: t.isActive ?? true,
                                  explanation: t.explanation,
                              })),
                          },
                      }
                    : {}),
            },
            include: {
                problemTags: { include: { tag: true } },
                problemCompanies: { include: { company: true } },
                testCases: true,
                createdBy: true,
            },
        });
    }
}
