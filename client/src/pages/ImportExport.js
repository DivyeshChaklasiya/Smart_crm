import React from "react";
import * as XLSX from "xlsx";
import API from "../services/api";
import { toast } from "react-toastify";

function ImportExport() {

  // 🔥 EXPORT EXCEL
  const exportLeads = async () => {
    try {
      const res = await API.get("/leads");

      const worksheet = XLSX.utils.json_to_sheet(res.data);
      const workbook = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");

      XLSX.writeFile(workbook, "CRM_Leads.xlsx");

      toast.success("Export successful ✅");

    } catch (err) {
      toast.error("Export failed ❌");
    }
  };

  // 🔥 IMPORT EXCEL
  const importLeads = async (e) => {
  try {

    const file = e.target.files[0];

    if (!file) {
      toast.warning("Select file first ⚠️");
      return;
    }

    const data = await file.arrayBuffer();

    const workbook = XLSX.read(data, {
      type: "array",
    });

    const worksheet =
      workbook.Sheets[workbook.SheetNames[0]];

    const jsonData = XLSX.utils.sheet_to_json(
      worksheet,
      { defval: "" }
    );

    console.log("Excel Data:", jsonData);

    for (const row of jsonData) {

      await API.post("/leads", {
        name:
          row.name ||
          row.Name ||
          "",

        email:
          row.email ||
          row.Email ||
          "",

        phone:
          row.phone ||
          row.Phone ||
          "",

        notes:
          row.notes ||
          row.Notes ||
          "",

        status:
          row.status ||
          row.Status ||
          "New",
      });

    }

    toast.success("Import successful ✅");

  } catch (err) {

    console.log(err);

    toast.error("Import failed ❌");
  }
};
  return (
    <div className="container mt-4">

      <h2 className="fw-bold mb-4">
        Import / Export 📁
      </h2>

      <div className="card p-4 shadow border-0">

        {/* EXPORT */}
        <h4>Export Leads</h4>

        <button
          className="btn btn-success mb-4"
          onClick={exportLeads}
        >
          Download Excel ⬇️
        </button>

        <hr />

        {/* IMPORT */}
        <h4 className="mt-3">Import Leads</h4>

        <input
          type="file"
          accept=".xlsx,.xls"
          className="form-control"
          onChange={importLeads}
        />

      </div>

    </div>
  );
}

export default ImportExport;