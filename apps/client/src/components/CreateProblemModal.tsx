import { useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { X, Plus, Trash2 } from 'lucide-react';
import * as api from '@/api';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';

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
                <Button onClick={() => setIsOpen(true)}>Create Problem</Button>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/90 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-2xl font-bold">Create Problem</h2>
                    <button onClick={() => setIsOpen(false)}>
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Form Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-6">
                        {/* Basic Info */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Basic Information</h3>

                            <div>
                                <Label className="mb-1">
                                    Title <span className="text-red-500">*</span>
                                </Label>
                                <Input {...register('title')} placeholder="Two Sum" />
                                {errors.title && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.title.message}
                                    </p>
                                )}
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <Label className="mb-1">
                                        Slug <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="flex gap-2">
                                        <Input {...register('slug')} placeholder="two-sum" />
                                        <Button type="button" onClick={generateSlug}>
                                            Generate
                                        </Button>
                                    </div>
                                    {errors.slug && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.slug.message}
                                        </p>
                                    )}
                                </div>

                                <div className="w-48">
                                    <Label className="mb-1">
                                        Difficulty <span className="text-red-500">*</span>
                                    </Label>

                                    <Controller
                                        control={control}
                                        name="difficulty"
                                        render={({ field }) => (
                                            <Select
                                                value={field.value}
                                                onValueChange={field.onChange}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select a difficulty" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Difficulty</SelectLabel>
                                                        <SelectItem value="Easy">Easy</SelectItem>
                                                        <SelectItem value="Medium">
                                                            Medium
                                                        </SelectItem>
                                                        <SelectItem value="Hard">Hard</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />

                                    {/* <Select {...register('difficulty')}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select a difficulty" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Difficulty</SelectLabel>
                                                <SelectItem value="Easy">Easy</SelectItem>
                                                <SelectItem value="Medium">Medium</SelectItem>
                                                <SelectItem value="Hard">Hard</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select> */}
                                </div>
                            </div>

                            <div>
                                <Label className="mb-1">
                                    Description <span className="text-red-500">*</span>
                                </Label>
                                <Textarea
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
                                <Label className="mb-1">Constraints</Label>
                                <Textarea
                                    {...register('constraints')}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="1 <= nums.length <= 10^4"
                                />
                            </div>
                        </div>

                        {/* Tags & Companies */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Tags & Companies</h3>
                            <div>
                                <Label className="mb-1">
                                    Tags <span className="text-red-500">*</span>
                                </Label>
                                <NativeSelect
                                    multiple
                                    value={(watch('tags') ?? []).map(String)}
                                    onChange={(e) => {
                                        const selected = Array.from(
                                            e.target.selectedOptions,
                                            (opt) => Number(opt.value),
                                        );
                                        setValue('tags', selected, { shouldValidate: true });
                                    }}
                                    className="h-52"
                                    size={availableTags?.length}
                                >
                                    {availableTags?.map((tag) => (
                                        <NativeSelectOption key={tag.id} value={tag.id}>
                                            {tag.name}
                                        </NativeSelectOption>
                                    ))}
                                </NativeSelect>
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
                                <Label className="mb-2">Companies</Label>
                                <div className="space-y-2">
                                    {companyFields.map((field, index) => (
                                        <div key={field.id} className="flex gap-2">
                                            <NativeSelect
                                                {...register(
                                                    `companies.${index}.companyId` as const,
                                                    { valueAsNumber: true },
                                                )}
                                                className="w-full"
                                            >
                                                <NativeSelectOption value="">
                                                    Select company...
                                                </NativeSelectOption>
                                                {availableCompanies?.map((company) => (
                                                    <NativeSelectOption
                                                        key={company.id}
                                                        value={company.id}
                                                    >
                                                        {company.name}
                                                    </NativeSelectOption>
                                                ))}
                                            </NativeSelect>
                                            <Input
                                                className="w-20"
                                                type="number"
                                                {...register(
                                                    `companies.${index}.frequency` as const,
                                                    { valueAsNumber: true },
                                                )}
                                                placeholder="Freq"
                                                min="1"
                                                max="10"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeCompany(index)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-md dark:hover:bg-red-800"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ))}
                                    <Button
                                        type="button"
                                        className="mt-5"
                                        onClick={() =>
                                            appendCompany({ companyId: 0, frequency: 1 })
                                        }
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add Company
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Hints */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Hints</h3>
                            <div className="space-y-2">
                                {hintFields.map((field, index) => (
                                    <div key={field.id} className="flex gap-2">
                                        <Input
                                            {...register(`hints.${index}` as const)}
                                            placeholder={`Hint ${index + 1}`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeHint(index)}
                                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-800 rounded-md"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                                <Button
                                    className="mt-5"
                                    type="button"
                                    onClick={() => appendHint('')}
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Hint
                                </Button>
                            </div>
                        </div>

                        {/* Test Cases */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">
                                Test Cases <span className="text-red-500">*</span>
                            </h3>
                            <div className="space-y-4">
                                {testCaseFields.map((field, index) => (
                                    <div
                                        key={field.id}
                                        className="border border-gray-200 rounded-lg p-4 space-y-3"
                                    >
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-medium">Test Case {index + 1}</h4>
                                            <div className="flex items-center gap-3">
                                                <Label className="flex items-center gap-2 text-sm">
                                                    <Input
                                                        type="checkbox"
                                                        {...register(
                                                            `testCases.${index}.isSample` as const,
                                                        )}
                                                    />
                                                    Sample
                                                </Label>
                                                {testCaseFields.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeTestCase(index)}
                                                        className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-800 rounded"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <Label className="mb-1">Input</Label>
                                                <Textarea
                                                    {...register(
                                                        `testCases.${index}.input` as const,
                                                    )}
                                                    rows={3}
                                                    placeholder="[2,7,11,15], 9"
                                                />
                                            </div>
                                            <div>
                                                <Label className="mb-1">Expected Output</Label>
                                                <Textarea
                                                    {...register(
                                                        `testCases.${index}.expectedOutput` as const,
                                                    )}
                                                    rows={3}
                                                    placeholder="[0,1]"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <Label className="mb-1">Explanation</Label>
                                            <Input
                                                {...register(
                                                    `testCases.${index}.explanation` as const,
                                                )}
                                                placeholder="Optional explanation"
                                            />
                                        </div>
                                    </div>
                                ))}
                                <Button
                                    type="button"
                                    onClick={() =>
                                        appendTestCase({
                                            input: '',
                                            expectedOutput: '',
                                            isSample: false,
                                            explanation: '',
                                        })
                                    }
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Test Case
                                </Button>
                            </div>
                            {errors.testCases && (
                                <p className="text-red-500 text-sm">{errors.testCases.message}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t">
                    <Button variant="outline" type="button" onClick={() => setIsOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit(onSubmit)} disabled={mutation.isPending}>
                        {mutation.isPending ? 'Creating...' : 'Create Problem'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
