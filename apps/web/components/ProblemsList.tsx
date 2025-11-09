'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import * as api from '@/api';
import { IProblem, ProblemDifficulty } from '@/api/problems/types';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const ProblemsList: React.FC = () => {
    const limit = 10;
    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    const [searchInput, setSearchInput] = useState('');
    const [search, setSearch] = useState('');
    const [difficulty, setDifficulty] = useState<'all' | ProblemDifficulty>('all');
    const [sortBy, setSortBy] = useState<'title' | 'createdAt'>('createdAt');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    const {
        data,
        isLoading,
        isError,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        refetch,
    } = useInfiniteQuery({
        queryKey: ['problems', search, difficulty, sortBy, sortOrder],
        queryFn: ({ pageParam = 0 }) =>
            api.problems.getProblems({
                limit: String(limit),
                offset: String(pageParam),
                name: search || undefined,
                difficulty: difficulty === 'all' ? undefined : difficulty,
                sortBy,
                sortOrder,
            }),
        getNextPageParam: (lastPage) => {
            const { total, offset, limit } = lastPage;
            const nextOffset = offset + limit;
            return nextOffset < total ? nextOffset : undefined;
        },
        initialPageParam: 0,
    });

    useEffect(() => {
        const handler = setTimeout(() => {
            setSearch(searchInput.trim());
        }, 500); // 500ms debounce
        return () => clearTimeout(handler);
    }, [searchInput]);

    useEffect(() => {
        if (!hasNextPage || isFetchingNextPage) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting) {
                    fetchNextPage();
                }
            },
            { threshold: 1.0 },
        );

        const currentRef = loadMoreRef.current;
        if (currentRef) observer.observe(currentRef);

        return () => {
            if (currentRef) observer.unobserve(currentRef);
        };
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="animate-spin w-6 h-6 mr-2" />
                <span>Loading problems...</span>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="text-center mt-10 space-y-3">
                <p className="text-red-500 font-medium">
                    Failed to load problems: {(error as any)?.message ?? 'Unknown error'}
                </p>
                <Button onClick={() => refetch()}>Retry</Button>
            </div>
        );
    }

    const problems: IProblem[] = data?.pages.flatMap((page) => page.data) ?? [];

    return (
        <div className="px-0 md:px-20 pt-5">
            <h1 className="font-semibold text-4xl mb-5">Problems</h1>

            {/* Search / Filter / Sort Controls */}
            <div className="flex flex-wrap gap-4 mb-6">
                {/* Search */}
                <Input
                    type="text"
                    placeholder="Search by title..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="w-[300px]"
                />

                {/* Difficulty Filter */}
                <Select value={difficulty} onValueChange={(val) => setDifficulty(val as any)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Difficulties</SelectItem>
                        <SelectItem value={ProblemDifficulty.EASY}>Easy</SelectItem>
                        <SelectItem value={ProblemDifficulty.MEDIUM}>Medium</SelectItem>
                        <SelectItem value={ProblemDifficulty.HARD}>Hard</SelectItem>
                    </SelectContent>
                </Select>

                {/* Sort By */}
                <Select
                    value={sortBy}
                    onValueChange={(val) => setSortBy(val as 'title' | 'createdAt')}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="createdAt">Created Date</SelectItem>
                        <SelectItem value="title">Title</SelectItem>
                    </SelectContent>
                </Select>

                {/* Sort Order */}
                <Select
                    value={sortOrder}
                    onValueChange={(val) => setSortOrder(val as 'asc' | 'desc')}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sort Order" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="asc">Ascending</SelectItem>
                        <SelectItem value="desc">Descending</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Problems */}
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>S.No</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Tags</TableHead>
                        <TableHead>Difficulty</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {problems.map((problem, index) => (
                        <TableRow key={problem.id}>
                            <TableCell>{index + 1}.</TableCell>
                            <TableCell>
                                <Link
                                    className="no-underline text-black dark:text-white"
                                    href={`/problems/${problem.slug}`}
                                >
                                    {problem.title}
                                </Link>
                            </TableCell>
                            <TableCell>{problem.description.slice(0, 100)}...</TableCell>
                            <TableCell>
                                {problem.problemTags.map((tag) => (
                                    <span key={tag.tag.slug} className="m-2">
                                        {tag.tag.name}
                                    </span>
                                ))}
                            </TableCell>
                            <TableCell
                                className={cn(
                                    'uppercase font-semibold',
                                    problem.difficulty === ProblemDifficulty.EASY &&
                                        'text-green-500',
                                    problem.difficulty === ProblemDifficulty.MEDIUM &&
                                        'text-yellow-500',
                                    problem.difficulty === ProblemDifficulty.HARD && 'text-red-500',
                                )}
                            >
                                {problem.difficulty}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* for auto-loading */}
            <div ref={loadMoreRef} className="h-10"></div>

            {/* no more data */}
            {!hasNextPage && (
                <div className="flex justify-center py-5 dark:text-gray-300 text-gray-400">
                    No more problems
                </div>
            )}
        </div>
    );
};

export default ProblemsList;
