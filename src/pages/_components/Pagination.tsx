import React from 'react';

interface PaginationProps {
    currentPage: number;
    pageCount: number;
    leftCount?: number;
    rightCount?: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, pageCount, leftCount = 2, rightCount = 2, onPageChange }) => {
    const handleChangePage = (page: number) => {
        onPageChange(page);
    };

    const leftPagin = Math.max(currentPage - leftCount, 1);
    const rightPagin = Math.min(currentPage + rightCount, pageCount);

    return (
        <nav>
            <ul className="pagination justify-content-center">
                {currentPage > 1 && (
                    <li className="page-item prev-item">
                        <button className="page-link" onClick={() => handleChangePage(currentPage - 1)}>&laquo;</button>
                    </li>
                )}
                {Array.from({ length: rightPagin - leftPagin + 1 }, (_, index) => (
                    <li key={leftPagin + index} className={`page-item ${(leftPagin + index) === currentPage ? 'active' : ''}`}>
                        <button className="page-link" onClick={() => handleChangePage(leftPagin + index)}>{leftPagin + index}</button>
                    </li>
                ))}
                {currentPage < pageCount && (
                    <li className="page-item next-item">
                        <button className="page-link" onClick={() => handleChangePage(currentPage + 1)}>&raquo;</button>
                    </li>
                )}
            </ul>
        </nav>
    );
};

export default Pagination;
