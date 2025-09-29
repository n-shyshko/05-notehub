import ReactPaginate from "react-paginate";
import css from "./Pagination.module.css";

interface PaginationProps {
  totalPages: number;
  page: number;
  onChange: (page: number) => void;
}

function Pagination({ totalPages, page, onChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <ReactPaginate
      className={css.pagination}
      pageClassName={css.page}
      activeClassName={css.active}
      previousClassName={css.prev}
      nextClassName={css.next}
      disabledClassName={css.disabled}
      breakLabel='...'
      nextLabel='>'
      previousLabel='<'
      pageCount={totalPages}
      forcePage={page - 1}
      onPageChange={(event) => onChange(event.selected + 1)}
    />
  );
}

export default Pagination;
