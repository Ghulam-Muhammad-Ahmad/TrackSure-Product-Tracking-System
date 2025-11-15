    import React, { useEffect, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserFormModal } from "./UserFormModal";
import { DeleteAlert } from "./DeleteAlert";
import {
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  CheckCircle,
  AlertTriangle,
  RefreshCcw,
} from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useLocation, useNavigate } from "react-router-dom";

export function DataTable({ columnsConfig, apiEndpoints, token, tablePermissions, validationRulesUpdate, validationRulesAdd }) {
  const [data, setData] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [sorting, setSorting] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [dropdownData, setDropdownData] = useState({});
  const [submitting, setSubmitting] = useState(false); // ✅ New state for submitting
  const location = useLocation();
  const navigate = useNavigate();
   const addItem = new URLSearchParams(location.search).get("addItem") === "true";

   useEffect(() => {
    if (addItem) {
      setModalOpen(true);

      // Remove the "addItem" param from URL
      const params = new URLSearchParams(location.search);
      params.delete("addItem");
      navigate({ search: params.toString() }, { replace: true });
    }
  }, [addItem]);

  const fetchData = async () => {
    try {
      const response = await fetch(apiEndpoints.get, {
        headers: { "x-jwt-bearer": token },
      });
      if (!response.ok) throw new Error("Failed to fetch data");
      setData(await response.json());
    } catch {
      setError("Failed to fetch data");
    }
  };

  const fetchDropdowns = async () => {
    const dropdownCols = columnsConfig.filter((col) => col.fetchDuringAdding);
    const resArr = await Promise.all(
      dropdownCols.map(async (col) => {
        try {
          const res = await fetch(col.fetchUrl, {
            headers: { "x-jwt-bearer": token },
          });
          const json = await res.json();
          const list = json;
          const opts = list.map((item) => ({
            label: item[col.labelKey],
            value: item[col.valueKey],
          }));
          return [col.accessorKey, opts];
        } catch {
          console.error(`Failed to load ${col.accessorKey}`);
          return [col.accessorKey, []];
        }
      })
    );
    setDropdownData(Object.fromEntries(resArr));
  };

  useEffect(() => {
    if (tablePermissions.canViewItem) {
      fetchData();
      fetchDropdowns();
    } else {
      setError("You do not have permission to view this table.");
    }
  }, []);

  useEffect(() => {
    if (error || success) {
      const t = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 4000);
      return () => clearTimeout(t);
    }
  }, [error, success]);

  const columns = React.useMemo(() => {
    const cols = columnsConfig
      .filter((col) => col.canShow)
      .map((col) => ({
        accessorKey: col.accessorKey,
        header: col.header,
        cell:
          col.type === "checkbox_group"
            ? ({ cell }) => (
                <div className="flex flex-wrap">
                  {cell.getValue().map((v) => (
                    <span key={v} className="m-1 p-1 bg-secondary text-primary text-xs rounded-full">
                      {v}
                    </span>
                  ))}
                </div>
              )
            : col.type === "color"
            ? ({ cell }) => (
                <div className="flex items-center gap-2">
                  <div 
                    className="w-6 h-6 rounded border border-gray-300" 
                    style={{ backgroundColor: cell.getValue() || "#6B7280" }}
                  ></div>
                  <span className="text-sm">{cell.getValue() || "#6B7280"}</span>
                </div>
              )
            : col.isTimestamp
            ? ({ cell }) => new Date(cell.getValue()).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })
            : ({ cell }) => cell.getValue(),
        enableSorting: col.canSort,
      }));

    cols.unshift({
      accessorKey: "src",
      header: "Src",
      cell: ({ row }) => row.index + 1,
      enableSorting: false,
    });

    if (tablePermissions.canAddItem || tablePermissions.canEditItem || tablePermissions.canDeleteItem) {
      cols.push({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex space-x-2">
            {tablePermissions.canEditItem && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedRow(row.original);
                  setModalOpen(true);
                }}
              >
                Edit
              </Button>
            )}
            {tablePermissions.canDeleteItem && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  setSelectedRow(row.original);
                  setDeleteOpen(true);
                }}
              >
                Delete
              </Button>
            )}
          </div>
        ),
        enableSorting: false,
      });
    }

    return cols;
  }, [columnsConfig, tablePermissions]);

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter, sorting },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const onAddSubmit = async (formData) => {
    try {
      setSubmitting(true); // ✅ Set submitting state to true
      const res = await fetch(apiEndpoints.post, {
        method: "POST",
        headers: {
          "x-jwt-bearer": token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Submit failed");
      const result = await res.json();
      if (result.success) {
        setSuccess("Saved successfully");
      } else {
        setError(result.message);
      }
      setSelectedRow(null); // Ensure selectedRow is reset to null after submission
      fetchData();
    } catch (error) {
      setError("Submit failed: " + error.message);
    } finally {
      setSubmitting(false); // ✅ Set submitting state to false
      setModalOpen(false);
    }
  };

  const onUpdateSubmit = async (formData) => {
    try {
      setSubmitting(true); // ✅ Set submitting state to true
      const idCol = columnsConfig.find((c) => c.isId == true);
      console.log("Col id name:" + JSON.stringify(formData));
      const id = formData[idCol.accessorKey];
      console.log("Col id value:" + id);
      const res = await fetch(`${apiEndpoints.put}`, {
        method: "PUT",
        headers: {
          "x-jwt-bearer": token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Submit failed");
      const result = await res.json();
      if (result.success) {
        setSuccess("Saved successfully");
      } else {
        setError(result.message);
      }
      setSelectedRow(null); // Ensure selectedRow is reset to null after submission
      fetchData();
    } catch (error) {
      setError("Submit failed: " + error.message);
    } finally {
      setSubmitting(false); // ✅ Set submitting state to false
      setModalOpen(false);
    }
  };

  const handleDelete = async () => {
    try {
      setSubmitting(true); // ✅ Set submitting state to true
      const idCol = columnsConfig.find((c) => c.isId);
      const id = selectedRow[idCol.accessorKey];
      const res = await fetch(`${apiEndpoints.delete}/${id}`, {
        method: "DELETE",
        headers: { "x-jwt-bearer": token },
      });
      if (!res.ok) throw new Error("Delete failed");
      const result = await res.json();
      if (result.success) {
        setSuccess("Deleted Successfully");
      } else {
        setError(result.message);
      }
      setDeleteOpen(false);
      setSelectedRow(null); // Ensure selectedRow is reset to null after deletion
      fetchData();
    } catch {
      setError("Delete failed");
    } finally {
      setSubmitting(false); // ✅ Set submitting state to false
    }
  };

  return (
    <div className="w-full">
      {success && (
        <Alert variant="default" className="mb-4 border-green-600 bg-green-50 text-green-800">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
      {error && (
        <Alert variant="destructive" className="mb-4 border-red-600 bg-red-50 text-red-800">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="flex items-center py-4">
        <Input
          placeholder="Search..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />
        {tablePermissions.canAddItem && (
          <Button
            className="ml-auto"
            onClick={() => {
              setSelectedRow(null); // Ensure selectedRow is reset to null before opening modal
              setModalOpen(true);
            }}
          >
            Add New
          </Button>
        )}
        <Button
          className="ml-2 cursor-pointer"
          onClick={fetchData}
        >
          <RefreshCcw className="h-5 w-5 text-[var(--primary-foreground)] " />
        </Button>
      </div>
      <div className="rounded-md border overflow-auto min-w-full max-w-[81vw]">
        <Table>
          {/* Table header & body rendering... */}
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id} className="hover:bg-[#dfe0dcc8]">
                {hg.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    onClick={header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
                    className={`select-none ${header.column.getCanSort() ? "cursor-pointer" : ""}`}
                  >
                    <div className="flex items-center">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() &&
                        ({
                          asc: <ArrowUp className="ml-1 h-4 w-4" />,
                          desc: <ArrowDown className="ml-1 h-4 w-4" />,
                        }[header.column.getIsSorted()] ?? (
                          <ArrowUpDown className="ml-1 h-4 w-4" />
                        ))}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} 
                className={`${row.index % 2 === 0 ? "bg-[var(--table-odd-item)]" : ""}`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          Previous
        </Button>
        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Next
        </Button>
        <span>
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </span>
      </div>

      <UserFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedRow(null); // Ensure selectedRow is reset to null on modal close
        }}
        onAddSubmit={onAddSubmit}
        onUpdateSubmit={onUpdateSubmit}
        defaultValues={selectedRow}
        columnsConfig={columnsConfig}
        dropdownData={dropdownData}
        validationRulesAdd = {validationRulesAdd}
        validationRulesUpdate={validationRulesUpdate}
        submitting={submitting} // ✅ Pass submitting state to UserFormModal
      />
      
      <DeleteAlert
        open={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setSelectedRow(null); // Ensure selectedRow is reset to null on delete alert close
        }}
        onConfirm={handleDelete}
        submitting={submitting} // ✅ Pass submitting state to DeleteAlert
      />
    </div>
  );
}
