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
import { ProductFormModal } from "./ProductFormModal";
import { DeleteAlert } from "./DeleteAlert";
import { BulkEditModal } from "./BulkEditModal.jsx"; // ✅ New Modal Component
import { ProductQrModal } from "./ProductQrModal.jsx"; // ✅ New Modal Component
import {
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  CheckCircle,
  AlertTriangle,
  RefreshCcw,
  FileText,
  ExternalLink,
} from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useLocation, useNavigate } from "react-router-dom";

export function ProductTableData({
  columnsConfig,
  apiEndpoints,
  token,
  tablePermissions,
  validationRulesAdd,
  validationRulesUpdate,
  profile,
}) {
  const [data, setData] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [bulkModalOpen, setBulkModalOpen] = useState(false); // ✅ New state
  const [qrModalOpen, setQrModalOpen] = useState(false); // ✅ New state
  const [selectedRow, setSelectedRow] = useState(null);
  const [sorting, setSorting] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [dropdownData, setDropdownData] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [rowSelection, setRowSelection] = useState({});
  const location = useLocation();
  const navigate = useNavigate();
  const [meMode, setMeMode] = useState(false);
  const addItem =
    new URLSearchParams(location.search).get("addItem") === "true";

  useEffect(() => {
    if (addItem) {
      setModalOpen(true);
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
    const results = await Promise.all(
      dropdownCols.map(async (col) => {
        try {
          const res = await fetch(col.fetchUrl, {
            headers: { "x-jwt-bearer": token },
          });
          const json = await res.json();
          const items = Array.isArray(json)
            ? json
            : col.responseKey
            ? json[col.responseKey] || []
            : [];

            const options = items.map((item) => ({
              label: item[col.labelKey],
              value: item[col.valueKey],
            }));
          // if (col.accessorKey === "current_owner_id" || col.accessorKey === "manufacturer_id") {
          //   options.unshift({
          //     label: profile.username + " (Me)",
          //     value: profile.user_id,
          //   });
          // }
          return [col.accessorKey, options];
        } catch {
          console.error(`Failed to load options for ${col.accessorKey}`);
          return [col.accessorKey, []];
        }
      })
    );
    setDropdownData(Object.fromEntries(results));
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
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const columns = React.useMemo(() => {
    const cols = columnsConfig
      .filter((col) => col.canShow)
      .map((col) => ({
        accessorKey: col.displayField || col.accessorKey,
        header: col.header,
        cell: ({ row }) => {
          const value = row.original[col.displayField || col.accessorKey];
          if (col.type === "file" && typeof value === "string") {
            return (
              <img
                src={value}
                alt="Product"
                className="h-20 w-20 rounded object-cover border"
              />
            );
          }
          return value ?? "";
        },
        enableSorting: col.canSort || false,
      }));

    // ✅ Add index column
    cols.unshift({
      accessorKey: "src",
      header: "Src",
      cell: ({ row }) => row.index + 1,
      enableSorting: false,
    });

    // ✅ Add selection checkbox column
    cols.unshift({
      id: "select",
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllPageRowsSelected()}
          onChange={table.getToggleAllPageRowsSelectedHandler()}
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
        />
      ),
      enableSorting: false,
    });

    // ✅ Add documents attached column
    cols.push({
      id: "documents",
      header: "Docs Attached",
      cell: ({ row }) => {
        const documents = row.original.documents || [];
        if (documents.length === 0) {
          return <span className="text-muted-foreground">—</span>;
        }
        
        return (
          <div className="flex flex-wrap gap-1">
            {documents.map((doc, index) => {
              const truncatedName = doc.filename
                .split(' ')
                .slice(0, 2)
                .join(' ') + (doc.filename.split(' ').length > 2 ? '...' : '');
              
              return (
                <button
                  key={index}
                  onClick={() => navigate(`/dashboard/document-viewer/${doc.document_id}`)}
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-secondary text-primary rounded-md hover:bg-secondary/80 transition-colors"
                  title={doc.filename}
                >
                  <FileText className="h-3 w-3" />
                  {truncatedName}
                  <ExternalLink className="h-2 w-2" />
                </button>
              );
            })}
          </div>
        );
      },
      enableSorting: false,
    });

    // ✅ Add actions column
    if (
      tablePermissions.canAddItem ||
      tablePermissions.canEditItem ||
      tablePermissions.canDeleteItem
    ) {
      cols.push({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex space-x-2">
               <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedRow(row.original);
                  setQrModalOpen(true);
                }}
              >
                Generate Qr
              </Button>
            {tablePermissions.canEditItem && (
              <Button
                variant="secondary"
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

  const filteredData = React.useMemo(() => {
    if (!meMode) return data;
    return data.filter((item) => item.current_owner_id === profile.user_id);
  }, [meMode, data, profile.user_id]);
  
  const table = useReactTable({
    data: filteredData,
    columns,
    state: { globalFilter, sorting, rowSelection, meMode },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onMeModeChange: setMeMode,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const onAddSubmit = async (formData) => {
    try {
      setSubmitting(true); // ✅ Set submitting to true before fetch
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
      setSelectedRow(null);
      fetchData();
    } catch (error) {
      setError("Submit failed: " + error.message);
    } finally {
      setSubmitting(false); // ✅ Set submitting to false after fetch
      setModalOpen(false);
    }
  };

  const onUpdateSubmit = async (formData) => {
    try {
      setSubmitting(true); // ✅ Set submitting to true before fetch
      const idCol = columnsConfig.find((c) => c.isId);
      const id = formData[idCol.accessorKey];
      const res = await fetch(`${apiEndpoints.put}`, {
        method: "PUT",
        headers: {
          "x-jwt-bearer": token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Update failed");
      const result = await res.json();
      if (result.success) {
        setSuccess("Saved successfully");
      } else {
        setError(result.message);
      }
      setSelectedRow(null);
      fetchData();
    } catch (error) {
      setError("Update failed: " + error.message);
    } finally {
      setSubmitting(false); // ✅ Set submitting to false after fetch
      setModalOpen(false);
    }
  };

  const handleDelete = async () => {
    try {
      setSubmitting(true); // ✅ Set submitting to true before fetch
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
      setSelectedRow(null);
      fetchData();
    } catch {
      setError("Delete failed");
    } finally {
      setSubmitting(false); // ✅ Set submitting to false after fetch
    }
  };

  const handleBulkEditSubmit = async (formData) => {
    try {
      setSubmitting(true);
      const idCol = columnsConfig.find((c) => c.isId);
      const selectedIds = table
        .getSelectedRowModel()
        .rows.map((r) => r.original[idCol.accessorKey]);

      const updates = {
        category_id: formData.category_id,
        manufacturer_id: formData.manufacturer_id,
        current_owner_id: formData.current_owner_id,
        product_status_id: formData.product_status_id,
      };

      const res = await fetch(apiEndpoints.bulkUpdate, {
        method: "PUT",
        headers: {
          "x-jwt-bearer": token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids: selectedIds, updates }),
      });

      if (!res.ok) throw new Error("Bulk update failed");
      const result = await res.json();

      if (result.success) setSuccess("Bulk update successful");
      else setError(result.message);

      fetchData();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
      setBulkModalOpen(false);
    }
  };

  return (
    <div className="w-full">
      {success && (
        <Alert className="mb-4 border-green-600 bg-green-50 text-green-800">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
      {error && (
        <Alert
          variant="destructive"
          className="mb-4 border-red-600 bg-red-50 text-red-800"
        >
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
              setSelectedRow(null);
              setModalOpen(true);
            }}
          >
            Add New
          </Button>
        )}
          {tablePermissions.canAddItem && (
          <Button
            className="ml-2"
            onClick={() => {
              navigate("/dashboard/tanent-qr-generator");
            }}
          >
            QR Generator
          </Button>
        )}
        <Button
          className={`ml-2 ${meMode ? 'bg-primary text-white' : 'bg-white'}`}
          variant="outline"
          onClick={() => {
           setMeMode(!meMode);
          }}
        >
         {meMode ? 'Exit Me Mode' : 'Me Mode'}
        </Button>
        {Object.keys(rowSelection).length > 0 &&
          tablePermissions.canEditItem && (
            <Button
              className="ml-2"
              variant="secondary"
              onClick={() => setBulkModalOpen(true)}
            >
              Bulk Edit ({Object.keys(rowSelection).length})
            </Button>
          )}

        <Button className="ml-2 cursor-pointer" onClick={fetchData}>
          <RefreshCcw className="h-5 w-5 text-[var(--primary-foreground)]" />
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-md border overflow-auto min-w-full max-w-[81vw]">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    onClick={
                      header.column.getCanSort()
                        ? header.column.getToggleSortingHandler()
                        : undefined
                    }
                    className={
                      header.column.getCanSort()
                        ? "cursor-pointer select-none"
                        : ""
                    }
                  >
                    <div className="flex items-center">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {/* {header.column.getIsSorted() === "asc" ? (
                        <ArrowUp className="ml-1 h-4 w-4" />
                      ) : header.column.getIsSorted() === "desc" ? (
                        <ArrowDown className="ml-1 h-4 w-4" />
                      ) : (
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      )} */}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className={`${row.index % 2 === 0 ? "bg-[var(--table-odd-item)]" : ""}`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
        <span>
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </span>
      </div>

      {/* Modals */}
      <ProductFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedRow(null);
        }}
        onAddSubmit={onAddSubmit}
        onUpdateSubmit={onUpdateSubmit}
        defaultValues={selectedRow}
        columnsConfig={columnsConfig}
        dropdownData={dropdownData}
        validationRulesAdd={validationRulesAdd}
        validationRulesUpdate={validationRulesUpdate}
        submitting={submitting}
      />

      <DeleteAlert
        open={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setSelectedRow(null);
        }}
        onConfirm={handleDelete}
        submitting={submitting}
      />

      {/* ✅ Bulk Edit Modal */}
      <BulkEditModal
        open={bulkModalOpen}
        onClose={() => setBulkModalOpen(false)}
        columnsConfig={columnsConfig}
        dropdownData={dropdownData}
        onSubmit={handleBulkEditSubmit}
        submitting={submitting}
      />

      {/* ✅ QR Modal */}
<ProductQrModal
  open={qrModalOpen}
  onClose={() => {
    setQrModalOpen(false);
    setSelectedRow(null);
  }}
  defaultValues={selectedRow}
  columnsConfig={columnsConfig}
/>

    </div>
  );
}
