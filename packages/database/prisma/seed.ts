// packages/database/prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // ===========================
    //         TAGS
    // ===========================
    const tags = await Promise.all([
        prisma.tag.upsert({
            where: { slug: 'array' },
            update: {},
            create: { name: 'Array', slug: 'array' },
        }),
        prisma.tag.upsert({
            where: { slug: 'string' },
            update: {},
            create: { name: 'String', slug: 'string' },
        }),
        prisma.tag.upsert({
            where: { slug: 'hash-table' },
            update: {},
            create: { name: 'Hash Table', slug: 'hash-table' },
        }),
        prisma.tag.upsert({
            where: { slug: 'dynamic-programming' },
            update: {},
            create: { name: 'Dynamic Programming', slug: 'dynamic-programming' },
        }),
        prisma.tag.upsert({
            where: { slug: 'math' },
            update: {},
            create: { name: 'Math', slug: 'math' },
        }),
        prisma.tag.upsert({
            where: { slug: 'sorting' },
            update: {},
            create: { name: 'Sorting', slug: 'sorting' },
        }),
        prisma.tag.upsert({
            where: { slug: 'greedy' },
            update: {},
            create: { name: 'Greedy', slug: 'greedy' },
        }),
        prisma.tag.upsert({
            where: { slug: 'depth-first-search' },
            update: {},
            create: { name: 'Depth-First Search', slug: 'depth-first-search' },
        }),
        prisma.tag.upsert({
            where: { slug: 'breadth-first-search' },
            update: {},
            create: { name: 'Breadth-First Search', slug: 'breadth-first-search' },
        }),
        prisma.tag.upsert({
            where: { slug: 'binary-search' },
            update: {},
            create: { name: 'Binary Search', slug: 'binary-search' },
        }),
        prisma.tag.upsert({
            where: { slug: 'tree' },
            update: {},
            create: { name: 'Tree', slug: 'tree' },
        }),
        prisma.tag.upsert({
            where: { slug: 'graph' },
            update: {},
            create: { name: 'Graph', slug: 'graph' },
        }),
        prisma.tag.upsert({
            where: { slug: 'two-pointers' },
            update: {},
            create: { name: 'Two Pointers', slug: 'two-pointers' },
        }),
        prisma.tag.upsert({
            where: { slug: 'sliding-window' },
            update: {},
            create: { name: 'Sliding Window', slug: 'sliding-window' },
        }),
        prisma.tag.upsert({
            where: { slug: 'backtracking' },
            update: {},
            create: { name: 'Backtracking', slug: 'backtracking' },
        }),
        prisma.tag.upsert({
            where: { slug: 'stack' },
            update: {},
            create: { name: 'Stack', slug: 'stack' },
        }),
        prisma.tag.upsert({
            where: { slug: 'linked-list' },
            update: {},
            create: { name: 'Linked List', slug: 'linked-list' },
        }),
        prisma.tag.upsert({
            where: { slug: 'heap' },
            update: {},
            create: { name: 'Heap', slug: 'heap' },
        }),
        prisma.tag.upsert({
            where: { slug: 'bit-manipulation' },
            update: {},
            create: { name: 'Bit Manipulation', slug: 'bit-manipulation' },
        }),
        prisma.tag.upsert({
            where: { slug: 'recursion' },
            update: {},
            create: { name: 'Recursion', slug: 'recursion' },
        }),
    ]);

    console.log(`✅ Seeded ${tags.length} tags`);

    // ===========================
    //        COMPANIES
    // ===========================
    const companies = await Promise.all([
        prisma.company.upsert({
            where: { slug: 'google' },
            update: {},
            create: { name: 'Google', slug: 'google' },
        }),
        prisma.company.upsert({
            where: { slug: 'amazon' },
            update: {},
            create: { name: 'Amazon', slug: 'amazon' },
        }),
        prisma.company.upsert({
            where: { slug: 'microsoft' },
            update: {},
            create: { name: 'Microsoft', slug: 'microsoft' },
        }),
        prisma.company.upsert({
            where: { slug: 'meta' },
            update: {},
            create: { name: 'Meta', slug: 'meta' },
        }),
        prisma.company.upsert({
            where: { slug: 'apple' },
            update: {},
            create: { name: 'Apple', slug: 'apple' },
        }),
        prisma.company.upsert({
            where: { slug: 'netflix' },
            update: {},
            create: { name: 'Netflix', slug: 'netflix' },
        }),
        prisma.company.upsert({
            where: { slug: 'uber' },
            update: {},
            create: { name: 'Uber', slug: 'uber' },
        }),
        prisma.company.upsert({
            where: { slug: 'flipkart' },
            update: {},
            create: { name: 'Flipkart', slug: 'flipkart' },
        }),
        prisma.company.upsert({
            where: { slug: 'adobe' },
            update: {},
            create: { name: 'Adobe', slug: 'adobe' },
        }),
        prisma.company.upsert({
            where: { slug: 'goldman-sachs' },
            update: {},
            create: { name: 'Goldman Sachs', slug: 'goldman-sachs' },
        }),
    ]);

    console.log(`✅ Seeded ${companies.length} companies`);

    const argon2 = await import('argon2');

    // ===========================
    //      ADMIN USER
    // ===========================
    const admin = await prisma.user.upsert({
        where: { email: 'admin@gmail.com' },
        update: {
            username: 'admin',
            email: 'admin@gmail.com',
            password: await argon2.hash(process.env.ADMIN_PASSWORD),
            emailVerfied: true,
            is_admin: true,
            full_name: 'Admin',
        },
        create: {
            username: 'admin',
            email: 'admin@gmail.com',
            password: await argon2.hash(process.env.ADMIN_PASSWORD),
            emailVerfied: true,
            is_admin: true,
            full_name: 'Admin',
        },
    });

    console.log(`✅ Seeded admin user (id: ${admin.id})`);

    // ===========================
    //      GUEST USER
    // ===========================
    const test = await prisma.user.upsert({
        where: { email: 'test@gmail.com' },
        update: {},
        create: {
            username: 'test',
            email: 'test@gmail.com',
            password: await argon2.hash('test123'),
            emailVerfied: true,
            is_admin: false,
            full_name: 'Test',
        },
    });

    console.log(`✅ Seeded test user (id: ${test.id})`);

    // ===========================
    //        PROBLEMS
    // ===========================
    const twoSum = await prisma.problem.upsert({
        where: { slug: 'two-sum' },
        update: {},
        create: {
            title: 'Two Sum',
            slug: 'two-sum',
            description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.`,
            difficulty: 'Easy',
            constraints:
                '2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9',
            hints: ['Try using a hash map to store complements'],
            createdById: admin.id,
            testCases: {
                create: [
                    {
                        input: '[2,7,11,15]\n9',
                        expectedOutput: '[0,1]',
                        isSample: true,
                        explanation: 'nums[0] + nums[1] = 2 + 7 = 9',
                    },
                    {
                        input: '[3,2,4]\n6',
                        expectedOutput: '[1,2]',
                        isSample: true,
                        explanation: 'nums[1] + nums[2] = 2 + 4 = 6',
                    },
                    { input: '[3,3]\n6', expectedOutput: '[0,1]', isSample: false },
                    { input: '[1,2,3,4,5]\n9', expectedOutput: '[3,4]', isSample: false },
                ],
            },
            problemTags: {
                create: [
                    { tagId: tags.find((t) => t.slug === 'array')!.id },
                    { tagId: tags.find((t) => t.slug === 'hash-table')!.id },
                ],
            },
            problemCompanies: {
                create: [
                    { companyId: companies.find((c) => c.slug === 'google')!.id, frequency: 95 },
                    { companyId: companies.find((c) => c.slug === 'amazon')!.id, frequency: 88 },
                ],
            },
        },
    });

    const validAnagram = await prisma.problem.upsert({
        where: { slug: 'valid-anagram' },
        update: {},
        create: {
            title: 'Valid Anagram',
            slug: 'valid-anagram',
            description: `Given two strings \`s\` and \`t\`, return \`true\` if \`t\` is an anagram of \`s\`, and \`false\` otherwise.`,
            difficulty: 'Easy',
            constraints:
                '1 <= s.length, t.length <= 5 * 10^4\ns and t consist of lowercase English letters.',
            hints: ['Try sorting both strings', 'Or use a frequency counter'],
            createdById: admin.id,
            testCases: {
                create: [
                    { input: '"anagram"\n"nagaram"', expectedOutput: 'true', isSample: true },
                    { input: '"rat"\n"car"', expectedOutput: 'false', isSample: true },
                    { input: '"a"\n"a"', expectedOutput: 'true', isSample: false },
                ],
            },
            problemTags: {
                create: [
                    { tagId: tags.find((t) => t.slug === 'string')!.id },
                    { tagId: tags.find((t) => t.slug === 'hash-table')!.id },
                    { tagId: tags.find((t) => t.slug === 'sorting')!.id },
                ],
            },
            problemCompanies: {
                create: [
                    { companyId: companies.find((c) => c.slug === 'amazon')!.id, frequency: 72 },
                ],
            },
        },
    });

    const climbingStairs = await prisma.problem.upsert({
        where: { slug: 'climbing-stairs' },
        update: {},
        create: {
            title: 'Climbing Stairs',
            slug: 'climbing-stairs',
            description: `You are climbing a staircase. It takes \`n\` steps to reach the top.\n\nEach time you can either climb \`1\` or \`2\` steps. In how many distinct ways can you climb to the top?`,
            difficulty: 'Easy',
            constraints: '1 <= n <= 45',
            hints: ['Think about Fibonacci', 'dp[i] = dp[i-1] + dp[i-2]'],
            createdById: admin.id,
            testCases: {
                create: [
                    { input: '2', expectedOutput: '2', isSample: true, explanation: '1+1, 2' },
                    {
                        input: '3',
                        expectedOutput: '3',
                        isSample: true,
                        explanation: '1+1+1, 1+2, 2+1',
                    },
                    { input: '5', expectedOutput: '8', isSample: false },
                    { input: '10', expectedOutput: '89', isSample: false },
                ],
            },
            problemTags: {
                create: [
                    { tagId: tags.find((t) => t.slug === 'dynamic-programming')!.id },
                    { tagId: tags.find((t) => t.slug === 'math')!.id },
                    { tagId: tags.find((t) => t.slug === 'recursion')!.id },
                ],
            },
            problemCompanies: {
                create: [
                    { companyId: companies.find((c) => c.slug === 'amazon')!.id, frequency: 60 },
                    { companyId: companies.find((c) => c.slug === 'google')!.id, frequency: 55 },
                    { companyId: companies.find((c) => c.slug === 'adobe')!.id, frequency: 40 },
                ],
            },
        },
    });

    const bestTimeToBuyStock = await prisma.problem.upsert({
        where: { slug: 'best-time-to-buy-and-sell-stock' },
        update: {},
        create: {
            title: 'Best Time to Buy and Sell Stock',
            slug: 'best-time-to-buy-and-sell-stock',
            description: `You are given an array \`prices\` where \`prices[i]\` is the price of a given stock on the \`i-th\` day.\n\nYou want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.\n\nReturn the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return \`0\`.`,
            difficulty: 'Easy',
            constraints: '1 <= prices.length <= 10^5\n0 <= prices[i] <= 10^4',
            hints: ['Track the minimum price seen so far'],
            createdById: admin.id,
            testCases: {
                create: [
                    {
                        input: '[7,1,5,3,6,4]',
                        expectedOutput: '5',
                        isSample: true,
                        explanation: 'Buy on day 2, sell on day 5',
                    },
                    {
                        input: '[7,6,4,3,1]',
                        expectedOutput: '0',
                        isSample: true,
                        explanation: 'No profit possible',
                    },
                    { input: '[2,4,1]', expectedOutput: '2', isSample: false },
                ],
            },
            problemTags: {
                create: [
                    { tagId: tags.find((t) => t.slug === 'array')!.id },
                    { tagId: tags.find((t) => t.slug === 'dynamic-programming')!.id },
                    { tagId: tags.find((t) => t.slug === 'sliding-window')!.id },
                ],
            },
            problemCompanies: {
                create: [
                    { companyId: companies.find((c) => c.slug === 'amazon')!.id, frequency: 80 },
                    { companyId: companies.find((c) => c.slug === 'flipkart')!.id, frequency: 65 },
                ],
            },
        },
    });

    const longestSubstring = await prisma.problem.upsert({
        where: { slug: 'longest-substring-without-repeating-characters' },
        update: {},
        create: {
            title: 'Longest Substring Without Repeating Characters',
            slug: 'longest-substring-without-repeating-characters',
            description: `Given a string \`s\`, find the length of the longest substring without repeating characters.`,
            difficulty: 'Medium',
            constraints:
                '0 <= s.length <= 5 * 10^4\ns consists of English letters, digits, symbols and spaces.',
            hints: ['Use a sliding window with a set'],
            createdById: admin.id,
            testCases: {
                create: [
                    {
                        input: '"abcabcbb"',
                        expectedOutput: '3',
                        isSample: true,
                        explanation: 'abc',
                    },
                    { input: '"bbbbb"', expectedOutput: '1', isSample: true, explanation: 'b' },
                    { input: '"pwwkew"', expectedOutput: '3', isSample: true, explanation: 'wke' },
                    { input: '""', expectedOutput: '0', isSample: false },
                ],
            },
            problemTags: {
                create: [
                    { tagId: tags.find((t) => t.slug === 'string')!.id },
                    { tagId: tags.find((t) => t.slug === 'hash-table')!.id },
                    { tagId: tags.find((t) => t.slug === 'sliding-window')!.id },
                    { tagId: tags.find((t) => t.slug === 'two-pointers')!.id },
                ],
            },
            problemCompanies: {
                create: [
                    { companyId: companies.find((c) => c.slug === 'amazon')!.id, frequency: 85 },
                    { companyId: companies.find((c) => c.slug === 'microsoft')!.id, frequency: 75 },
                    { companyId: companies.find((c) => c.slug === 'google')!.id, frequency: 70 },
                ],
            },
        },
    });

    console.log(
        `✅ Seeded ${[twoSum, validAnagram, climbingStairs, bestTimeToBuyStock, longestSubstring].length} problems`,
    );
    console.log('🌱 Seeding complete');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
