import React, { useEffect, useRef } from "react";
import DataTable from "react-data-table-component";

const DataTables = ({ columns, tableData }) => {
  const tableRef = useRef(null);

  useEffect(() => {
    const tableElement = tableRef.current;
    if (tableElement) {
      new DataTable(tableElement);
    }
  }, []);
  return (
    <DataTable
      pagination
      columns={columns}
      data={tableData}
    />
  )
}

export default DataTables
