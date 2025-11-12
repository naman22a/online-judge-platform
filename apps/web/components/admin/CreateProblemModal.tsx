'use client';

import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { X, Plus, Trash2 } from 'lucide-react';
import * as api from '@/api';
import { toast } from 'sonner';

const problemSchema = z.object({
    title: z.string().min(1, 'Title is required').max(255),
    slug: z
        .string()
        .min(1, 'Slug is required')
        .max(255)
        .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens'),
    description: z.string().min(1, 'Description is required'),
    difficulty: z.enum(['Easy', 'Medium', 'Hard']),
    constraints: z.string().optional(),
    hints: z.array(z.string()).default([]),
    similarProblems: z.array(z.number()).default([]),
    tags: z.array(z.number()).min(1, 'At least one tag is required'),
    companies: z
        .array(
            z.object({
                companyId: z.number(),
                frequency: z.number().min(1).max(10).default(1),
            }),
        )
        .default([]),
    testCases: z
        .array(
            z.object({
                input: z.string().min(1, 'Input is required'),
                expectedOutput: z.string().min(1, 'Output is required'),
                isSample: z.boolean().default(false),
                explanation: z.string().optional(),
            }),
        )
        .min(1, 'At least one test case is required'),
});

type ProblemFormData = z.infer<typeof problemSchema>;

export default function CreateProblemModal() {
    const [isOpen, setIsOpen] = useState(false);
    const queryClient = useQueryClient();

    const { data: availableCompanies } = useQuery({
        queryKey: ['companies'],
        queryFn: api.companies.findAll,
    });

    const { data: availableTags } = useQuery({
        queryKey: ['tags'],
        queryFn: api.tags.findAll,
    });

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
        setValue,
    } = useForm<ProblemFormData>({
        resolver: zodResolver(problemSchema) as any,
        defaultValues: {
            difficulty: 'Medium',
            hints: [],
            similarProblems: [],
            tags: [],
            companies: [],
            testCases: [{ input: '', expectedOutput: '', isSample: true, explanation: '' }],
        },
    });

    const {
        fields: hintFields,
        append: appendHint,
        remove: removeHint,
    } = useFieldArray({
        control,
        name: 'hints' as any,
    });

    const {
        fields: testCaseFields,
        append: appendTestCase,
        remove: removeTestCase,
    } = useFieldArray({
        control,
        name: 'testCases',
    });

    const {
        fields: companyFields,
        append: appendCompany,
        remove: removeCompany,
    } = useFieldArray({
        control,
        name: 'companies',
    });

    const mutation = useMutation({
        mutationFn: api.problems.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['problems'] });
            setIsOpen(false);
            reset();
        },
    });

    const onSubmit = async (data: ProblemFormData) => {
        console.log(data);
        const newProblem = await mutation.mutateAsync(data);
        if (newProblem) {
            toast.success('Problem created');
            setIsOpen(false);
        } else {
            toast.error('Something went wrong');
        }
    };

    const generateSlug = () => {
        const title = watch('title');
        const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
        setValue('slug', slug);
    };

    if (!isOpen) {
        return (
            <div>
                <button
                    onClick={() => setIsOpen(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Create Problem
                </button>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-2xl font-bold text-gray-900">Create Problem</h2>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Form Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-6">
                        {/* Basic Info */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Basic Information
                            </h3>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    {...register('title')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Two Sum"
                                />
                                {errors.title && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.title.message}
                                    </p>
                                )}
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Slug <span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            {...register('slug')}
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="two-sum"
                                        />
                                        <button
                                            type="button"
                                            onClick={generateSlug}
                                            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm"
                                        >
                                            Generate
                                        </button>
                                    </div>
                                    {errors.slug && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.slug.message}
                                        </p>
                                    )}
                                </div>

                                <div className="w-48">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Difficulty <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        {...register('difficulty')}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="Easy">Easy</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Hard">Hard</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    {...register('description')}
                                    rows={6}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Problem description..."
                                />
                                {errors.description && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.description.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Constraints
                                </label>
                                <textarea
                                    {...register('constraints')}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="1 <= nums.length <= 10^4"
                                />
                            </div>
                        </div>

                        {/* Tags & Companies */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Tags & Companies
                            </h3>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tags <span className="text-red-500">*</span>
                                </label>
                                <select
                                    multiple
                                    value={(watch('tags') ?? []).map(String)}
                                    onChange={(e) => {
                                        const selected = Array.from(
                                            e.target.selectedOptions,
                                            (opt) => Number(opt.value),
                                        );
                                        setValue('tags', selected, { shouldValidate: true });
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    size={5}
                                >
                                    {availableTags?.map((tag) => (
                                        <option key={tag.id} value={tag.id}>
                                            {tag.name}
                                        </option>
                                    ))}
                                </select>
                                <p className="text-sm text-gray-500 mt-1">
                                    Hold Ctrl/Cmd to select multiple
                                </p>
                                {errors.tags && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.tags.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Companies
                                </label>
                                <div className="space-y-2">
                                    {companyFields.map((field, index) => (
                                        <div key={field.id} className="flex gap-2">
                                            <select
                                                {...register(
                                                    `companies.${index}.companyId` as const,
                                                    { valueAsNumber: true },
                                                )}
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="">Select company...</option>
                                                {availableCompanies?.map((company) => (
                                                    <option key={company.id} value={company.id}>
                                                        {company.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <input
                                                type="number"
                                                {...register(
                                                    `companies.${index}.frequency` as const,
                                                    { valueAsNumber: true },
                                                )}
                                                placeholder="Freq"
                                                min="1"
                                                max="10"
                                                className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeCompany(index)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            appendCompany({ companyId: 0, frequency: 1 })
                                        }
                                        className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add Company
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Hints */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900">Hints</h3>
                            <div className="space-y-2">
                                {hintFields.map((field, index) => (
                                    <div key={field.id} className="flex gap-2">
                                        <input
                                            {...register(`hints.${index}` as const)}
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder={`Hint ${index + 1}`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeHint(index)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => appendHint('')}
                                    className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Hint
                                </button>
                            </div>
                        </div>

                        {/* Test Cases */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Test Cases <span className="text-red-500">*</span>
                            </h3>
                            <div className="space-y-4">
                                {testCaseFields.map((field, index) => (
                                    <div
                                        key={field.id}
                                        className="border border-gray-200 rounded-lg p-4 space-y-3"
                                    >
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-medium text-gray-700">
                                                Test Case {index + 1}
                                            </h4>
                                            <div className="flex items-center gap-3">
                                                <label className="flex items-center gap-2 text-sm">
                                                    <input
                                                        type="checkbox"
                                                        {...register(
                                                            `testCases.${index}.isSample` as const,
                                                        )}
                                                        className="rounded"
                                                    />
                                                    Sample
                                                </label>
                                                {testCaseFields.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeTestCase(index)}
                                                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Input
                                                </label>
                                                <textarea
                                                    {...register(
                                                        `testCases.${index}.input` as const,
                                                    )}
                                                    rows={3}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono"
                                                    placeholder="[2,7,11,15], 9"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Expected Output
                                                </label>
                                                <textarea
                                                    {...register(
                                                        `testCases.${index}.expectedOutput` as const,
                                                    )}
                                                    rows={3}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono"
                                                    placeholder="[0,1]"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Explanation
                                            </label>
                                            <input
                                                {...register(
                                                    `testCases.${index}.explanation` as const,
                                                )}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                                placeholder="Optional explanation"
                                            />
                                        </div>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() =>
                                        appendTestCase({
                                            input: '',
                                            expectedOutput: '',
                                            isSample: false,
                                            explanation: '',
                                        })
                                    }
                                    className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Test Case
                                </button>
                            </div>
                            {errors.testCases && (
                                <p className="text-red-500 text-sm">{errors.testCases.message}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
                    <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit(onSubmit)}
                        disabled={mutation.isPending}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
                    >
                        {mutation.isPending ? 'Creating...' : 'Create Problem'}
                    </button>
                </div>
            </div>
        </div>
    );
}
