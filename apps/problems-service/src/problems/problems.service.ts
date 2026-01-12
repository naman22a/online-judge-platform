import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@leetcode/database';
import { CreateProblemDto, UpdateProblemDto } from '@leetcode/types';

@Injectable()
export class ProblemsService {
    constructor(private readonly prisma: PrismaService) {}

    async create({ userId, dto }: { userId: number; dto: CreateProblemDto }) {
        const { problemTags, problemCompanies, testCases, ...problemData } = dto;

        return this.prisma.problem.create({
            data: {
                createdById: userId,
                ...problemData,
                problemTags: problemTags?.length
                    ? {
                          create: problemTags.map((tag) => ({
                              tag: { connect: { id: tag.tagId } },
                          })),
                      }
                    : undefined,
                problemCompanies: problemCompanies?.length
                    ? {
                          create: problemCompanies.map((company) => ({
                              company: { connect: { id: company.companyId } },
                              frequency: company.frequency ?? 1,
                              lastAskedDate: company.lastAskedDate
                                  ? new Date(company.lastAskedDate)
                                  : undefined,
                          })),
                      }
                    : undefined,
                testCases: testCases?.length
                    ? {
                          create: testCases.map((t) => ({
                              input: t.input,
                              expectedOutput: t.expectedOutput,
                              isSample: t.isSample ?? false,
                              isActive: t.isActive ?? true,
                              explanation: t.explanation,
                          })),
                      }
                    : undefined,
            },
            include: {
                problemTags: { include: { tag: true } },
                problemCompanies: { include: { company: true } },
                testCases: true,
                createdBy: true,
            },
        });
    }

    async update(id: number, dto: UpdateProblemDto) {
        const { problemTags, problemCompanies, testCases, ...problemData } = dto;

        const existing = await this.prisma.problem.findUnique({
            where: { id },
            include: {
                problemTags: true,
                problemCompanies: true,
                testCases: true,
            },
        });

        if (!existing) {
            throw new NotFoundException(`Problem with ID ${id} not found`);
        }

        return this.prisma.$transaction(async (tx) => {
            const updatedProblem = await tx.problem.update({
                where: { id },
                data: {
                    ...problemData,
                },
            });

            if (problemTags) {
                await tx.problemTag.deleteMany({
                    where: { problemId: id },
                });

                if (problemTags.length > 0) {
                    await tx.problemTag.createMany({
                        data: problemTags.map((tag) => ({
                            problemId: id,
                            tagId: tag.tagId,
                        })),
                    });
                }
            }

            if (problemCompanies) {
                await tx.problemCompany.deleteMany({
                    where: { problemId: id },
                });

                if (problemCompanies.length > 0) {
                    await tx.problemCompany.createMany({
                        data: problemCompanies.map((company) => ({
                            problemId: id,
                            companyId: company.companyId,
                            frequency: company.frequency ?? 1,
                            lastAskedDate: company.lastAskedDate
                                ? new Date(company.lastAskedDate)
                                : undefined,
                        })),
                    });
                }
            }

            if (testCases) {
                await tx.testCase.deleteMany({
                    where: { problemId: id },
                });

                if (testCases.length > 0) {
                    await tx.testCase.createMany({
                        data: testCases.map((t) => ({
                            problemId: id,
                            input: t.input,
                            expectedOutput: t.expectedOutput,
                            isSample: t.isSample ?? false,
                            isActive: t.isActive ?? true,
                            explanation: t.explanation,
                        })),
                    });
                }
            }

            return tx.problem.findUnique({
                where: { id },
                include: {
                    problemTags: { include: { tag: true } },
                    problemCompanies: { include: { company: true } },
                    testCases: true,
                },
            });
        });
    }
}
