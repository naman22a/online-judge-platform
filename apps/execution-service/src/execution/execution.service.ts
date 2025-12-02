import { Injectable } from '@nestjs/common';
import { spawn } from 'child_process';
import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import { Language } from '@leetcode/database';
import { ExecutionResult } from '@leetcode/types';
import { LANG_CONFIGS } from '@leetcode/constants';

@Injectable()
export class ExecutionService {
    async runTestCases(
        language: Language,
        code: string,
        testCases: { input: string; output: string }[],
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

        const executionId = `exec_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        const tempDir = path.join('/tmp/leetcode-sandbox', executionId);
        if (!fsSync.existsSync(tempDir)) {
            fsSync.mkdirSync(tempDir, { recursive: true });
        }

        const fileExtension = this.getFileExtension(language);
        const fileName = language === 'java' ? 'Solution' : 'solution';
        const filePath = path.join(tempDir, `${fileName}.${fileExtension}`);

        try {
            fsSync.writeFileSync(filePath, code);

            // Verify file was created
            if (!fsSync.existsSync(filePath)) {
                return { success: false, output: 'Failed to create code file' };
            }

            console.log(`File created at: ${filePath}`); // Debug log
        } catch (error) {
            console.error('File write error:', error);
            return { success: false, output: 'Failed to write code file' };
        }

        // Cleanup function
        const cleanup = async () => {
            try {
                await fs.rm(tempDir, { recursive: true, force: true });
            } catch (error) {
                console.error('Cleanup error:', error);
            }
        };

        const dockerArgs = [
            'run',
            '--rm',
            '--network=none',
            '--memory=128m',
            '--cpus=0.5',
            '--pids-limit=50',
            '-v',
            `${tempDir}:/workspace`,
            '-w',
            '/workspace',
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
                    const process = spawn('docker', [...dockerArgs, ...command]);
                    let output = '';
                    let errorOutput = '';
                    let isTimedOut = false;

                    const timer = setTimeout(() => {
                        isTimedOut = true;
                        process.kill('SIGKILL');
                    }, timeout);

                    // Write input to stdin
                    if (input) {
                        process.stdin.write(input + '\n');
                    }
                    process.stdin.end();

                    process.stdout.on('data', (data) => {
                        output += data.toString();
                    });

                    process.stderr.on('data', (data) => {
                        errorOutput += data.toString();
                    });

                    process.on('error', (error) => {
                        clearTimeout(timer);
                        callback({
                            success: false,
                            output: `Process error: ${error.message}`,
                        });
                    });

                    process.on('close', (code) => {
                        clearTimeout(timer);

                        if (isTimedOut) {
                            callback({
                                success: false,
                                output: 'Time Limit Exceeded',
                            });
                            return;
                        }

                        callback({
                            success: code === 0 && expectedOutput.trim() === output.trim(),
                            output: output || errorOutput,
                        });
                    });
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
                    if (!compileResult.success) {
                        cleanup().finally(() => {
                            resolve({
                                success: false,
                                output: 'Compilation Error: ' + compileResult.output,
                            });
                        });
                    } else {
                        executeProcess(runCommand, (runResult) => {
                            cleanup().finally(() => resolve(runResult));
                        });
                    }
                });
            } else {
                executeProcess(runCommand, (runResult) => {
                    cleanup().finally(() => resolve(runResult));
                });
            }
        });
    }

    private getFileExtension(language: string): string {
        const extensions: Record<string, string> = {
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
        };
        return extensions[language] || 'txt';
    }
}
