'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { TestCase } from '@/types/evaluation';

interface TestCasesTableProps {
  testCases: TestCase[];
}

const ITEMS_PER_PAGE = 10;

export function TestCasesTable({ testCases }: TestCasesTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredTestCases = useMemo(() => {
    return testCases.filter((tc) => {
      const matchesSearch =
        searchQuery === '' ||
        tc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tc.inputPrompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tc.metric.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || tc.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [testCases, searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredTestCases.length / ITEMS_PER_PAGE);
  const paginatedTestCases = filteredTestCases.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endIndex = Math.min(currentPage * ITEMS_PER_PAGE, filteredTestCases.length);

  function formatLatency(ms: number): string {
    if (ms >= 1000) {
      return `${(ms / 1000).toFixed(1)}s`;
    }
    return `${Math.round(ms)}ms`;
  }

  function getScoreColor(score: number): string {
    if (score >= 0.9) return 'text-[var(--accent-green)]';
    if (score >= 0.5) return 'text-[var(--warning)]';
    return 'text-[var(--error)]';
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
    >
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-base font-semibold">Detailed Test Cases</CardTitle>
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <Input
                  placeholder="Search test cases..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-9 w-[200px]"
                />
              </div>
              {/* Status Filter */}
              <Select
                value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger variant="outline" className="w-[130px]">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="passed">Passed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="border border-[var(--border)] rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-[var(--bg-subtle)] hover:bg-[var(--bg-subtle)]">
                  <TableHead className="w-[80px]">Status</TableHead>
                  <TableHead className="w-[100px]">Test Case ID</TableHead>
                  <TableHead>Input Prompt</TableHead>
                  <TableHead className="w-[140px]">Metric</TableHead>
                  <TableHead className="w-[80px]">Score</TableHead>
                  <TableHead className="w-[80px]">Latency</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedTestCases.map((tc) => (
                  <TableRow key={tc.id}>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          tc.status === 'passed'
                            ? 'bg-[var(--accent-green)]/10 text-[var(--accent-green)]'
                            : 'bg-[var(--error)]/10 text-[var(--error)]'
                        }`}
                      >
                        {tc.status === 'passed' ? 'Passed' : 'Failed'}
                      </span>
                    </TableCell>
                    <TableCell className="font-mono text-sm font-medium">{tc.id}</TableCell>
                    <TableCell className="max-w-[300px] truncate text-[var(--text-secondary)]">
                      {tc.inputPrompt}
                    </TableCell>
                    <TableCell className="text-[var(--text-secondary)]">{tc.metric}</TableCell>
                    <TableCell className={`font-semibold ${getScoreColor(tc.score)}`}>
                      {tc.score.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-[var(--text-secondary)]">
                      {formatLatency(tc.latency)}
                    </TableCell>
                  </TableRow>
                ))}
                {paginatedTestCases.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-[var(--text-muted)]">
                      No test cases found matching your criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4 text-sm">
            <p className="text-[var(--text-muted)]">
              Showing {startIndex} to {endIndex} of {filteredTestCases.length} results
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center rounded border border-[var(--border)] hover:bg-[var(--bg-subtle)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 flex items-center justify-center rounded text-sm font-medium transition-colors ${
                      pageNum === currentPage
                        ? 'bg-[var(--primary)] text-white'
                        : 'border border-[var(--border)] hover:bg-[var(--bg-subtle)]'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="w-8 h-8 flex items-center justify-center rounded border border-[var(--border)] hover:bg-[var(--bg-subtle)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
