'use client';

import { useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const testCaseSchema = z.object({
    input: z.string().min(1, 'Input is required'),
    expectedOutput: z.string().min(1, 'Expected output is required'),
    isSample: z.boolean().optional(),
    isActive: z.boolean().optional().default(true),
    explanation: z.string().optional(),
});

const tagSchema = z.object({
    tagId: z.preprocess(
        (val) => Number(val),
        z.number().int().positive('Tag ID must be a positive number'),
    ),
});

const problemSchema = z.object({
    title: z.string().min(3, 'Title is required'),
    slug: z.string().min(3, 'Slug is required'),
    description: z.string().min(5, 'Description is required'),
    difficulty: z.enum(['Easy', 'Medium', 'Hard']),
    constraints: z.string().min(1, 'Constraints are required'),
    hints: z
        .array(z.string().min(1, 'Hint cannot be empty'))
        .min(1, 'At least one hint is required'),
    similarProblems: z.array(z.number().int()).optional(),
    createdById: z.number().int().positive(),
    problemTags: z.array(tagSchema).min(1, 'At least one tag is required'),
    testCases: z.array(testCaseSchema).min(1, 'At least one test case is required'),
});

type ProblemFormData = z.infer<typeof problemSchema>;

function CreateProblemForm() {
    const [loading, setLoading] = useState(false);

    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ProblemFormData>({
        resolver: zodResolver(problemSchema) as any,
        defaultValues: {
            title: '',
            slug: '',
            description: '',
            difficulty: 'Easy',
            constraints: '',
            hints: [''],
            similarProblems: [],
            createdById: 1,
            problemTags: [{ tagId: 1 }],
            testCases: [
                { input: '', expectedOutput: '', isSample: false, isActive: true, explanation: '' },
            ],
        },
    });

    const {
        fields: hintFields,
        append: addHint,
        remove: removeHint,
    } = useFieldArray({
        control,
        name: 'hints' as any,
    });

    const {
        fields: tagFields,
        append: addTag,
        remove: removeTag,
    } = useFieldArray({
        control,
        name: 'problemTags',
    });

    const {
        fields: testCaseFields,
        append: addTestCase,
        remove: removeTestCase,
    } = useFieldArray({
        control,
        name: 'testCases',
    });

    const onSubmit = async (data: ProblemFormData) => {
        console.log(data);
        // setLoading(true);
        // try {
        //     const res = await fetch('/api/problems', {
        //         method: 'POST',
        //         headers: { 'Content-Type': 'application/json' },
        //         body: JSON.stringify(data),
        //     });

        //     if (!res.ok) throw new Error('Failed to create problem');
        //     alert('✅ Problem created successfully!');
        //     reset();
        // } catch (err) {
        //     console.error(err);
        //     alert('❌ Error creating problem');
        // } finally {
        //     setLoading(false);
        // }
    };

    return (
        <Card className="max-w-3xl mx-auto mt-8">
            <CardHeader>
                <CardTitle>Create New Problem</CardTitle>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Basic Info */}
                    <div>
                        <Label>Title</Label>
                        <Input {...register('title')} placeholder="Two Sum" />
                        {errors.title && (
                            <p className="text-red-500 text-sm">{errors.title.message}</p>
                        )}
                    </div>

                    <div>
                        <Label>Slug</Label>
                        <Input {...register('slug')} placeholder="two-sum" />
                        {errors.slug && (
                            <p className="text-red-500 text-sm">{errors.slug.message}</p>
                        )}
                    </div>

                    <div>
                        <Label>Description</Label>
                        <Textarea
                            {...register('description')}
                            placeholder="Given an array of integers..."
                        />
                        {errors.description && (
                            <p className="text-red-500 text-sm">{errors.description.message}</p>
                        )}
                    </div>

                    <div>
                        <Label>Difficulty</Label>
                        <Controller
                            control={control}
                            name="difficulty"
                            render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select difficulty" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Easy">Easy</SelectItem>
                                        <SelectItem value="Medium">Medium</SelectItem>
                                        <SelectItem value="Hard">Hard</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.difficulty && (
                            <p className="text-red-500 text-sm">{errors.difficulty.message}</p>
                        )}
                    </div>

                    <div>
                        <Label>Constraints</Label>
                        <Textarea
                            {...register('constraints')}
                            placeholder="2 <= nums.length <= 10^4"
                        />
                        {errors.constraints && (
                            <p className="text-red-500 text-sm">{errors.constraints.message}</p>
                        )}
                    </div>

                    {/* Hints */}
                    <div>
                        <Label>Hints</Label>
                        {hintFields.map((field, index) => (
                            <div key={field.id} className="flex gap-2 mb-2">
                                <Input {...register(`hints.${index}`)} placeholder="Hint text" />
                                <Button
                                    type="button"
                                    variant="destructive"
                                    onClick={() => removeHint(index)}
                                >
                                    Remove
                                </Button>
                            </div>
                        ))}
                        <Button type="button" onClick={() => addHint('')}>
                            + Add Hint
                        </Button>
                        {errors.hints && (
                            <p className="text-red-500 text-sm">{errors.hints.message}</p>
                        )}
                    </div>

                    {/* Tags */}
                    <div>
                        <Label>Problem Tags</Label>
                        {tagFields.map((field, index) => (
                            <div key={field.id} className="flex gap-2 mb-2">
                                <Input
                                    type="number"
                                    {...register(`problemTags.${index}.tagId` as const)}
                                    placeholder="Tag ID"
                                />
                                <Button
                                    type="button"
                                    variant="destructive"
                                    onClick={() => removeTag(index)}
                                >
                                    Remove
                                </Button>
                            </div>
                        ))}
                        <Button type="button" onClick={() => addTag({ tagId: 0 })}>
                            + Add Tag
                        </Button>
                        {errors.problemTags && (
                            <p className="text-red-500 text-sm">{errors.problemTags.message}</p>
                        )}
                    </div>

                    <Separator />

                    {/* Test Cases */}
                    <div>
                        <Label>Test Cases</Label>
                        {testCaseFields.map((field, index) => (
                            <div key={field.id} className="border p-3 rounded-lg mb-3 space-y-2">
                                <Input
                                    {...register(`testCases.${index}.input`)}
                                    placeholder="Input"
                                />
                                <Input
                                    {...register(`testCases.${index}.expectedOutput`)}
                                    placeholder="Expected Output"
                                />
                                <Input
                                    {...register(`testCases.${index}.explanation`)}
                                    placeholder="Explanation (optional)"
                                />

                                <div className="flex gap-3 text-sm">
                                    <label className="flex items-center gap-1">
                                        <input
                                            type="checkbox"
                                            {...register(`testCases.${index}.isSample`)}
                                        />{' '}
                                        Sample
                                    </label>
                                    <label className="flex items-center gap-1">
                                        <input
                                            type="checkbox"
                                            {...register(`testCases.${index}.isActive`)}
                                        />{' '}
                                        Active
                                    </label>
                                </div>

                                <Button
                                    type="button"
                                    variant="destructive"
                                    onClick={() => removeTestCase(index)}
                                >
                                    Remove Test Case
                                </Button>
                            </div>
                        ))}
                        <Button
                            type="button"
                            onClick={() =>
                                addTestCase({ input: '', expectedOutput: '', isActive: true })
                            }
                        >
                            + Add Test Case
                        </Button>
                        {errors.testCases && (
                            <p className="text-red-500 text-sm">{errors.testCases.message}</p>
                        )}
                    </div>

                    {/* Submit */}
                    <Button type="submit" disabled={loading} className={cn('w-full')}>
                        {loading ? 'Creating...' : 'Create Problem'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}

export default CreateProblemForm;
