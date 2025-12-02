import { Language } from '@leetcode/database';
import { Injectable } from '@nestjs/common';
import { ExecutionResult } from '@leetcode/types';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { LANG_CONFIGS } from '@leetcode/constants';

@Injectable()
export class ExecutionService {
    async runTestCases(
        language: Language,
        code: string,
        testCases: {
            input: string;
            output: string;
        }[],
    ) {
        const results: ExecutionResult[] = [];
        for (const testCase of testCases) {
            const result = await this.executeCode(language, code, testCase.input, testCase.output);
            results.push(result);
        }
        return results;
    }

    private async executeCode(
        language: string,
        code: string,
        input: string,
        expectedOutput: string,
        timeout: number = 30000,
    ): Promise<ExecutionResult> {
        if (!LANG_CONFIGS[language]) {
            return { success: false, output: 'Unsupported language' };
        }

        const tempDir = path.resolve(process.cwd(), 'sandbox');
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

        const fileExtension = {
            cpp: 'cpp',
            python: 'py',
            java: 'java',
            javascript: 'js',
            go: 'go',
            rust: 'rs',
            csharp: 'cs',
            ruby: 'rb',
            swift: 'swift',
            php: 'php',
            kotlin: 'kt',
            dart: 'dart',
            r: 'R',
            perl: 'pl',
            typescript: 'ts',
            haskell: 'hs',
        }[language];

        const fileName = language === 'java' ? 'Solution' : 'solution';
        const filePath = path.join(tempDir, `${fileName}.${fileExtension}`);

        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        fs.writeFileSync(filePath, code);

        const dockerArgs = [
            'run',
            '--rm',
            '--network=none',
            '--memory=128m',
            '--cpus=0.5',
            '--pids-limit=50',
            '-v',
            `${tempDir}:/sandbox`,
            LANG_CONFIGS[language].image,
        ];

        return new Promise((resolve) => {
            const compileCommand = LANG_CONFIGS[language].compile;
            const runCommand = LANG_CONFIGS[language].run;

            const executeProcess = (
                command: string[],
                callback: (result: ExecutionResult) => void,
            ) => {
                try {
                    const fullCommand = input
                        ? ['sh', '-c', `echo "${input}" | ${command.join(' ')}`]
                        : command;

                    const process = spawn('docker', [...dockerArgs, ...fullCommand]);

                    let output = '';
                    let errorOutput = '';

                    process.stdin.write(input + '\n');
                    process.stdin.end();

                    process.stdout.on('data', (data) => (output += data.toString()));
                    process.stderr.on('data', (data) => (errorOutput += data.toString()));

                    process.on('close', (code) => {
                        callback({
                            success: code === 0 && expectedOutput.trim() === output.trim(),
                            output: output || errorOutput,
                        });
                    });

                    const timer = setTimeout(() => {
                        process.kill();
                        callback({
                            success: false,
                            output: 'Time Limit Exceeded',
                        });
                    }, timeout);
                    process.on('close', () => clearTimeout(timer));
                } catch (error) {
                    console.error(error);
                    callback({
                        success: false,
                        output: 'Something went wrong',
                    });
                }
            };

            if (compileCommand) {
                executeProcess(compileCommand, (compileResult) => {
                    if (!compileResult.success && compileResult.output) {
                        resolve({
                            success: false,
                            output: 'Compilation Error: ' + compileResult.output,
                        });
                    } else {
                        executeProcess(runCommand, resolve);
                    }
                });
            } else {
                executeProcess(runCommand, resolve);
            }
        });
    }
}
